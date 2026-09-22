# MOE Standard Designs Navigator — Project Plan

Status: **Phase 1 data substantially verified.** All 8 supplied Ministry PDFs have been
read in full and extracted into `db/data/*.yml` with page-level citations. Type S, D, H
and G are now `status: verified` with real dimensions, typology codes, and fixed/
configurable rules. Type K and the "composite" school type remain unsourced — see
§11a below for what's still open.
Last updated: 2026-09-22

## 11a. What the 8 supplied PDFs actually confirmed (2026-09-22 update)

Full extraction reports (with page citations) exist in this session's history; the
headline findings now reflected in `db/data/`:

- **Type S and Type D are umbrella labels; the PDFs use their own typology codes**
  underneath: **S1/S2/S3** (single-depth, 1/2/3-storey) and a relocatable **OMB2.5**,
  plus **D1/D2/D3** (double-depth, secondary-only — the primary/intermediate catalogue
  contains no Type D designation anywhere). These are modelled as `Layout` records
  under the `S`/`D` `BuildingType`.
- **Type H and Type G's PDF never uses "Type H"/"Type G"/"whare wānanga"/
  "whare hākinakina" at all** — a genuine discrepancy between the MOE webpage's
  umbrella language and the technical document's own coding (halls: HS/HM/HL split by
  amenity-side and by primary vs. secondary; gyms: GS-S/GS-L/GD-S, not split by school
  type). Flagged in `BuildingType#S` summary; not silently reconciled.
  hall example ~510m², single-court gym example ~731m² — both single worked examples,
  not guaranteed sizes for every instance of that tier.
