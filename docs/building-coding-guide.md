# MOE standard design building coding guide

Supplied by the project team on 2026-09-27, taken from Ministry documents that are
not in `docs/source-pdfs`. **Treat as the source of truth for the selection rules**
until official PDF information gives a more specific rule. Code that implements a
rule cites the section number here as `[guide §n]`.

These are selection rules for the website, not a replacement for official Ministry
documentation. The website must never recommend a building type that conflicts with them.

## 1. School types

Two categories: **Primary**, and **Secondary / Intermediate**. School type decides
which building configurations are available and which module dimensions are used.

## 2. S-type buildings — single depth

S = single-depth teaching building; the number is storeys: S1 = 1, S2 = 2, S3 = 3.
There is no S4. S types can be used at both school types, with a different module:

- Primary: **B module, 7.2 m × 12 m**
- Secondary / Intermediate: **A module, 7.2 m × 10.3 m**

## 3. S-type length

S1, S2 and S3 are generally **3 to 6 modules long**. The number in the building code
is the configuration length. Physical bays do not always equal teaching spaces (TS):
one bay may be toilets, administration or resource/support space.

## 4. Half-bay resource / toilet configuration

A half-bay is **3.6 m wide** and can hold toilets, administration or resource space.

- S1 with 2 TS: normally **no** toilet/resource half-bay.
- S1 with 3 TS: can include a half-bay — coded **S1-3.5** (3 TS length + .5 half-bay).
- Above 3 TS: use a **full bay** for resource/admin/toilets, so the physical length
  exceeds the number of teaching spaces.

## 5. Example: S2

**S2-3.5**: 2 storeys, 3 TS length, half-bay resource/admin/toilet provision (can serve
the building vertically). Beyond 3 TS move to a full bay: **S2-5 ≈ 4 TS + 1
resource/admin/toilet bay**. S2-5 ≠ 5 teaching spaces.

## 6. Teaching-space counting rule

Never assume building code number = number of teaching spaces.
**Physical bay count = teaching spaces + service/resource/admin provision.**
The interface should make this distinction clear.

## 7. C module

**C module = 8.4 m × 12 m.** May be incorporated into S types where more area is
required, but **do not recommend it automatically yet** — store it, don't use it to
override the S-type rules.

## 8. D-type buildings — double depth

Teaching spaces | corridor | teaching spaces. D1 = 1 storey, D2 = 2, D3 = 3. No D4.

## 9. D-type compatibility

**Secondary / Intermediate only.** Never recommend D types to a primary school.
D-type module: **8.4 m × 8 m**.

## 10. D-type length

D1, D2 and D3 are generally **3 to 6 modules long**, coded on the same principle as S types.

## 11. D1 half-bay rules

- D1 with 3 TS length: half-bay resource/toilet on **one** side — **D1-3**.
- D1 with 4 TS length: half-bay on **each** side — **D1-4**.
- Half-bays are not counted as teaching spaces.

## 12. D2 and D3 half-bays

D2 and D3 generally have half-bay resource/toilet provision on **each** side as part
of the normal configuration.

## 13. D2 / D3 teaching-space count

One bay may be occupied by resource/admin/toilet functions. Example: 4 bays along one
row and 3 along the other = **7 bays but 6 teaching spaces**. Report teaching capacity,
not physical bay count.

## 14. Specialist teaching spaces

S1–S3 and D1–D3 allow **up to 4 specialist spaces per floor**; the typical range is
**1–3 per floor**. Use the specialist requirement when choosing configurations
(e.g. 5 specialist spaces → 2 floors × 3 per floor). Don't assume all 4 are used.

## 15. Specialist recommendation logic

1. School type → 2. total TS → 3. specialist TS → 4. single or double depth →
5. floors → 6. TS capacity per floor → 7. do the specialist spaces fit →
8. present suitable configurations, not every possible one. Prefer configurations
that meet the requirement without unnecessarily exceeding it.

## 16. Gyms

- **G1** single-court gym, **G2** single-court gym with a different amenity arrangement
  (present both when a single court is required; user compares/selects).
- **G4** double-court gym.
- 1 court → G1 / G2. 2 courts → G4. Don't recommend G4 for a single court.

## 17. Halls

- **H3** large primary school hall.
- **H8** large secondary school hall; **H9** the same with a different amenity arrangement.
- Primary → H3. Secondary / Intermediate → H8 or H9 (alternatives, not sizes).

## 18. OMB 2.5

**1–6 modules long, module 7.2 m × 12 m.** A separate standard building type; do not
combine with the S/D recommendation logic unless official MOE information says so.

## 19. Recommendation hierarchy

1. School type. 2. Required functions (general TS, specialist TS, hall, gym, other).
3. Teaching-space requirement → suitable S/D configurations. 4. School-type filter:

- Primary: S1/S2/S3 on the B module (7.2 × 12); hall H3; gym G1/G2/G4; no D types.
- Secondary / Intermediate: S1/S2/S3 on the A module (7.2 × 10.3) and D1/D2/D3 on the
  8.4 × 8 module; halls H8/H9; gyms G1/G2/G4.

