// Recommendation layer: user input -> requirement calculation -> standard design rules -> suitable building types.
// Kept separate from the interface so rules can be updated without rebuilding screens.

import { MODULES, BUILDING_TYPES, TEACHING_LAYOUTS, MODULE_ZONES, LIBRARY_LAYOUTS, ADMIN_LAYOUTS, CLIMATE_ZONES, HEATING, SPACE_CATS } from './moe-data.js';

const LEVEL_H = 3.9;          // floor to floor, metres
const ROOF_H = 0.6;           // parapet / fascia
const ceil = (n) => Math.ceil(n - 1e-9);

/* ---------------------------------------------------------------- 1. Requirement calculation */

export function calcRequirements(input, ratio) {
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
  if (input.hall === 'Yes') notes.push('Hall requirement recorded — outside standard designs V1.0.');
  if (input.gym === 'Yes') notes.push('Gym / PE requirement recorded — outside standard designs V1.0.');
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
    notes
  };
}

/* ---------------------------------------------------------------- 2. Bay + block assembly */

let uid = 0;
function bay(moduleKey, level, opts = {}) {
  const m = MODULES[moduleKey];
  const zones = opts.zones || MODULE_ZONES[moduleKey] || [];
  return {
    id: `b${++uid}`,
    moduleKey, code: opts.code || m.code, name: opts.name || m.name,
    cat: opts.cat || m.cat, w: m.w, d: m.d, nfa: opts.nfa || m.nfa, level,
    layout: opts.layout || null, note: opts.note || m.note,
    zones: zones.map((z, i) => ({ ...z, id: `z${uid}-${i}` }))
  };
}

function teachingLevel(count, level, layout, specialistCount, amenity, stair) {
  const bays = [];
  for (let i = 0; i < count; i++) {
    const spec = i >= count - specialistCount;
    bays.push(bay(spec ? 'TS_SPEC' : 'TS_P', level, {
      layout: layout.id,
      name: spec ? 'Specialist teaching space' : 'Teaching space — primary',
      zones: layout.zones
    }));
  }
  if (amenity) {
    const key = amenity === 0.5 ? 'AM_HALF' : 'AM_FULL';
    const at = count >= 6 ? Math.round(count / 2) : bays.length;
    bays.splice(at, 0, bay(key, level));
  }
  if (stair) bays.push(bay('STAIR', level));
  return bays;
}

function measure(block) {
  let nfa = 0, footprint = 0, gfa = 0, len = 0;
  block.levels.forEach((bays, i) => {
    const l = bays.reduce((s, b) => s + b.w, 0);
    len = Math.max(len, l);
    gfa += l * 12.0;
    nfa += bays.reduce((s, b) => s + b.nfa, 0);
    if (i === 0) footprint = l * 12.0;
  });
  const storeys = block.levels.length;
  return {
    ...block,
    nfa: Math.round(nfa), gfa: Math.round(gfa), footprint: Math.round(footprint),
    length: Math.round(len * 10) / 10, depth: 12.0, storeys,
    height: Math.round((storeys * LEVEL_H + ROOF_H) * 10) / 10,
    dims: `${Math.round(len * 10) / 10}m × 12.0m × ${Math.round((storeys * LEVEL_H + ROOF_H) * 10) / 10}m`
  };
}

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
    levels.push(teachingLevel(take, l, req.layout, spec, storeys > 1 ? 1 : req.amenityBays, storeys > 1));
  }
  const t = BUILDING_TYPES[typeId];
  return measure({ id: `${typeId}-${++uid}`, typeId, name: t.name, form: t.form, moe: t.moe, roof: t.roof, levels });
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
  const ts = all.filter((b) => b.moduleKey === 'TS_P').length;
  const spec = all.filter((b) => b.moduleKey === 'TS_SPEC').length;
  const lib = all.filter((b) => b.moduleKey === 'LIB').length;
  const adm = all.filter((b) => b.moduleKey === 'ADMIN').length;
  const amen = all.filter((b) => b.moduleKey === 'AM_FULL').length + all.filter((b) => b.moduleKey === 'AM_HALF').length * 0.5;
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
  const ts = all.filter((b) => b.cat === 'teaching').length;
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

export function buildOptions(req) {
  const ts = req.tsNew, spec = req.specialist, total = req.totalTeaching;
  const out = [];
  const label = ['A', 'B', 'C', 'D'];

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
    // Option A — lowest-rise standard type that fits
    if (total <= 6) {
      add(`Type S1 — ${total} teaching ${total === 1 ? 'space' : 'spaces'}`,
        'Single teaching block on one level with amenities bay, plus standard support buildings.',
        [teachingBlock('S1', ts, spec, req, 1), ...support(false)],
        ['Single-storey, no stair or lift', 'Largest footprint of the options', 'Simplest and fastest to deliver', `Teaching layout ${req.layout.id}`]);
    } else {
      const storeys = total <= 12 ? 2 : 3;
      add(`Type S${storeys} — ${total} teaching spaces`,
        `Single-depth ${storeys}-storey teaching block with a full amenities bay and stair module per level.`,
        [teachingBlock(`S${storeys}`, ts, spec, req, storeys), ...support(false)],
        [`${storeys} storeys, stair and lift module per level`, 'Compact footprint', 'Full amenities bay per level', `Teaching layout ${req.layout.id}`]);
    }

    // Option B — alternative massing
    if (total <= 6 && total >= 4 && req.maxStoreys >= 2) {
      add(`Type S2 — ${total} teaching spaces over two levels`,
        'The same teaching provision stacked over two levels to release site area.',
        [teachingBlock('S2', ts, spec, req, 2), ...support(false)],
        ['Footprint roughly halved', 'Stair and lift module per level', 'Amenities bay on each level', 'Suits tighter or sloping sites']);
    } else if (total > 6) {
      if (req.maxStoreys >= 3 && total <= 12) {
        add(`Type S3 — ${total} teaching spaces over three levels`,
          'Three-storey single-depth block for the smallest possible footprint.',
          [teachingBlock('S3', ts, spec, req, 3), ...support(false)],
          ['Smallest footprint', 'Three storeys, lift required', 'Amenities and stair per level', 'Suits constrained sites']);
      }
      const half = Math.ceil(total / 2);
      add(`Two Type S1 blocks — ${half} + ${total - half} teaching spaces`,
        'Teaching provision split across two single-storey blocks that can be staged or placed apart on the site.',
        [teachingBlock('S1', Math.min(ts, half), Math.max(0, spec - Math.max(0, half - ts)), req, 1),
         teachingBlock('S1', Math.max(0, ts - half), Math.min(spec, Math.max(0, total - half)), req, 1),
         ...support(false)],
        ['All single-storey', 'Can be delivered in two stages', 'Two separate footprints on the site', 'No lift required']);
    }

    // Option C — combination with relocatable
    if (req.relocatableOk !== false && total >= 3) {
      const perm = Math.max(2, total - 2);
      const relo = total - perm;
      if (relo >= 1) {
        add(`Type S1 + Type R — ${perm} permanent + ${relo} relocatable`,
          'Permanent block sized to the confirmed roll, with relocatable spaces covering short-term growth.',
          [teachingBlock('S1', Math.min(ts, perm), Math.max(0, perm - ts), req, 1),
           teachingBlock('R', relo, 0, req, 1),
           ...support(false)],
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
export function buildFaces(blocks, mPx, opts = {}) {
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

export const GEOM = { LEVEL_H, ROOF_H };
