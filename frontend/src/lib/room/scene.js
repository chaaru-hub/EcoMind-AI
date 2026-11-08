// A cut-away 3D studio apartment with one animated object per device.
// Plain three.js, mounted by components/Room3D.jsx.
//
//   const room = createRoom(container, { onPick, onHover });
//   room.update(devices);   // [{ id, name, status }]
//   room.dispose();

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const COLORS = {
  floor: 0x2c2723,
  floorEdge: 0x1c1916,
  wall: 0x3a3a42,
  wallEdge: 0x1d1d22,
  rug: 0x34324a,
  wood: 0x5a4434,
  woodDark: 0x3d2f25,
  stone: 0xcfcac1,
  cabinet: 0x3a3a42,
  white: 0xe9e9ee,
  metal: 0xc4c8cf,
  black: 0x0d0d10,
  sofa: 0x47507a,
  blanket: 0x5b7cfa,
  linen: 0xdcd8d0,
  warm: 0xffc983,
  cool: 0x9fd8ff,
  green: 0x6ee7a0,
};

// ---------- small helpers ----------

function mat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.04, ...extra });
}

function glow(color) {
  return new THREE.MeshStandardMaterial({
    color: 0x111111,
    emissive: new THREE.Color(color),
    emissiveIntensity: 0,
    roughness: 0.4,
  });
}

function mesh(geometry, material, { shadow = true } = {}) {
  const m = new THREE.Mesh(geometry, material);
  m.castShadow = shadow;
  m.receiveShadow = true;
  return m;
}

// box whose position is given by its bottom-centre
function block(w, h, d, material, x, y, z, radius = 0.03) {
  const g = radius > 0 ? new RoundedBoxGeometry(w, h, d, 2, Math.min(radius, w / 2, h / 2, d / 2)) : new THREE.BoxGeometry(w, h, d);
  const m = mesh(g, material);
  m.position.set(x, y + h / 2, z);
  return m;
}

function cyl(rTop, rBottom, h, material, x, y, z, segments = 24) {
  const m = mesh(new THREE.CylinderGeometry(rTop, rBottom, h, segments), material);
  m.position.set(x, y + h / 2, z);
  return m;
}

const approach = (current, target, dt, speed = 4) =>
  current + (target - current) * (1 - Math.exp(-dt * speed));

// ---------- the room shell and furniture ----------

