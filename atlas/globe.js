// LOBBY — moteur du globe photoréaliste (three.js pur, servi par /lib).
// Terre jour/nuit éclairée par la position RÉELLE du Soleil (UTC), nuages séparés, atmosphère, étoiles.
import * as THREE from 'three';
import { OrbitControls } from '/lib/OrbitControls.js';

const A = '/assets/earth/';
const DEG = Math.PI / 180;

// ---- Soleil : point subsolaire (lat/lon en degrés) pour une date UTC — formules NOAA simplifiées (précision ~0,1°)
export function subsolar(date) {
  const d = date.getTime() / 86400000 - 10957.5;            // jours depuis J2000.0
  const g = (357.529 + 0.98560028 * d) * DEG;               // anomalie moyenne
  const q = 280.459 + 0.98564736 * d;                       // longitude moyenne
  const L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * DEG; // longitude écliptique
  const e = (23.439 - 0.00000036 * d) * DEG;                // obliquité
  const ra = Math.atan2(Math.cos(e) * Math.sin(L), Math.cos(L));
  const dec = Math.asin(Math.sin(e) * Math.sin(L));
  const gmst = ((18.697374558 + 24.06570982441908 * d) % 24 + 24) % 24; // heures
  let lon = (ra / DEG - gmst * 15) % 360;
  if (lon > 180) lon -= 360; if (lon < -180) lon += 360;
  return { lat: dec / DEG, lon };
}

// lat/lon -> vecteur unitaire, aligné sur le mapping UV de THREE.SphereGeometry
export function ll2v(lat, lon, r = 1) {
  const la = lat * DEG, lo = lon * DEG;
  return new THREE.Vector3(r * Math.cos(la) * Math.cos(lo), r * Math.sin(la), -r * Math.cos(la) * Math.sin(lo));
}
export function v2ll(v) {
  const n = v.clone().normalize();
  return { lat: Math.asin(n.y) / DEG, lon: Math.atan2(-n.z, n.x) / DEG };
}

