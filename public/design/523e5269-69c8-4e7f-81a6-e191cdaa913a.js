// Generated for the standalone export. Edit moe-data.js / moe-rules.js instead.
(function(){
// Standard designs — building database.
// Structured records only. No interface logic here, so new standard designs
// can be added without touching the application.
// Source: "Standard designs for primary and intermediate schools" V1.0, June 2026.

const CATALOGUE = {
  title: 'Standard designs for primary and intermediate schools',
  version: 'V1.0',
  issued: 'June 2026',
  scope: 'New teaching, library and administration spaces. Does not cover every school building type or technical requirement.'
};

const SPACE_CATS = {
  teaching:    { label: 'Teaching — general',   fill: '#E6E2D4', line: '#8B7E61' },
  breakout:    { label: 'Teaching — breakout',  fill: '#D8DFD5', line: '#6E7E67' },
  wet:         { label: 'Wet area',             fill: '#CDD8DE', line: '#627782' },
  resource:    { label: 'Resource / teachers’ wall', fill: '#E2DBE5', line: '#7B6D84' },
  admin:       { label: 'Admin / staff',        fill: '#DADFE8', line: '#687289' },
  wc:          { label: 'WC / amenities',       fill: '#DBD7D1', line: '#7C7568' },
  library:     { label: 'Library',              fill: '#E9DECF', line: '#8D795B' },
  circulation: { label: 'Circulation / stair',  fill: '#EEEDE9', line: '#898982' },
  store:       { label: 'Storage / bags',       fill: '#E3E1DB', line: '#817F6E' }
};

// Module dimensions in metres [guide §2, §4, §7, §9]. Module letters are the
// coding guide's: B 7.2 × 12 (primary), A 7.2 × 10.3 (secondary / intermediate),
// C 8.4 × 12 (stored, never recommended automatically) and the D-type module
// 8.4 × 8. Amenity net areas are given as "varies" in the catalogues: the
// half-bay and D-type figures are estimates at 85% of gross.
const MODULES = {
  TS_P: { key: 'TS_P', code: 'B · A1.p', letter: 'B', name: 'Teaching space — B module (primary)', w: 7.2, d: 12.0, nfa: 82, cat: 'teaching',
    note: 'Complete teaching space with additional area for resources. B module, 7.2 m × 12 m.' },
  AM_FULL: { key: 'AM_FULL', code: 'B1', name: 'Resource / admin / toilets — full bay', w: 7.2, d: 12.0, nfa: 76, cat: 'wc',
    note: 'Toilets, resource areas, admin or staff spaces. Not a teaching space. Net floor area varies.' },
  AM_HALF: { key: 'AM_HALF', code: 'B1.h', name: 'Resource / admin / toilets — half bay', w: 3.6, d: 12.0, nfa: 37, cat: 'wc',
    note: 'Half-bay, 3.6 m wide: toilets and resource / storage. Not a teaching space. Net floor area varies.' },
  LIB: { key: 'LIB', code: 'L1', name: 'Library module', w: 7.2, d: 12.0, nfa: 82, cat: 'library',
    note: 'Library on the teaching module grid.' },
  ADMIN: { key: 'ADMIN', code: 'C1', name: 'Administration module', w: 7.2, d: 12.0, nfa: 80, cat: 'admin',
    note: 'Reception, sick bay, meeting, staff, workroom and leadership spaces.' },
  STAIR: { key: 'STAIR', code: 'S.st', name: 'Stair & lift module', w: 4.3, d: 12.0, nfa: 34, cat: 'circulation',
    note: 'Required once per level on multi-storey types.' },
  TS_S: { key: 'TS_S', code: 'A', letter: 'A', name: 'Teaching space — A module (secondary / intermediate)', w: 7.2, d: 10.3, nfa: 70, cat: 'teaching',
    note: 'A general teaching space with teaching wall and flexibility in resources and layout. A module, 7.2 m × 10.3 m.' },
  TS_D: { key: 'TS_D', code: 'D', letter: 'D', name: 'Teaching space — D-type module', w: 8.4, d: 8.0, nfa: 67, cat: 'teaching',
    note: 'D-type teaching module, 8.4 m × 8 m. Net area shown is the module area.' },
  // A D-type bay: a teaching module either side of the corridor (3.6 m, the
  // resource / breakout strip width the secondary catalogue p8 prints).
  TS_D_PAIR: { key: 'TS_D_PAIR', code: 'D ×2', name: 'Teaching spaces — D-type, either side of the corridor', w: 8.4, d: 19.6, nfa: 134, cat: 'teaching',
    note: 'Two D-type teaching modules (8.4 m × 8 m) across a 3.6 m corridor.' },
  // D2 / D3: the position across the corridor from the stair is the resource / admin / toilet bay [guide §13].
  D_SERVICE: { key: 'D_SERVICE', code: 'D.rs', name: 'Resource / admin / toilets and stair', w: 8.4, d: 19.6, nfa: 57, cat: 'wc',
    note: 'One D-type module of resource / admin / toilets across the corridor from the stair. Not a teaching space. Net floor area varies.' },
  AM_HALF_D: { key: 'AM_HALF_D', code: 'B1.h', name: 'Resource / toilets — half bay', w: 3.6, d: 19.6, nfa: 60, cat: 'wc',
    note: 'Half-bay, 3.6 m wide, across the full depth of the D-type building. Not a teaching space. Net floor area varies.' },
  AM_FULL_S: { key: 'AM_FULL_S', code: 'B1', name: 'Resource / admin / toilets — full bay', w: 7.2, d: 10.3, nfa: 65, cat: 'wc',
    note: 'Supporting spaces such as toilets, resource areas, admin or staff spaces. Not a teaching space. Net floor area varies.' },
  AM_HALF_S: { key: 'AM_HALF_S', code: 'B1.h', name: 'Resource / admin / toilets — half bay', w: 3.6, d: 10.3, nfa: 32, cat: 'wc',
    note: 'Half-bay, 3.6 m wide: toilets and resource / storage. Not a teaching space. Net floor area varies.' },
  C_MOD: { key: 'C_MOD', code: 'C', letter: 'C', name: 'C module', w: 8.4, d: 12.0, nfa: null, cat: 'teaching',
    note: 'May be added to S types where more area is required. Not recommended automatically [guide §7].' }
};

// How many teaching spaces a bay holds. Everything else (amenity, service,
// stair, library, admin bays) holds none [guide §6].
const BAY_TS = { TS_P: 1, TS_S: 1, TS_D: 1, TS_D_PAIR: 2 };

// Typologies [guide §2, §8, §18 and its building table]. schools: the
// categories a type may be offered to (D types: secondary / intermediate only).
const BOTH = ['primary_intermediate', 'secondary'];
const BUILDING_TYPES = {
  R:  { id: 'R',  name: 'OMB 2.5 — Relocatable', form: 'Relocatable, single-storey', storeys: 1, depth: 'single', schools: BOTH,
        config: '1–6 modules of 7.2 m × 12 m', moe: 'OMB 2.5', roof: 'Mono-pitch',
        tags: ['relocatable', 'staging', 'tight timeframe'],
        description: 'OMB 2.5, 1–6 modules of 7.2 m × 12 m. A separate standard building, entered by code rather than offered with the S / D options.' },
  S1: { id: 'S1', name: 'Type S1 — Single-depth, single-storey', form: 'Single-depth, single-storey', storeys: 1, depth: 'single', schools: BOTH,
        config: '3–6 modules', moe: 'Standard type S1', roof: 'Mono-pitch or gabled',
        tags: ['single-storey', 'typical primary'],
        description: 'Single-depth, single-storey teaching block, 3–6 modules long including its resource / admin / toilet bay.' },
  S2: { id: 'S2', name: 'Type S2 — Single-depth, two-storey', form: 'Single-depth, two-storey', storeys: 2, depth: 'single', schools: BOTH,
        config: '3–6 modules', moe: 'Standard type S2', roof: 'Mono-pitch',
        tags: ['two-storey', 'reduced footprint'],
        description: 'Single-depth, two-storey teaching block, 3–6 modules long per floor.' },
  S3: { id: 'S3', name: 'Type S3 — Single-depth, three-storey', form: 'Single-depth, three-storey', storeys: 3, depth: 'single', schools: BOTH,
        config: '3–6 modules', moe: 'Standard type S3', roof: 'Mono-pitch',
        tags: ['three-storey', 'constrained site'],
        description: 'Single-depth, three-storey teaching block, 3–6 modules long per floor.' },
  D1: { id: 'D1', name: 'Type D1 — Double-depth, single-storey', form: 'Double-depth, single-storey', storeys: 1, depth: 'double', schools: ['secondary'],
        config: '3–6 modules per row', moe: 'Standard type D1', roof: 'Gabled',
        tags: ['double-depth', 'single-storey', 'secondary'],
        description: 'Double-depth block: teaching spaces either side of a central corridor.' },
  D2: { id: 'D2', name: 'Type D2 — Double-depth, two-storey', form: 'Double-depth, two-storey', storeys: 2, depth: 'double', schools: ['secondary'],
        config: '3–6 modules per row', moe: 'Standard type D2', roof: 'Gabled',
        tags: ['double-depth', 'two-storey', 'secondary'],
        description: 'Two-storey double-depth block with teaching spaces either side of a central corridor.' },
  D3: { id: 'D3', name: 'Type D3 — Double-depth, three-storey', form: 'Double-depth, three-storey', storeys: 3, depth: 'double', schools: ['secondary'],
        config: '3–6 modules per row', moe: 'Standard type D3', roof: 'Gabled',
        tags: ['double-depth', 'three-storey', 'secondary'],
        description: 'Three-storey double-depth block with teaching spaces either side of a central corridor.' },
  L:  { id: 'L',  name: 'Library building', form: 'Single-storey, 1–2 modules', storeys: 1, depth: 'single', schools: BOTH,
        moe: 'Standard library layouts A / B', roof: 'Mono-pitch',
        tags: ['library', 'learning commons'],
        description: 'Standard library layouts on the teaching module grid.' },
  C:  { id: 'C',  name: 'Administration building', form: 'Single-storey, 2–4 modules', storeys: 1, depth: 'single', schools: BOTH,
        moe: 'Standard admin layouts A / B / C', roof: 'Mono-pitch',
        tags: ['administration', 'staff'],
        description: 'Standard administration layouts sized to school roll.' }
};

// Zone sets: fx/fy/fw/fh are fractions of the module (fx across the 7.2m width, fy along the 12m depth).
const TEACHING_LAYOUTS = {
  A: { id: 'A', name: 'Layout A — Open plan with tiered seating',
    summary: 'Tiered seating around a mat area, high-wear dado with pinboard above, glazed sliding connection to the adjacent space.',
    zones: [
      { cat: 'teaching', label: 'General teaching', fx: 0, fy: 0, fw: 1, fh: 0.55 },
      { cat: 'teaching', label: 'Mat / tiered seating', fx: 0, fy: 0.55, fw: 0.5, fh: 0.45 },
      { cat: 'wet', label: 'Wet area', fx: 0.5, fy: 0.55, fw: 0.5, fh: 0.25 },
      { cat: 'resource', label: 'Resource / teachers’ wall', fx: 0.5, fy: 0.8, fw: 0.5, fh: 0.2 }
    ] },
  B: { id: 'B', name: 'Layout B — Shared enclosed wet space',
    summary: 'Dry teaching space with full-height pinboard, connected to a shared enclosed wet space.',
    zones: [
      { cat: 'teaching', label: 'General teaching', fx: 0, fy: 0, fw: 1, fh: 0.6 },
      { cat: 'breakout', label: 'Breakout space', fx: 0, fy: 0.6, fw: 0.45, fh: 0.4 },
      { cat: 'wet', label: 'Shared wet space', fx: 0.45, fy: 0.6, fw: 0.3, fh: 0.4 },
      { cat: 'resource', label: 'Resource / teachers’ wall', fx: 0.75, fy: 0.6, fw: 0.25, fh: 0.4 }
    ] },
  C: { id: 'C', name: 'Layout C — Integrated wet area, small breakout',
    summary: 'Wet area integrated into the teaching space with a small breakout room off it.',
    zones: [
      { cat: 'teaching', label: 'General teaching', fx: 0, fy: 0, fw: 1, fh: 0.62 },
      { cat: 'wet', label: 'Wet area', fx: 0, fy: 0.62, fw: 0.35, fh: 0.38 },
      { cat: 'breakout', label: 'Small breakout room', fx: 0.35, fy: 0.62, fw: 0.3, fh: 0.38 },
      { cat: 'resource', label: 'Resource / bags', fx: 0.65, fy: 0.62, fw: 0.35, fh: 0.38 }
    ] },
  D: { id: 'D', name: 'Layout D — Shared dry medium breakout',
    summary: 'General teaching with a shared dry breakout room between spaces.',
    zones: [
      { cat: 'teaching', label: 'General teaching', fx: 0, fy: 0, fw: 1, fh: 0.58 },
      { cat: 'breakout', label: 'Shared breakout room', fx: 0, fy: 0.58, fw: 0.5, fh: 0.42 },
      { cat: 'resource', label: 'Resource / teachers’ wall', fx: 0.5, fy: 0.58, fw: 0.5, fh: 0.21 },
      { cat: 'store', label: 'Bag storage', fx: 0.5, fy: 0.79, fw: 0.5, fh: 0.21 }
    ] }
};

const MODULE_ZONES = {
  AM_FULL: [
    { cat: 'wc', label: 'WC', fx: 0, fy: 0, fw: 0.45, fh: 0.36 },
    { cat: 'wc', label: 'WC', fx: 0, fy: 0.36, fw: 0.45, fh: 0.36 },
    { cat: 'wc', label: 'Accessible WC', fx: 0, fy: 0.72, fw: 0.45, fh: 0.28 },
    { cat: 'admin', label: 'Resource / admin', fx: 0.45, fy: 0, fw: 0.55, fh: 0.5 },
    { cat: 'store', label: 'Storage', fx: 0.45, fy: 0.5, fw: 0.55, fh: 0.28 },
    { cat: 'circulation', label: 'WC circulation', fx: 0.45, fy: 0.78, fw: 0.55, fh: 0.22 }
  ],
  AM_HALF: [
    { cat: 'wc', label: 'WC', fx: 0, fy: 0, fw: 1, fh: 0.42 },
    { cat: 'wc', label: 'Accessible WC', fx: 0, fy: 0.42, fw: 1, fh: 0.22 },
    { cat: 'store', label: 'Resource / storage', fx: 0, fy: 0.64, fw: 1, fh: 0.36 }
  ],
  LIB: [
    { cat: 'library', label: 'Library', fx: 0, fy: 0, fw: 1, fh: 0.6 },
    { cat: 'breakout', label: 'Group', fx: 0, fy: 0.6, fw: 0.35, fh: 0.4 },
    { cat: 'resource', label: 'Support', fx: 0.35, fy: 0.6, fw: 0.3, fh: 0.4 },
    { cat: 'breakout', label: 'Breakout', fx: 0.65, fy: 0.6, fw: 0.35, fh: 0.4 }
  ],
  LIB_2: [
    { cat: 'library', label: 'Library', fx: 0, fy: 0, fw: 1, fh: 0.55 },
    { cat: 'breakout', label: 'Study', fx: 0, fy: 0.55, fw: 0.3, fh: 0.45 },
    { cat: 'breakout', label: 'Mat', fx: 0.3, fy: 0.55, fw: 0.4, fh: 0.45 },
    { cat: 'resource', label: 'Support', fx: 0.7, fy: 0.55, fw: 0.3, fh: 0.45 }
  ],
  ADMIN_1: [
    { cat: 'circulation', label: 'Lobby', fx: 0, fy: 0, fw: 0.5, fh: 0.38 },
    { cat: 'admin', label: 'Reception', fx: 0.5, fy: 0, fw: 0.5, fh: 0.38 },
    { cat: 'admin', label: 'Sick bay', fx: 0, fy: 0.38, fw: 0.5, fh: 0.32 },
    { cat: 'admin', label: 'Meeting', fx: 0.5, fy: 0.38, fw: 0.5, fh: 0.32 },
    { cat: 'wc', label: 'WC', fx: 0, fy: 0.7, fw: 0.35, fh: 0.3 },
    { cat: 'admin', label: 'Repro.', fx: 0.35, fy: 0.7, fw: 0.65, fh: 0.3 }
  ],
  ADMIN_2: [
    { cat: 'admin', label: 'Staffroom', fx: 0, fy: 0, fw: 1, fh: 0.5 },
    { cat: 'admin', label: 'Workroom', fx: 0, fy: 0.5, fw: 0.5, fh: 0.5 },
    { cat: 'admin', label: 'Leadership', fx: 0.5, fy: 0.5, fw: 0.5, fh: 0.5 }
  ],
  ADMIN_3: [
    { cat: 'admin', label: 'Leadership', fx: 0, fy: 0, fw: 0.5, fh: 0.48 },
    { cat: 'admin', label: 'Meeting', fx: 0.5, fy: 0, fw: 0.5, fh: 0.48 },
    { cat: 'admin', label: 'Flexible', fx: 0, fy: 0.48, fw: 1, fh: 0.52 }
  ],
  ADMIN_4: [
    { cat: 'admin', label: 'Flexible', fx: 0, fy: 0, fw: 0.55, fh: 0.5 },
    { cat: 'admin', label: 'Flexible', fx: 0.55, fy: 0, fw: 0.45, fh: 0.5 },
    { cat: 'store', label: 'Store', fx: 0, fy: 0.5, fw: 0.35, fh: 0.5 },
    { cat: 'admin', label: 'Meeting', fx: 0.35, fy: 0.5, fw: 0.65, fh: 0.5 }
  ],
  STAIR: [
    { cat: 'circulation', label: 'Stair', fx: 0, fy: 0, fw: 1, fh: 0.55 },
    { cat: 'circulation', label: 'Lift', fx: 0, fy: 0.55, fw: 0.45, fh: 0.45 },
    { cat: 'store', label: 'Store', fx: 0.45, fy: 0.55, fw: 0.55, fh: 0.45 }
  ],
  // D-type bay across its 19.6 m depth: 8 m teaching, 3.6 m corridor, 8 m teaching.
  TS_D_PAIR: [
    { cat: 'teaching', label: 'General teaching', fx: 0, fy: 0, fw: 1, fh: 8 / 19.6 },
    { cat: 'circulation', label: 'Corridor', fx: 0, fy: 8 / 19.6, fw: 1, fh: 3.6 / 19.6 },
    { cat: 'teaching', label: 'General teaching', fx: 0, fy: 11.6 / 19.6, fw: 1, fh: 8 / 19.6 }
  ],
  D_SERVICE: [
    { cat: 'wc', label: 'Resource / admin / toilets', fx: 0, fy: 0, fw: 1, fh: 8 / 19.6 },
    { cat: 'circulation', label: 'Corridor', fx: 0, fy: 8 / 19.6, fw: 1, fh: 3.6 / 19.6 },
    { cat: 'circulation', label: 'Stair', fx: 0, fy: 11.6 / 19.6, fw: 1, fh: 8 / 19.6 }
  ]
};
MODULE_ZONES.AM_FULL_S = MODULE_ZONES.AM_FULL;
MODULE_ZONES.AM_HALF_S = MODULE_ZONES.AM_HALF;
MODULE_ZONES.AM_HALF_D = MODULE_ZONES.AM_HALF;

const LIBRARY_LAYOUTS = {
  A: { id: 'A', modules: 1, name: 'Library layout A', suits: 'Small to medium primary school', zones: 'LIB' },
  B: { id: 'B', modules: 2, name: 'Library layout B', suits: 'Large primary school', zones: 'LIB_2' }
};

const ADMIN_LAYOUTS = {
  A: { id: 'A', modules: 2, name: 'Admin layout A', suits: 'Small school' },
  B: { id: 'B', modules: 3, name: 'Admin layout B', suits: 'Medium school' },
  C: { id: 'C', modules: 4, name: 'Admin layout C', suits: 'Large school' }
};

const CLADDING = {
  A: { id: 'A', name: 'Option A — Profiled metal', notes: 'Full-height profiled metal, factory-coated. Open painted balustrade.', wall: '#C9CCC8', roof: '#B7BBB7' },
  B: { id: 'B', name: 'Option B — Brick', notes: 'Low-level brick or masonry veneer with profiled metal above. Full height single-storey, low seismic only.', wall: '#C3AFA3', roof: '#B7BBB7' },
  C: { id: 'C', name: 'Option C — Painted fibre cement', notes: 'Fibre cement sheet with vertical cover battens, profiled metal to upper levels.', wall: '#D5D3CB', roof: '#B7BBB7' }
};

const HEATING = {
  default: { name: 'Default', warm: 'Electric ceiling radiators and natural ventilation.', cold: 'Airsource heat pumps and wall radiators with natural ventilation.' },
  alt01: { name: 'Alternative 01', warm: 'Electric ceiling radiators and ducted mechanical heat recovery.', cold: 'Airsource heat pumps, wall radiators and ducted mechanical heat recovery.' },
  alt02: { name: 'Alternative 02', warm: 'Heatpump VRF-AC cassettes with ducted outdoor air supply.', cold: 'Heatpump VRF-AC cassettes with ducted mechanical heat recovery.' }
};

const CLIMATE_ZONES = [
  { id: 1, band: 'warm' }, { id: 2, band: 'warm' }, { id: 3, band: 'warm' },
  { id: 4, band: 'cold' }, { id: 5, band: 'cold' }, { id: 6, band: 'cold' }
];

// Gyms and halls [guide §16–17]. They sit alongside the teaching building
// rather than being assembled from modules, so they carry no geometry.
const COMPANIONS = {
  G1: { code: 'G1', kind: 'gym', name: 'G1 — Single-court gym', courts: 1, note: 'Single-court gym. Same function as G2, with a different amenity arrangement.' },
  G2: { code: 'G2', kind: 'gym', name: 'G2 — Single-court gym', courts: 1, note: 'Single-court gym. Same function as G1, with a different amenity arrangement.' },
  G4: { code: 'G4', kind: 'gym', name: 'G4 — Double-court gym', courts: 2, note: 'Double-court gym.' },
  H3: { code: 'H3', kind: 'hall', name: 'H3 — Large primary school hall', schools: ['primary_intermediate'], note: 'Large primary school hall.' },
  H8: { code: 'H8', kind: 'hall', name: 'H8 — Large secondary school hall', schools: ['secondary'], note: 'Large secondary school hall. An alternative to H9 with a different amenity arrangement.' },
  H9: { code: 'H9', kind: 'hall', name: 'H9 — Large secondary school hall', schools: ['secondary'], note: 'Large secondary school hall. An alternative to H8 with a different amenity arrangement.' }
};

window.MOE_D = { CATALOGUE, SPACE_CATS, MODULES, BUILDING_TYPES, TEACHING_LAYOUTS, MODULE_ZONES, LIBRARY_LAYOUTS, ADMIN_LAYOUTS, CLADDING, HEATING, CLIMATE_ZONES, COMPANIONS };
// Recommendation layer: user input -> requirement calculation -> standard design rules -> suitable building types.
// The rules follow docs/building-coding-guide.md; [guide §n] marks the section a rule comes from.

const LEVEL_H = 3.9;          // floor to floor, metres
const ROOF_H = 0.6;           // parapet / fascia
const ceil = (n) => Math.ceil(n - 1e-9);
const SPEC_MAX_PER_FLOOR = 4;       // [guide §14]
const SPEC_TYPICAL_PER_FLOOR = 3;   // [guide §14]
const SCHOOL_LABEL = { primary_intermediate: 'Primary school', secondary: 'Secondary / intermediate school' };

/* ---------------------------------------------------------------- 1. Requirement calculation */

// Gyms and halls in scope, each with the codes the school chooses between [guide §16–17].
function companionsFor(category, hall, courts) {
  const out = [];
  if (courts === 1) out.push({ kind: 'gym', label: 'Gym — single court', codes: ['G1', 'G2'],
    why: 'One court required: G1 and G2 are both single-court gyms, with different amenity arrangements.' });
  if (courts >= 2) out.push({ kind: 'gym', label: 'Gym — double court', codes: ['G4'],
    why: 'Two courts required: G4 is the double-court gym.' });
  if (hall) out.push(category === 'secondary'
    ? { kind: 'hall', label: 'Hall — secondary / intermediate', codes: ['H8', 'H9'],
        why: 'Secondary / intermediate school: H8 and H9 are large secondary halls, with different amenity arrangements.' }
    : { kind: 'hall', label: 'Hall — primary', codes: ['H3'], why: 'Primary school: H3 is the large primary school hall.' });
  return out;
}

function calcRequirements(input, ratio) {
  const r = Math.max(10, Number(ratio) || 25);
  const category = input.category === 'secondary' ? 'secondary' : 'primary_intermediate';
  const direct = input.direct || null;
  let roll = Math.max(Number(input.rollFuture) || 0, Number(input.roll) || 0);
  let tsEntitlement = ceil(roll / r);
  let tsExisting = Number(input.tsExisting) || 0;
  let tsNew = Math.max(0, tsEntitlement - tsExisting);
  let specialist = Number(input.specialist) || 0;
  if (direct) {
    // A building entered by its code: the requirement is what that building provides.
    tsNew = direct.capacity; tsEntitlement = direct.capacity; tsExisting = 0; specialist = 0; roll = direct.capacity * r;
  }

  const libraryModules = input.library === 'Yes' ? (roll <= 300 ? 1 : 2) : 0;
  const libraryLayout = libraryModules === 2 ? LIBRARY_LAYOUTS.B : LIBRARY_LAYOUTS.A;
  const adminModules = input.admin === 'Yes' ? (roll <= 150 ? 2 : roll <= 400 ? 3 : 4) : 0;
  const adminLayout = adminModules >= 4 ? ADMIN_LAYOUTS.C : adminModules === 3 ? ADMIN_LAYOUTS.B : ADMIN_LAYOUTS.A;

  const gymCourts = input.gym === 'Yes' ? (Number(input.gymCourts) >= 2 ? 2 : 1) : 0;
  const companions = direct ? direct.companions : companionsFor(category, input.hall === 'Yes', gymCourts);
  const totalTeaching = tsNew + specialist;

  const zone = CLIMATE_ZONES.find((z) => z.id === (Number(input.climate) || 3)) || CLIMATE_ZONES[2];
  const services = HEATING.default[zone.band === 'cold' ? 'cold' : 'warm'];

  const notes = [];
  if (direct) notes.push('Building entered by code — the requirement shown is what that building provides.');
  if (category === 'primary_intermediate') notes.push('Primary school: single-depth S types on the B module (7.2 m × 12 m). Double-depth D types are secondary / intermediate only.');
  else notes.push('Secondary / intermediate school: S types on the A module (7.2 m × 10.3 m) and double-depth D types on the 8.4 m × 8 m module.');
  if (specialist > 0) notes.push(`Specialist spaces take standard teaching bays: up to ${SPEC_MAX_PER_FLOOR} a floor, typically 1–${SPEC_TYPICAL_PER_FLOOR}.`);

  return {
    ratio: r, roll, tsEntitlement, tsExisting, tsNew, specialist, totalTeaching,
    libraryModules, libraryLayout, adminModules, adminLayout,
    storage: input.storage || 'Standard', bags: input.bags || 'Covered bag shelter',
    climateZone: zone.id, climateBand: zone.band, services,
    cladding: input.cladding || 'A',
    maxStoreys: input.maxStoreys === 'No preference' ? 3 : Number(input.maxStoreys) || 3,
    siteArea: input.siteArea || 'Moderate',
    layout: TEACHING_LAYOUTS[input.layout] || TEACHING_LAYOUTS.B,
    category, schoolLabel: SCHOOL_LABEL[category], gymCourts, companions, direct,
    notes
  };
}

/* ---------------------------------------------------------------- 2. Configuration rules */

// One floor of an S type holding t teaching spaces [guide §3–6]: 2 with no
// amenity bay (S1 only), 3 with a half-bay (S-3.5), 4–5 with a full bay (S-5,
// S-6). len is the code's length: bays along the building, a half-bay .5.
function sFloor(t, storeys) {
  if (t === 2 && storeys === 1) return { ts: 2, amenity: 0, len: 2 };
  if (t === 3) return { ts: 3, amenity: 0.5, len: 3.5 };
  if (t === 4 || t === 5) return { ts: t, amenity: 1, len: t + 1 };
  return null;
}
// The same read back from a code. S-3 (no half-bay) and S-4 (3 spaces and a
// full bay) are valid codes the options never generate.
const S_LENGTHS = { 2: { ts: 2, amenity: 0 }, 3: { ts: 3, amenity: 0 }, 3.5: { ts: 3, amenity: 0.5 },
  4: { ts: 3, amenity: 1 }, 5: { ts: 4, amenity: 1 }, 6: { ts: 5, amenity: 1 } };
function sFloorFromLen(len, storeys) {
  const f = S_LENGTHS[len];
  return f && !(len === 2 && storeys > 1) ? { ...f, len } : null;
}

// One floor of a D type, n modules long per row [guide §10–13]. D1: both rows
// teaching, a half-bay at one end when 3 long and at both ends from 4. D2 / D3:
// one position is the stair and the bay across from it is resource / admin /
// toilets, with half-bays at both ends, so D2-4 is 7 bays and 6 teaching spaces a floor.
function dFloor(storeys, n) {
  if (n < 3 || n > 6) return null;
  return storeys === 1
    ? { n, ts: 2 * n, halfBays: n === 3 ? 1 : 2, service: false }
    : { n, ts: 2 * n - 2, halfBays: 2, service: true };
}

// Specialist spaces spread over the floors as evenly as possible: at most 4 a
// floor and never more than the floor's teaching spaces [guide §14].
function specFloors(spec, storeys, tsPerFloor) {
  const out = Array.from({ length: storeys }, (_, i) => Math.floor(spec / storeys) + (i < spec % storeys ? 1 : 0));
  return out.every((n) => n <= Math.min(SPEC_MAX_PER_FLOOR, tsPerFloor)) ? out : null;
}

/* ---------------------------------------------------------------- 3. Bay + block assembly */

let uid = 0;
function bay(moduleKey, level, opts = {}) {
  const m = MODULES[moduleKey];
  const zones = opts.zones || MODULE_ZONES[moduleKey] || [];
  return {
    id: `b${++uid}`,
    moduleKey, code: opts.code || m.code, name: opts.name || m.name,
    cat: opts.cat || m.cat, w: m.w, d: m.d, nfa: opts.nfa || m.nfa, level,
    layout: opts.layout || null, note: opts.note || m.note, spec: opts.spec || 0,
    zones: zones.map((z, i) => ({ ...z, id: `z${uid}-${i}` }))
  };
}

const tsIn = (b) => BAY_TS[b.moduleKey] || 0;
const specIn = (b) => b.spec || 0;

// Areas from each bay's own size, since secondary and D bays aren't 12m deep.
function measure(block) {
  let nfa = 0, footprint = 0, gfa = 0, len = 0, depth = 0;
  block.levels.forEach((bays, i) => {
    const l = bays.reduce((s, b) => s + b.w, 0);
    const a = bays.reduce((s, b) => s + b.w * b.d, 0);
    len = Math.max(len, l);
    depth = Math.max(depth, ...bays.map((b) => b.d));
    gfa += a;
    nfa += bays.reduce((s, b) => s + (b.nfa || 0), 0);
    if (i === 0) footprint = a;
  });
  const storeys = block.levels.length;
  const r1 = (n) => Math.round(n * 10) / 10;
  const t = BUILDING_TYPES[block.typeId];
  const all = block.levels.flat();
  const code = block.code || block.typeId;
  return {
    id: `${block.typeId}-${++uid}`, form: t.form, moe: t.moe, roof: t.roof, depthType: t.depth,
    ...block,
    code, name: block.name || `Type ${code} — ${t.form}`,
    teachingSpaces: all.reduce((s, b) => s + tsIn(b), 0),
    specialistSpaces: all.reduce((s, b) => s + specIn(b), 0),
    nfa: Math.round(nfa), gfa: Math.round(gfa), footprint: Math.round(footprint),
    length: r1(len), depth: r1(depth), storeys,
    height: r1(storeys * LEVEL_H + ROOF_H),
    dims: `${r1(len)}m × ${r1(depth)}m × ${r1(storeys * LEVEL_H + ROOF_H)}m`
  };
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

// S type: code S{storeys}-{module letter}{length}, e.g. S2-B3.5 [guide §2–5].
function sBlock(storeys, floor, spec, req) {
  const typeId = `S${storeys}`;
  const secondary = req.category === 'secondary';
  const tsKey = secondary ? 'TS_S' : 'TS_P';
  const m = MODULES[tsKey];
  const levels = [];
  for (let l = 0; l < storeys; l++) {
    const bays = [];
    for (let i = 0; i < floor.ts; i++) {
      const isSpec = i >= floor.ts - spec[l];
      bays.push(bay(tsKey, l, { layout: req.layout.id, spec: isSpec ? 1 : 0,
        name: isSpec ? 'Specialist teaching space' : m.name, zones: req.layout.zones }));
    }
    if (floor.amenity) {
      const key = (floor.amenity === 0.5 ? 'AM_HALF' : 'AM_FULL') + (secondary ? '_S' : '');
      bays.splice(floor.ts >= 4 ? Math.round(floor.ts / 2) : bays.length, 0, bay(key, l));
    }
    if (storeys > 1) bays.push(bay('STAIR', l));
    levels.push(bays);
  }
  const amen = floor.amenity === 0.5 ? '½ resource / admin / toilet bay' : floor.amenity ? '1 resource / admin / toilet bay' : 'no resource / toilet bay';
  return measure({ typeId, code: `${typeId}-${m.letter}${floor.len}`, levels, specFloors: spec,
    perFloor: `${plural(floor.ts, 'teaching space')} + ${amen}`,
    moduleText: `${m.letter} module, ${m.w} m × ${m.d} m` });
}

// D type: code D{storeys}-{length per row}, e.g. D2-4 [guide §8–13].
function dBlock(storeys, floor, spec, req) {
  const typeId = `D${storeys}`;
  const levels = [];
  for (let l = 0; l < storeys; l++) {
    const bays = [];
    let specLeft = spec[l];
    if (floor.halfBays) bays.push(bay('AM_HALF_D', l));
    for (let i = 0; i < (floor.service ? floor.n - 1 : floor.n); i++) {
      const sp = Math.min(specLeft, 2);
      specLeft -= sp;
      bays.push(bay('TS_D_PAIR', l, { layout: req.layout.id, spec: sp,
        name: MODULES.TS_D_PAIR.name + (sp ? ` (${sp} specialist)` : '') }));
    }
    if (floor.service) bays.push(bay('D_SERVICE', l));
    if (floor.halfBays === 2) bays.push(bay('AM_HALF_D', l));
    levels.push(bays);
  }
  const half = floor.halfBays === 2 ? 'half-bays at both ends' : 'a half-bay at one end';
  return measure({ typeId, code: `${typeId}-${floor.n}`, levels, specFloors: spec,
    perFloor: floor.service
      ? `${plural(floor.ts, 'teaching space')} + 1 resource / admin / toilet bay and the stair, ${half}`
      : `${plural(floor.ts, 'teaching space')}, ${half}`,
    moduleText: `D-type module, 8.4 m × 8 m, rows ${floor.n} modules long` });
}

// OMB 2.5: n modules of 7.2 m × 12 m, entered by code only [guide §18].
// Each module is counted as a teaching space.
function ombBlock(n, req) {
  const bays = Array.from({ length: n }, () => bay('TS_P', 0, { layout: req.layout.id, name: 'OMB 2.5 module', zones: req.layout.zones }));
  return measure({ typeId: 'R', code: `OMB 2.5-${n}`, levels: [bays], specFloors: [0],
    perFloor: `${plural(n, 'module')} of 7.2 m × 12 m`, moduleText: 'OMB 2.5 module, 7.2 m × 12 m' });
}

// Library and administration buildings, in the layout the school picked
// (default: the one sized to the roll).
function libraryBlock(req, layoutId) {
  const lay = LIBRARY_LAYOUTS[layoutId] || req.libraryLayout;
  const zones = MODULE_ZONES[lay.zones];
  const bays = [];
  for (let i = 0; i < lay.modules; i++) bays.push(bay('LIB', 0, { zones, name: `Library module ${i + 1}`, note: lay.suits }));
  const t = BUILDING_TYPES.L;
  return measure({ typeId: 'L', code: `Library ${lay.id}`, name: `${t.name} — ${lay.name}`, moe: lay.name, levels: [bays],
    summary: `${plural(lay.modules, 'module')} on the teaching module grid. Suits a ${lay.suits.toLowerCase()}.` });
}

function adminBlock(req, layoutId) {
  const lay = ADMIN_LAYOUTS[layoutId] || req.adminLayout;
  const zoneSets = ['ADMIN_1', 'ADMIN_2', 'ADMIN_3', 'ADMIN_4'];
  const bays = [];
  for (let i = 0; i < lay.modules; i++) bays.push(bay('ADMIN', 0, { zones: MODULE_ZONES[zoneSets[i]], name: `Admin module ${i + 1}`, note: lay.suits }));
  const t = BUILDING_TYPES.C;
  return measure({ typeId: 'C', code: `Admin ${lay.id}`, name: `${t.name} — ${lay.name}`, moe: lay.name, levels: [bays],
    summary: `${plural(lay.modules, 'module')} of reception, sick bay, meeting, staff and leadership space. Suits a ${lay.suits.toLowerCase()}.` });
}

// A gym or hall [guide §16–17]: listed with the other buildings, with no module geometry.
function companionBlock(code) {
  const c = COMPANIONS[code];
  return { id: `${code}-${++uid}`, typeId: code, code, kind: c.kind, name: c.name,
    form: c.kind === 'gym' ? (c.courts === 2 ? 'Double-court gym' : 'Single-court gym') : 'Large hall',
    moe: 'Standard designs for school gyms and halls', roof: '—', depthType: 'single', summary: c.note,
    levels: [], storeys: 0, teachingSpaces: 0, specialistSpaces: 0, nfa: 0, gfa: 0, footprint: 0,
    length: 0, depth: 0, height: 0, dims: 'See the standard gym and hall designs' };
}

/* ---------------------------------------------------------------- 4. Fit assessment */

function fitLines(req, blocks) {
  const all = blocks.flatMap((b) => b.levels.flat());
  const spec = all.reduce((s, b) => s + specIn(b), 0);
  const ts = all.reduce((s, b) => s + tsIn(b), 0) - spec;
  const lib = all.filter((b) => b.moduleKey === 'LIB').length;
  const adm = all.filter((b) => b.moduleKey === 'ADMIN').length;
  const storeys = Math.max(...blocks.map((b) => b.storeys));

  const mk = (label, required, provided, unit) => {
    const status = provided >= required ? (provided > required ? 'surplus' : 'met') : 'short';
    return { label, required, provided, unit: unit || '', status,
      text: status === 'met' ? 'Requirement met' : status === 'surplus' ? `${Math.round((provided - required) * 10) / 10} more than required` : `${Math.round((required - provided) * 10) / 10} short` };
  };

  const lines = [
    mk('General teaching spaces', req.tsNew, ts, 'spaces'),
    mk('Specialist teaching spaces', req.specialist, spec, 'spaces'),
    mk('Library modules', req.libraryModules, lib, 'modules'),
    mk('Administration modules', req.adminModules, adm, 'modules'),
    mk('Additional teaching capacity', Math.max(0, req.roll - req.tsExisting * req.ratio), (ts + spec) * req.ratio, 'students')
  ].filter((l) => l.required > 0 || l.provided > 0);

  lines.push({
    label: 'Storeys within site limit', required: req.maxStoreys, provided: storeys, unit: 'storeys',
    status: storeys <= req.maxStoreys ? 'met' : 'short',
    text: storeys <= req.maxStoreys ? `${storeys} of ${req.maxStoreys} permitted` : `Exceeds the ${req.maxStoreys}-storey site limit`
  });

  const met = lines.filter((l) => l.status !== 'short').length;
  return { lines, score: Math.round((met / lines.length) * 100), met, total: lines.length };
}

function totals(blocks, req) {
  const all = blocks.flatMap((b) => b.levels.flat());
  const ts = all.reduce((s, b) => s + tsIn(b), 0);
  return {
    gfa: blocks.reduce((s, b) => s + b.gfa, 0),
    nfa: blocks.reduce((s, b) => s + b.nfa, 0),
    footprint: blocks.reduce((s, b) => s + b.footprint, 0),
    modules: all.length,
    teachingSpaces: ts,
    capacity: ts * req.ratio,
    storeys: Math.max(...blocks.map((b) => b.storeys)),
    blocks: blocks.length
  };
}

/* ---------------------------------------------------------------- 5. Option generation */

// Every single-building S / D configuration that holds `total` teaching spaces,
// `spec` of them specialist, within the storey limit [guide §15, §19–20].
function candidates(total, spec, req) {
  const out = [];
  const maxStoreys = Math.min(3, req.maxStoreys);
  for (let s = 1; s <= maxStoreys; s++) {
    const floor = sFloor(Math.max(s === 1 ? 2 : 3, ceil(total / s)), s);
    const sp = floor && specFloors(spec, s, floor.ts);
    if (sp) out.push({ kind: 'S', storeys: s, capacity: floor.ts * s, build: () => sBlock(s, floor, sp, req) });
  }
  // D types are secondary / intermediate only [guide §9].
  if (req.category === 'secondary') {
    for (let s = 1; s <= maxStoreys; s++) {
      const need = ceil(total / s);
      const floor = dFloor(s, Math.max(3, ceil((s === 1 ? need : need + 2) / 2)));
      const sp = floor && specFloors(spec, s, floor.ts);
      if (sp) out.push({ kind: 'D', storeys: s, capacity: floor.ts * s, build: () => dBlock(s, floor, sp, req) });
    }
  }
  return out;
}

// The closest single building for part of a split: least surplus, then fewest storeys.
function closest(total, spec, req, kind) {
  return candidates(total, spec, req).filter((c) => c.kind === kind)
    .sort((a, b) => (a.capacity - b.capacity) || (a.storeys - b.storeys))[0] || null;
}

const split = (n, k) => Array.from({ length: k }, (_, i) => Math.floor(n / k) + (i < n % k ? 1 : 0));

// Split the requirement into the fewest buildings of one kind that each fit.
function splitBlocks(total, spec, req, kind, minBlocks) {
  for (let k = minBlocks; k <= 12; k++) {
    const sizes = split(total, k), specs = split(spec, k);
    const parts = sizes.map((n, i) => closest(n, specs[i], req, kind));
    if (parts.every(Boolean)) return parts.map((p) => p.build());
  }
  return null;
}

function describe(blk, req) {
  const depth = blk.depthType === 'double' ? 'double-depth' : 'single-depth';
  return `${req.schoolLabel} · ${plural(blk.storeys, 'storey')} · ${depth} · ${blk.moduleText} · per floor: ${blk.perFloor}`;
}

function traits(blk) {
  const out = [
    `${plural(blk.storeys, 'storey')}, ${blk.depthType === 'double' ? 'double-depth' : 'single-depth'}${blk.storeys > 1 ? ' with a stair per floor' : ''}`,
    blk.moduleText,
    `Per floor: ${blk.perFloor}`,
    `${plural(blk.teachingSpaces, 'teaching space')} in total — the code counts bays, not teaching spaces`
  ];
  if (blk.specialistSpaces) {
    const most = Math.max(...blk.specFloors);
    out.push(`Specialist spaces per floor: ${blk.specFloors.join(' / ')}` + (most > SPEC_TYPICAL_PER_FLOOR ? ` — above the typical 1–${SPEC_TYPICAL_PER_FLOOR}` : ''));
  }
  return out;
}

function buildOptions(req) {
  const total = req.totalTeaching, spec = req.specialist;
  const out = [];
  const label = 'ABCDEFGH'.split('');

  const add = (title, summary, blocks, characteristics, why) => {
    if (!blocks.length) return;
    // Teaching options are matched on teaching only: library, admin, gyms and
    // halls are chosen in their own sections.
    const fit = fitLines({ ...req, libraryModules: 0, adminModules: 0 }, blocks);
    out.push({ id: label[out.length], title, summary, blocks, why,
      totals: totals(blocks, req), fit, characteristics, companions: req.companions });
  };

  const meets = (cap) => (cap === total ? `meets the ${total} required exactly` : `${cap - total} more than the ${total} required`);

  if (req.direct) {
    const d = req.direct;
    const blk = d.kind === 'S' ? sBlock(d.storeys, d.floor, Array(d.storeys).fill(0), req)
      : d.kind === 'D' ? dBlock(d.storeys, d.floor, Array(d.storeys).fill(0), req)
        : ombBlock(d.n, req);
    add(`Type ${blk.code} — ${plural(blk.teachingSpaces, 'teaching space')}`,
      `${describe(blk, req)}. Entered by code.`, [blk], traits(blk), 'Entered by its building code.');
    return out;
  }

  if (total > 0) {
    const all = candidates(total, spec, req);
    if (all.length) {
      // Keep configurations that meet the requirement without exceeding it by
      // much more than the closest one does [guide §15].
      const least = Math.min(...all.map((c) => c.capacity - total));
      const allowance = Math.max(2, ceil(total * 0.25));
      const keep = all.filter((c) => c.capacity - total <= least + allowance);
      const lowestS = Math.min(...keep.filter((c) => c.kind === 'S').map((c) => c.storeys));
      keep.forEach((c) => {
        const blk = c.build();
        const why = c.kind === 'D'
          ? 'Double-depth: a shorter, deeper building for secondary / intermediate schools.'
          : c.storeys === lowestS ? 'The fewest storeys that hold the teaching spaces required.'
            : 'The same provision stacked higher to free up site area.';
        add(`Type ${blk.code} — ${plural(blk.teachingSpaces, 'teaching space')}`,
          `${describe(blk, req)}. ${plural(blk.teachingSpaces, 'teaching space')} in total, ${meets(blk.teachingSpaces)}.`,
          [blk], [...traits(blk), why], why);
      });
      // Two lower buildings instead of one taller one, e.g. to stage the works.
      const pair = total >= 6 && isFinite(lowestS) && lowestS > 1 ? splitBlocks(total, spec, req, 'S', 2) : null;
      if (pair && pair.length === 2 && Math.max(...pair.map((b) => b.storeys)) < lowestS) {
        const cap = pair.reduce((s, b) => s + b.teachingSpaces, 0);
        const why = 'Two lower buildings instead of one taller one: can be staged or placed apart on the site.';
        add(`Type ${pair[0].code} + Type ${pair[1].code} — ${plural(cap, 'teaching space')}`,
          `${pair.map((b) => `${b.code}: ${b.perFloor} per floor`).join(' · ')}. ${plural(cap, 'teaching space')} in total, ${meets(cap)}.`,
          pair, [...pair.flatMap((b) => [`${b.code}: ${describe(b, req)}`]), why], why);
      }
    } else {
      // Too many for one building: the fewest S (and, secondary, D) buildings that fit.
      ['S', ...(req.category === 'secondary' ? ['D'] : [])].forEach((kind) => {
        const blocks = splitBlocks(total, spec, req, kind, 2);
        if (!blocks) return;
        const cap = blocks.reduce((s, b) => s + b.teachingSpaces, 0);
        const why = `More than one ${kind} type holds, so the provision is split across ${blocks.length} buildings.`;
        add(`${blocks.map((b) => `Type ${b.code}`).join(' + ')} — ${plural(cap, 'teaching space')}`,
          `${blocks.map((b) => `${b.code}: ${b.perFloor} per floor`).join(' · ')}. ${plural(cap, 'teaching space')} in total, ${meets(cap)}.`,
          blocks, [...blocks.map((b) => `${b.code}: ${describe(b, req)}`), why], why);
      });
    }
  }
  return out;
}

/* ---------------------------------------------------------------- 6. Building codes entered directly */

// Codes from the "already know your building" screen, in the XX-XX format:
// the building type (S1–S3, D1–D3) then the rest of the code, e.g. S2-B5,
// S1-A3.5, D2-4 or OMB 2.5-3. An S code carries its module letter (B primary,
// A secondary / intermediate) [guide §2]; D types are secondary / intermediate
// only [guide §9]. Gym and hall codes can go alongside ("S2-B5 + G1 + H3").
function parseCodes(text) {
  const tokens = String(text || '').toUpperCase().replace(/OMB\s*2\.5/g, 'OMB2.5').split(/[\s,+&]+/).filter(Boolean);
  if (!tokens.length) return { error: 'Enter a building code, e.g. S2-B5, D2-4 or OMB 2.5-3.' };
  let teaching = null;
  const extras = [];
  for (const tok of tokens) {
    let m;
    const one = (t) => { if (teaching) return { error: 'Enter one teaching building at a time (gyms and halls can go alongside it).' }; teaching = t; return null; };
    if ((m = tok.match(/^(S[123])-?([AB]?)(\d(?:\.5)?)$/))) {
      if (!m[2]) return { error: `${tok}: add the module letter after the dash — B for primary (7.2 m × 12 m) or A for secondary / intermediate (7.2 m × 10.3 m), e.g. ${m[1]}-B${m[3]}.` };
      const storeys = Number(m[1][1]);
      const floor = sFloorFromLen(Number(m[3]), storeys);
      if (!floor) return { error: `${tok}: ${m[1]} codes are ${storeys === 1 ? '2' : '3'}–6 modules long, or 3.5 with a half-bay.` };
      const cat = m[2] === 'A' ? 'secondary' : 'primary_intermediate';
      const err = one({ kind: 'S', typeId: m[1], storeys, floor, category: cat, capacity: floor.ts * storeys });
      if (err) return err;
    } else if ((m = tok.match(/^(D[123])-?(\d)$/))) {
      const storeys = Number(m[1][1]);
      const floor = dFloor(storeys, Number(m[2]));
      if (!floor) return { error: `${tok}: D types are 3–6 modules long.` };
      const err = one({ kind: 'D', typeId: m[1], storeys, floor, category: 'secondary', capacity: floor.ts * storeys });
      if (err) return err;
    } else if ((m = tok.match(/^OMB2\.5-?(\d)$/))) {
      const n = Number(m[1]);
      if (n < 1 || n > 6) return { error: 'OMB 2.5 is 1–6 modules long.' };
      const err = one({ kind: 'OMB', typeId: 'R', storeys: 1, n, category: 'primary_intermediate', capacity: n });
      if (err) return err;
    } else if (COMPANIONS[tok]) {
      extras.push(COMPANIONS[tok]);
    } else {
      return { error: `${tok} is not a recognised building code.` };
    }
  }
  if (!teaching) return { error: 'Add the teaching building code (S, D or OMB 2.5) — gym and hall codes go alongside it.' };
  const wrong = extras.find((c) => c.schools && !c.schools.includes(teaching.category));
  if (wrong) return { error: `${wrong.code} is a ${wrong.schools[0] === 'secondary' ? 'secondary' : 'primary'} school hall.` };
  teaching.companions = extras.map((c) => ({ kind: c.kind, label: c.name, codes: [c.code], why: 'Entered by code.' }));
  return teaching;
}

/* ---------------------------------------------------------------- 7. Geometry for the viewer */

// Returns flat face list for a CSS 3D axonometric. mPx = pixels per metre.
function buildFaces(blocks, mPx, opts = {}) {
  const { visibleLevels = null, hiddenCats = [], selectedBayId = null, isolate = false, onPick = null } = opts;
  const faces = [];
  const gap = 6; // metres between blocks
  let originX = 0;

  blocks.forEach((block) => {
    const blockLen = block.levels.reduce((m, bays) => Math.max(m, bays.reduce((s, b) => s + b.w, 0)), 0);
    block.levels.forEach((bays, level) => {
      if (visibleLevels && !visibleLevels.includes(level)) return;
      let x = originX;
      bays.forEach((b) => {
        const dim = isolate && selectedBayId && selectedBayId !== b.id;
        const z = level * LEVEL_H;
        const bx = x * mPx, by = 0, bw = b.w * mPx, bd = b.d * mPx, bh = LEVEL_H * mPx, bz = z * mPx;
        const selected = selectedBayId === b.id;
        const wallFill = selected ? '#F6F0F4' : dim ? '#F1F0EE' : '#FBFAF8';
        const edge = selected ? '#2C112D' : dim ? '#DAD8D4' : '#B9B4B0';

        // four walls
        const walls = [
          { t: `translate3d(${bx}px,${by}px,${bz}px) rotateX(90deg)`, w: bw, h: bh },
          { t: `translate3d(${bx}px,${by + bd}px,${bz}px) rotateX(90deg)`, w: bw, h: bh },
          { t: `translate3d(${bx}px,${by}px,${bz}px) rotateZ(90deg) rotateX(90deg)`, w: bd, h: bh },
          { t: `translate3d(${bx + bw}px,${by}px,${bz}px) rotateZ(90deg) rotateX(90deg)`, w: bd, h: bh }
        ];
        walls.forEach((wl, i) => faces.push({
          key: `${b.id}-w${i}`, kind: 'wall', bayId: b.id, label: '', labelStyle: 'display:none;',
          onClick: onPick ? () => onPick(b) : null,
          style: `position:absolute;left:0;top:0;transform-origin:0 0;transform:${wl.t};width:${wl.w}px;height:${wl.h}px;` +
                 `background:${wallFill};border:1px solid ${edge};box-sizing:border-box;backface-visibility:visible;`
        }));

        // floor plate top face with zones
        faces.push({
          key: `${b.id}-top`, kind: 'top', bayId: b.id, label: '', labelStyle: 'display:none;',
          onClick: onPick ? () => onPick(b) : null,
          style: `position:absolute;left:0;top:0;transform-origin:0 0;transform:translate3d(${bx}px,${by}px,${bz + bh}px);` +
                 `width:${bw}px;height:${bd}px;background:#FFFFFF;border:1px solid ${edge};box-sizing:border-box;`
        });

        b.zones.forEach((zn, zi) => {
          const hid = hiddenCats.includes(zn.cat);
          const c = SPACE_CATS[zn.cat] || SPACE_CATS.circulation;
          const zw = zn.fw * bw, zh = zn.fh * bd;
          const showLabel = opts.labels !== false && zw > 46 && zh > 22;
          faces.push({
            key: `${b.id}-z${zi}`, kind: 'zone', bayId: b.id, zoneId: zn.id, label: showLabel ? zn.label : '',
            cat: zn.cat, hidden: hid, onClick: onPick ? () => onPick(b, zn) : null,
            style: `position:absolute;left:0;top:0;transform-origin:0 0;` +
                   `transform:translate3d(${bx + zn.fx * bw}px,${by + zn.fy * bd}px,${bz + bh + 0.4}px);` +
                   `width:${zw}px;height:${zh}px;box-sizing:border-box;` +
                   `background:${c.fill};border:1px solid ${selected ? '#2C112D' : c.line};` +
                   `display:flex;align-items:flex-start;padding:3px 4px;overflow:hidden;` +
                   `cursor:${onPick ? 'pointer' : 'default'};` +
                   `opacity:${hid ? 0 : dim ? 0.18 : 1};`,
            labelStyle: showLabel
              ? `font:500 ${Math.min(11, Math.max(7, zh / 5))}px/1.15 'IBM Plex Mono',monospace;color:#3C2A3B;letter-spacing:0.02em;text-transform:uppercase;`
              : 'display:none;'
          });
        });

        x += b.w;
      });
    });
    originX += blockLen + gap;
  });

  const width = Math.max(1, originX - gap) * mPx;
  const deepest = Math.max(12.0, ...blocks.flatMap((b) => b.levels.flat().map((bay) => bay.d)));
  return { faces, width, depth: deepest * mPx, sceneW: width, sceneH: deepest * mPx };
}

// The selected set of buildings (one per section), totalled and matched together.
function assemble(blocks, req) {
  return { totals: totals(blocks, req), fit: fitLines(req, blocks) };
}

const GEOM = { LEVEL_H, ROOF_H };

window.MOE_R = { calcRequirements, buildOptions, buildFaces, parseCodes, libraryBlock, adminBlock, companionBlock, assemble, GEOM, SCHOOL_LABEL };
})();
