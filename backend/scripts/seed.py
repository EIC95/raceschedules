from app.database import SessionLocal
from app.models import Category, Championship, Event, Session
from datetime import datetime, timedelta, timezone
from pathlib import Path
from scripts.validate_data import validate_categories_data, validate_championships_data, validate_championship_events_data
from sqlalchemy.exc import IntegrityError
from typing import Optional
import pytz

def seed_data():
    db = SessionLocal()
    try:
        print("Seeding database...")

        # Helper to convert local time to UTC, handling timezone
        def convert_to_utc(dt_str: str, tz_name: Optional[str] = None) -> datetime:
            dt_naive = datetime.fromisoformat(dt_str.replace('Z', '+00:00')) # Handles 'Z' and gets base datetime

            if dt_naive.tzinfo is not None and dt_naive.tzinfo.utcoffset(dt_naive) is not None:
                # Already timezone-aware with offset, just convert to UTC
                return dt_naive.astimezone(timezone.utc)
            elif tz_name:
                # Naive datetime with provided timezone name
                local_tz = pytz.timezone(tz_name)
                dt_localized = local_tz.localize(dt_naive)
                return dt_localized.astimezone(timezone.utc)
            else:
                raise ValueError(f"Cannot convert naive datetime {dt_str} to UTC without a timezone name.")

        # --- Categories Seeding ---
        BASE_DATA_PATH = Path(__file__).parent.parent / "data"
        CATEGORIES_FILE = BASE_DATA_PATH / "categories.json"
        try:
            validated_categories = validate_categories_data(CATEGORIES_FILE)
            category_slug_to_id = {} # To store mapping for championships
            for cat_data in validated_categories:
                category_db = db.query(Category).filter(Category.slug == cat_data.slug).first()
                if not category_db:
                    category_db = Category(name=cat_data.name, slug=cat_data.slug)
                    db.add(category_db)
                    db.flush() # Flush to get ID for newly added category
                    print(f"Added category: {cat_data.name}")
                else:
                    category_db.name = cat_data.name # Update name if slug matches
                    print(f"Updated category: {cat_data.name}")
                category_slug_to_id[category_db.slug] = category_db.id
            db.commit()
            print("Categories seeded successfully.")
        except Exception as e:
            db.rollback()
            print(f"Error seeding categories: {e}")
            raise

        # --- Championships Seeding ---
        CHAMPIONSHIPS_DEFINITION_FILE = BASE_DATA_PATH / "championships.json"
        try:
            validated_championships = validate_championships_data(CHAMPIONSHIPS_DEFINITION_FILE, set(category_slug_to_id.keys()))
            championship_slug_to_id = {} # To store mapping for events
            for champ_data in validated_championships:
                championship_db = db.query(Championship).filter(Championship.slug == champ_data.slug).first()
                category_id = category_slug_to_id.get(champ_data.category)

                if not category_id:
                    print(f"Warning: Category '{champ_data.category}' not found for championship '{champ_data.name}'. Skipping.")
                    continue

                if not championship_db:
                    championship_db = Championship(
                        name=champ_data.name,
                        slug=champ_data.slug,
                        category_id=category_id
                    )
                    db.add(championship_db)
                    db.flush() # Flush to get ID
                    print(f"Added championship: {champ_data.name}")
                else:
                    championship_db.name = champ_data.name
                    championship_db.category_id = category_id
                    print(f"Updated championship: {champ_data.name}")
                championship_slug_to_id[championship_db.slug] = championship_db.id
            db.commit()
            print("Championships seeded successfully.")
        except Exception as e:
            db.rollback()
            print(f"Error seeding championships: {e}")
            raise

        # --- Events and Sessions Seeding ---
        CHAMPIONSHIP_EVENTS_DIR = BASE_DATA_PATH / "championships"
        if not CHAMPIONSHIP_EVENTS_DIR.exists():
            print(f"Championship events directory not found: {CHAMPIONSHIP_EVENTS_DIR}")
        
        event_seeding_errors = False
        for event_file in CHAMPIONSHIP_EVENTS_DIR.glob("*.json"):
            try:
                validated_champ_events = validate_championship_events_data(event_file, set(championship_slug_to_id.keys()))

                championship_id = championship_slug_to_id.get(validated_champ_events.championship)
                if not championship_id:
                    print(f"Warning: Championship '{validated_champ_events.championship}' not found. Skipping events in {event_file.name}.")
                    continue

                for event_data in validated_champ_events.events:
                    event_db = db.query(Event).filter(Event.slug == event_data.slug).first()
                    if not event_db:
                        event_db = Event(
                            name=event_data.name,
                            slug=event_data.slug,
                            start_date=datetime.strptime(event_data.start_date, '%Y-%m-%d'),
                            end_date=datetime.strptime(event_data.end_date, '%Y-%m-%d'),
                            championship_id=championship_id
                        )
                        db.add(event_db)
                        db.flush() # Flush to get ID
                        print(f"Added event: {event_data.name} ({validated_champ_events.championship})")
                    else:
                        event_db.name = event_data.name
                        event_db.start_date = datetime.strptime(event_data.start_date, '%Y-%m-%d'),
                        event_db.end_date = datetime.strptime(event_data.end_date, '%Y-%m-%d'),
                        event_db.championship_id = championship_id
                        print(f"Updated event: {event_data.name} ({validated_champ_events.championship})")

                    # Sessions upsert
                    for session_data in event_data.sessions:
                        session_db = db.query(Session).filter(
                            Session.event_id == event_db.id,
                            Session.session_number == session_data.session_number
                        ).first()

                        session_start_time_utc = convert_to_utc(session_data.start_time, session_data.timezone)

                        if not session_db:
                            session_db = Session(
                                name=session_data.name,
                                start_time=session_start_time_utc,
                                session_number=session_data.session_number,
                                event_id=event_db.id,
                                timezone=session_data.timezone if session_data.timezone else session_start_time_utc.tzinfo.tzname(session_start_time_utc) # Store provided TZ or inferred UTC
                            )
                            db.add(session_db)
                            print(f"  Added session: {session_data.name} for {event_data.name}")
                        else:
                            session_db.name = session_data.name
                            session_db.start_time = session_start_time_utc
                            session_db.timezone = session_data.timezone if session_data.timezone else session_start_time_utc.tzinfo.tzname(session_start_time_utc)
                            print(f"  Updated session: {session_data.name} for {event_data.name}")
                db.commit()
                print(f"Events and Sessions seeded for championship: {validated_champ_events.championship}")

            except Exception as e:
                db.rollback()
                print(f"Error seeding events/sessions from {event_file.name}: {e}")
                event_seeding_errors = True
        
        if event_seeding_errors:
            print("\nSome event/session files failed seeding.")
        else:
            print("\nAll data (categories, championships, events, sessions) seeded successfully!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_data()