function buildRoom(scene) {
  const floorMat = mat(COLORS.floor, { roughness: 0.7 });
  const wallMat = mat(COLORS.wall, { roughness: 0.95 });

  // floor slab with a darker edge
  scene.add(block(10, 0.3, 8, mat(COLORS.floorEdge), 0, -0.3, 0, 0.02));
  const floor = mesh(new THREE.PlaneGeometry(10, 8), floorMat, { shadow: false });
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.001;
  scene.add(floor);

  // floorboards
  const seam = mat(0x24201c);
  for (let x = -4.5; x < 5; x += 0.8) {
    const line = mesh(new THREE.PlaneGeometry(0.015, 8), seam, { shadow: false });
    line.rotation.x = -Math.PI / 2;
    line.position.set(x, 0.002, 0);
    scene.add(line);
  }

  // back wall
  scene.add(block(10.3, 4.2, 0.25, wallMat, 0, 0, -4.12, 0.02));

  // left wall, built around a window (z 0.8..2.6, y 1.6..3.2)
  const wx = -5.12;
  scene.add(block(0.25, 4.2, 4.8, wallMat, wx, 0, -1.6, 0.02)); // z -4..0.8
  scene.add(block(0.25, 4.2, 1.4, wallMat, wx, 0, 3.3, 0.02)); // z 2.6..4
  scene.add(block(0.25, 1.6, 1.8, wallMat, wx, 0, 1.7, 0.02)); // below window
  scene.add(block(0.25, 1.0, 1.8, wallMat, wx, 3.2, 1.7, 0.02)); // above window

  // window frame and glass
  const frame = mat(COLORS.wallEdge);
  scene.add(block(0.3, 0.08, 1.8, frame, wx + 0.02, 1.56, 1.7, 0));
  scene.add(block(0.3, 0.08, 1.8, frame, wx + 0.02, 3.16, 1.7, 0));
  scene.add(block(0.3, 1.6, 0.06, frame, wx + 0.02, 1.6, 1.7, 0));
  const glass = mesh(
    new THREE.PlaneGeometry(1.8, 1.6),
    new THREE.MeshStandardMaterial({
      color: 0x0a1020,
      emissive: 0x23345c,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.55,
    }),
    { shadow: false }
  );
  glass.rotation.y = Math.PI / 2;
  glass.position.set(wx - 0.05, 2.4, 1.7);
  scene.add(glass);

  // skirting
  const skirt = mat(0x1a1a1e);
  scene.add(block(10, 0.12, 0.04, skirt, 0, 0, -3.98, 0));
  scene.add(block(0.04, 0.12, 8, skirt, -4.98, 0, 0, 0));

  // rug
  scene.add(block(3.6, 0.025, 2.6, mat(COLORS.rug, { roughness: 1 }), 1.6, 0, -1.6, 0.01));

  // sofa facing the TV
  const sofaMat = mat(COLORS.sofa, { roughness: 0.95 });
  scene.add(block(2.5, 0.42, 0.95, sofaMat, 1.6, 0, -0.55, 0.08));
  scene.add(block(2.5, 0.62, 0.24, sofaMat, 1.6, 0.3, -0.12, 0.08));
  scene.add(block(0.24, 0.62, 0.95, sofaMat, 0.4, 0, -0.55, 0.08));
  scene.add(block(0.24, 0.62, 0.95, sofaMat, 2.8, 0, -0.55, 0.08));
  scene.add(block(0.5, 0.14, 0.5, mat(0xefe08c), 0.85, 0.42, -0.5, 0.06)); // cushion

  // coffee table
  scene.add(block(1.1, 0.06, 0.6, mat(COLORS.wood), 1.6, 0.36, -1.75, 0.02));
  scene.add(cyl(0.04, 0.04, 0.36, mat(COLORS.woodDark), 1.6, 0, -1.75));

  // TV cabinet
  scene.add(block(2.8, 0.48, 0.5, mat(COLORS.woodDark), 1.6, 0, -3.7, 0.03));

  // kitchen counter along the left wall + wall cabinets
  scene.add(block(1.1, 0.95, 2.6, mat(COLORS.cabinet), -4.4, 0, -1.75, 0.02));
  scene.add(block(1.18, 0.06, 2.66, mat(COLORS.stone, { roughness: 0.5 }), -4.42, 0.95, -1.75, 0.01));
  scene.add(block(0.55, 0.75, 2.6, mat(COLORS.cabinet), -4.72, 2.75, -1.75, 0.02));

  // bed against the left wall, under the window
  scene.add(block(0.12, 0.95, 1.7, mat(COLORS.woodDark), -4.92, 0, 1.75, 0.03));
  scene.add(block(2.3, 0.32, 1.7, mat(COLORS.wood), -3.75, 0, 1.75, 0.04));
  scene.add(block(2.2, 0.22, 1.6, mat(COLORS.linen, { roughness: 1 }), -3.8, 0.32, 1.75, 0.08));
  scene.add(block(1.45, 0.06, 1.66, mat(COLORS.blanket, { roughness: 1 }), -3.3, 0.52, 1.75, 0.03));
  scene.add(block(0.4, 0.14, 0.62, mat(0xf3f3f5, { roughness: 1 }), -4.55, 0.54, 1.33, 0.07));
  scene.add(block(0.4, 0.14, 0.62, mat(0xf3f3f5, { roughness: 1 }), -4.55, 0.54, 2.17, 0.07));

  // bedside table
  scene.add(block(0.55, 0.52, 0.5, mat(COLORS.woodDark), -4.62, 0, 0.45, 0.03));

  // desk + chair
  const deskMat = mat(COLORS.wood);
  scene.add(block(1.9, 0.06, 0.8, deskMat, 4.0, 0.76, -3.55, 0.02));
  for (const [x, z] of [[3.12, -3.9], [4.88, -3.9], [3.12, -3.2], [4.88, -3.2]]) {
    scene.add(block(0.05, 0.76, 0.05, mat(COLORS.black), x, 0, z, 0));
  }
  const chair = mat(0x2a2a30);
  scene.add(cyl(0.3, 0.3, 0.08, chair, 3.75, 0.48, -2.65));
  scene.add(cyl(0.03, 0.03, 0.48, mat(COLORS.metal), 3.75, 0, -2.65));
  scene.add(block(0.6, 0.6, 0.08, chair, 3.75, 0.56, -2.3, 0.04));

  // plant
  scene.add(cyl(0.22, 0.17, 0.42, mat(0xd8d2c4), 4.45, 0, -1.5));
  const leaves = mat(0x3f7d57, { roughness: 1 });
  for (const [x, y, z, r] of [[4.45, 0.75, -1.5, 0.32], [4.3, 0.98, -1.4, 0.22], [4.6, 0.95, -1.62, 0.2]]) {
    const s = mesh(new THREE.IcosahedronGeometry(r, 1), leaves);
    s.position.set(x, y, z);
    scene.add(s);
  }
}

