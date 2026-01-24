from app.database import SessionLocal
from app.models import Category, Championship, Event, Session
from datetime import datetime, timedelta, timezone

def seed_data():
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(Category).first() is None:
            print("Seeding database...")
            
            # Helper to create timezone-aware UTC datetime
            def to_utc(year, month, day, hour, minute):
                return datetime(year, month, day, hour, minute, tzinfo=timezone.utc)

            # Categories
            cat_f1 = Category(name="Formula 1")
            cat_wec = Category(name="World Endurance Championship")
            db.add_all([cat_f1, cat_wec])
            db.commit()

            # Championships
            champ_f1 = Championship(name="Formula 1 World Championship", slug="f1", category_id=cat_f1.id)
            champ_wec = Championship(name="FIA World Endurance Championship", slug="wec", category_id=cat_wec.id)
            db.add_all([champ_f1, champ_wec])
            db.commit()

            # Events
            # Ensure event dates are also timezone aware if they represent specific points in time
            evt_monaco = Event(name="Monaco Grand Prix", slug="monaco-gp", start_date=to_utc(2026, 5, 22, 0, 0), end_date=to_utc(2026, 5, 24, 0, 0), championship_id=champ_f1.id)
            evt_lemans = Event(name="24 Hours of Le Mans", slug="24h-lemans", start_date=to_utc(2026, 6, 13, 0, 0), end_date=to_utc(2026, 6, 14, 0, 0), championship_id=champ_wec.id)
            evt_upcoming = Event(name="Upcoming Test Event", slug="upcoming-test", start_date=datetime.now(timezone.utc) + timedelta(days=3), end_date=datetime.now(timezone.utc) + timedelta(days=4))
            db.add_all([evt_monaco, evt_lemans, evt_upcoming])
            db.commit()

            # Sessions
            # Add timezone string for each session
            ses_mon_fp1 = Session(name="Free Practice 1", start_time=to_utc(2026, 5, 22, 13, 30), session_number=1, event_id=evt_monaco.id, timezone="Europe/Monaco")
            ses_mon_fp2 = Session(name="Free Practice 2", start_time=to_utc(2026, 5, 22, 17, 0), session_number=2, event_id=evt_monaco.id, timezone="Europe/Monaco")
            ses_mon_qual = Session(name="Qualifying", start_time=to_utc(2026, 5, 23, 16, 0), session_number=3, event_id=evt_monaco.id, timezone="Europe/Monaco")
            ses_mon_race = Session(name="Race", start_time=to_utc(2026, 5, 24, 15, 0), session_number=4, event_id=evt_monaco.id, timezone="Europe/Monaco")
            
            ses_lem_warmup = Session(name="Warm-up", start_time=to_utc(2026, 6, 13, 9, 0), session_number=1, event_id=evt_lemans.id, timezone="Europe/Paris")
            ses_lem_race = Session(name="Race", start_time=to_utc(2026, 6, 13, 16, 0), session_number=2, event_id=evt_lemans.id, timezone="Europe/Paris")

            ses_next = Session(name="Next Session Test", start_time=datetime.now(timezone.utc) + timedelta(hours=2), session_number=1, event_id=evt_upcoming.id, timezone="UTC")

            db.add_all([ses_mon_fp1, ses_mon_fp2, ses_mon_qual, ses_mon_race, ses_lem_warmup, ses_lem_race, ses_next])
            db.commit()
            print("Database seeded.")
        else:
            print("Database already seeded.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
