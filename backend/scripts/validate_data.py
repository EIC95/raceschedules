import json
from pathlib import Path
from typing import List, Set, Optional
from datetime import datetime
from pydantic import BaseModel, Field, ValidationError, field_validator # Import field_validator

# Try importing pytz for timezone validation, provide a fallback if not installed
try:
    import pytz
except ImportError:
    pytz = None
    print("Warning: pytz not installed. Timezone validation will be skipped. "
          "Install with 'pipenv install pytz' or 'pip install pytz' for full validation.")

class CategoryData(BaseModel):
    slug: str = Field(..., pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$") # kebab-case
    name: str

class ChampionshipData(BaseModel):
    slug: str = Field(..., pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$") # kebab-case
    name: str
    category: str # This will be the slug of an existing category

class SessionData(BaseModel):
    name: str
    session_number: int
    start_time: str
    timezone: Optional[str] = None

    @field_validator('start_time')
    def validate_start_time_format(cls, v):
        try:
            datetime.fromisoformat(v.replace('Z', '+00:00')) # Handle 'Z' for UTC
        except ValueError:
            raise ValueError("start_time must be a valid ISO 8601 datetime string.")
        return v

    @field_validator('timezone')
    def validate_timezone_with_start_time(cls, v, info): # Changed values to info for Pydantic V2
        start_time_str = info.data.get('start_time') # Access data via info.data
        if not start_time_str:
            return v # start_time validation already failed or not present

        dt = datetime.fromisoformat(start_time_str.replace('Z', '+00:00'))

        # Check if start_time has timezone info (offset-aware)
        if dt.tzinfo is not None and dt.tzinfo.utcoffset(dt) is not None:
            if v is not None:
                print(f"Warning: timezone field '{v}' is redundant for offset-aware start_time '{start_time_str}'.")
            return None # Clear redundant timezone
        else: # start_time is naive (offset-naive)
            if v is None:
                raise ValueError("timezone is mandatory for offset-naive start_time.")
            if pytz:
                try:
                    pytz.timezone(v)
                except pytz.exceptions.UnknownTimeZoneError:
                    raise ValueError(f"'{v}' is not a valid IANA timezone.")
            elif v is not None:
                print(f"Skipping timezone validation for '{v}' because pytz is not installed.")
            return v

class EventData(BaseModel):
    slug: str = Field(..., pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$") # kebab-case
    name: str
    location: str
    start_date: str # YYYY-MM-DD
    end_date: str   # YYYY-MM-DD
    sessions: List[SessionData]

    @field_validator('start_date', 'end_date')
    def validate_date_format(cls, v):
        try:
            datetime.strptime(v, '%Y-%m-%d')
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format.")
        return v

class ChampionshipEventsData(BaseModel):
    championship: str # Slug of the championship this data belongs to
    events: List[EventData]

def validate_categories_data(file_path: Path) -> List[CategoryData]:
    """
    Loads and validates categories data from a JSON file.
    """
    if not file_path.exists():
        raise FileNotFoundError(f"Categories data file not found: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError("Categories data must be a list of objects.")

    validated_categories: List[CategoryData] = []
    slugs = set()
    for item in data:
        try:
            category = CategoryData(**item)
            if category.slug in slugs:
                raise ValueError(f"Duplicate slug found in categories: {category.slug}")
            slugs.add(category.slug)
            validated_categories.append(category)
        except ValidationError as e:
            raise ValueError(f"Invalid category data: {item}. Errors: {e.errors()}")
        except ValueError as e:
            raise e # Re-raise duplicate slug error

    print(f"Successfully validated {len(validated_categories)} categories from {file_path}")
    return validated_categories

def validate_championships_data(file_path: Path, valid_category_slugs: Set[str]) -> List[ChampionshipData]:
    """
    Loads and validates championships data from a JSON file.
    Ensures category slugs refer to existing categories.
    """
    if not file_path.exists():
        raise FileNotFoundError(f"Championships data file not found: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError("Championships data must be a list of objects.")

    validated_championships: List[ChampionshipData] = []
    slugs = set()
    for item in data:
        try:
            championship = ChampionshipData(**item)
            if championship.slug in slugs:
                raise ValueError(f"Duplicate slug found in championships: {championship.slug}")
            if championship.category not in valid_category_slugs:
                raise ValueError(f"Invalid category slug '{championship.category}' for championship '{championship.name}'. "
                                 f"Must be one of: {', '.join(valid_category_slugs)}")
            slugs.add(championship.slug)
            validated_championships.append(championship)
        except ValidationError as e:
            raise ValueError(f"Invalid championship data: {item}. Errors: {e.errors()}")
        except ValueError as e:
            raise e # Re-raise duplicate slug/invalid category error

    print(f"Successfully validated {len(validated_championships)} championships from {file_path}")
    return validated_championships

def validate_championship_events_data(file_path: Path, valid_championship_slugs: Set[str]) -> ChampionshipEventsData:
    """
    Loads and validates championship event data from a JSON file.
    Ensures the championship slug refers to an existing championship.
    Ensures event slugs are unique within the file.
    """
    if not file_path.exists():
        raise FileNotFoundError(f"Championship events data file not found: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    try:
        champ_events = ChampionshipEventsData(**data)
    except ValidationError as e:
        raise ValueError(f"Invalid championship events data in {file_path}. Errors: {e.errors()}")

    if champ_events.championship not in valid_championship_slugs:
        raise ValueError(f"Championship slug '{champ_events.championship}' in {file_path} does not exist in "
                         f"the main championships list. Must be one of: {', '.join(valid_championship_slugs)}")

    event_slugs = set()
    for event in champ_events.events:
        if event.slug in event_slugs:
            raise ValueError(f"Duplicate event slug '{event.slug}' found in {file_path}.")
        event_slugs.add(event.slug)
        
        session_names_and_numbers = set()
        for session in event.sessions:
            # Ensure unique session name/number combo within an event
            if (session.name, session.session_number) in session_names_and_numbers:
                raise ValueError(f"Duplicate session (name: '{session.name}', number: {session.session_number}) "
                                 f"found for event '{event.slug}' in {file_path}.")
            session_names_and_numbers.add((session.name, session.session_number))

    print(f"Successfully validated championship events for '{champ_events.championship}' from {file_path}")
    return champ_events


if __name__ == "__main__":
    BASE_DATA_PATH = Path(__file__).parent.parent / "data"

    # Validate Categories
    CATEGORIES_FILE = BASE_DATA_PATH / "categories.json"
    try:
        validated_categories = validate_categories_data(CATEGORIES_FILE)
        category_slugs = {c.slug for c in validated_categories}
    except (FileNotFoundError, ValueError) as e:
        print(f"Error validating categories: {e}")
        exit(1)

    # Validate Championships
    CHAMPIONSHIPS_FILE = BASE_DATA_PATH / "championships.json"
    try:
        validated_championships = validate_championships_data(CHAMPIONSHIPS_FILE, category_slugs)
        championship_slugs = {c.slug for c in validated_championships}
    except (FileNotFoundError, ValueError) as e:
        print(f"Error validating championships: {e}")
        exit(1)

    # Validate Championship Events
    CHAMPIONSHIP_EVENTS_DIR = BASE_DATA_PATH / "championships"
    if not CHAMPIONSHIP_EVENTS_DIR.exists():
        print(f"Championship events directory not found: {CHAMPIONSHIP_EVENTS_DIR}")
        exit(1)
    
    event_validation_errors = False
    for event_file in CHAMPIONSHIP_EVENTS_DIR.glob("*.json"):
        try:
            validate_championship_events_data(event_file, championship_slugs)
        except (FileNotFoundError, ValueError) as e:
            print(f"Error validating championship events in {event_file.name}: {e}")
            event_validation_errors = True
    
    if event_validation_errors:
        print("\nSome championship event files failed validation.")
        exit(1)
    else:
        print("\nAll data validation passed!")