// ---------- devices ----------
// Each builder returns { group, light?, animate(level, t, dt) }.
// `level` eases between 0 (off) and 1 (on).

function pendant(x, z, { shadeColor, dome = false, intensity }) {
  const group = new THREE.Group();
  group.add(cyl(0.012, 0.012, 1.0, mat(COLORS.black), x, 3.2, z, 8));
  group.add(cyl(0.12, 0.12, 0.03, mat(COLORS.black), x, 4.17, z, 16));

  const shadeGeo = dome
    ? new THREE.SphereGeometry(0.34, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2)
    : new THREE.CylinderGeometry(0.12, 0.4, 0.34, 28, 1, true);
  const shade = mesh(shadeGeo, mat(shadeColor, { side: THREE.DoubleSide, roughness: 0.6 }));
  shade.position.set(x, dome ? 2.9 : 3.03, z);
  group.add(shade);

  const bulbMat = glow(COLORS.warm);
  const bulb = mesh(new THREE.SphereGeometry(0.1, 16, 12), bulbMat, { shadow: false });
  bulb.position.set(x, 2.88, z);
  group.add(bulb);

  const light = new THREE.PointLight(COLORS.warm, 0, 14, 1.25);
  light.position.set(x, 2.75, z);

  return {
    group,
    light,
    animate(level) {
      bulbMat.emissiveIntensity = 0.15 + level * 3.5;
      light.intensity = level * intensity;
    },
  };
}

function bedsideLamp() {
  const x = -4.62, z = 0.45, y = 0.52;
  const group = new THREE.Group();
  group.add(cyl(0.11, 0.13, 0.05, mat(COLORS.black), x, y, z));
  group.add(cyl(0.015, 0.015, 0.36, mat(COLORS.metal), x, y + 0.05, z, 8));
  const shadeMat = new THREE.MeshStandardMaterial({
    color: 0xe8dcc5,
    emissive: new THREE.Color(COLORS.warm),
    emissiveIntensity: 0,
    side: THREE.DoubleSide,
    roughness: 0.9,
  });
  const shade = mesh(new THREE.CylinderGeometry(0.15, 0.22, 0.26, 24, 1, true), shadeMat);
  shade.position.set(x, y + 0.48, z);
  group.add(shade);

  const light = new THREE.PointLight(COLORS.warm, 0, 6, 1.8);
  light.position.set(x + 0.15, y + 0.5, z + 0.1);

  return {
    group,
    light,
    animate(level) {
      shadeMat.emissiveIntensity = level * 1.4;
      light.intensity = level * 11;
    },
  };
}

