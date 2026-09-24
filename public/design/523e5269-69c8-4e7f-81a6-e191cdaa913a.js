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

// Module dimensions in metres. Primary module P = 12m depth.
const MODULES = {
  TS_P: { key: 'TS_P', code: 'A1.p', name: 'Teaching space — primary', w: 7.2, d: 12.0, nfa: 82, cat: 'teaching',
    note: 'Complete teaching space with additional area for resources.' },
  TS_SPEC: { key: 'TS_SPEC', code: 'A1.specialist', name: 'Specialist teaching space', w: 7.2, d: 12.0, nfa: 82, cat: 'teaching',
    note: 'Teaching module fitted out for specialist curriculum use.' },
  AM_FULL: { key: 'AM_FULL', code: 'B1', name: 'Amenities & resource / admin — full bay', w: 7.2, d: 12.0, nfa: 76, cat: 'wc',
    note: 'Toilets, resource areas, admin or staff spaces. Net floor area varies.' },
  AM_HALF: { key: 'AM_HALF', code: 'B1.h', name: 'Amenities & resource / admin — half bay', w: 4.3, d: 12.0, nfa: 44, cat: 'wc',
    note: 'Toilets and resource / storage. Net floor area varies.' },
  LIB: { key: 'LIB', code: 'L1', name: 'Library module', w: 7.2, d: 12.0, nfa: 82, cat: 'library',
    note: 'Library on the teaching module grid.' },
  ADMIN: { key: 'ADMIN', code: 'C1', name: 'Administration module', w: 7.2, d: 12.0, nfa: 80, cat: 'admin',
    note: 'Reception, sick bay, meeting, staff, workroom and leadership spaces.' },
  STAIR: { key: 'STAIR', code: 'S.st', name: 'Stair & lift module', w: 4.3, d: 12.0, nfa: 34, cat: 'circulation',
    note: 'Required once per level on multi-storey types.' },
  // Secondary modules, sized as the secondary catalogue p8 prints them.
  TS_S: { key: 'TS_S', code: 'B', name: 'Teaching space — secondary (S)', w: 7.2, d: 10.3, nfa: 70, cat: 'teaching',
    note: 'A general teaching space with teaching wall and flexibility in resources and layout.' },
  TS_D: { key: 'TS_D', code: 'C', name: 'Teaching space — secondary (D)', w: 8.4, d: 8.9, nfa: 70, cat: 'teaching',
    note: 'A general teaching space with teaching wall and flexibility in resources and layout.' },
  // A D-type bay: a teaching space either side of the resource / breakout
  // strip (8.4m x 3.6m), as the secondary catalogue p8 example shows.
  TS_D_PAIR: { key: 'TS_D_PAIR', code: 'C', name: 'Teaching spaces — secondary (D), either side of resource / breakout', w: 8.4, d: 21.4, nfa: 165, cat: 'teaching',
    note: 'Two D teaching spaces (8.4m x 8.9m, 70m² each) across a resource / breakout module (8.4m x 3.6m, 25m²).' },
  // The catalogue gives amenity floor area as "varies": these nfa figures are
  // estimates, the primary amenity areas above scaled to the secondary bay.
  AM_FULL_S: { key: 'AM_FULL_S', code: 'B1', name: 'Resource / amenities — full bay', w: 7.2, d: 10.3, nfa: 65, cat: 'wc',
    note: 'Supporting spaces such as toilets, resource areas, admin or staff spaces. Net floor area varies.' },
  AM_HALF_S: { key: 'AM_HALF_S', code: 'B1.h', name: 'Resource / amenities — half bay', w: 4.1, d: 10.3, nfa: 36, cat: 'wc',
    note: 'Supporting spaces such as toilets, resource areas, admin or staff spaces. Net floor area varies.' }
};
// The specialist module as the secondary catalogue p8 prints it (8.4m x 12.0m,
// 95m²). Specialist spaces apply to S and D types in both school categories.
Object.assign(MODULES.TS_SPEC, { w: 8.4, d: 12.0, nfa: 95 });

