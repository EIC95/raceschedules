import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

from app.database import SessionLocal
from app.models import Category, Championship, Event, Session
from datetime import datetime, timezone
from scripts.validate_data import validate_categories_data, validate_championships_data, validate_championship_events_data
from typing import Optional
import pytz


def convert_to_utc(dt_str: str, tz_name: str) -> datetime:
    local_tz = pytz.timezone(tz_name)
    dt_localized = local_tz.localize(datetime.fromisoformat(dt_str))
    return dt_localized.astimezone(timezone.utc)


# ─── Diff helpers ────────────────────────────────────────────────────────────

def diff_categories(db, validated_categories):
    changes = {"new": [], "updated": []}
    for cat in validated_categories:
        db_cat = db.query(Category).filter(Category.slug == cat.slug).first()
        if not db_cat:
            changes["new"].append(cat)
        elif db_cat.name != cat.name:
            changes["updated"].append((cat, {"name": (db_cat.name, cat.name)}))
    return changes


def diff_championships(db, validated_championships, category_slug_to_id):
    changes = {"new": [], "updated": []}
    for champ in validated_championships:
        db_champ = db.query(Championship).filter(Championship.slug == champ.slug).first()
        if not db_champ:
            changes["new"].append(champ)
        else:
            field_changes = {}
            if db_champ.name != champ.name:
                field_changes["name"] = (db_champ.name, champ.name)
            new_cat_id = category_slug_to_id.get(champ.category)
            if db_champ.category_id != new_cat_id:
                field_changes["category"] = (db_champ.category_id, champ.category)
            if field_changes:
                changes["updated"].append((champ, field_changes))
    return changes