function airConditioner() {
  const x = -1.1, y = 3.15, z = -3.82;
  const group = new THREE.Group();
  group.add(block(1.6, 0.46, 0.3, mat(COLORS.white, { roughness: 0.4 }), x, y, z, 0.08));

  const louver = mesh(new THREE.BoxGeometry(1.4, 0.04, 0.12), mat(0xcfd0d6));
  const hinge = new THREE.Group();
  hinge.position.set(x, y + 0.04, z + 0.15);
  louver.position.set(0, 0, 0.05);
  hinge.add(louver);
  group.add(hinge);

  const ledMat = glow(COLORS.green);
  const led = mesh(new THREE.SphereGeometry(0.022, 8, 8), ledMat, { shadow: false });
  led.position.set(x + 0.68, y + 0.36, z + 0.16);
  group.add(led);

  // cool air: drifting points
  const COUNT = 70;
  const seeds = Array.from({ length: COUNT }, () => ({
    x: (Math.random() - 0.5) * 1.3,
    phase: Math.random(),
    speed: 0.25 + Math.random() * 0.25,
    sway: Math.random() * Math.PI * 2,
  }));
  const positions = new Float32Array(COUNT * 3);
  const airGeo = new THREE.BufferGeometry();
  airGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const airMat = new THREE.PointsMaterial({
    color: COLORS.cool,
    size: 0.06,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const air = new THREE.Points(airGeo, airMat);
  group.add(air);

  return {
    group,
    animate(level, t, dt) {
      hinge.rotation.x = -0.15 - level * (0.45 + Math.sin(t * 0.8) * 0.2);
      ledMat.emissiveIntensity = level * 3;
      airMat.opacity = level * 0.7;
      seeds.forEach((s, i) => {
        s.phase = (s.phase + dt * s.speed * (0.3 + level)) % 1;
        const p = s.phase;
        positions[i * 3] = x + s.x + Math.sin(s.sway + t) * 0.05;
        positions[i * 3 + 1] = y - p * 1.6;
        positions[i * 3 + 2] = z + 0.25 + p * 1.8;
      });
      airGeo.attributes.position.needsUpdate = true;
    },
  };
}

function ceilingFan() {
  const x = -1.3, z = 1.2;
  const group = new THREE.Group();
  group.add(cyl(0.02, 0.02, 0.45, mat(COLORS.black), x, 3.75, z, 8));
  group.add(cyl(0.16, 0.13, 0.16, mat(0x2e2e34), x, 3.62, z));

  const rotor = new THREE.Group();
  rotor.position.set(x, 3.66, z);
  const bladeMat = mat(COLORS.wood, { roughness: 0.6 });
  for (let i = 0; i < 4; i++) {
    const arm = new THREE.Group();
    arm.rotation.y = (i * Math.PI) / 2;
    const blade = mesh(new RoundedBoxGeometry(1.0, 0.025, 0.22, 2, 0.01), bladeMat);
    blade.position.x = 0.65;
    blade.rotation.x = 0.12;
    arm.add(blade);
    rotor.add(arm);
  }
  group.add(rotor);

  return {
    group,
    animate(level, t, dt) {
      rotor.rotation.y += dt * level * 7;
    },
  };
}

function screenTexture(draw) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 144;
  const ctx = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  let last = -1;
  return {
    texture,
    tick(t) {
      if (t - last < 1 / 20) return; // 20 fps is plenty for a screen
      last = t;
      draw(ctx, canvas.width, canvas.height, t);
      texture.needsUpdate = true;
    },
  };
}

function smartTv() {
  const x = 1.6, y = 1.15, z = -3.95;
  const group = new THREE.Group();
  group.add(block(2.3, 1.32, 0.07, mat(COLORS.black, { roughness: 0.3 }), x, y, z, 0.02));

  // an abstract "nature documentary": drifting hills under a moving sky
  const screen = screenTexture((c, w, h, t) => {
    const sky = c.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, `hsl(${210 + Math.sin(t * 0.3) * 20}, 70%, 55%)`);
    sky.addColorStop(1, `hsl(${30 + Math.sin(t * 0.3) * 15}, 85%, 70%)`);
    c.fillStyle = sky;
    c.fillRect(0, 0, w, h);
    c.fillStyle = "rgba(255,240,200,0.9)";
    c.beginPath();
    c.arc(w * 0.72, h * 0.32 + Math.sin(t * 0.4) * 6, 14, 0, Math.PI * 2);
    c.fill();
    const hills = ["#2f6b4f", "#24543e", "#183a2c"];
    hills.forEach((color, i) => {
      c.fillStyle = color;
      c.beginPath();
      c.moveTo(0, h);
      for (let px = 0; px <= w; px += 8) {
        const py = h * (0.55 + i * 0.12) + Math.sin(px * 0.03 + t * (0.4 + i * 0.3) + i) * (10 - i * 2);
        c.lineTo(px, py);
      }
      c.lineTo(w, h);
      c.fill();
    });
  });
  const screenMat = new THREE.MeshStandardMaterial({
    color: 0x050507,
    emissive: 0xffffff,
    emissiveMap: screen.texture,
    emissiveIntensity: 0,
    roughness: 0.25,
    metalness: 0.1,
  });
  const panel = mesh(new THREE.PlaneGeometry(2.2, 1.22), screenMat, { shadow: false });
  panel.position.set(x, y + 0.66, z + 0.04);
  group.add(panel);

  const light = new THREE.PointLight(0x9fb8ff, 0, 5, 1.8);
  light.position.set(x, y + 0.6, z + 0.8);

  return {
    group,
    light,
    animate(level, t) {
      if (level > 0.01) screen.tick(t);
      screenMat.emissiveIntensity = level * 1.15;
      light.intensity = level * 3 * (0.85 + Math.sin(t * 2.3) * 0.15);
    },
    dispose() {
      screen.texture.dispose();
    },
  };
}

