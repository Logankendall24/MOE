// Renders a GLB in the building page's 3D window: rotate (drag), pan
// (right-drag), zoom (scroll), and the preset views on the design's toolbar.
// Loaded on demand by the design's component. three.js is vendored under
// /vendor/three and resolved through the page's import map.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const INK = 0x2c112d;
const DEG = Math.PI / 180;

// The design's own view angles: tilt from straight down, turn about vertical.
const PRESETS = {
  axonometric: { tilt: 57, turn: -36 },
  plan: { tilt: 0.01, turn: 0 },
  elevation: { tilt: 89.9, turn: 0 }
};

export class ModelViewer {
  // rotateOnly: no zoom or pan, so the page still scrolls over the window.
  constructor(el, { onChange, onPick, rotateOnly = false } = {}) {
    this.el = el;
    this.onChange = onChange || (() => {});
    this.onPick = onPick || null;
    this.materials = [];
    this.preset = 'axonometric';

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;';
    el.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 10000);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2d9, 2.4));
    const sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.set(-0.5, 1, 0.7);
    this.scene.add(sun);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.12;
    this.controls.screenSpacePanning = true;
    this.controls.maxPolarAngle = Math.PI / 2;
    if (rotateOnly) { this.controls.enableZoom = false; this.controls.enablePan = false; }
    this.controls.addEventListener('start', () => { this.preset = null; this.tween = null; });
    this.controls.addEventListener('change', () => { this.dirty = true; this.onChange(); });

    // A click (a press that barely moves, so not a rotate) picks the piece under it.
    if (this.onPick) {
      const dom = this.renderer.domElement;
      dom.addEventListener('pointerdown', (e) => { this.down = e.button === 0 ? { x: e.clientX, y: e.clientY } : null; });
      dom.addEventListener('pointerup', (e) => {
        const d = this.down; this.down = null;
        if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 5) this.pickAt(e.clientX, e.clientY);
      });
    }

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(el);
    this.resize();

    const loop = (t) => {
      this.raf = requestAnimationFrame(loop);
      this.stepTween(t);
      this.controls.update();
      if (this.dirty) { this.dirty = false; this.renderer.render(this.scene, this.camera); }
    };
    this.raf = requestAnimationFrame(loop);
  }

  async load(url) {
    const gltf = await new GLTFLoader().loadAsync(url);
    if (this.disposed) return;
    if (this.model) { this.scene.remove(this.model); this.disposeObject(this.model); }

    // Matte versions of the model's own colours, with thin outlines, for a
    // clean architectural look. Meshes are grouped by material for the legend.
    const groups = new Map();
    gltf.scene.traverse((o) => {
      if (!o.isMesh) return;
      const src = o.material;
      const name = src.name || 'Model';
      if (!groups.has(name)) {
        const mat = new THREE.MeshStandardMaterial({
          color: src.color.clone(), opacity: src.opacity, transparent: src.opacity < 1,
          roughness: 0.9, metalness: 0, side: THREE.DoubleSide,
          polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1
        });
        groups.set(name, { name, color: '#' + src.color.getHexString(THREE.SRGBColorSpace), material: mat, meshes: [] });
      }
      const g = groups.get(name);
      src.dispose();
      o.material = g.material;
      o.add(new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 25),
        new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.5 })));
      g.meshes.push(o);
    });
    this.materials = [...groups.values()];
    this.selected = null;

    // Sit the model on the ground, centred on the origin.
    const model = gltf.scene;
    const box = new THREE.Box3().setFromObject(model);
    const centre = box.getCenter(new THREE.Vector3());
    model.position.sub(new THREE.Vector3(centre.x, box.min.y, centre.z));
    this.scene.add(model);
    this.model = model;
    model.updateMatrixWorld(true);

    // Floor levels: the distinct heights pieces start at (to the nearest 0.5 m).
    const bases = this.materials.flatMap((g) => g.meshes.map((m) => Math.round(new THREE.Box3().setFromObject(m).min.y * 2) / 2));
    this.levels = [...new Set(bases)].sort((a, b) => a - b);

    const size = box.getSize(new THREE.Vector3());
    this.target = new THREE.Vector3(0, size.y / 2, 0);
    this.radius = box.getBoundingSphere(new THREE.Sphere()).radius;
    this.fit();
    this.camera.near = this.fitDistance / 100;
    this.camera.far = this.fitDistance * 20;
    this.camera.updateProjectionMatrix();
    this.controls.minDistance = this.fitDistance * 0.15;
    this.controls.maxDistance = this.fitDistance * 4;
    this.view('axonometric', false);
    this.loadedUrl = url;
  }

  // Camera distance that frames the model in the window's narrower direction.
  // A bounding sphere is conservative for long, low buildings, so fit a little tighter.
  fit() {
    const v = this.camera.fov * DEG;
    const h = 2 * Math.atan(Math.tan(v / 2) * this.camera.aspect);
    this.fitDistance = (this.radius / Math.sin(Math.min(v, h) / 2)) * 0.9;
  }

  // Move to one of the design's preset views ('reset' is axonometric, re-centred).
  view(name, animate = true) {
    const p = PRESETS[name === 'reset' ? 'axonometric' : name];
    if (!p || !this.target) return;
    this.preset = name === 'reset' ? 'axonometric' : name;
    const to = { tilt: p.tilt, turn: p.turn, dist: this.fitDistance, target: this.target.clone() };
    if (!animate) { this.place(to); return; }
    const from = this.current();
    // Turn the short way round.
    let dt = to.turn - from.turn;
    dt -= Math.round(dt / 360) * 360;
    to.turn = from.turn + dt;
    this.tween = { from, to, start: null };
    this.dirty = true;
  }

  setHidden(names) {
    this.hiddenNames = new Set(names);
    this.applyVisibility();
  }

  applyVisibility() {
    const hidden = this.hiddenNames || new Set();
    const only = this.isolated && this.selected;
    this.materials.forEach((g) => g.meshes.forEach((m) => { m.visible = !hidden.has(g.name) && (!only || m === this.selected.mesh); }));
    this.dirty = true;
  }

  // The visible piece under a screen point: highlighted, and described to onPick
  // (its material group, measured size, plan area and floor level), or null.
  pickAt(clientX, clientY) {
    if (!this.model) return;
    const r = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(ndc, this.camera);
    const hit = ray.intersectObject(this.model, true).find((h) => h.object.isMesh && h.object.visible);
    this.select(hit ? hit.object : null);
  }

  select(mesh) {
    if (this.selected) { this.selected.mesh.material = this.selected.material; this.selected.highlight.dispose(); }
    this.selected = null;
    if (mesh) {
      const group = this.materials.find((g) => g.meshes.includes(mesh));
      const highlight = mesh.material.clone();
      highlight.color.lerp(new THREE.Color(0xa0508f), 0.55);
      highlight.opacity = 1;
      highlight.transparent = false;
      this.selected = { mesh, material: mesh.material, highlight };
      mesh.material = highlight;
      const b = new THREE.Box3().setFromObject(mesh);
      const size = b.getSize(new THREE.Vector3());
      const r1 = (n) => Math.round(n * 10) / 10;
      this.onPick({
        material: group ? group.name : '', color: group ? group.color : '',
        width: r1(Math.max(size.x, size.z)), depth: r1(Math.min(size.x, size.z)), height: r1(size.y),
        area: Math.round(size.x * size.z),
        level: Math.max(0, this.levels.indexOf(Math.round(b.min.y * 2) / 2)), levels: this.levels.length,
        sameType: group ? group.meshes.length : 1
      });
    } else {
      this.isolated = false;
      this.onPick(null);
    }
    this.applyVisibility();
  }

  isolate(on) {
    this.isolated = !!on && !!this.selected;
    this.applyVisibility();
  }

  // Azimuth and elevation in degrees, and zoom relative to the fitted view.
  readout() {
    const { tilt, turn, dist } = this.current();
    return { az: Math.round(((turn % 360) + 360) % 360), el: Math.round(90 - tilt), zoom: Math.round((this.fitDistance / dist) * 100) };
  }

  current() {
    const offset = this.camera.position.clone().sub(this.controls.target);
    const s = new THREE.Spherical().setFromVector3(offset);
    return { tilt: s.phi / DEG, turn: s.theta / DEG, dist: s.radius, target: this.controls.target.clone() };
  }

  place({ tilt, turn, dist, target }) {
    this.controls.target.copy(target);
    const offset = new THREE.Vector3().setFromSpherical(new THREE.Spherical(dist, tilt * DEG, turn * DEG));
    this.camera.position.copy(target).add(offset);
    this.camera.lookAt(target);
    this.dirty = true;
    this.onChange();
  }

  stepTween(t) {
    const tw = this.tween;
    if (!tw) return;
    if (tw.start === null) tw.start = t;
    const k = Math.min(1, (t - tw.start) / 650);
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const lerp = (a, b) => a + (b - a) * e;
    this.place({
      tilt: lerp(tw.from.tilt, tw.to.tilt), turn: lerp(tw.from.turn, tw.to.turn), dist: lerp(tw.from.dist, tw.to.dist),
      target: tw.from.target.clone().lerp(tw.to.target, e)
    });
    if (k === 1) this.tween = null;
  }

  resize() {
    const w = this.el.clientWidth, h = this.el.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.radius) this.fit();
    this.dirty = true;
  }

  disposeObject(obj) {
    obj.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) o.material.dispose();
    });
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.controls.dispose();
    if (this.model) this.disposeObject(this.model);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