- **Administration and library are not separate Ministry "Types"** — they're layout
  categories that attach to a Type S/D teaching building via a "Resource & Admin
  Module" system (explicitly keyed to S1/D/S2/S3 on p.15 of the primary teaching doc
  and p.34 of the secondary teaching doc). The matcher now checks `admin_compatible`
  as well as category for administration requests; library layouts are attached to
  Type S as an editorial convenience (not a Ministry-stated linkage — flagged in each
  library Layout's notes).
- **No roll-size-to-classroom-count formula exists in any of the 8 documents.** Every
  extraction agent checked explicitly and confirmed absence. Do not invent one.
- **Accessibility is barely documented** — only a generic "Accessible WC door" (TJ-5)
  appears across all documents, plus two callouts for an accessible bench/sink in one
  secondary science room. No accessibility standard, clearance, or requirement is
  named anywhere.
- **Most room-level floor areas are not stated as m² figures** — only overall building
  grid dimensions (mm) are given on plan sheets. Where `spaces.yml` shows an area, it
  is either a Ministry-stated module dimension (e.g. general teaching 82m²/70m²/95m²,
  explicitly given in the catalogues) or is clearly marked `[NEEDS CONFIRMATION]` as
  calculated from grid dimensions, never invented.
- The **full secondary specialist-teaching catalogue** (30+ named subject rooms —
  science, technology, arts, food/hospitality, automotive, mechatronics, etc., each
  with its own room data sheet) is documented in "Standard layouts for secondary
  school teaching spaces" but not yet individually modelled as `Space` records —
  only a generic "Specialist Teaching Space — Secondary" placeholder exists. Expanding
  this is the natural next data-entry pass.
- **Type K (kura) and the "composite" school type remain completely unsourced** —
  none of the 8 PDFs mention kura, Māori-medium, or composite schools at all.

This document is the required "structuring stage" output before any application code is
written: document inventory, data model, user journey, and matching logic. Per the project
brief, every fact below is labeled by provenance so nothing invented gets mistaken for
Ministry-verified information.

## Provenance legend (used throughout this doc and later in the app itself)

| Tag | Meaning |
|---|---|
| `[MOE-WEB]` | Stated on the official MOE webpage the user supplied in chat (URL below). Treated as verified. |
| `[MOE-PDF]` | Sourced from a supplied Ministry PDF, with document name + page cited. **None supplied yet — see Open Items.** |
| `[ASSUMPTION]` | A prototype scaffolding choice made to keep development moving. Not a Ministry fact. Must not be shown to a real user as if it were Ministry data. |
| `[NEEDS CONFIRMATION]` | A plausible real-world variable that has no source yet and must be verified against MOE documentation or MOE property team before the app relies on it. |

Reference: MOE — *Standard designs for school buildings and layouts*
https://www.education.govt.nz/our-work/strategies-policies-and-programmes/property-and-infrastructure/standardising-school-property/standard-designs-school-buildings-and-layouts `[MOE-WEB]`

---

## 1. Document inventory

**No Ministry PDFs have been supplied to this session yet.** Everything below that would
normally come from those PDFs (dimensions, capacities, room counts, fixed-vs-configurable
rules, accessibility requirements) is marked `[NEEDS CONFIRMATION]` and stubbed as `null`
in the data model — not guessed.

What *is* known from the official webpage `[MOE-WEB]`:

- Pre-approved designs cover buildings, classroom layouts, and agreed building materials.
- They include teaching, administration, gym, hall, and library spaces.
- Standard **building types**:
  - **Type S** — single-depth buildings
  - **Type D** — double-depth buildings
  - **Type H** — halls, including whare wānanga
  - **Type G** — gyms, including whare hākinakina
  - **Type K** — kura Māori buildings (where applicable)
- Standard **layouts** exist for: primary/intermediate teaching spaces, secondary teaching
  spaces, administration, libraries, gyms and halls, and learning support spaces.

Everything else — actual dimensions, teaching-space counts per type, storey limits, what's
fixed vs. configurable, accessibility rules, material specs — is **not yet available** and
must come from the PDFs you'll supply, or direct confirmation from the Ministry property
team.

**Action needed from you:** drop the Ministry PDFs into `docs/source-pdfs/` (create the
folder) and tell me which ones map to which building type/category, so the next pass can
extract real figures instead of `null` placeholders.

---

## 2. School types identified

From the brief and the webpage's layout categories:

| Code | Label | Source |
|---|---|---|
| `primary` | Primary | `[MOE-WEB]` (layouts exist for "primary/intermediate teaching spaces") |
| `intermediate` | Intermediate | `[MOE-WEB]` |
| `secondary` | Secondary | `[MOE-WEB]` (layouts exist for "secondary teaching spaces") |
| `composite` | Composite (Years 1–13) | `[ASSUMPTION]` — standard NZ school-type category, not yet confirmed against MOE building-type applicability |
| `kura` | Kura / Māori-medium | `[MOE-WEB]` (Type K exists "where applicable") |

## 3. Standard layout categories identified `[MOE-WEB]`

1. Primary and intermediate teaching spaces
2. Secondary teaching spaces
3. Administration
4. Libraries
5. Gyms and halls
6. Learning support spaces

These become the app's **building category** facets (Teaching / Administration / Library /
Hall / Gym / Specialist / Learning Support), per the brief's requirement that categories be
data-driven, not hard-coded to classrooms.

## 4. Decision variables — proposed, pending PDF confirmation

These are the fields the questionnaire will ask for and the matcher will compare against
building-type records. All are `[ASSUMPTION]` scaffolding until cross-checked against the
PDFs — the point is to get the *shape* of the matcher right, not to assert these are the
real Ministry criteria.

- School type (`primary` / `intermediate` / `secondary` / `composite` / `kura`)
- Current roll, projected roll
- Number of general teaching spaces required
- Number of specialist teaching spaces required
- Learning support space requirements
- Administration requirements (offices, reception, staff areas, meeting spaces)
- Additional facilities needed (library / hall / gym / whare wānanga / whare hākinakina /
  learning support / specialist)
- Building configuration preference (single storey / two storey / other)
- Site area available, site constraints, existing buildings/circulation, future expansion

## 5. Fixed vs. configurable elements