function router() {
  const x = 2.65, y = 0.48, z = -3.65;
  const group = new THREE.Group();
  group.add(block(0.46, 0.08, 0.3, mat(0x1d1d22, { roughness: 0.4 }), x, y, z, 0.02));
  for (const dx of [-0.17, 0.17]) {
    const ant = cyl(0.015, 0.015, 0.32, mat(0x1d1d22), x + dx, y + 0.06, z - 0.12, 8);
    ant.rotation.z = dx > 0 ? -0.15 : 0.15;
    group.add(ant);
  }
  const leds = [0, 1, 2].map((i) => {
    const m = glow(COLORS.green);
    const led = mesh(new THREE.BoxGeometry(0.04, 0.015, 0.01), m, { shadow: false });
    led.position.set(x - 0.08 + i * 0.08, y + 0.045, z + 0.152);
    group.add(led);
    return m;
  });
  const rings = [0, 1].map(() => {
    const m = new THREE.MeshBasicMaterial({
      color: COLORS.green,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.22, 40, 1, Math.PI * 0.15, Math.PI * 0.7), m);
    ring.position.set(x, y + 0.2, z);
    group.add(ring);
    return { ring, m };
  });

  return {
    group,
    animate(level, t) {
      leds.forEach((m, i) => {
        const blink = Math.sin(t * (5 + i * 3.1) + i) > -0.2 ? 1 : 0.15;
        m.emissiveIntensity = level * 2.5 * blink;
      });
      rings.forEach(({ ring, m }, i) => {
        const p = (t * 0.6 + i * 0.5) % 1;
        ring.scale.setScalar(0.6 + p * 1.8);
        m.opacity = level * (1 - p) * 0.8;
      });
    },
  };
}

function gamingPc() {
  const group = new THREE.Group();
  const x = 4.62, y = 0.82, z = -3.55;

  // tower with a glass side
  group.add(block(0.3, 0.62, 0.58, mat(0x141417, { roughness: 0.35 }), x, y, z, 0.02));
  const rgbMats = [];
  for (let i = 0; i < 3; i++) {
    const m = glow(0xff00ff);
    const fan = mesh(new THREE.TorusGeometry(0.075, 0.012, 8, 24), m, { shadow: false });
    fan.position.set(x, y + 0.14 + i * 0.17, z + 0.295);
    group.add(fan);
    rgbMats.push(m);
  }
  const stripMat = glow(0x00ffff);
  const strip = mesh(new THREE.BoxGeometry(0.012, 0.56, 0.012), stripMat, { shadow: false });
  strip.position.set(x - 0.16, y + 0.31, z + 0.29);
  group.add(strip);
  rgbMats.push(stripMat);

  // monitor
  const mx = 3.95;
  group.add(block(0.22, 0.02, 0.16, mat(COLORS.black), mx, y, -3.7, 0.01));
  group.add(block(0.04, 0.24, 0.04, mat(COLORS.black), mx, y, -3.75, 0));
  group.add(block(1.0, 0.58, 0.04, mat(COLORS.black, { roughness: 0.3 }), mx, y + 0.22, -3.73, 0.02));
  const monitor = screenTexture((c, w, h, t) => {
    c.fillStyle = "#0b1030";
    c.fillRect(0, 0, w, h);
    // a scrolling neon racetrack
    for (let i = 0; i < 12; i++) {
      const p = ((i / 12 + t * 0.35) % 1);
      const yy = h * 0.45 + p * p * h * 0.55;
      const half = 10 + p * p * w * 0.6;
      c.strokeStyle = `hsla(${(t * 60 + i * 20) % 360}, 90%, 60%, ${0.25 + p * 0.75})`;
      c.lineWidth = 1 + p * 3;
      c.beginPath();
      c.moveTo(w / 2 - half, yy);
      c.lineTo(w / 2 + half, yy);
      c.stroke();
    }
    c.fillStyle = "#ff5d8f";
    c.fillRect(w / 2 - 10 + Math.sin(t * 2) * 30, h * 0.8, 20, 10);
  });
  const monitorMat = new THREE.MeshStandardMaterial({
    color: 0x050507,
    emissive: 0xffffff,
    emissiveMap: monitor.texture,
    emissiveIntensity: 0,
    roughness: 0.3,
  });
  const screen = mesh(new THREE.PlaneGeometry(0.94, 0.52), monitorMat, { shadow: false });
  screen.position.set(mx, y + 0.51, -3.705);
  group.add(screen);

  const light = new THREE.PointLight(0xb46bff, 0, 3.5, 1.8);
  light.position.set(4.3, 1.4, -3.0);

  const color = new THREE.Color();
  return {
    group,
    light,
    animate(level, t) {
      if (level > 0.01) monitor.tick(t);
      monitorMat.emissiveIntensity = level * 1.1;
      rgbMats.forEach((m, i) => {
        color.setHSL(((t * 0.15 + i * 0.12) % 1), 0.9, 0.55);
        m.emissive.copy(color);
        m.emissiveIntensity = level * 2.8;
      });
      color.setHSL((t * 0.15) % 1, 0.8, 0.6);
      light.color.copy(color);
      light.intensity = level * 2.5;
    },
    dispose() {
      monitor.texture.dispose();
    },
  };
}