## 20. Configuration selection

For each building calculate storeys × usable teaching configuration, accounting for
resource/admin/toilet bays — never modules × floors. Store separately: physical
configuration, teaching capacity, specialist capacity, resource/admin/toilet provision.

## 21. Example

Secondary, 4 general TS + 2 specialist TS → consider S1–S3 and D1–D3. An S option may
be shown as **S2-5**: "2-storey single-depth configuration, approximately 4 teaching
spaces plus a resource/admin/toilet bay". Present a small number of options that meet
the requirement and explain why each is available; don't pick one automatically.

## 22. Recommendation language

Never "This is the correct building". Use "Potential standardised options",
"Suitable standardised configurations" or "Options that meet the current
requirements" — final selection also depends on site, school, MOE requirements,
planning and architectural site planning.

## 23. Future rules

Keep the engine modular: site area/dimensions, setbacks, orientation, constraints,
seismic, storeys allowed, accessibility, specialist types, hall/gym requirements,
climate, existing buildings and connections, circulation, fire access, outdoor learning.

## 24. Implementation principle

Work from structured data. For every building type store: code, category, school
types permitted, module type, module width, module length, storeys, min/max
configuration, teaching-space capacity, specialist capacity, resource/admin, toilet,
half-bay and full-bay provision, gym/hall type.

## Building database

| Code    | Building type     | School                   | Storeys | Module                    | Configuration  |
| ------- | ----------------- | ------------------------ | ------: | ------------------------- | -------------- |
| S1      | Single depth      | Primary / Secondary      |       1 | Primary: B / Secondary: A | 3–6            |
| S2      | Single depth      | Primary / Secondary      |       2 | Primary: B / Secondary: A | 3–6            |
| S3      | Single depth      | Primary / Secondary      |       3 | Primary: B / Secondary: A | 3–6            |
| D1      | Double depth      | Secondary / Intermediate |       1 | 8.4 × 8 m                 | 3–6            |
| D2      | Double depth      | Secondary / Intermediate |       2 | 8.4 × 8 m                 | 3–6            |
| D3      | Double depth      | Secondary / Intermediate |       3 | 8.4 × 8 m                 | 3–6            |
| G1      | Single-court gym  | School dependent         |       — | —                         | Single court   |
| G2      | Single-court gym  | School dependent         |       — | —                         | Single court   |
| G4      | Double-court gym  | School dependent         |       — | —                         | Double court   |
| H3      | Large hall        | Primary                  |       — | —                         | Primary hall   |
| H8      | Large hall        | Secondary                |       — | —                         | Secondary hall |
| H9      | Large hall        | Secondary                |       — | —                         | Secondary hall |
| OMB 2.5 | Standard building | TBD                      |       — | 7.2 × 12 m                | 1–6            |

## Selection flow

School type → required functions → teaching-space requirement → filter incompatible
types → suitable S/D configurations → account for resource/admin/toilet bays → check
specialist capacity → present suitable options → user selects → carry into the PDF.
Always show **why** an option is available, e.g.:

> **S2-A5** · Secondary school · 2 storeys · single-depth · 7.2 × 10.3 m teaching
> module · approximately 4 teaching spaces + 1 resource/admin/toilet bay per floor ·
> suitable for the current teaching-space requirement

## How the app reads the ambiguous parts

Decisions the project team should confirm:

- **Code number is per floor.** S2-5 = 5 bays per floor (4 TS + 1 resource bay), so
  8 TS over two floors — this follows §20 (storeys × usable configuration).
- **Code format XX-XX.** The building type comes first (S1–S3, D1–D3). S codes carry the
  module letter, since it varies by school type: S2-B5 (primary, B module), S2-A5
  (secondary / intermediate, A module); a letterless S2-5 is rejected with a prompt to add
  the letter. D types have one module, so D codes have no letter (D2-4). Valid S lengths:
  2 (S1 only), 3, 3.5, 4 (3 TS + full bay), 5, 6. The options only generate 2, 3.5, 5, 6.
- **D-type counting.** D-n is n modules long per row. D1: both rows are teaching (2n TS
  per floor), half-bay one end at n = 3, both ends at n ≥ 4. D2/D3: one position per floor
  is the stair and one bay is resource/admin/toilet, so 2n − 2 TS per floor (D2-4 = 7
  bays, 6 TS per floor — the §13 example), with half-bays both ends.
- **Specialist spaces** occupy the building's standard teaching bays (the C module is not
  used automatically, §7), at most 4 per floor, spread as evenly as the floors allow.
- **OMB 2.5** is never generated as an option — it can only be entered by code
  (OMB 2.5-3), and each module is counted as a teaching space (§18).
- **Which options are shown.** Every S (and, secondary, D) configuration that fits within
  the storey limit, keeping those whose surplus is within max(2, 25% of the requirement)
  of the closest fit; plus two lower S buildings when one building would need more storeys.
  Above the largest single building, the fewest buildings of one type that fit.
- **Library layouts** are the primary catalogue's A / B, offered to both school types.
