# CONTRIBUTING DATA

This document explains: file structure, expected format, validation, contribution workflow, and PR checklist.

## Recommended folder structure (example)

```
backend/
 ├── app/                 # application code
 ├── data/
 │   ├── categories.json
 │   └── championships/
 │           ├── f1.json
 │           ├── wec.json
 │           └── motogp.json
 ├── scripts/
 │   ├── seed.py
 │   └── validate_data.py
 └── README.md
```

---

## Data models (expected JSON format)

> **Principle**: JSON files are normalized. The `seed.py` script reads these files, validates their schema, and performs upserts into the database.

### Category (`backend/data/categories.json`)

List of objects:

```json
[
  { "slug": "single-seaters", "name": "Single-Seaters" },
  { "slug": "motorcycles", "name": "Motorcycles" }
]
```

* `slug`: unique string, kebab-case
* `name`: unique string

### Championship (`backend/data/championships.json`)

List of objects:

```json
[
  { "slug": "f1", "name": "Formula 1", "category": "single-seaters" },
  { "slug": "motogp", "name": "MotoGP", "category": "motorcycles" }
]
```

* `slug`: unique
* `name`: string
* `category`: `slug` of an existing Category

### Events (`backend/data/championships/<championship>.json`)

One file per championship; example `championships/f1.json`:

```json
{
  "championship": "f1",
  "events": [
    {
      "slug": "bahrain-gp-2026",
      "name": "Bahrain Grand Prix",
      "location": "Sakhir, Bahrain",
      "start_date": "2026-03-12",
      "end_date": "2026-03-15",
      "sessions": [
        {
          "name": "FP1",
          "session_number": 1,
          "start_time": "2026-03-13T12:30:00",
          "timezone": "Asia/Bahrain"
        },
        {
          "name": "Race",
          "session_number": 3,
          "start_time": "2026-03-15T18:00:00+03:00"
        }
      ]
    }
  ]
}
```

Notes:

* `start_date` and `end_date` for an `Event` can be provided in date format (YYYY-MM-DD).
* `sessions` is a list of Session objects (see below).
* `session.start_time` can be provided as:

  * ISO8601 with offset (`2026-03-15T18:00:00+03:00`) — the script will properly convert to UTC, **or**
  * without offset (`2026-03-13T12:30:00`) **with** a mandatory IANA `timezone` field (`"Asia/Bahrain"`).
* If `start_time` has no offset and no `timezone` is provided, validation will fail.

To contribute an exhibition event:
1.  **Create a Championship Entry:** Add an entry to `backend/data/championships.json` with the `slug` of the exhibition event, its `name`, and set its `category` to `"exhibitions"`.
    ```json
    { "slug": "macau-grand-prix", "name": "Macau Grand Prix", "category": "exhibitions" }
    ```
2.  **Create an Event File:** Create a JSON file in `backend/data/championships/` named after the exhibition event's slug (e.g., `macau-grand-prix.json`). This file will contain the event(s) and their sessions, just like a regular championship event file.
    ```json
    {
      "championship": "macau-grand-prix",
      "events": [
        {
          "slug": "macau-f3-2026",
          "name": "Macau F3 Race",
          "location": "Macau, China",
          "start_date": "2026-11-19",
          "end_date": "2026-11-22",
          "sessions": [
            { "name": "Qualifying", "session_number": 1, "start_time": "2026-11-20T10:00:00", "timezone": "Asia/Macau" },
            { "name": "Race", "session_number": 2, "start_time": "2026-11-22T15:30:00", "timezone": "Asia/Macau" }
          ]
        }
      ]
    }
    ```

This approach allows exhibition events to be managed and displayed using the same robust data structure as other championships.

### Session (inside an Event)

Expected fields:

```json
{
  "name": "Qualifying",
  "session_number": 2,
  "start_time": "2026-03-14T15:00:00",
  "timezone": "Europe/Paris"
}
```

* `name`: string
* `session_number`: integer (order within the event)
* `start_time`: ISO8601 (see rules above)
* `timezone`: **IANA tz** (e.g. `Africa/Dakar`, `Europe/Paris`) if `start_time` has no offset

---

## Automated validation

* The repository includes a `scripts/validate_data.py` script (or equivalent) based on JSON Schema / Pydantic that checks:

  * file schemas
  * uniqueness of slugs
  * existence of references (`championship` → `championships.json`, `category` → `categories.json`)
  * validity of timezones (IANA list)
  * ISO8601 format for dates/times

---

## Seed / ingestion (maintainer workflow)