def diff_events(db, validated_champ_events, championship_id):
    changes = {"new_events": [], "updated_events": [], "new_sessions": [], "updated_sessions": [], "removed_events": []}

    db_events = {e.slug: e for e in db.query(Event).filter(Event.championship_id == championship_id).all()}
    json_slugs = {e.slug for e in validated_champ_events.events}

    for slug, db_ev in db_events.items():
        if slug not in json_slugs:
            changes["removed_events"].append(db_ev)

    for event_data in validated_champ_events.events:
        db_ev = db_events.get(event_data.slug)
        new_start = datetime.strptime(event_data.start_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        new_end = datetime.strptime(event_data.end_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)

        if not db_ev:
            changes["new_events"].append(event_data)
            for s in event_data.sessions:
                changes["new_sessions"].append((event_data.name, s))
            continue

        # Event field diff
        ev_changes = {}
        if db_ev.name != event_data.name:
            ev_changes["name"] = (db_ev.name, event_data.name)
        db_start = db_ev.start_date if db_ev.start_date.tzinfo else db_ev.start_date.replace(tzinfo=timezone.utc)
        db_end = db_ev.end_date if db_ev.end_date.tzinfo else db_ev.end_date.replace(tzinfo=timezone.utc)
        if db_start.date() != new_start.date():
            ev_changes["start_date"] = (db_start.strftime("%Y-%m-%d"), event_data.start_date)
        if db_end.date() != new_end.date():
            ev_changes["end_date"] = (db_end.strftime("%Y-%m-%d"), event_data.end_date)
        if bool(db_ev.postponed) != bool(event_data.postponed):
            ev_changes["postponed"] = (db_ev.postponed, event_data.postponed)
        if bool(db_ev.cancelled) != bool(event_data.cancelled):
            ev_changes["cancelled"] = (db_ev.cancelled, event_data.cancelled)
        if ev_changes:
            changes["updated_events"].append((event_data, ev_changes))

        # Session diff
        db_sessions = {s.session_number: s for s in db.query(Session).filter(Session.event_id == db_ev.id).all()}
        for session_data in event_data.sessions:
            db_sess = db_sessions.get(session_data.session_number)
            new_utc = convert_to_utc(session_data.start_time, session_data.timezone)

            if not db_sess:
                changes["new_sessions"].append((event_data.name, session_data))
            else:
                db_time = db_sess.start_time if db_sess.start_time.tzinfo else db_sess.start_time.replace(tzinfo=timezone.utc)
                sess_changes = {}
                if db_sess.name != session_data.name:
                    sess_changes["name"] = (db_sess.name, session_data.name)
                if abs((db_time - new_utc).total_seconds()) > 60:
                    sess_changes["start_time"] = (db_time.strftime("%Y-%m-%d %H:%M UTC"), new_utc.strftime("%Y-%m-%d %H:%M UTC"))
                if db_sess.timezone != session_data.timezone:
                    sess_changes["timezone"] = (db_sess.timezone, session_data.timezone)
                if sess_changes:
                    changes["updated_sessions"].append((event_data.name, session_data, sess_changes))

    return changes


def has_any_change(diff: dict) -> bool:
    return any(v for v in diff.values())


# ─── Pretty-print helpers ─────────────────────────────────────────────────────

def print_field_changes(field_changes: dict, indent: int = 4):
    pad = " " * indent
    for field, (old, new) in field_changes.items():
        print(f"{pad}  {field}: {old!r} → {new!r}")


def print_categories_diff(diff):
    if not has_any_change(diff):
        print("  Categories: no changes")
        return
    for cat in diff["new"]:
        print(f"  [NEW]     Category: {cat.name} ({cat.slug})")
    for cat, fc in diff["updated"]:
        print(f"  [CHANGED] Category: {cat.name} ({cat.slug})")
        print_field_changes(fc)


def print_championships_diff(diff):
    if not has_any_change(diff):
        print("  Championships: no changes")
        return
    for champ in diff["new"]:
        print(f"  [NEW]     Championship: {champ.name} ({champ.slug})")
    for champ, fc in diff["updated"]:
        print(f"  [CHANGED] Championship: {champ.name} ({champ.slug})")
        print_field_changes(fc)


def print_events_diff(diff, championship_slug):
    if not has_any_change(diff):
        print(f"  {championship_slug}: no changes")
        return

    for ev in diff["removed_events"]:
        print(f"  [REMOVED] Event: {ev.name} ({ev.slug})")
    for ev in diff["new_events"]:
        print(f"  [NEW]     Event: {ev.name} ({ev.slug})")
    for ev, fc in diff["updated_events"]:
        print(f"  [CHANGED] Event: {ev.name} ({ev.slug})")
        print_field_changes(fc)
    for ev_name, sess in diff["new_sessions"]:
        print(f"  [NEW]     Session: {sess.name} (#{sess.session_number}) in '{ev_name}'")
    for ev_name, sess, fc in diff["updated_sessions"]:
        print(f"  [CHANGED] Session: {sess.name} (#{sess.session_number}) in '{ev_name}'")
        print_field_changes(fc)

    counts = []
    if diff["removed_events"]:
        counts.append(f"{len(diff['removed_events'])} removed event(s)")
    if diff["new_events"]:
        counts.append(f"{len(diff['new_events'])} new event(s)")
    if diff["updated_events"]:
        counts.append(f"{len(diff['updated_events'])} updated event(s)")
    if diff["new_sessions"]:
        counts.append(f"{len(diff['new_sessions'])} new session(s)")
    if diff["updated_sessions"]:
        counts.append(f"{len(diff['updated_sessions'])} updated session(s)")
    print(f"  → {', '.join(counts)}")


# ─── Apply helpers ────────────────────────────────────────────────────────────

def apply_categories(db, validated_categories):
    cat_slug_to_id = {}
    for cat in validated_categories:
        db_cat = db.query(Category).filter(Category.slug == cat.slug).first()
        if not db_cat:
            db_cat = Category(name=cat.name, slug=cat.slug)
            db.add(db_cat)
            db.flush()
        else:
            db_cat.name = cat.name
        cat_slug_to_id[db_cat.slug] = db_cat.id
    db.commit()
    return cat_slug_to_id


def apply_championships(db, validated_championships, category_slug_to_id):
    champ_slug_to_id = {}
    for champ in validated_championships:
        db_champ = db.query(Championship).filter(Championship.slug == champ.slug).first()
        cat_id = category_slug_to_id.get(champ.category)
        if not cat_id:
            print(f"  Warning: category '{champ.category}' not found, skipping {champ.name}")
            continue
        if not db_champ:
            db_champ = Championship(name=champ.name, slug=champ.slug, category_id=cat_id)
            db.add(db_champ)
            db.flush()
        else:
            db_champ.name = champ.name
            db_champ.category_id = cat_id
        champ_slug_to_id[db_champ.slug] = db_champ.id
    db.commit()
    return champ_slug_to_id


def apply_events(db, validated_champ_events, championship_id):
    json_slugs = {e.slug for e in validated_champ_events.events}
    for ev in db.query(Event).filter(Event.championship_id == championship_id).all():
        if ev.slug not in json_slugs:
            db.query(Session).filter(Session.event_id == ev.id).delete()
            db.delete(ev)
    db.flush()

    for event_data in validated_champ_events.events:
        ev_db = db.query(Event).filter(Event.slug == event_data.slug).first()
        if not ev_db:
            ev_db = Event(
                name=event_data.name,
                slug=event_data.slug,
                start_date=datetime.strptime(event_data.start_date, "%Y-%m-%d").replace(tzinfo=timezone.utc),
                end_date=datetime.strptime(event_data.end_date, "%Y-%m-%d").replace(tzinfo=timezone.utc),
                postponed=bool(event_data.postponed),
                cancelled=bool(event_data.cancelled),
                championship_id=championship_id,
            )
            db.add(ev_db)
            db.flush()
        else:
            ev_db.name = event_data.name
            ev_db.start_date = datetime.strptime(event_data.start_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            ev_db.end_date = datetime.strptime(event_data.end_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
            ev_db.postponed = bool(event_data.postponed)
            ev_db.cancelled = bool(event_data.cancelled)
            ev_db.championship_id = championship_id

        for session_data in event_data.sessions:
            sess_db = db.query(Session).filter(
                Session.event_id == ev_db.id,
                Session.session_number == session_data.session_number,
            ).first()
            utc_time = convert_to_utc(session_data.start_time, session_data.timezone)
            if not sess_db:
                sess_db = Session(
                    name=session_data.name,
                    start_time=utc_time,
                    session_number=session_data.session_number,
                    event_id=ev_db.id,
                    timezone=session_data.timezone,
                )
                db.add(sess_db)
            else:
                sess_db.name = session_data.name
                sess_db.start_time = utc_time
                sess_db.timezone = session_data.timezone
    db.commit()


# ─── Main ─────────────────────────────────────────────────────────────────────

def seed_data():
    db = SessionLocal()
    BASE_DATA_PATH = Path(__file__).parent.parent / "data"

    try:
        # ── Categories ────────────────────────────────────────────────────────
        print("\n=== Categories ===")
        validated_categories = validate_categories_data(BASE_DATA_PATH / "categories.json")
        cat_diff = diff_categories(db, validated_categories)
        print_categories_diff(cat_diff)

        if has_any_change(cat_diff):
            choice = input("Apply category changes? [Y/n]: ").strip().lower()
            if choice != "n":
                category_slug_to_id = apply_categories(db, validated_categories)
                print("  ✓ Categories updated.")
            else:
                # Still need the mapping even if we skip writes
                category_slug_to_id = {
                    c.slug: db.query(Category).filter(Category.slug == c.slug).first().id
                    for c in validated_categories
                    if db.query(Category).filter(Category.slug == c.slug).first()
                }
                print("  Skipped.")
        else:
            category_slug_to_id = {
                c.slug: db.query(Category).filter(Category.slug == c.slug).first().id
                for c in validated_categories
            }

        # ── Championships ─────────────────────────────────────────────────────
        print("\n=== Championships ===")
        validated_championships = validate_championships_data(
            BASE_DATA_PATH / "championships.json", set(category_slug_to_id.keys())
        )
        champ_diff = diff_championships(db, validated_championships, category_slug_to_id)
        print_championships_diff(champ_diff)

        if has_any_change(champ_diff):
            choice = input("Apply championship changes? [Y/n]: ").strip().lower()
            if choice != "n":
                championship_slug_to_id = apply_championships(db, validated_championships, category_slug_to_id)
                print("  ✓ Championships updated.")
            else:
                championship_slug_to_id = {
                    c.slug: db.query(Championship).filter(Championship.slug == c.slug).first().id
                    for c in validated_championships
                    if db.query(Championship).filter(Championship.slug == c.slug).first()
                }
                print("  Skipped.")
        else:
            championship_slug_to_id = {
                c.slug: db.query(Championship).filter(Championship.slug == c.slug).first().id
                for c in validated_championships
            }

        # ── Events & Sessions ─────────────────────────────────────────────────
        EVENTS_DIR = BASE_DATA_PATH / "championships"
        if not EVENTS_DIR.exists():
            print(f"\nEvents directory not found: {EVENTS_DIR}")
            return

        errors = False
        for event_file in sorted(EVENTS_DIR.glob("*.json")):
            print(f"\n=== {event_file.name} ===")
            try:
                validated = validate_championship_events_data(event_file, set(championship_slug_to_id.keys()))
            except Exception as e:
                print(f"  Validation error: {e}")
                errors = True
                continue

            champ_id = championship_slug_to_id.get(validated.championship)
            if not champ_id:
                print(f"  Championship '{validated.championship}' not in DB, skipping.")
                continue

            ev_diff = diff_events(db, validated, champ_id)
            print_events_diff(ev_diff, validated.championship)

            if not has_any_change(ev_diff):
                continue

            choice = input(f"Apply changes for '{validated.championship}'? [Y/n]: ").strip().lower()
            if choice == "n":
                print("  Skipped.")
                continue

            try:
                apply_events(db, validated, champ_id)
                print(f"  ✓ Applied.")
            except Exception as e:
                db.rollback()
                print(f"  Error applying: {e}")
                errors = True

        print("\n" + ("Some files had errors." if errors else "Done."))

    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