const EARTH_VS = `
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){ vUv = uv; vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position,1.); vW = w.xyz;
gl_Position = projectionMatrix * viewMatrix * w; }`;
const EARTH_FS = `
uniform sampler2D dayMap, nightMap, waterMap, bumpMap; uniform vec3 sunDir; uniform vec3 camPos; uniform vec2 texel;
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){
  vec3 N = normalize(vN);
  // relief discret : dérivées de la carte d'altitude -> perturbation de normale
  float h = texture2D(bumpMap, vUv).r;
  float hx = texture2D(bumpMap, vUv + vec2(texel.x,0.)).r - h;
  float hy = texture2D(bumpMap, vUv + vec2(0.,texel.y)).r - h;
  vec3 T = normalize(cross(vec3(0.,1.,0.), N) + 1e-5); vec3 B = cross(N, T);
  vec3 Np = normalize(N - (T * hx + B * hy) * 2.2);
  float ndl = dot(Np, sunDir);
  float day = smoothstep(-0.06, 0.16, dot(N, sunDir));            // terminateur doux (crépuscule)
  vec3 dayC = texture2D(dayMap, vUv).rgb * (0.28 + 0.86 * max(ndl, 0.));
  float twi = smoothstep(-0.12, 0.0, dot(N, sunDir)) * (1. - smoothstep(0.0, 0.12, dot(N, sunDir)));
  dayC += vec3(0.35, 0.12, 0.03) * twi * 0.1;                      // lueur orangée au crépuscule
  vec3 nightC = texture2D(nightMap, vUv).rgb; nightC = pow(nightC, vec3(1.25)) * vec3(1.25, 1.05, 0.8);
  vec3 col = mix(nightC * 1.3, dayC, day);
  gl_FragColor = vec4(col, 1.);
  #include <colorspace_fragment>
}`;
const CLOUD_FS = `
uniform sampler2D map; uniform vec3 sunDir; varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main(){ vec3 N = normalize(vN); float a = texture2D(map, vUv).r; float l = smoothstep(-0.15, 0.35, dot(N, sunDir));
gl_FragColor = vec4(vec3(1.) * (0.06 + 0.94 * l), a * mix(0.18, 0.9, l));
#include <colorspace_fragment>
}`;
const ATMO_VS = `varying vec3 vNv; varying vec3 vN; void main(){ vNv = normalize(normalMatrix*normal); vN = normalize(mat3(modelMatrix)*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const ATMO_FS = `
uniform vec3 sunDir; varying vec3 vNv; varying vec3 vN;
void main(){ float i = pow(clamp(0.72 - dot(vNv, vec3(0.,0.,1.)), 0., 1.), 5.0);   // halo doux (technique three-globe)
float lit = smoothstep(-0.45, 0.35, dot(normalize(vN), sunDir));
vec3 c = mix(vec3(0.05,0.08,0.2), vec3(0.32,0.6,1.0), lit);
gl_FragColor = vec4(c, i * (0.1 + 0.5 * lit));
}`;

function isLowEnd() {
  const mob = matchMedia('(pointer:coarse)').matches || Math.min(screen.width, screen.height) < 700;
  const cores = navigator.hardwareConcurrency || 4;
  return mob || cores < 4 || (navigator.deviceMemory && navigator.deviceMemory < 4);
}

export function createGlobe(el, opts = {}) {
  const low = isLowEnd();
  let dirty = true;
  const dpr = devicePixelRatio || 1;
  const renderer = new THREE.WebGLRenderer({ antialias: !low && dpr < 2, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(dpr, low ? 1.25 : 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  el.appendChild(renderer.domElement);
  Object.assign(renderer.domElement.style, { display: 'block', width: '100%', height: '100%', touchAction: 'none' });

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 200);
  const start = opts.view || { lat: 30, lon: 10, dist: 3.4 };
  camera.position.copy(ll2v(start.lat, start.lon, start.dist));

  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, { enableDamping: true, dampingFactor: 0.07, enablePan: false, minDistance: 1.4, maxDistance: 7, rotateSpeed: 0.45, zoomSpeed: 0.8 });
  controls.autoRotate = opts.autoRotate !== false; controls.autoRotateSpeed = 0.35;
  if (opts.interactive === false) { controls.enableRotate = controls.enableZoom = false; }
  controls.addEventListener('start', () => { controls.autoRotate = false; });

  const loader = new THREE.TextureLoader();
  const tex = (f, srgb) => new Promise((ok) => loader.load(A + f, (t) => { if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); ok(t); }, undefined, () => ok(null)));

  const sun = new THREE.Vector3(1, 0, 0);
  const uni = { dayMap: { value: null }, nightMap: { value: null }, waterMap: { value: null }, bumpMap: { value: null }, sunDir: { value: sun }, camPos: { value: camera.position }, texel: { value: new THREE.Vector2(1 / 2048, 1 / 1024) } };
  const seg = low ? 80 : 128;
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, seg, seg / 2), new THREE.ShaderMaterial({ uniforms: uni, vertexShader: EARTH_VS, fragmentShader: EARTH_FS }));
  earth.visible = false; scene.add(earth);

  const cUni = { map: { value: null }, sunDir: { value: sun } };
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.006, seg, seg / 2), new THREE.ShaderMaterial({ uniforms: cUni, vertexShader: EARTH_VS, fragmentShader: CLOUD_FS, transparent: true, depthWrite: false }));
  clouds.visible = false; scene.add(clouds);

  const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.13, 96, 48), new THREE.ShaderMaterial({ uniforms: { sunDir: { value: sun } }, vertexShader: ATMO_VS, fragmentShader: ATMO_FS, side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(atmo);

  let stars = null, starsOpacity = opts.starsOpacity ?? 1;
  const realSun = opts.realSun === true; // par défaut : lumière qui suit la caméra -> toute la face visible est éclairée
  if (opts.stars !== false) {
    tex('stars.webp', true).then((t) => { if (!t) return; stars = new THREE.Mesh(new THREE.SphereGeometry(90, 32, 16), new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, color: 0x8a8f9a, transparent: true, opacity: starsOpacity })); scene.add(stars); });
  }

  // Chargement progressif : 2K d'abord, 4K ensuite sur machine capable
  const ready = Promise.all([tex('day-2k.webp', true), realSun ? tex('night-2k.webp', true) : Promise.resolve(null), Promise.resolve(null), tex('bump-2k.webp'), tex('clouds-2k.webp')]).then(([d, n, w, b, c]) => {
    n = n || d; w = w || d;
    uni.dayMap.value = d; uni.nightMap.value = n; uni.waterMap.value = w; uni.bumpMap.value = b; cUni.map.value = c;
    earth.visible = !!d; clouds.visible = !!c && opts.clouds !== false;
    if (!low && opts.hd !== false) {
      tex('day-4k.webp', true).then((d4) => { if (d4) { uni.dayMap.value = d4; dirty = true; } });
    }
    dirty = true; el.dispatchEvent(new CustomEvent('globe:ready'));
  });

  let timeOffset = 0; // ms, pour tester d'autres heures
  function updateSun() { const s = subsolar(new Date(Date.now() + timeOffset)); sun.copy(ll2v(s.lat, s.lon)); return s; }
  let sunInfo = updateSun();

  function resize() { dirty = true; const w = el.clientWidth || 1, h = el.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h;
    // écran étroit (téléphone) : on élargit le champ pour que la Terre tienne en entier
    camera.fov = camera.aspect < 1 ? Math.min(70, 2 * Math.atan(Math.tan(19 * DEG) / camera.aspect) / DEG) : 38; camera.updateProjectionMatrix(); }
  const ro = new ResizeObserver(resize); ro.observe(el); resize();

  // Rendu uniquement quand c'est utile (onglet visible, globe à l'écran)
  let visible = true, raf = 0, last = 0, frameCb = null;
  const lastPos = new THREE.Vector3();
  controls.addEventListener('change', () => { dirty = true; });
  addEventListener('resize', () => { dirty = true; });
  const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) loop(); }); io.observe(el);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) loop(); });
  function loop(t = performance.now()) {
    cancelAnimationFrame(raf);
    if (!visible || document.hidden) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (t - last) / 1000 || 0); last = t;
    if (realSun) { if (t % 1000 < 20) sunInfo = updateSun(); }
    else { // « lampe frontale » douce, légèrement en haut à gauche de la caméra
      const c = camera.position.clone().normalize(), up = camera.up.clone().projectOnPlane(c).normalize(), right = new THREE.Vector3().crossVectors(c, up);
      sun.copy(c).addScaledVector(up, 0.35).addScaledVector(right, -0.3).normalize();
    }
    const dist = camera.position.length();
    controls.rotateSpeed = 0.12 + 0.33 * Math.min(1, (dist - 1.1) / 2.5); // plus précis de près
    if (controls.update()) dirty = true;
    if (controls.autoRotate) { clouds.rotation.y += dt * 0.004; dirty = true; }
    if (lastPos.distanceToSquared(camera.position) > 1e-12) { lastPos.copy(camera.position); dirty = true; }
    if (!dirty) return; // rien n'a bougé : on ne redessine pas (économise le GPU)
    dirty = false;
    if (frameCb) frameCb(camera, dist);
    renderer.render(scene, camera);
  }
  loop();

  // Animation de caméra vers lat/lon/distance
  function flyTo(lat, lon, dist = camera.position.length(), ms = 1400) {
    controls.autoRotate = false;
    const from = camera.position.clone(), fromD = from.length();
    const to = ll2v(lat, lon, 1);
    const t0 = performance.now();
    return new Promise((done) => {
      (function step() {
        const k = Math.min(1, (performance.now() - t0) / ms), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        const dir = from.clone().normalize().lerp(to, e).normalize();
        camera.position.copy(dir.multiplyScalar(fromD + (dist - fromD) * e));
        camera.lookAt(0, 0, 0);
        if (k < 1) requestAnimationFrame(step); else done();
      })();
    });
  }

  return {
    THREE, scene, camera, controls, renderer, earth, ready, flyTo,
    get sun() { return sunInfo; },
    setTimeOffset(ms) { timeOffset = ms; sunInfo = updateSun(); },
    setStars(o) { starsOpacity = o; if (stars) stars.material.opacity = o; dirty = true; },
    redraw() { dirty = true; },
    get view() { const ll = v2ll(camera.position); return { lat: ll.lat, lon: ll.lon, dist: camera.position.length() }; },
    zoomTo(dist, ms = 600) { const d0 = camera.position.length(), t0 = performance.now(); controls.autoRotate = false; return new Promise((done) => { (function st() { const k = Math.min(1, (performance.now() - t0) / ms), e = 1 - Math.pow(1 - k, 3); camera.position.setLength(d0 + (dist - d0) * e); if (k < 1) requestAnimationFrame(st); else done(); })(); }); },
    onFrame(cb) { frameCb = cb; },
    project(lat, lon) { // position écran + visibilité (face cachée)
      const p = ll2v(lat, lon, 1.01), camDir = camera.position.clone().normalize();
      const facing = p.clone().normalize().dot(camDir);
      const v = p.project(camera), w = el.clientWidth, h = el.clientHeight;
      return { x: (v.x + 1) / 2 * w, y: (1 - v.y) / 2 * h, front: facing > 0.22, facing };
    },
    pick(clientX, clientY) {
      const r = renderer.domElement.getBoundingClientRect();
      const ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2((clientX - r.left) / r.width * 2 - 1, -(clientY - r.top) / r.height * 2 + 1), camera);
      const hit = ray.intersectObject(earth)[0]; return hit ? v2ll(hit.point) : null;
    },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); renderer.dispose(); el.removeChild(renderer.domElement); }
  };
}

// Fond selon l'heure locale du visiteur : la Terre reste entièrement visible, seul le décor change.
export function skyFor(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60;
  if (h >= 6 && h < 8.5) return { name: 'aube', stars: 0.15, bg: 'linear-gradient(180deg, #2c4b86 0%, #6a6f9e 55%, #e3a483 100%)' };
  if (h >= 8.5 && h < 17.5) return { name: 'jour', stars: 0, bg: 'linear-gradient(180deg, #3d77c4 0%, #5f97d8 50%, #a9c9ec 100%)' };
  if (h >= 17.5 && h < 19.5) return { name: 'crépuscule', stars: 0.25, bg: 'linear-gradient(180deg, #1d2d5c 0%, #5a4a7c 50%, #e08a5c 100%)' };
  return { name: 'nuit', stars: 0.9, bg: 'radial-gradient(120% 90% at 50% 40%, #142036 0%, #0a0f1a 70%)' };
}