The seed script reads `backend/data/` and performs operations in a transaction:

1. File validation.
2. Upsert of `categories`.
3. Upsert of `championships`.
4. Upsert of `events`.
5. For each `session`: conversion of `start_time` to UTC using `timezone` or offset, then insert/upsert.

Local command (example):

```bash
# local
python backend/scripts/seed.py
```

---

## Contribution workflow (for contributors)

1. Fork the repo.
2. Create a branch: `feature/add-f1-2026`.
3. Modify / add JSON files in `backend/data/…`.
4. Run validation locally:

   ```bash
   python backend/scripts/validate_data.py
   ```
5. (Optional but recommended) Run seed locally to verify import:

   ```bash
   python backend/scripts/seed.py
   ```
6. Commit & push.
7. Open a Pull Request explaining the change (which files, why).
8. A maintainer will review the PR.

---

## PR checklist (to include in PR description)

* [ ] I respected the JSON schemas (local validation OK).
* [ ] Slugs are unique.
* [ ] Timezones are IANA when required.
* [ ] I tested the seed locally (optional but strongly recommended).
* [ ] No fixed numeric IDs in files (use slugs).
* [ ] Clear PR description: add / fix / remove.

---

## Examples (copy–paste)

`backend/data/championships.json` (partial):

```json
[
  { "slug": "f1", "name": "Formula 1", "category": "single-seaters" },
  { "slug": "wec", "name": "FIA World Endurance Championship", "category": "endurance-gt" },
  { "slug": "wrc", "name": "World Rally Championship", "category": "rally" },
  { "slug": "nascar-cup", "name": "NASCAR Cup Series", "category": "stock-touring" },
  { "slug": "motogp", "name": "MotoGP", "category": "motorcycles" }
]
```

`backend/data/championships/f1.json` (partial):

```json
{
  "championship": "f1",
  "events": [
    {
      "slug": "bahrain-gp-2026",
      "name": "Bahrain Grand Prix",
      "location": "Sakhir, Bahrain",
      "start_date": "2026-03-12",
      "end_date": "2026-03-15",
      "sessions": [
        { "name": "FP1", "session_number": 1, "start_time": "2026-03-13T12:30:00", "timezone": "Asia/Bahrain" },
        { "name": "Qualifying", "session_number": 2, "start_time": "2026-03-14T15:00:00+03:00" },
        { "name": "Race", "session_number": 3, "start_time": "2026-03-15T18:00:00+03:00" }
      ]
    }
  ]
}
```

---

## FAQ

* **Should I include numeric IDs?** No. Use slugs.
* **Accepted formats for `start_time`?** ISO8601 with offset, or without offset + IANA `timezone`.
* **How is timezone validated?** The validation script checks against the IANA database.

---

Voici une section que tu peux ajouter telle quelle dans ton README (ou dans `README-data.md`) pour expliquer clairement l’objectif côté données :

---

## Target Championships to Add

The following championships and events are the **planned scope of the project**.
Some are already implemented (marked with ✅), while others are **open for contribution**.

Contributors are encouraged to help by adding events, and sessions for any of the championships listed below, following the data contribution guidelines described in this document.

### Single-Seaters

* Formula 1 (F1) ✅
* Formula 2 (F2)
* Formula 3 (F3)
* Super Formula
* F1 Academy
* IndyCar
* Indy NXT

### Motorcycles

* MotoGP ✅
* Moto2
* Moto3
* World Superbike (WSBK)

### Rally & Off-Road

* World Rally Championship (WRC) ✅
* World Rallycross Championship (WRX)
* World Rally-Raid Championship (W2RC)

### Stock Cars & Touring Cars

* NASCAR Cup Series ✅
* NASCAR Xfinity Series
* NASCAR Truck Series
* NASCAR Euro Series
* Deutsche Tourenwagen Masters (DTM)
* Supercars Championship
* British Touring Car Championship

### Endurance & GT Racing

* FIA World Endurance Championship (WEC) ✅
* Le Mans Cup
* IMSA WeatherTech SportsCar Championship (IMSA)
* GT World Challenge (All regions combined)
* Asian Le Mans Series
* European Le Mans Series (ELMS)
* Nürburgring Langstrecken Serie (NLS)
* Super GT
* Porsche Supercup
* Ferrari Challenge

### Exhibitions

* Macau Grand Prix
* Pikes Peak International Hill Climb
* Isle of Man TT
* Race of Champions
* Goodwood Festival of Speed

> If a championship is not listed here but fits the project scope, feel free to open an issue to discuss adding it before submitting data.