// How many teaching spaces a bay holds, and how many bays of building length
// it adds to the building code (S2-A6.5: half an amenity bay adds 0.5).
const BAY_TS = { TS_P: 1, TS_S: 1, TS_D: 1, TS_D_PAIR: 2, TS_SPEC: 1 };
// The code counts teaching bays along the building; a half amenity bay adds
// .5 (S2-A6.5). A full amenity bay adds nothing: S2 types always have one per
// level and the project team's example codes a 6-long S2 as S2-A6.
const BAY_LEN = { TS_P: 1, TS_S: 1, TS_D: 1, TS_D_PAIR: 1, TS_SPEC: 1, AM_HALF: 0.5, AM_HALF_S: 0.5 };

// Typologies
const BUILDING_TYPES = {
  R:  { id: 'R',  name: 'Type R — Relocatable', form: 'Relocatable, single-storey', storeys: 1, tsMin: 1, tsMax: 4,
        moe: 'OMB 2.5 — Relocatable, single-storey', roof: 'Mono-pitch',
        tags: ['relocatable', 'staging', 'tight timeframe'],
        description: 'Relocatable teaching block for short-term roll growth, staged works, or constrained sites.' },
  S1: { id: 'S1', name: 'Type S1 — Single-depth, single-storey', form: 'Single-depth, single-storey', storeys: 1, tsMin: 2, tsMax: 6,
        moe: 'Standard type S1', roof: 'Mono-pitch or gabled',
        tags: ['single-storey', 'typical primary'],
        description: 'The typical primary teaching block: 2–6 teaching modules of 7.2m plus an amenities bay.' },
  S2: { id: 'S2', name: 'Type S2 — Single-depth, two-storey', form: 'Single-depth, two-storey', storeys: 2, tsMin: 6, tsMax: 12,
        moe: 'Standard type S2', roof: 'Mono-pitch',
        tags: ['two-storey', 'reduced footprint'],
        description: 'Two-storey single-depth block. Halves the footprint where the site is tighter.' },
  S3: { id: 'S3', name: 'Type S3 — Single-depth, three-storey', form: 'Single-depth, three-storey', storeys: 3, tsMin: 9, tsMax: 18,
        moe: 'Standard type S3', roof: 'Mono-pitch',
        tags: ['three-storey', 'constrained site'],
        description: 'Three-storey single-depth block for larger rolls on constrained sites.' },
  // Secondary only. Names and ranges as the secondary catalogue p7 prints them.
  D1: { id: 'D1', name: 'Type D1 — Double-depth, single-storey', form: 'Double-depth, single-storey', storeys: 1, tsMin: 6, tsMax: 10,
        moe: 'Standard type D1', roof: 'Gabled',
        tags: ['double-depth', 'single-storey', 'secondary'],
        description: 'Double-depth block: teaching spaces either side of a central resource / breakout strip.' },
  D2: { id: 'D2', name: 'Type D2 — Double-depth, two-storey', form: 'Double-depth, two-storey', storeys: 2, tsMin: 12, tsMax: 33,
        moe: 'Standard type D2', roof: 'Gabled',
        tags: ['double-depth', 'two-storey', 'secondary'],
        description: 'Two-storey double-depth block with teaching spaces either side of a central resource / breakout strip.' },
  D3: { id: 'D3', name: 'Type D3 — Double-depth, three-storey', form: 'Double-depth, three-storey', storeys: 3, tsMin: 12, tsMax: 33,
        moe: 'Standard type D3', roof: 'Gabled',
        tags: ['double-depth', 'three-storey', 'secondary'],
        description: 'Three-storey double-depth block with teaching spaces either side of a central resource / breakout strip.' },
  L:  { id: 'L',  name: 'Library building', form: 'Single-storey, 1–2 modules', storeys: 1, tsMin: 0, tsMax: 0,
        moe: 'Standard library layouts A / B', roof: 'Mono-pitch',
        tags: ['library', 'learning commons'],
        description: 'Standard library layouts on the teaching module grid.' },
  C:  { id: 'C',  name: 'Administration building', form: 'Single-storey, 2–4 modules', storeys: 1, tsMin: 0, tsMax: 0,
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
  // D bay across its 21.4m depth: 8.9m teaching, 3.6m resource / breakout, 8.9m teaching.
  TS_D_PAIR: [
    { cat: 'teaching', label: 'General teaching', fx: 0, fy: 0, fw: 1, fh: 8.9 / 21.4 },
    { cat: 'breakout', label: 'Resource / breakout', fx: 0, fy: 8.9 / 21.4, fw: 1, fh: 3.6 / 21.4 },
    { cat: 'teaching', label: 'General teaching', fx: 0, fy: 12.5 / 21.4, fw: 1, fh: 8.9 / 21.4 }
  ]
};
MODULE_ZONES.AM_FULL_S = MODULE_ZONES.AM_FULL;
MODULE_ZONES.AM_HALF_S = MODULE_ZONES.AM_HALF;

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

const OUT_OF_SCOPE = {
  hall: 'Halls are covered by Standard designs for school gyms and halls, not by standard designs V1.0.',
  gym: 'Gymnasia / PE spaces are covered by Standard designs for school gyms and halls, not by standard designs V1.0.',
  specialistSecondary: 'Intermediate specialist fit-outs are briefed using the briefing templates.'
};

window.MOE_D = { CATALOGUE, SPACE_CATS, MODULES, BUILDING_TYPES, TEACHING_LAYOUTS, MODULE_ZONES, LIBRARY_LAYOUTS, ADMIN_LAYOUTS, CLADDING, HEATING, CLIMATE_ZONES, OUT_OF_SCOPE };
// Recommendation layer: user input -> requirement calculation -> standard design rules -> suitable building types.
// Kept separate from the interface so rules can be updated without rebuilding screens.


const LEVEL_H = 3.9;          // floor to floor, metres
const ROOF_H = 0.6;           // parapet / fascia
const ceil = (n) => Math.ceil(n - 1e-9);

/* ---------------------------------------------------------------- 1. Requirement calculation */

function calcRequirements(input, ratio) {
  const r = Math.max(10, Number(ratio) || 25);
  const roll = Math.max(Number(input.rollFuture) || 0, Number(input.roll) || 0);
  const tsEntitlement = ceil(roll / r);
  const tsExisting = Number(input.tsExisting) || 0;
  const tsNew = Math.max(0, tsEntitlement - tsExisting);
  const specialist = Number(input.specialist) || 0;

  const libraryModules = input.library === 'Yes' ? (roll <= 300 ? 1 : 2) : 0;
  const libraryLayout = libraryModules === 2 ? LIBRARY_LAYOUTS.B : LIBRARY_LAYOUTS.A;
  const adminModules = input.admin === 'Yes' ? (roll <= 150 ? 2 : roll <= 400 ? 3 : 4) : 0;
  const adminLayout = adminModules >= 4 ? ADMIN_LAYOUTS.C : adminModules === 3 ? ADMIN_LAYOUTS.B : ADMIN_LAYOUTS.A;

  const totalTeaching = tsNew + specialist;
  const amenityBays = input.amenities === 'No' ? 0 : (totalTeaching <= 3 ? 0.5 : 1);

  const zone = CLIMATE_ZONES.find((z) => z.id === (Number(input.climate) || 3)) || CLIMATE_ZONES[2];
  const services = HEATING.default[zone.band === 'cold' ? 'cold' : 'warm'];

  const notes = [];
  if (input.hall === 'Yes') notes.push('Hall requirement recorded — standard hall layouts are under Further information on the building page.');
  if (input.gym === 'Yes') notes.push('Gym / PE requirement recorded — standard gym layouts are under Further information on the building page.');
  if (input.relocatable === 'Yes') notes.push('Relocatable buildings accepted — Type R included in options.');
  if (totalTeaching > 18) notes.push('Teaching requirement exceeds a single standard block — multiple blocks proposed.');

  return {
    ratio: r, roll, tsEntitlement, tsExisting, tsNew, specialist, totalTeaching,
    libraryModules, libraryLayout, adminModules, adminLayout, amenityBays,
    storage: input.storage || 'Standard', bags: input.bags || 'Covered bag shelter',
    climateZone: zone.id, climateBand: zone.band, services,
    relocatableOk: input.relocatable !== 'No',
    cladding: input.cladding || 'A',
    maxStoreys: input.maxStoreys === 'No preference' ? 3 : Number(input.maxStoreys) || 3,
    siteArea: input.siteArea || 'Moderate',
    layout: TEACHING_LAYOUTS[input.layout] || TEACHING_LAYOUTS.B,
    // School category: secondary schools use the secondary S module and can
    // have D-type buildings; primary / intermediate use the primary module.
    category: input.category === 'secondary' ? 'secondary' : 'primary_intermediate',
    notes
  };
}

// A single-depth (S) building is at most 6 teaching spaces long per level:
// beyond that it becomes S2, then S3 (project team rule; the catalogues'
// typical plan shows 2-6 modules). D types take the same length per side.
const MAX_LEN = 6;

/* ---------------------------------------------------------------- 2. Bay + block assembly */

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

function teachingLevel(count, level, layout, specialistCount, amenity, stair, category) {
  const secondary = category === 'secondary';
  const tsKey = secondary ? 'TS_S' : 'TS_P';
  const bays = [];
  for (let i = 0; i < count; i++) {
    const spec = i >= count - specialistCount;
    bays.push(bay(spec ? 'TS_SPEC' : tsKey, level, {
      layout: layout.id,
      name: spec ? 'Specialist teaching space' : MODULES[tsKey].name,
      zones: layout.zones
    }));
  }
  if (amenity) {
    const key = (amenity === 0.5 ? 'AM_HALF' : 'AM_FULL') + (secondary ? '_S' : '');
    const at = count >= 6 ? Math.round(count / 2) : bays.length;
    bays.splice(at, 0, bay(key, level));
  }
  if (stair) bays.push(bay('STAIR', level));
  return bays;
}

// Areas from each bay's own size, since secondary and D bays aren't 12m deep.
function measure(block, category) {
  let nfa = 0, footprint = 0, gfa = 0, len = 0, depth = 0;
  block.levels.forEach((bays, i) => {
    const l = bays.reduce((s, b) => s + b.w, 0);
    const a = bays.reduce((s, b) => s + b.w * b.d, 0);
    len = Math.max(len, l);
    depth = Math.max(depth, ...bays.map((b) => b.d));
    gfa += a;
    nfa += bays.reduce((s, b) => s + b.nfa, 0);
    if (i === 0) footprint = a;
  });
  const storeys = block.levels.length;
  const r1 = (n) => Math.round(n * 10) / 10;
  const code = buildingCode(block.typeId, block.levels, category);
  const t = BUILDING_TYPES[block.typeId];
  return {
    ...block,
    code, name: code !== block.typeId && t ? `Type ${code} — ${t.form}` : block.name,
    nfa: Math.round(nfa), gfa: Math.round(gfa), footprint: Math.round(footprint),
    length: r1(len), depth: r1(depth), storeys,
    height: r1(storeys * LEVEL_H + ROOF_H),
    dims: `${r1(len)}m × ${r1(depth)}m × ${r1(storeys * LEVEL_H + ROOF_H)}m`
  };
}

// Building code: type, then module letter and length in bays, e.g. S2-A6.5 is
// a single-depth two-storey block of primary modules (A), 6 bays long with a
// half amenity bay. Module letters: A primary, B secondary S, C secondary D.
// The stair module doesn't count towards length. Other types keep their id.
function buildingCode(typeId, levels, category) {
  if (!/^[SD][123]$/.test(typeId)) return typeId;
  const letter = typeId[0] === 'D' ? 'C' : category === 'secondary' ? 'B' : 'A';
  const len = Math.max(...levels.map((bays) => bays.reduce((s, b) => s + (BAY_LEN[b.moduleKey] || 0), 0)));
  return `${typeId}-${letter}${len}`;
}

const tsIn = (b) => BAY_TS[b.moduleKey] || 0;
const specIn = (b) => b.spec || (b.moduleKey === 'TS_SPEC' ? 1 : 0);

function teachingBlock(typeId, ts, specialist, req, storeys) {
  const perLevel = ceil((ts + specialist) / storeys);
  const levels = [];
  let remainingTs = ts, remainingSpec = specialist;
  for (let l = 0; l < storeys; l++) {
    const take = Math.min(perLevel, remainingTs + remainingSpec);
    const specHere = Math.min(remainingSpec, Math.max(0, take - Math.min(remainingTs, take - Math.min(remainingSpec, take))));
    const spec = Math.min(remainingSpec, l === storeys - 1 ? remainingSpec : specHere);
    const gen = take - spec;
    remainingTs -= gen; remainingSpec -= spec;
    levels.push(teachingLevel(take, l, req.layout, spec, storeys > 1 ? 1 : req.amenityBays, storeys > 1, req.category));
  }
  const t = BUILDING_TYPES[typeId];
  return measure({ id: `${typeId}-${++uid}`, typeId, name: t.name, form: t.form, moe: t.moe, roof: t.roof, levels }, req.category);
}

// D-type block (secondary only): each bay holds a teaching space either side
// of the resource / breakout strip, so a level of n spaces is ceil(n / 2) bays
// long. Specialist spaces take their share of the bays; an odd space out sits
// in a single-sided D bay. Amenities as for S types.
function teachingBlockD(typeId, ts, specialist, req, storeys) {
  const perLevel = ceil((ts + specialist) / storeys);
  const levels = [];
  let remaining = ts + specialist, specLeft = specialist;
  for (let l = 0; l < storeys; l++) {
    const take = Math.min(perLevel, remaining);
    const bays = [];
    for (let i = 0; i < take; i += 2) {
      const pair = i + 1 < take;
      const spec = Math.min(specLeft, pair ? 2 : 1);
      specLeft -= spec;
      bays.push(bay(pair ? 'TS_D_PAIR' : 'TS_D', l, {
        layout: req.layout.id, spec,
        name: (pair ? MODULES.TS_D_PAIR.name : MODULES.TS_D.name) + (spec ? ` (${spec} specialist)` : ''),
        zones: pair ? MODULE_ZONES.TS_D_PAIR : req.layout.zones
      }));
    }
    const amenity = storeys > 1 ? 1 : req.amenityBays;
    if (amenity) bays.push(bay(amenity === 0.5 ? 'AM_HALF_S' : 'AM_FULL_S', l));
    if (storeys > 1) bays.push(bay('STAIR', l));
    remaining -= take;
    levels.push(bays);
  }
  const t = BUILDING_TYPES[typeId];
  return measure({ id: `${typeId}-${++uid}`, typeId, name: t.name, form: t.form, moe: t.moe, roof: t.roof, levels }, req.category);
}

function libraryBlock(req) {
  const lay = req.libraryLayout;
  const zones = MODULE_ZONES[lay.zones];
  const bays = [];
  for (let i = 0; i < lay.modules; i++) bays.push(bay('LIB', 0, { zones, name: `Library module ${i + 1}`, note: lay.suits }));
  const t = BUILDING_TYPES.L;
  return measure({ id: `L-${++uid}`, typeId: 'L', name: `${t.name} — ${lay.name}`, form: t.form, moe: lay.name, roof: t.roof, levels: [bays] });
}

function adminBlock(req, extraAmenity) {
  const n = req.adminModules;
  const zoneSets = ['ADMIN_1', 'ADMIN_2', 'ADMIN_3', 'ADMIN_4'];
  const bays = [];
  for (let i = 0; i < n; i++) bays.push(bay('ADMIN', 0, { zones: MODULE_ZONES[zoneSets[i]], name: `Admin module ${i + 1}`, note: req.adminLayout.suits }));
  if (extraAmenity) bays.push(bay('AM_HALF', 0));
  const t = BUILDING_TYPES.C;
  return measure({ id: `C-${++uid}`, typeId: 'C', name: `${t.name} — ${req.adminLayout.name}`, form: t.form, moe: req.adminLayout.name, roof: t.roof, levels: [bays] });
}

/* ---------------------------------------------------------------- 3. Fit assessment */

function fitLines(req, blocks) {
  const all = blocks.flatMap((b) => b.levels.flat());
  const spec = all.reduce((s, b) => s + specIn(b), 0);
  const ts = all.reduce((s, b) => s + tsIn(b), 0) - spec;
  const lib = all.filter((b) => b.moduleKey === 'LIB').length;
  const adm = all.filter((b) => b.moduleKey === 'ADMIN').length;
  const amen = all.reduce((s, b) => s + (/^AM_FULL/.test(b.moduleKey) ? 1 : /^AM_HALF/.test(b.moduleKey) ? 0.5 : 0), 0);
  const storeys = Math.max(...blocks.map((b) => b.storeys));

  const mk = (label, required, provided, unit) => {
    const status = provided >= required ? (provided > required ? 'surplus' : 'met') : 'short';
    return { label, required, provided, unit: unit || '', status,
      text: status === 'met' ? 'Requirement met' : status === 'surplus' ? `${Math.round((provided - required) * 10) / 10} more than required` : `${Math.round((required - provided) * 10) / 10} short` };
  };

  const lines = [
    mk('General teaching spaces', req.tsNew, ts, 'spaces'),
    mk('Specialist teaching spaces', req.specialist, spec, 'spaces'),
    mk('Amenity bays', req.amenityBays, amen, 'bays'),
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

/* ---------------------------------------------------------------- 4. Option generation */

function buildOptions(req) {
  const ts = req.tsNew, spec = req.specialist, total = req.totalTeaching;
  const out = [];
  const label = 'ABCDEFGH'.split('');

  const support = (extraAmenity) => {
    const b = [];
    if (req.libraryModules) b.push(libraryBlock(req));
    if (req.adminModules) b.push(adminBlock(req, extraAmenity));
    return b;
  };

  const add = (title, summary, blocks, characteristics) => {
    if (!blocks.length) return;
    const fit = fitLines(req, blocks);
    out.push({
      id: label[out.length], title, summary, blocks,
      totals: totals(blocks, req), fit, characteristics,
      recommended: false
    });
  };

  if (total > 0) {
    const spaces = (n) => `${n} teaching ${n === 1 ? 'space' : 'spaces'}`;
    const secondary = req.category === 'secondary';
    // Split n spaces as evenly as possible into k blocks, specialist spaces
    // shared out in proportion.
    const split = (n, k) => Array.from({ length: k }, (_, i) => Math.floor(n / k) + (i < n % k ? 1 : 0));
    const sBlock = (n, sp, storeys) => teachingBlock(`S${storeys}`, n - sp, sp, req, storeys);

    // Option A — lowest-rise S type that fits, at most 6 spaces long per level.
    // Above 18 spaces (an S3 of 6 per level), the provision is split into
    // several blocks.
    if (total <= MAX_LEN * 3) {
      const storeys = Math.ceil(total / MAX_LEN);
      const blk = sBlock(total, spec, storeys);
      add(`Type ${blk.code} — ${spaces(total)}`,
        storeys === 1 ? 'Single teaching block on one level with amenities bay, plus standard support buildings.'
          : `Single-depth ${storeys}-storey teaching block with a full amenities bay and stair module per level.`,
        [blk, ...support(false)],
        storeys === 1 ? ['Single-storey, no stair or lift', 'Largest footprint of the options', 'Simplest and fastest to deliver', `Teaching layout ${req.layout.id}`]
          : [`${storeys} storeys, stair and lift module per level`, 'Compact footprint', 'Full amenities bay per level', `Teaching layout ${req.layout.id}`]);
    } else {
      const k = Math.ceil(total / (MAX_LEN * 3));
      const sizes = split(total, k), specs = split(spec, k);
      const blocks = sizes.map((n, i) => sBlock(n, Math.min(specs[i], n), Math.ceil(n / MAX_LEN)));
      add(`${blocks.map((b) => `Type ${b.code}`).join(' + ')} — ${spaces(total)}`,
        `More than one S3 holds (18 spaces), so the provision is split across ${k} single-depth blocks.`,
        [...blocks, ...support(false)],
        [`${k} blocks, each up to 6 spaces long per level`, 'Stair and lift module per level', 'Full amenities bay per level', `Teaching layout ${req.layout.id}`]);
    }

    // Option B — alternative S massing
    if (total <= 6 && total >= 4 && req.maxStoreys >= 2) {
      const blk = sBlock(total, spec, 2);
      add(`Type ${blk.code} — ${spaces(total)} over two levels`,
        'The same teaching provision stacked over two levels to release site area.',
        [blk, ...support(false)],
        ['Footprint roughly halved', 'Stair and lift module per level', 'Amenities bay on each level', 'Suits tighter or sloping sites']);
    } else if (total > 6) {
      if (req.maxStoreys >= 3 && total <= 12) {
        const blk = sBlock(total, spec, 3);
        add(`Type ${blk.code} — ${spaces(total)} over three levels`,
          'Three-storey single-depth block for the smallest possible footprint.',
          [blk, ...support(false)],
          ['Smallest footprint', 'Three storeys, lift required', 'Amenities and stair per level', 'Suits constrained sites']);
      }
      // Two single-storey blocks only while each stays within 6 spaces.
      if (total <= MAX_LEN * 2) {
        const [n1, n2] = split(total, 2), [s1, s2] = split(spec, 2);
        const b1 = sBlock(n1, Math.min(s1, n1), 1), b2 = sBlock(n2, Math.min(s2, n2), 1);
        add(`Type ${b1.code} + Type ${b2.code} — ${n1} + ${n2} teaching spaces`,
          'Teaching provision split across two single-storey blocks that can be staged or placed apart on the site.',
          [b1, b2, ...support(false)],
          ['All single-storey', 'Can be delivered in two stages', 'Two separate footprints on the site', 'No lift required']);
      }
    }

    // D types (secondary only): teaching spaces either side of a central
    // resource / breakout strip, in the catalogue's ranges (D1 6-10, D2 and
    // D3 12-33), at most 6 bays long per level.
    if (secondary) {
      const dFits = (storeys) => Math.ceil(Math.ceil(total / storeys) / 2) <= MAX_LEN && storeys <= req.maxStoreys;
      const dAdd = (typeId, storeys, summary, chars) => {
        const blk = teachingBlockD(typeId, total - spec, spec, req, storeys);
        add(`Type ${blk.code} — ${spaces(total)}`, summary, [blk, ...support(false)], chars);
      };
      if (total >= 6 && total <= 10 && dFits(1)) {
        dAdd('D1', 1, 'Double-depth single-storey block: teaching spaces either side of a central resource / breakout strip.',
          ['Single-storey, no stair or lift', 'Shorter, deeper footprint than S1', 'Central resource / breakout strip', `Teaching layout ${req.layout.id}`]);
      }
      if (total >= 12 && total <= 33) {
        if (dFits(2)) dAdd('D2', 2, 'Double-depth two-storey block with a central resource / breakout strip and stair module per level.',
          ['2 storeys, stair and lift module per level', 'Compact, deep footprint', 'Full amenities bay per level', `Teaching layout ${req.layout.id}`]);
        if (dFits(3)) dAdd('D3', 3, 'Double-depth three-storey block for the largest provision on a tight site.',
          ['3 storeys, lift required', 'Smallest footprint of the D types', 'Full amenities bay per level', `Teaching layout ${req.layout.id}`]);
      }
    }

    // Option — permanent S1 with relocatables (Type R holds 1-4 spaces)
    if (req.relocatableOk !== false && total >= 3) {
      const perm = Math.min(MAX_LEN, total - 1);
      const relo = total - perm;
      if (relo >= 1 && relo <= 4) {
        const b1 = sBlock(perm, Math.min(spec, perm), 1);
        add(`Type ${b1.code} + Type R — ${perm} permanent + ${relo} relocatable`,
          'Permanent block sized to the confirmed roll, with relocatable spaces covering short-term growth.',
          [b1, teachingBlock('R', relo, Math.max(0, spec - perm), req, 1), ...support(false)],
          ['Lowest permanent footprint', 'Relocatable spaces can be removed later', 'Suits uncertain roll projections', 'OMB 2.5 relocatable']);
      }
    }
  } else if (req.libraryModules || req.adminModules) {
    add('Support buildings only', 'No new teaching spaces required — library and administration provision only.', support(true),
      ['No teaching modules required', 'Single-storey']);
  }

  if (out.length) {
    const best = out.reduce((a, b) => (b.fit.score > a.fit.score || (b.fit.score === a.fit.score && b.totals.gfa < a.totals.gfa) ? b : a), out[0]);
    best.recommended = true;
  }
  return out;
}

/* ---------------------------------------------------------------- 5. Geometry for the viewer */

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
  return { faces, width, depth: 12.0 * mPx, sceneW: width, sceneH: 12.0 * mPx };
}

const GEOM = { LEVEL_H, ROOF_H };

window.MOE_R = { calcRequirements, buildOptions, buildFaces, GEOM };
})();
