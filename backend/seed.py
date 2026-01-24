from app.database import SessionLocal
from app.models import Category, Championship, Event, Session
from datetime import datetime, timedelta, timezone

def seed_data():
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(Category).first() is None:
            print("Seeding database...")
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
            evt_monaco = Event(name="Monaco Grand Prix", slug="monaco-gp", start_date=datetime(2026, 5, 22), end_date=datetime(2026, 5, 24), championship_id=champ_f1.id)
            evt_lemans = Event(name="24 Hours of Le Mans", slug="24h-lemans", start_date=datetime(2026, 6, 13), end_date=datetime(2026, 6, 14), championship_id=champ_wec.id)
            evt_upcoming = Event(name="Upcoming Test Event", slug="upcoming-test", start_date=datetime.now(timezone.utc) + timedelta(days=3), end_date=datetime.now(timezone.utc) + timedelta(days=4))
            db.add_all([evt_monaco, evt_lemans, evt_upcoming])
            db.commit()

            # Sessions
            ses_mon_fp1 = Session(name="Free Practice 1", start_time=datetime(2026, 5, 22, 13, 30), session_number=1, event_id=evt_monaco.id)
            ses_mon_fp2 = Session(name="Free Practice 2", start_time=datetime(2026, 5, 22, 17, 0), session_number=2, event_id=evt_monaco.id)
            ses_mon_qual = Session(name="Qualifying", start_time=datetime(2026, 5, 23, 16, 0), session_number=3, event_id=evt_monaco.id)
            ses_mon_race = Session(name="Race", start_time=datetime(2026, 5, 24, 15, 0), session_number=4, event_id=evt_monaco.id)
            
            ses_lem_warmup = Session(name="Warm-up", start_time=datetime(2026, 6, 13, 9, 0), session_number=1, event_id=evt_lemans.id)
            ses_lem_race = Session(name="Race", start_time=datetime(2026, 6, 13, 16, 0), session_number=2, event_id=evt_lemans.id)

            ses_next = Session(name="Next Session Test", start_time=datetime.now(timezone.utc) + timedelta(hours=2), session_number=1, event_id=evt_upcoming.id)

            db.add_all([ses_mon_fp1, ses_mon_fp2, ses_mon_qual, ses_mon_race, ses_lem_warmup, ses_lem_race, ses_next])
            db.commit()
            print("Database seeded.")
        else:
            print("Database already seeded.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
