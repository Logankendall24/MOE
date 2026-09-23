// Standard designs — building database.
// Structured records only. No interface logic here, so new standard designs
// can be added without touching the application.
// Source: "Standard designs for primary and intermediate schools" V1.0, June 2026.

export const CATALOGUE = {
  title: 'Standard designs for primary and intermediate schools',
  version: 'V1.0',
  issued: 'June 2026',
  scope: 'New teaching, library and administration spaces. Does not cover every school building type or technical requirement.'
};

export const SPACE_CATS = {
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
export const MODULES = {
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
    note: 'Required once per level on multi-storey types.' }
};

// Typologies
export const BUILDING_TYPES = {
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
export const TEACHING_LAYOUTS = {
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

export const MODULE_ZONES = {
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
  ]
};

export const LIBRARY_LAYOUTS = {
  A: { id: 'A', modules: 1, name: 'Library layout A', suits: 'Small to medium primary school', zones: 'LIB' },
  B: { id: 'B', modules: 2, name: 'Library layout B', suits: 'Large primary school', zones: 'LIB_2' }
};

export const ADMIN_LAYOUTS = {
  A: { id: 'A', modules: 2, name: 'Admin layout A', suits: 'Small school' },
  B: { id: 'B', modules: 3, name: 'Admin layout B', suits: 'Medium school' },
  C: { id: 'C', modules: 4, name: 'Admin layout C', suits: 'Large school' }
};

export const CLADDING = {
  A: { id: 'A', name: 'Option A — Profiled metal', notes: 'Full-height profiled metal, factory-coated. Open painted balustrade.', wall: '#C9CCC8', roof: '#B7BBB7' },
  B: { id: 'B', name: 'Option B — Brick', notes: 'Low-level brick or masonry veneer with profiled metal above. Full height single-storey, low seismic only.', wall: '#C3AFA3', roof: '#B7BBB7' },
  C: { id: 'C', name: 'Option C — Painted fibre cement', notes: 'Fibre cement sheet with vertical cover battens, profiled metal to upper levels.', wall: '#D5D3CB', roof: '#B7BBB7' }
};

export const HEATING = {
  default: { name: 'Default', warm: 'Electric ceiling radiators and natural ventilation.', cold: 'Airsource heat pumps and wall radiators with natural ventilation.' },
  alt01: { name: 'Alternative 01', warm: 'Electric ceiling radiators and ducted mechanical heat recovery.', cold: 'Airsource heat pumps, wall radiators and ducted mechanical heat recovery.' },
  alt02: { name: 'Alternative 02', warm: 'Heatpump VRF-AC cassettes with ducted outdoor air supply.', cold: 'Heatpump VRF-AC cassettes with ducted mechanical heat recovery.' }
};

export const CLIMATE_ZONES = [
  { id: 1, band: 'warm' }, { id: 2, band: 'warm' }, { id: 3, band: 'warm' },
  { id: 4, band: 'cold' }, { id: 5, band: 'cold' }, { id: 6, band: 'cold' }
];

export const OUT_OF_SCOPE = {
  hall: 'Halls are not covered by standard designs V1.0. Brief separately with your property advisor.',
  gym: 'Gymnasia / PE spaces are not covered by standard designs V1.0.',
  specialistSecondary: 'Intermediate specialist fit-outs are briefed using the briefing templates.'
};