function laptop() {
  const x = 3.3, y = 0.82, z = -3.35;
  const group = new THREE.Group();
  const shell = mat(0xb9bcc4, { metalness: 0.4, roughness: 0.35 });
  group.add(block(0.52, 0.025, 0.36, shell, x, y, z, 0.01));

  const hinge = new THREE.Group();
  hinge.position.set(x, y + 0.025, z - 0.17);
  hinge.rotation.x = -0.32;
  const lid = mesh(new RoundedBoxGeometry(0.52, 0.34, 0.018, 2, 0.008), shell);
  lid.position.set(0, 0.17, 0);
  hinge.add(lid);
  const screenMat = glow(0xcfe0ff);
  const screen = mesh(new THREE.PlaneGeometry(0.46, 0.28), screenMat, { shadow: false });
  screen.position.set(0, 0.17, 0.011);
  hinge.add(screen);
  group.add(hinge);

  return {
    group,
    animate(level, t) {
      screenMat.emissiveIntensity = level * (1.3 + Math.sin(t * 0.7) * 0.05);
    },
  };
}

function fridge() {
  const x = -4.45, z = -3.5;
  const group = new THREE.Group();
  const body = mat(COLORS.metal, { metalness: 0.35, roughness: 0.4 });
  group.add(block(0.95, 2.15, 0.85, body, x, 0, z, 0.05));
  group.add(block(0.97, 0.02, 0.02, mat(0x8a8d94), x, 1.42, z + 0.43, 0)); // door split
  group.add(block(0.04, 0.5, 0.04, mat(0x8a8d94), x + 0.36, 1.6, z + 0.45, 0.01));
  group.add(block(0.04, 0.5, 0.04, mat(0x8a8d94), x + 0.36, 0.8, z + 0.45, 0.01));

  const panelMat = glow(0x6fd6ff);
  const panel = mesh(new THREE.PlaneGeometry(0.22, 0.12), panelMat, { shadow: false });
  panel.position.set(x - 0.15, 1.72, z + 0.432);
  group.add(panel);

  return {
    group,
    animate(level, t) {
      panelMat.emissiveIntensity = level * (2.2 + Math.sin(t * 1.5) * 0.3);
    },
  };
}