`[NEEDS CONFIRMATION]` — entirely. The brief is explicit that the app must distinguish
"what can be changed" from "what is fixed" per building type, but this is exactly the kind
of clause that lives inside the PDFs (materials, structural grid, room adjacencies) and
must not be inferred. The data model reserves fields for this (`fixed_elements`,
`configurable_elements` on each Building record) but they ship `null`/empty until sourced.

## 6. Contradictions / open ambiguities so far

- The brief lists "single storey / two storey / potentially other configurations" — the
  webpage doesn't confirm which building types support which storey counts. `[NEEDS CONFIRMATION]`
- "Composite" school type isn't named on the webpage's layout list (which only mentions
  primary/intermediate and secondary) — need to confirm whether composite schools draw from
  both layout families or have distinct guidance. `[NEEDS CONFIRMATION]`
- No capacity/roll-size figures exist anywhere in what's been supplied so far — the
  questionnaire will collect roll numbers, but the matcher cannot yet use them
  quantitatively (e.g. "roll of 400 → X classrooms") without a sourced formula. Until then,
  roll/space-count questions inform the *summary* shown to the user but do not silently
  drive a match score.

---

## 7. Data model

Kept entirely separate from the UI, as structured data (YAML/JSON seeds → ActiveRecord
tables later), matching the brief's `/data/buildings`, `/data/layouts`, `/data/spaces`,
`/data/rules`, `/data/sources` split.

```
BuildingType
  id                    string, e.g. "type-s"
  code                  "S" | "D" | "H" | "G" | "K"
  name                  "Type S — Single-depth building"
  depth                 "single" | "double" | null
  category              "teaching" | "administration" | "library" | "hall" | "gym" | "specialist" | "learning_support"
  applicable_school_types   [SchoolType.id]           [NEEDS CONFIRMATION]
  storeys_supported     ["single", "two"] | null       [NEEDS CONFIRMATION]
  teaching_space_count  { min, max } | null            [NEEDS CONFIRMATION]
  admin_compatible      boolean | null                 [NEEDS CONFIRMATION]
  specialist_spaces     [string] | []                  [NEEDS CONFIRMATION]
  hall_gym_compatible   boolean | null                 [NEEDS CONFIRMATION]
  fixed_elements        [string] | []                  [NEEDS CONFIRMATION]
  configurable_elements [string] | []                  [NEEDS CONFIRMATION]
  summary               plain-language description, tagged by provenance
  sources               [Source.id]
  model_3d_id           Model3D.id | null
  status                "prototype_placeholder" | "verified"

Layout
  id
  building_type_id      → BuildingType
  name                  e.g. "Secondary teaching — 2 classroom cluster"
  school_types          [SchoolType.id]
  spaces                [Space.id]
  diagram_asset         path to source diagram/image, if permitted to reproduce
  sources               [Source.id]

Space
  id
  name                  e.g. "General teaching space", "Reception", "Library — junior"
  category              matches BuildingType.category enum
  typical_area_m2       number | null                  [NEEDS CONFIRMATION]
  notes
  sources               [Source.id]

SchoolType
  id                     "primary" | "intermediate" | "secondary" | "composite" | "kura"
  label
  notes

Requirement (captured per user session, not seed data)
  id
  session_id
  school_type_id
  current_roll, projected_roll
  teaching_spaces_required, specialist_spaces_required
  admin_requirements      {...}
  facilities_requested    [category]
  configuration_preference
  site_constraints        {...}
  created_at

Rule
  id
  description            plain-language explanation of a matching rule
  applies_to             BuildingType.id
  condition               structured predicate (see §9 Matching logic)
  source_id               Source.id | null              [NEEDS CONFIRMATION] until PDF-backed
  status                  "prototype_placeholder" | "verified"

Source
  id
  document_name           e.g. "MOE Standard Designs — Type S Guidance.pdf"
  ministry_source_url
  page                    number | null
  section
  version / date
  file_path                docs/source-pdfs/... (once supplied)

Model3D
  id
  building_type_id
  format                  "glb" | "placeholder"
  file_path
  is_placeholder          boolean
  label                   shown in the viewer, e.g. "Prototype representation — not an official Ministry model"
```