function washingMachine() {
  const x = -3.25, z = -3.55;
  const group = new THREE.Group();
  const body = new THREE.Group();
  body.add(block(0.85, 0.92, 0.75, mat(COLORS.white, { roughness: 0.45 }), 0, 0, 0, 0.05));
  body.add(block(0.85, 0.12, 0.02, mat(0xcfd0d6), 0, 0.78, 0.37, 0));

  const ledMat = glow(COLORS.green);
  const led = mesh(new THREE.CircleGeometry(0.02, 12), ledMat, { shadow: false });
  led.position.set(0.3, 0.84, 0.385);
  body.add(led);

  const door = mesh(new THREE.TorusGeometry(0.25, 0.04, 12, 32), mat(0xb7b9c0, { metalness: 0.5, roughness: 0.3 }));
  door.position.set(0, 0.42, 0.39);
  body.add(door);

  // drum with clothes, seen through the glass
  const drum = new THREE.Group();
  drum.position.set(0, 0.42, 0.37);
  drum.add(mesh(new THREE.CircleGeometry(0.24, 32), mat(0x2b3140), { shadow: false }));
  const clothes = [0x5b7cfa, 0xf39b9b, 0xefe08c];
  clothes.forEach((c, i) => {
    const blob = mesh(new THREE.SphereGeometry(0.07, 10, 8), mat(c, { roughness: 1 }), { shadow: false });
    const a = (i / clothes.length) * Math.PI * 2;
    blob.position.set(Math.cos(a) * 0.12, Math.sin(a) * 0.12, 0.01);
    blob.scale.z = 0.3;
    drum.add(blob);
  });
  body.add(drum);

  const glass = mesh(
    new THREE.CircleGeometry(0.24, 32),
    new THREE.MeshStandardMaterial({ color: 0x9fb4d8, transparent: true, opacity: 0.25, roughness: 0.05 }),
    { shadow: false }
  );
  glass.position.set(0, 0.42, 0.395);
  body.add(glass);

  body.position.set(x, 0, z);
  group.add(body);

  return {
    group,
    animate(level, t, dt) {
      drum.rotation.z -= dt * level * 9;
      ledMat.emissiveIntensity = level * 3;
      body.position.x = x + Math.sin(t * 40) * 0.006 * level;
    },
  };
}

function microwave() {
  const x = -4.45, y = 1.01, z = -1.0;
  const group = new THREE.Group();
  group.add(block(0.5, 0.4, 0.72, mat(0x2b2b31, { roughness: 0.4 }), x, y, z, 0.03));

  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x0b0b0d,
    emissive: new THREE.Color(0xffb052),
    emissiveIntensity: 0,
    roughness: 0.2,
  });
  const win = mesh(new THREE.PlaneGeometry(0.46, 0.28), windowMat, { shadow: false });
  win.rotation.y = Math.PI / 2;
  win.position.set(x + 0.252, y + 0.2, z - 0.07);
  group.add(win);

  const clockMat = glow(COLORS.green);
  const clock = mesh(new THREE.PlaneGeometry(0.12, 0.05), clockMat, { shadow: false });
  clock.rotation.y = Math.PI / 2;
  clock.position.set(x + 0.252, y + 0.3, z + 0.25);
  group.add(clock);

  const light = new THREE.PointLight(0xffb052, 0, 2.2, 2);
  light.position.set(x + 0.6, y + 0.2, z - 0.07);

  return {
    group,
    light,
    animate(level, t) {
      const hum = 0.9 + Math.sin(t * 9) * 0.1;
      windowMat.emissiveIntensity = level * 1.6 * hum;
      clockMat.emissiveIntensity = level * 2.4;
      light.intensity = level * 1.4 * hum;
    },
  };
}

// device id (from backend/data/devices.json) -> builder
const BUILDERS = {
  1: () => pendant(1.6, -1.3, { shadeColor: 0xe6dfd0, intensity: 30 }), // Living Room Light
  2: bedsideLamp, // Bedroom Light
  3: () => pendant(-3.75, -1.9, { shadeColor: 0x2f2f35, dome: true, intensity: 24 }), // Kitchen Light
  4: airConditioner,
  5: ceilingFan,
  6: smartTv,
  7: gamingPc,
  8: laptop,
  9: fridge,
  10: washingMachine,
  11: microwave,
  12: router,
};

// ---------- public API ----------

export function createRoom(container, { onPick, onHover } = {}) {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = "room-canvas";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const target = new THREE.Vector3(-0.2, 1.3, -0.6);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(target);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minPolarAngle = 0.55;
  controls.maxPolarAngle = 1.32;
  controls.minAzimuthAngle = 0.12;
  controls.maxAzimuthAngle = 1.45;
  controls.rotateSpeed = 0.6;

  // base lighting: dim night-time room with moonlight through the window
  // ambient brightens as more of the three room lights are on
  const NIGHT_SKY = new THREE.Color(0x8b97c4);
  const WARM_SKY = new THREE.Color(0xc9b494);
  const ambient = new THREE.HemisphereLight(NIGHT_SKY, 0x1b1714, 0.5);
  scene.add(ambient);
  const moon = new THREE.DirectionalLight(0x9fb4ff, 2.1);
  moon.position.set(-14, 7, 3.5);
  moon.target.position.set(-2, 0, 1.5);
  moon.castShadow = true;
  moon.shadow.mapSize.set(1024, 1024);
  moon.shadow.camera.left = -8;
  moon.shadow.camera.right = 8;
  moon.shadow.camera.top = 8;
  moon.shadow.camera.bottom = -8;
  moon.shadow.bias = -0.0008;
  scene.add(moon, moon.target);
  const fill = new THREE.DirectionalLight(0xffffff, 0.25);
  fill.position.set(8, 9, 10);
  scene.add(fill);

  buildRoom(scene);

  const devices = new Map(); // id -> { ctl, level, target, name, status }
  const pickables = [];
  for (const [id, build] of Object.entries(BUILDERS)) {
    const ctl = build();
    ctl.group.traverse((o) => {
      if (o.isMesh) {
        o.userData.deviceId = Number(id);
        pickables.push(o);
      }
    });
    scene.add(ctl.group);
    if (ctl.light) scene.add(ctl.light);
    devices.set(Number(id), { ctl, level: 0, target: 0, name: "", status: "OFF", known: false, hover: 0 });
  }

  // ---- sizing: keep the whole room in frame at any aspect ratio ----
  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const distance = 17 * Math.max(1, 1.55 / camera.aspect);
    const dir = new THREE.Vector3(0.68, 0.5, 0.78).normalize();
    if (!resize.done) {
      camera.position.copy(target).addScaledVector(dir, distance);
      resize.done = true;
    } else {
      const current = camera.position.clone().sub(target).normalize();
      camera.position.copy(target).addScaledVector(current, distance);
    }
    controls.minDistance = distance * 0.6;
    controls.maxDistance = distance * 1.25;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  // ---- picking: click toggles, hover shows a label ----
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;
  let downAt = null;

  function pick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(pickables, false)[0];
    const id = hit?.object.userData.deviceId;
    return id && devices.get(id)?.known ? id : null;
  }

  function onMove(event) {
    const id = pick(event);
    hovered = id;
    renderer.domElement.style.cursor = id ? "pointer" : "grab";
    if (onHover) {
      const rect = container.getBoundingClientRect();
      const d = id && devices.get(id);
      onHover(
        d ? { id, name: d.name, status: d.status, x: event.clientX - rect.left, y: event.clientY - rect.top } : null
      );
    }
  }
  function onLeave() {
    hovered = null;
    onHover?.(null);
  }
  function onDown(event) {
    downAt = { x: event.clientX, y: event.clientY };
  }
  function onUp(event) {
    if (!downAt) return;
    const moved = Math.hypot(event.clientX - downAt.x, event.clientY - downAt.y);
    downAt = null;
    if (moved > 6) return; // that was a drag to look around
    const id = pick(event);
    if (id) onPick?.(id);
  }
  const el = renderer.domElement;
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);
  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointerup", onUp);

  // ---- render loop, paused while off-screen ----
  const clock = new THREE.Clock();
  let raf = 0;
  let visible = true;
  let t = 0;

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    t += reduceMotion ? 0 : dt;
    for (const [id, d] of devices) {
      d.level = reduceMotion ? d.target : approach(d.level, d.target, dt, 3.5);
      d.hover = approach(d.hover, hovered === id ? 1 : 0, dt, 12);
      d.ctl.group.scale.setScalar(1 + d.hover * 0.025);
      d.ctl.animate(d.level, t, reduceMotion ? 0 : dt);
    }
    const lit = (devices.get(1).level + devices.get(2).level * 0.6 + devices.get(3).level) / 2.6;
    ambient.intensity = 0.75 + lit * 0.7;
    ambient.color.copy(NIGHT_SKY).lerp(WARM_SKY, lit);
    controls.update();
    renderer.render(scene, camera);
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf) {
      clock.getDelta();
      frame();
    } else if (!visible && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  io.observe(container);
  frame();

  return {
    update(list) {
      for (const dev of list) {
        const d = devices.get(Number(dev.id));
        if (!d) continue;
        const first = !d.known;
        d.known = true;
        d.name = dev.name;
        d.status = dev.status;
        d.target = dev.status === "ON" ? 1 : 0;
        if (first) d.level = d.target; // no fade on first paint
      }
      // devices that aren't in the list stay dark
    },
    dispose() {
      cancelAnimationFrame(raf);
      raf = 0;
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      controls.dispose();
      for (const d of devices.values()) d.ctl.dispose?.();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) [].concat(o.material).forEach((m) => m.dispose());
      });
      renderer.dispose();
      el.remove();
    },
  };
}