Every `BuildingType` and `Rule` record ships with a `status` flag
(`prototype_placeholder` vs `verified`) and the UI will visibly badge unverified records —
this is how the app enforces the brief's "distinguish Ministry-documented info from
prototype assumptions" requirement structurally, not just in copy.

## 8. Proposed user journey

Matches the brief's flow exactly:

```
Landing → School Requirements (multi-step) → Building/Space Requirements (multi-step)
  → Site/Building Constraints → Relevant Standard Options (scored + explained)
  → Building Type Selection → 3D/Visual Exploration (Phase 3+)
  → Detailed Building Information → Comparison/Shortlist → Summary
```

Each questionnaire step is its own Turbo Frame / route (not one giant form), each showing a
one-line "why we're asking" note before its fields, matching the brief's requirement.

## 9. Proposed matching logic (Phase 1)

Deterministic, explainable, rule-based — no LLM in the matching path.

1. Start with all `BuildingType` records in the requested `category` (or all categories if
   the user is exploring broadly).
2. For each candidate, evaluate its `applicable_school_types`, `storeys_supported`,
   `teaching_space_count`, `hall_gym_compatible`, etc. against the `Requirement` the user
   entered. Each satisfied criterion contributes one **matched reason**; each violated
   *hard* constraint (e.g. school type not supported, once that's actually sourced)
   removes the candidate from "relevant" and demotes it to "not applicable, here's why."
3. Render a relevance list, each item showing:
   - the plain-language matched reasons (✓ bullet list, exactly as the brief's example)
   - a visible `prototype_placeholder` badge on any criterion that isn't yet PDF-sourced
4. No numeric "AI confidence score" — matches are shown as satisfied/unsatisfied criteria,
   because that's what stays auditable when a school board or Ministry reviewer asks "why
   is this here."

This keeps the door open for Phase 5's AI layer to *explain* results in plain language
(with citations back to `Source` records) without ever being the thing that decides a
match.

## 10. Technology stack

- **Backend/framework:** Ruby on Rails 7.x, Hotwire (Turbo + Stimulus) for the multi-step
  wizard and comparison interactions without a heavy SPA layer.
- **Styling:** Tailwind CSS via the `tailwindcss-rails` gem (ships a standalone binary —
  no Node dependency for CSS, which matters since this machine currently has no Node
  installed either).
- **Data:** YAML seed files under `db/data/{building_types,layouts,spaces,school_types,rules,sources}`,
  loaded into SQLite (dev) / Postgres (prod-ready later) via `db/seeds.rb`. Structured data
  stays out of the view layer entirely, per the brief.
- **3D (Phase 3):** plain Three.js in a Stimulus controller, `.glb` models. Placeholder
  geometry clearly labeled "prototype representation — not an official Ministry model"
  until real SketchUp→glTF exports exist.
- **Deploy target (local, this session):** `bin/rails server` on localhost. Production
  deploy (Kamal / Render / Fly.io) is a later decision, not needed for local dev.
- **Version control:** Git, local repo now, GitHub remote whenever you're ready to push.

## 11. Phased plan

Matches the brief's phases 1–5 (landing, questionnaire, DB, results, detail pages →
sources/comparison → 3D → multi-building site planning → AI explanation layer). Phase 1 is
the target for this initial scaffold.

---

## Open items — needs your input

1. **Ministry PDFs not yet supplied.** Nothing about dimensions, capacities, room counts,
   fixed/configurable elements, or accessibility rules can be filled in until these arrive.
   Please drop them in `docs/source-pdfs/` and note which building type/category each one
   covers.
2. **"Composite" school type applicability** isn't stated on the webpage — flagged for
   confirmation once PDFs are available.
3. Until PDFs land, all seeded `BuildingType`/`Rule` records in the scaffold are
   `status: prototype_placeholder` with `null` figures, so the app is honest about its own
   current state rather than presenting placeholder numbers as real.
