// Built-in HTML5 Canvas game engines that run with 0% lag, 100% offline-ready, zero external redirects

export function getEscapeRoadBuiltInHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Escape Road - High Speed Pursuit</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; user-select:none; }
  body { background:#0a0e17; color:#fff; font-family:system-ui, -apple-system, sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
  canvas { background:#111625; border:2px solid #00f0ff; border-radius:12px; box-shadow:0 0 30px rgba(0,240,255,0.25); max-width:96vw; max-height:82vh; }
  #hud { position:absolute; top:20px; display:flex; gap:20px; font-weight:bold; font-size:16px; text-shadow:0 2px 4px #000; }
  .badge { background:rgba(0,0,0,0.7); padding:6px 14px; border-radius:8px; border:1px solid rgba(255,255,255,0.15); }
  #msg { position:absolute; color:#ff0055; font-size:28px; font-weight:900; text-align:center; display:none; text-shadow:0 0 20px #ff0055; }
  #controls { position:absolute; bottom:12px; font-size:12px; color:#8892b0; letter-spacing:1px; }
</style>
</head>
<body>
<div id="hud">
  <div class="badge" style="color:#00f0ff">DISTANCE: <span id="dist">0</span>m</div>
  <div class="badge" style="color:#ffcc00">WANTED LEVEL: <span id="stars">★★★☆☆</span></div>
  <div class="badge" style="color:#ff3366">SPEED: <span id="spd">110</span> MPH</div>
</div>
<div id="msg">BUSTED!<br><span style="font-size:15px;color:#fff;font-weight:400">Press SPACEBAR or CLICK to Retry Pursuit</span></div>
<canvas id="cv" width="800" height="600"></canvas>
<div id="controls">← → / A D : STEER | ↑ / W : NITRO ACCEL | SPACEBAR : EMERGENCY HANDBRAKE DRIFT</div>
<script>
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const distEl = document.getElementById('dist');
const spdEl = document.getElementById('spd');
const msgEl = document.getElementById('msg');

let car = { x: 400, y: 460, w: 42, h: 74, angle: 0, speed: 7, drift: 0 };
let police = [];
let obstacles = [];
let distance = 0;
let gameOver = false;
let keys = {};
let frame = 0;

window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === ' ' && gameOver) resetGame();
});
window.addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
});
cv.addEventListener('pointerdown', () => {
  if (gameOver) resetGame();
});

function resetGame() {
  car = { x: 400, y: 460, w: 42, h: 74, angle: 0, speed: 7, drift: 0 };
  police = [];
  obstacles = [];
  distance = 0;
  gameOver = false;
  msgEl.style.display = 'none';
}

function spawnPolice() {
  if (police.length < 5 && Math.random() < 0.04) {
    police.push({
      x: car.x + (Math.random() - 0.5) * 300,
      y: -100,
      w: 40,
      h: 70,
      speed: 6.5 + Math.random() * 2,
      color: '#ff2244',
      siren: 0
    });
  }
}

function spawnObstacle() {
  if (obstacles.length < 6 && Math.random() < 0.03) {
    obstacles.push({
      x: 180 + Math.random() * 440,
      y: -100,
      w: 46,
      h: 46,
      type: Math.random() > 0.5 ? 'barricade' : 'civilian'
    });
  }
}

function update() {
  if (gameOver) return;
  frame++;
  distance += Math.round(car.speed);
  distEl.innerText = distance;
  spdEl.innerText = Math.round(car.speed * 16);

  // Steering
  if (keys['arrowleft'] || keys['a']) {
    car.x -= 6;
    car.angle = -0.15;
  } else if (keys['arrowright'] || keys['d']) {
    car.x += 6;
    car.angle = 0.15;
  } else {
    car.angle *= 0.8;
  }

  // Speed
  if (keys['arrowup'] || keys['w']) {
    car.speed = Math.min(13, car.speed + 0.1);
  } else if (keys['arrowdown'] || keys['s']) {
    car.speed = Math.max(4, car.speed - 0.2);
  } else {
    car.speed = 8;
  }

  // Handbrake
  if (keys[' ']) {
    car.drift = 1;
    car.speed = Math.max(5, car.speed * 0.98);
  } else {
    car.drift = 0;
  }

  // Clamp within road boundaries
  car.x = Math.max(160, Math.min(640, car.x));

  spawnPolice();
  spawnObstacle();

  // Move police
  for (let i = police.length - 1; i >= 0; i--) {
    let p = police[i];
    p.y += (car.speed - p.speed) + 4;
    p.siren = (p.siren + 1) % 20;

    // AI steering toward player
    if (p.x < car.x - 5) p.x += 2;
    else if (p.x > car.x + 5) p.x -= 2;

    // Collision check
    if (Math.abs(p.x - car.x) < 36 && Math.abs(p.y - car.y) < 65) {
      gameOver = true;
      msgEl.style.display = 'block';
    }

    if (p.y > 700 || p.y < -200) police.splice(i, 1);
  }

  // Move obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
    o.y += car.speed + 2;

    if (Math.abs(o.x - car.x) < 38 && Math.abs(o.y - car.y) < 55) {
      gameOver = true;
      msgEl.style.display = 'block';
    }

    if (o.y > 700) obstacles.splice(i, 1);
  }
}

function draw() {
  ctx.clearRect(0, 0, 800, 600);

  // Asphalt road
  ctx.fillStyle = '#141a29';
  ctx.fillRect(140, 0, 520, 600);

  // Sidewalk grass / buildings
  ctx.fillStyle = '#0b0f19';
  ctx.fillRect(0, 0, 140, 600);
  ctx.fillRect(660, 0, 140, 600);

  // Lane markers moving
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 4;
  ctx.setLineDash([25, 25]);
  ctx.lineDashOffset = -(frame * car.speed) % 50;

  ctx.beginPath();
  ctx.moveTo(310, 0); ctx.lineTo(310, 600);
  ctx.moveTo(490, 0); ctx.lineTo(490, 600);
  ctx.stroke();
  ctx.setLineDash([]);

  // Road borders
  ctx.strokeStyle = '#ff0055';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(140, 0); ctx.lineTo(140, 600);
  ctx.moveTo(660, 0); ctx.lineTo(660, 600);
  ctx.stroke();

  // Draw obstacles
  obstacles.forEach(o => {
    ctx.fillStyle = o.type === 'barricade' ? '#ffaa00' : '#8855ff';
    ctx.fillRect(o.x - o.w/2, o.y - o.h/2, o.w, o.h);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(o.x - o.w/2, o.y - o.h/2, o.w, o.h);
  });

  // Draw police cars
  police.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.fillStyle = '#1a1f36';
    ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-p.w/2 + 4, -p.h/2 + 20, p.w - 8, 30);
    // Siren
    ctx.fillStyle = p.siren < 10 ? '#ff0033' : '#0066ff';
    ctx.fillRect(-10, -5, 20, 8);
    ctx.restore();
  });

  // Draw player getaway muscle car
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);
  
  // Neon shadow
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = car.drift ? 25 : 12;

  // Car body
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(-car.w/2, -car.h/2, car.w, car.h);
  // Roof / windshield
  ctx.fillStyle = '#051025';
  ctx.fillRect(-car.w/2 + 5, -car.h/2 + 18, car.w - 10, 36);
  // Headlights
  ctx.fillStyle = '#ffea00';
  ctx.fillRect(-car.w/2 + 4, -car.h/2, 8, 6);
  ctx.fillRect(car.w/2 - 12, -car.h/2, 8, 6);
  // Tail lights
  ctx.fillStyle = '#ff0055';
  ctx.fillRect(-car.w/2 + 4, car.h/2 - 5, 8, 5);
  ctx.fillRect(car.w/2 - 12, car.h/2 - 5, 8, 5);

  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>`;
}

export function getNitroLeagueBuiltInHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Nitro League 3D</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#030712; color:#fff; font-family:system-ui; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
  canvas { background:#0f172a; border:2px solid #a855f7; border-radius:12px; box-shadow:0 0 35px rgba(168,85,247,0.3); max-width:96vw; max-height:82vh; }
  #hud { position:absolute; top:18px; display:flex; gap:16px; font-weight:bold; }
  .box { background:rgba(15,23,42,0.8); padding:8px 16px; border-radius:8px; border:1px solid #a855f7; }
</style>
</head>
<body>
<div id="hud">
  <div class="box" style="color:#a855f7">SPEED: <span id="spd">120</span> MPH</div>
  <div class="box" style="color:#38bdf8">NITRO GAUGE: <span id="nitro">100</span>%</div>
  <div class="box" style="color:#f59e0b">LAP TIME: <span id="time">0:00</span></div>
</div>
<canvas id="cv" width="800" height="600"></canvas>
<script>
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
let speed = 8, nitro = 100, playerX = 400, angle = 0, keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

let f = 0;
function loop() {
  f++;
  if (keys['a'] || keys['arrowleft']) { playerX -= 6; angle = -0.15; }
  else if (keys['d'] || keys['arrowright']) { playerX += 6; angle = 0.15; }
  else { angle *= 0.8; }

  let isNitro = keys[' '] && nitro > 0;
  if (isNitro) {
    speed = 16;
    nitro = Math.max(0, nitro - 0.4);
  } else {
    speed = 9;
    nitro = Math.min(100, nitro + 0.15);
  }
  document.getElementById('spd').innerText = Math.round(speed * 14);
  document.getElementById('nitro').innerText = Math.round(nitro);

  ctx.clearRect(0, 0, 800, 600);
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(100, 0, 600, 600);

  // neon tracks
  ctx.strokeStyle = isNitro ? '#38bdf8' : '#a855f7';
  ctx.lineWidth = 5;
  ctx.setLineDash([30, 20]);
  ctx.lineDashOffset = -(f * speed) % 50;
  ctx.beginPath();
  ctx.moveTo(300, 0); ctx.lineTo(300, 600);
  ctx.moveTo(500, 0); ctx.lineTo(500, 600);
  ctx.stroke();

  // car
  ctx.save();
  ctx.translate(playerX, 480);
  ctx.rotate(angle);
  ctx.shadowColor = isNitro ? '#38bdf8' : '#c084fc';
  ctx.shadowBlur = 20;
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(-22, -45, 44, 90);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-16, -20, 32, 45);
  ctx.restore();

  requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>`;
}

export function getSlopeCyberBuiltInHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Slope Cyber Tunnel VIP</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; user-select:none; }
  body { background:#030712; color:#fff; font-family:system-ui, -apple-system, sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
  canvas { background:#060d1f; border:2px solid #22c55e; border-radius:12px; box-shadow:0 0 35px rgba(34,197,94,0.35); max-width:96vw; max-height:82vh; }
  #hud { position:absolute; top:20px; display:flex; gap:16px; font-weight:bold; font-size:15px; }
  .badge { background:rgba(3,7,18,0.85); padding:6px 14px; border-radius:8px; border:1px solid #22c55e; }
  #msg { position:absolute; color:#ef4444; font-size:32px; font-weight:900; text-align:center; display:none; text-shadow:0 0 25px #ef4444; }
  #controls { position:absolute; bottom:12px; font-size:12px; color:#86efac; letter-spacing:1px; font-family:monospace; }
</style>
</head>
<body>
<div id="hud">
  <div class="badge" style="color:#4ade80">DISTANCE: <span id="dist">0</span>m</div>
  <div class="badge" style="color:#38bdf8">SPEED: <span id="spd">140</span> KM/H</div>
  <div class="badge" style="color:#facc15">BEST: <span id="best">0</span>m</div>
</div>
<div id="msg">FALLEN OFF TRACK!<br><span style="font-size:16px;color:#fff;font-weight:400">Press SPACEBAR or CLICK to Roll Again</span></div>
<canvas id="cv" width="800" height="600"></canvas>
<div id="controls">← → or A / D : STEER BALL | SPACEBAR / CLICK : RETRY PURSUIT</div>
<script>
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const distEl = document.getElementById('dist');
const spdEl = document.getElementById('spd');
const bestEl = document.getElementById('best');
const msgEl = document.getElementById('msg');

let ball = { x: 0, y: 0, vx: 0, radius: 16 };
let speed = 9;
let distance = 0;
let highScore = 0;
let gameOver = false;
let keys = {};
let segments = [];
let obstacles = [];
let frame = 0;

for (let i = 0; i < 30; i++) {
  segments.push({
    z: i * 40,
    width: 280,
    xOffset: 0
  });
}

function resetGame() {
  ball = { x: 0, y: 0, vx: 0, radius: 16 };
  speed = 9;
  distance = 0;
  gameOver = false;
  obstacles = [];
  msgEl.style.display = 'none';
}

window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === ' ' && gameOver) resetGame();
});
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
cv.addEventListener('pointerdown', () => { if (gameOver) resetGame(); });

function spawnObstacle() {
  if (Math.random() < 0.08 && obstacles.length < 15) {
    obstacles.push({
      z: 1100,
      x: (Math.random() - 0.5) * 220,
      w: 40,
      h: 40,
      color: '#ef4444'
    });
  }
}

function update() {
  if (gameOver) return;
  frame++;
  distance += Math.round(speed);
  speed = Math.min(22, 9 + distance / 800);
  distEl.innerText = distance;
  spdEl.innerText = Math.round(speed * 18);
  if (distance > highScore) {
    highScore = distance;
    bestEl.innerText = highScore;
  }

  // Steering
  if (keys['a'] || keys['arrowleft']) ball.vx -= 1.2;
  else if (keys['d'] || keys['arrowright']) ball.vx += 1.2;
  else ball.vx *= 0.85;

  ball.vx = Math.max(-12, Math.min(12, ball.vx));
  ball.x += ball.vx;

  // Track boundary check
  const trackLimit = 150;
  if (Math.abs(ball.x) > trackLimit) {
    gameOver = true;
    msgEl.style.display = 'block';
  }

  spawnObstacle();

  // Move obstacles toward camera
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.z -= speed * 4;

    // Check collision at player Z plane (~120)
    if (obs.z < 160 && obs.z > 80) {
      if (Math.abs(obs.x - ball.x) < 32) {
        gameOver = true;
        msgEl.style.display = 'block';
      }
    }

    if (obs.z <= 0) obstacles.splice(i, 1);
  }
}

function draw() {
  ctx.clearRect(0, 0, 800, 600);

  // Horizon grid
  ctx.fillStyle = '#060d1f';
  ctx.fillRect(0, 0, 800, 600);

  const horizonY = 220;
  const cx = 400;

  // Perspective 3D slope track
  for (let z = 1200; z >= 60; z -= 40) {
    let factor = 300 / z;
    let nextFactor = 300 / (z - 40);

    let y1 = horizonY + z * 0.3;
    let y2 = horizonY + (z - 40) * 0.3;

    let w1 = 180 * factor * 2;
    let w2 = 180 * nextFactor * 2;

    let x1 = cx - ball.x * factor;
    let x2 = cx - ball.x * nextFactor;

    // Grid wireframe polygon
    ctx.beginPath();
    ctx.moveTo(x1 - w1, y1);
    ctx.lineTo(x1 + w1, y1);
    ctx.lineTo(x2 + w2, y2);
    ctx.lineTo(x2 - w2, y2);
    ctx.closePath();

    let gridColor = ((Math.floor(z / 40) + Math.floor(frame * 0.2)) % 2 === 0) ? '#152e22' : '#0e1f17';
    ctx.fillStyle = gridColor;
    ctx.fill();

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Draw obstacles
  obstacles.forEach(obs => {
    if (obs.z <= 0) return;
    let factor = 300 / obs.z;
    let ox = cx + (obs.x - ball.x) * factor;
    let oy = horizonY + obs.z * 0.3;
    let size = obs.w * factor;

    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 15;
    ctx.fillRect(ox - size/2, oy - size, size, size);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(ox - size/2, oy - size, size, size);
    ctx.shadowBlur = 0;
  });

  // Draw player rolling sphere
  ctx.save();
  ctx.translate(cx, 480);
  ctx.shadowColor = '#4ade80';
  ctx.shadowBlur = 25;

  let grad = ctx.createRadialGradient(-4, -6, 2, 0, 0, ball.radius + 4);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.3, '#4ade80');
  grad.addColorStop(0.8, '#15803d');
  grad.addColorStop(1, '#052e16');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, ball.radius + 2, 0, Math.PI * 2);
  ctx.fill();

  // Ball rolling rotation lines
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, ball.radius - 3, (frame * 0.2) % (Math.PI*2), (frame * 0.2 + 2.5) % (Math.PI*2));
  ctx.stroke();

  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>`;
}

export function get1v1ArenaBuiltInHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>1v1 Arena Duel VIP</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; user-select:none; }
  body { background:#050814; color:#fff; font-family:system-ui, sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
  canvas { background:#091224; border:2px solid #38bdf8; border-radius:12px; box-shadow:0 0 35px rgba(56,189,248,0.3); max-width:96vw; max-height:82vh; cursor:crosshair; }
  #hud { position:absolute; top:18px; display:flex; gap:16px; font-weight:bold; font-size:15px; }
  .box { background:rgba(9,18,36,0.85); padding:6px 14px; border-radius:8px; border:1px solid #38bdf8; }
  #msg { position:absolute; font-size:32px; font-weight:900; text-align:center; display:none; }
  #controls { position:absolute; bottom:12px; font-size:12px; color:#7dd3fc; letter-spacing:1px; font-family:monospace; }
</style>
</head>
<body>
<div id="hud">
  <div class="box" style="color:#38bdf8">YOU: <span id="php">100</span> HP</div>
  <div class="box" style="color:#ef4444">ENEMY BOT: <span id="ehp">100</span> HP</div>
  <div class="box" style="color:#facc15">SCORE: <span id="score">0 - 0</span></div>
  <div class="box" style="color:#a855f7">WOOD WALLS: <span id="walls">10</span></div>
</div>
<div id="msg">VICTORY!<br><span style="font-size:16px;color:#fff;font-weight:400">Click or Spacebar to start Next Round</span></div>
<canvas id="cv" width="800" height="600"></canvas>
<div id="controls">WASD : MOVE | MOUSE : AIM | LEFT CLICK : FIRE SHOTGUN | Q or RIGHT CLICK : PLACE WOOD WALL</div>
<script>
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const phpEl = document.getElementById('php');
const ehpEl = document.getElementById('ehp');
const scoreEl = document.getElementById('score');
const wallsEl = document.getElementById('walls');
const msgEl = document.getElementById('msg');

let player = { x: 200, y: 300, hp: 100, speed: 4.5, angle: 0, cooldown: 0, walls: 10 };
let enemy = { x: 600, y: 300, hp: 100, speed: 3.2, angle: 0, cooldown: 30 };
let bullets = [];
let builtWalls = [];
let pScore = 0, eScore = 0;
let gameOver = false;
let mouse = { x: 400, y: 300 };
let keys = {};

function resetRound() {
  player.x = 180; player.y = 300; player.hp = 100; player.walls = 10;
  enemy.x = 620; enemy.y = 300; enemy.hp = 100;
  bullets = [];
  builtWalls = [];
  gameOver = false;
  msgEl.style.display = 'none';
  phpEl.innerText = player.hp;
  ehpEl.innerText = enemy.hp;
  wallsEl.innerText = player.walls;
}

cv.addEventListener('mousemove', e => {
  const rect = cv.getBoundingClientRect();
  mouse.x = (e.clientX - rect.left) * (cv.width / rect.width);
  mouse.y = (e.clientY - rect.top) * (cv.height / rect.height);
});

cv.addEventListener('mousedown', e => {
  if (gameOver) { resetRound(); return; }
  if (e.button === 0) firePlayer();
  else if (e.button === 2) placeWall();
});
window.addEventListener('contextmenu', e => e.preventDefault());

window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key.toLowerCase() === 'q') placeWall();
  if (e.key === ' ' && gameOver) resetRound();
});
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function placeWall() {
  if (player.walls <= 0 || gameOver) return;
  player.walls--;
  wallsEl.innerText = player.walls;
  let wx = player.x + Math.cos(player.angle) * 55;
  let wy = player.y + Math.sin(player.angle) * 55;
  builtWalls.push({ x: wx, y: wy, w: 22, h: 65, hp: 150 });
}

function firePlayer() {
  if (player.cooldown > 0 || gameOver) return;
  player.cooldown = 14;
  for (let i = -2; i <= 2; i++) {
    let spreadAngle = player.angle + i * 0.08;
    bullets.push({
      x: player.x + Math.cos(player.angle) * 20,
      y: player.y + Math.sin(player.angle) * 20,
      vx: Math.cos(spreadAngle) * 11,
      vy: Math.sin(spreadAngle) * 11,
      team: 'player',
      damage: 12
    });
  }
}

function update() {
  if (gameOver) return;

  // Player controls
  let dx = 0, dy = 0;
  if (keys['w']) dy -= 1;
  if (keys['s']) dy += 1;
  if (keys['a']) dx -= 1;
  if (keys['d']) dx += 1;

  if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
  player.x = Math.max(30, Math.min(770, player.x + dx * player.speed));
  player.y = Math.max(30, Math.min(570, player.y + dy * player.speed));
  player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
  if (player.cooldown > 0) player.cooldown--;

  // Enemy Bot AI
  let distToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
  enemy.angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
  
  if (distToPlayer > 240) {
    enemy.x += Math.cos(enemy.angle) * enemy.speed;
    enemy.y += Math.sin(enemy.angle) * enemy.speed;
  } else if (distToPlayer < 140) {
    enemy.x -= Math.cos(enemy.angle) * enemy.speed;
    enemy.y -= Math.sin(enemy.angle) * enemy.speed;
  }

  // Enemy shoot
  enemy.cooldown--;
  if (enemy.cooldown <= 0) {
    enemy.cooldown = 32 + Math.random() * 20;
    bullets.push({
      x: enemy.x + Math.cos(enemy.angle) * 20,
      y: enemy.y + Math.sin(enemy.angle) * 20,
      vx: Math.cos(enemy.angle) * 9,
      vy: Math.sin(enemy.angle) * 9,
      team: 'enemy',
      damage: 18
    });
  }

  // Update bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.x += b.vx;
    b.y += b.vy;

    // Check hit wall
    let hitWall = false;
    for (let w of builtWalls) {
      if (Math.abs(b.x - w.x) < w.w && Math.abs(b.y - w.y) < w.h) {
        w.hp -= b.damage;
        hitWall = true;
        break;
      }
    }
    if (hitWall) { bullets.splice(i, 1); continue; }

    // Hit enemy
    if (b.team === 'player' && Math.hypot(b.x - enemy.x, b.y - enemy.y) < 22) {
      enemy.hp = Math.max(0, enemy.hp - b.damage);
      ehpEl.innerText = enemy.hp;
      bullets.splice(i, 1);
      if (enemy.hp <= 0) {
        gameOver = true;
        pScore++;
        scoreEl.innerText = pScore + " - " + eScore;
        msgEl.innerHTML = '<span style="color:#38bdf8">VICTORY ROYALE! 👑</span><br><span style="font-size:16px;color:#fff;font-weight:400">Click or Space to Next Round</span>';
        msgEl.style.display = 'block';
      }
      continue;
    }

    // Hit player
    if (b.team === 'enemy' && Math.hypot(b.x - player.x, b.y - player.y) < 22) {
      player.hp = Math.max(0, player.hp - b.damage);
      phpEl.innerText = player.hp;
      bullets.splice(i, 1);
      if (player.hp <= 0) {
        gameOver = true;
        eScore++;
        scoreEl.innerText = pScore + " - " + eScore;
        msgEl.innerHTML = '<span style="color:#ef4444">DEFEATED! 💀</span><br><span style="font-size:16px;color:#fff;font-weight:400">Click or Space to Respawn</span>';
        msgEl.style.display = 'block';
      }
      continue;
    }

    if (b.x < 0 || b.x > 800 || b.y < 0 || b.y > 600) bullets.splice(i, 1);
  }

  // Filter dead walls
  builtWalls = builtWalls.filter(w => w.hp > 0);
}

function draw() {
  ctx.clearRect(0, 0, 800, 600);

  // Arena floor grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 800; x += 50) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
  }
  for (let y = 0; y <= 600; y += 50) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
  }

  // Draw built wooden walls
  builtWalls.forEach(w => {
    ctx.fillStyle = '#b45309';
    ctx.fillRect(w.x - w.w/2, w.y - w.h/2, w.w, w.h);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(w.x - w.w/2, w.y - w.h/2, w.w, w.h);
  });

  // Bullets
  bullets.forEach(b => {
    ctx.fillStyle = b.team === 'player' ? '#38bdf8' : '#f87171';
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw Player
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);
  ctx.fillStyle = '#0284c7';
  ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(10, -4, 18, 8); // Shotgun barrel
  ctx.restore();

  // Draw Enemy Bot
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  ctx.rotate(enemy.angle);
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f87171';
  ctx.fillRect(10, -4, 18, 8); // Enemy rifle
  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>`;
}

export function getDriveMadBuiltInHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Drive Mad Extreme Stunts VIP</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; user-select:none; }
  body { background:#0a101d; color:#fff; font-family:system-ui, sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
  canvas { background:#0f1d38; border:2px solid #f59e0b; border-radius:12px; box-shadow:0 0 35px rgba(245,158,11,0.3); max-width:96vw; max-height:82vh; }
  #hud { position:absolute; top:18px; display:flex; gap:16px; font-weight:bold; font-size:15px; }
  .box { background:rgba(15,29,56,0.85); padding:6px 14px; border-radius:8px; border:1px solid #f59e0b; }
  #msg { position:absolute; font-size:32px; font-weight:900; text-align:center; display:none; }
  #controls { position:absolute; bottom:12px; font-size:12px; color:#fde68a; letter-spacing:1px; font-family:monospace; }
</style>
</head>
<body>
<div id="hud">
  <div class="box" style="color:#fbbf24">STAGE: <span id="stage">1 / 3</span></div>
  <div class="box" style="color:#38bdf8">SPEED: <span id="spd">0</span> MPH</div>
  <div class="box" style="color:#4ade80">PROGRESS: <span id="prog">0</span>%</div>
</div>
<div id="msg">STAGE CLEARED!<br><span style="font-size:16px;color:#fff;font-weight:400">Click or Spacebar to continue</span></div>
<canvas id="cv" width="800" height="600"></canvas>
<div id="controls">W / ↑ or D / → : GAS FORWARD | S / ↓ or A / ← : BRAKE / REVERSE | BALANCE YOUR TRUCK!</div>
<script>
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const stageEl = document.getElementById('stage');
const spdEl = document.getElementById('spd');
const progEl = document.getElementById('prog');
const msgEl = document.getElementById('msg');

let truck = { x: 120, y: 380, vx: 0, vy: 0, angle: 0, vAngle: 0, wheelR: 20 };
let currentStage = 1;
let gameOver = false;
let victory = false;
let keys = {};
let cameraX = 0;

function resetStage(stageNum) {
  currentStage = stageNum || 1;
  stageEl.innerText = currentStage + " / 3";
  truck = { x: 120, y: 380, vx: 0, vy: 0, angle: 0, vAngle: 0, wheelR: 20 };
  gameOver = false;
  victory = false;
  msgEl.style.display = 'none';
}

window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === ' ' && (gameOver || victory)) {
    if (victory && currentStage < 3) resetStage(currentStage + 1);
    else resetStage(currentStage);
  }
});
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
cv.addEventListener('pointerdown', () => {
  if (victory && currentStage < 3) resetStage(currentStage + 1);
  else if (gameOver || victory) resetStage(currentStage);
});

function getTerrainY(worldX) {
  // Level layout with bridges, ramps, and hills
  if (worldX < 280) return 430;
  if (worldX < 460) return 430 + Math.sin((worldX - 280) * 0.03) * 35; // suspension bridge
  if (worldX < 650) return 430 - (worldX - 460) * 0.4; // ramp up
  if (worldX < 750) return 354; // upper plateau
  if (worldX < 920) return 354 + (worldX - 750) * 0.5; // dip
  if (worldX < 1200) return 439; // finish straight
  return 439;
}

function update() {
  if (gameOver || victory) return;

  // Gas & reverse
  if (keys['w'] || keys['arrowup'] || keys['d'] || keys['arrowright']) {
    truck.vx += 0.32;
    truck.vAngle += 0.003;
  } else if (keys['s'] || keys['arrowdown'] || keys['a'] || keys['arrowleft']) {
    truck.vx -= 0.28;
    truck.vAngle -= 0.004;
  } else {
    truck.vx *= 0.98;
    truck.vAngle *= 0.95;
  }

  // Gravity
  truck.vy += 0.38;
  truck.x += truck.vx;
  truck.y += truck.vy;
  truck.angle += truck.vAngle;

  let groundY = getTerrainY(truck.x);
  if (truck.y + truck.wheelR >= groundY) {
    truck.y = groundY - truck.wheelR;
    truck.vy = 0;
    // Ground friction
    truck.vx *= 0.97;
  }

  // Flip crash check
  if (Math.abs(truck.angle) > 2.2) {
    gameOver = true;
    msgEl.innerHTML = '<span style="color:#ef4444">CRASHED! 💥</span><br><span style="font-size:16px;color:#fff;font-weight:400">Click or Spacebar to Retry Stage</span>';
    msgEl.style.display = 'block';
  }

  // Finish check
  const finishX = 1100;
  if (truck.x >= finishX) {
    victory = true;
    msgEl.innerHTML = '<span style="color:#4ade80">STAGE COMPLETED! 🏁</span><br><span style="font-size:16px;color:#fff;font-weight:400">' + (currentStage < 3 ? 'Click or Spacebar for Next Stage' : 'ALL 3 STAGES CLEARED!') + '</span>';
    msgEl.style.display = 'block';
  }

  cameraX = truck.x - 250;
  spdEl.innerText = Math.round(Math.abs(truck.vx) * 14);
  progEl.innerText = Math.min(100, Math.round((truck.x / finishX) * 100));
}

function draw() {
  ctx.clearRect(0, 0, 800, 600);

  ctx.save();
  ctx.translate(-cameraX, 0);

  // Draw terrain
  ctx.beginPath();
  ctx.moveTo(cameraX - 100, 600);
  for (let x = cameraX - 100; x <= cameraX + 900; x += 15) {
    ctx.lineTo(x, getTerrainY(x));
  }
  ctx.lineTo(cameraX + 900, 600);
  ctx.closePath();
  ctx.fillStyle = '#1e3a8a';
  ctx.fill();

  // Terrain grass/wood border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Checkered Finish Line
  const fx = 1100;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(fx, 340, 12, 100);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = (i % 2 === 0) ? '#000' : '#fff';
    ctx.fillRect(fx, 340 + i * 20, 12, 20);
  }
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('FINISH', fx - 16, 330);

  // Draw Voxel 4x4 Monster Truck
  ctx.save();
  ctx.translate(truck.x, truck.y);
  ctx.rotate(truck.angle);

  // Yellow Cab
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(-35, -28, 70, 24);
  // Cab roof / windows
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-15, -42, 35, 16);
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(-12, -40, 14, 12);
  ctx.fillRect(6, -40, 12, 12);

  // Big Monster Wheels
  ctx.fillStyle = '#18181b';
  ctx.beginPath(); ctx.arc(-24, 6, truck.wheelR, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(24, 6, truck.wheelR, 0, Math.PI * 2); ctx.fill();

  // Rims
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath(); ctx.arc(-24, 6, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(24, 6, 8, 0, Math.PI * 2); ctx.fill();

  ctx.restore();

  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>`;
}

// ==================== RETRO BOWL ====================
export function getRetroBowlBuiltInHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Retro Bowl - Gridiron Champion</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; user-select:none; }
  body { background:#0a0f1d; color:#fff; font-family:'Courier New', monospace, sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
  canvas { background:#1e392a; border:3px solid #f59e0b; border-radius:10px; box-shadow:0 0 35px rgba(245,158,11,0.25); max-width:96vw; max-height:82vh; cursor:crosshair; }
  #hud { position:absolute; top:12px; display:flex; gap:14px; font-weight:bold; font-size:14px; }
  .badge { background:rgba(0,0,0,0.85); padding:6px 14px; border-radius:6px; border:1px solid #4b5563; }
  #msg { position:absolute; color:#fbbf24; font-size:32px; font-weight:900; text-align:center; display:none; text-shadow:0 0 25px #f59e0b; pointer-events:none; }
  #controls { position:absolute; bottom:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div id="hud">
  <div class="badge" style="color:#60a5fa">HOME: <span id="homeScore">0</span></div>
  <div class="badge" style="color:#f87171">AWAY: <span id="awayScore">0</span></div>
  <div class="badge" style="color:#fbbf24">QTR: <span id="qtr">1</span> | <span id="clock">02:45</span></div>
  <div class="badge" style="color:#34d399">DOWN: <span id="down">1st & 10</span></div>
  <div class="badge" style="color:#e2e8f0">BALL ON: <span id="yard">OWN 25</span></div>
</div>
<div id="msg">TOUCHDOWN! 🏈<br><span style="font-size:16px;color:#fff;font-weight:normal">Click to Continue Play</span></div>
<canvas id="cv" width="900" height="520"></canvas>
<div id="controls">PASS: Click & Drag backwards to aim & throw | RUN: WASD or Arrow Keys to juke defenders | SPACEBAR: Dive</div>
<script>
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const homeEl = document.getElementById('homeScore');
const awayEl = document.getElementById('awayScore');
const qtrEl = document.getElementById('qtr');
const clockEl = document.getElementById('clock');
const downEl = document.getElementById('down');
const yardEl = document.getElementById('yard');
const msgEl = document.getElementById('msg');

// Audio synth
let audioCtx;
function playBeep(freq, type = 'sine', duration = 0.1) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) {}
}

let homeScore = 0;
let awayScore = 0;
let quarter = 1;
let secondsLeft = 165;
let down = 1;
let yardsToGo = 10;
let ballYard = 25; // 0 to 100
let firstDownYard = 35;

let playState = 'snap'; // 'snap', 'aiming', 'ball_flying', 'running', 'play_over'
let qb = { x: 120, y: 260 };
let ball = { x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0, inAir: false, holder: 'qb', height: 0, vz: 0 };
let receivers = [];
let defenders = [];
let oLine = [];
let dLine = [];
let dragStart = null;
let aimVector = { x: 0, y: 0 };
let keys = {};

window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === ' ' && playState === 'play_over') resetPlay();
});
window.addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
});

cv.addEventListener('pointerdown', e => {
  if (playState === 'play_over') {
    resetPlay();
    return;
  }
  if (playState === 'snap') {
    playState = 'aiming';
    playBeep(440, 'triangle', 0.1);
  }
  const rect = cv.getBoundingClientRect();
  dragStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
});

cv.addEventListener('pointermove', e => {
  if (playState === 'aiming' && dragStart) {
    const rect = cv.getBoundingClientRect();
    const curr = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    aimVector = { x: dragStart.x - curr.x, y: dragStart.y - curr.y };
  }
});

cv.addEventListener('pointerup', () => {
  if (playState === 'aiming') {
    throwBall();
  }
  dragStart = null;
});

function throwBall() {
  playState = 'ball_flying';
  ball.x = qb.x;
  ball.y = qb.y;
  ball.holder = null;
  const power = Math.min(Math.hypot(aimVector.x, aimVector.y) * 0.12, 16);
  const angle = Math.atan2(aimVector.y, aimVector.x);
  ball.vx = Math.cos(angle) * power * 1.5;
  ball.vy = Math.sin(angle) * power * 1.5;
  ball.vz = 8;
  ball.height = 10;
  ball.inAir = true;
  playBeep(580, 'sine', 0.18);
}

function initPlay() {
  playState = 'snap';
  msgEl.style.display = 'none';
  qb = { x: 140, y: 260, vx: 0, vy: 0 };
  ball = { x: qb.x, y: qb.y, vx: 0, vy: 0, inAir: false, holder: 'qb', height: 0, vz: 0 };
  dragStart = null;
  aimVector = { x: 0, y: 0 };

  // Receivers routes
  receivers = [
    { x: 190, y: 100, vx: 4.2, vy: 0.5, hasBall: false, color: '#38bdf8', number: '18', route: 'go' },
    { x: 190, y: 200, vx: 3.8, vy: 1.2, hasBall: false, color: '#38bdf8', number: '87', route: 'slant' },
    { x: 190, y: 400, vx: 4.0, vy: -0.8, hasBall: false, color: '#38bdf8', number: '11', route: 'post' }
  ];

  // Defensive Backs
  defenders = [
    { x: 380, y: 110, vx: 0, vy: 0, color: '#ef4444', speed: 3.3, number: '24' },
    { x: 420, y: 220, vx: 0, vy: 0, color: '#ef4444', speed: 3.4, number: '29' },
    { x: 400, y: 390, vx: 0, vy: 0, color: '#ef4444', speed: 3.2, number: '21' },
    { x: 520, y: 260, vx: 0, vy: 0, color: '#dc2626', speed: 3.6, number: '33' } // Safety
  ];

  // Offensive / Defensive Linemen
  oLine = [
    { x: 180, y: 230 }, { x: 180, y: 260 }, { x: 180, y: 290 }
  ];
  dLine = [
    { x: 230, y: 230 }, { x: 230, y: 260 }, { x: 230, y: 290 }
  ];

  updateHud();
}

function updateHud() {
  homeEl.innerText = homeScore;
  awayEl.innerText = awayScore;
  qtrEl.innerText = quarter;
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  clockEl.innerText = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  downEl.innerText = down + (down === 1 ? 'st' : down === 2 ? 'nd' : down === 3 ? 'rd' : 'th') + ' & ' + yardsToGo;
  yardEl.innerText = ballYard < 50 ? 'OWN ' + ballYard : ballYard === 50 ? '50' : 'OPP ' + (100 - ballYard);
}

function tackle(carrier) {
  playState = 'play_over';
  playBeep(180, 'square', 0.25);
  const gain = Math.round((carrier.x - 140) / 7);
  ballYard += Math.max(-5, gain);
  yardsToGo -= Math.max(-5, gain);

  if (ballYard >= 100) {
    homeScore += 7;
    ballYard = 25;
    down = 1;
    yardsToGo = 10;
    firstDownYard = 35;
    playBeep(880, 'sine', 0.4);
    msgEl.innerHTML = '🎉 TOUCHDOWN PENGUINS! 🏈<br><span style="font-size:16px;color:#fff">+7 POINTS! Click to kick off next drive</span>';
    msgEl.style.display = 'block';
  } else if (yardsToGo <= 0) {
    down = 1;
    yardsToGo = 10;
    firstDownYard = ballYard + 10;
    msgEl.innerHTML = 'FIRST DOWN! 🚩<br><span style="font-size:16px;color:#fff">Great drive! Click to snap ball</span>';
    msgEl.style.display = 'block';
  } else {
    down++;
    if (down > 4) {
      // Turnover on downs
      awayScore += 3;
      ballYard = 25;
      down = 1;
      yardsToGo = 10;
      msgEl.innerHTML = 'TURNOVER ON DOWNS! ❌<br><span style="font-size:16px;color:#fff">Opponent kicked FG! Your turn</span>';
      msgEl.style.display = 'block';
    } else {
      msgEl.innerHTML = 'TACKLED! (Gain: ' + gain + ' YDS)<br><span style="font-size:16px;color:#fff">Click for Next Down</span>';
      msgEl.style.display = 'block';
    }
  }
  updateHud();
}

function resetPlay() {
  initPlay();
}

function update() {
  if (playState === 'play_over') return;

  if (playState === 'aiming' || playState === 'ball_flying' || playState === 'running') {
    if (Math.random() < 0.05 && secondsLeft > 0) {
      secondsLeft--;
      updateHud();
    }
  }

  // Receivers run routes
  receivers.forEach(r => {
    if (!r.hasBall) {
      r.x += r.vx;
      r.y += r.vy;
      if (r.route === 'slant' && r.x > 320) r.vy = -1.2;
      if (r.route === 'post' && r.x > 340) r.vy = -1.6;
    } else {
      // User control
      if (keys['w'] || keys['arrowup']) r.y -= 4;
      if (keys['s'] || keys['arrowdown']) r.y += 4;
      if (keys['a'] || keys['arrowleft']) r.x -= 2;
      if (keys['d'] || keys['arrowright']) r.x += 4.5;
      r.x += 2.5; // natural forward momentum

      // Touchdown line check
      if (r.x > 840) {
        tackle(r);
        return;
      }
    }
  });

  // Ball in flight
  if (ball.inAir) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.height += ball.vz;
    ball.vz -= 0.35; // gravity

    if (ball.height <= 0) {
      ball.height = 0;
      ball.inAir = false;

      // Check if any receiver catches
      let caught = false;
      receivers.forEach(r => {
        const dist = Math.hypot(r.x - ball.x, r.y - ball.y);
        if (dist < 45 && !caught) {
          caught = true;
          r.hasBall = true;
          playState = 'running';
          playBeep(650, 'triangle', 0.15);
        }
      });

      if (!caught) {
        // Incomplete pass
        playState = 'play_over';
        playBeep(220, 'sawtooth', 0.2);
        down++;
        if (down > 4) {
          awayScore += 3;
          ballYard = 25;
          down = 1;
          yardsToGo = 10;
          msgEl.innerHTML = 'TURNOVER ON DOWNS! ❌<br><span style="font-size:16px;color:#fff">Opponent kicked FG! Click to play</span>';
        } else {
          msgEl.innerHTML = 'INCOMPLETE PASS! 🏈<br><span style="font-size:16px;color:#fff">Click for Next Down</span>';
        }
        msgEl.style.display = 'block';
        updateHud();
      }
    }
  }

  // Defenders track ball carrier or receivers
  defenders.forEach(d => {
    let target = null;
    const carrier = receivers.find(r => r.hasBall);
    if (carrier) {
      target = carrier;
    } else if (ball.inAir) {
      target = ball;
    } else {
      // Cover nearest receiver
      let closest = receivers[0];
      let minDist = 999;
      receivers.forEach(r => {
        const dist = Math.hypot(r.x - d.x, r.y - d.y);
        if (dist < minDist) { minDist = dist; closest = r; }
      });
      target = closest;
    }

    if (target) {
      const angle = Math.atan2(target.y - d.y, target.x - d.x);
      d.x += Math.cos(angle) * d.speed;
      d.y += Math.sin(angle) * d.speed;

      // Check tackle
      if (carrier && Math.hypot(carrier.x - d.x, carrier.y - d.y) < 22) {
        tackle(carrier);
      }
    }
  });

  // Rusher rush QB if holding too long
  if (playState === 'aiming' || playState === 'snap') {
    dLine.forEach(dl => {
      dl.x -= 0.8;
      if (Math.hypot(qb.x - dl.x, qb.y - dl.y) < 20) {
        // SACK!
        playState = 'play_over';
        playBeep(150, 'sawtooth', 0.3);
        ballYard = Math.max(1, ballYard - 6);
        down++;
        msgEl.innerHTML = 'QB SACKED! 💥 (-6 YARDS)<br><span style="font-size:16px;color:#fff">Click for Next Down</span>';
        msgEl.style.display = 'block';
        updateHud();
      }
    });
  }
}

function drawPlayer(x, y, color, num, isCarrier = false) {
  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 14, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Helmet
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -6, 9, 0, Math.PI * 2);
  ctx.fill();

  // Visor
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(2, -8, 6, 4);

  // Jersey Body
  ctx.fillStyle = color;
  ctx.fillRect(-10, 2, 20, 16);

  // Number
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(num, 0, 14);

  // Cleats
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-8, 18, 6, 5);
  ctx.fillRect(2, 18, 6, 5);

  // Football if holding
  if (isCarrier) {
    ctx.fillStyle = '#854d0e';
    ctx.beginPath();
    ctx.ellipse(10, 8, 7, 4, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, 900, 520);

  // Turf Field Grass Stripes
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#1b4332' : '#2d6a4f';
    ctx.fillRect(i * 100, 0, 100, 520);
  }

  // Endzones
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(840, 0, 60, 520);
  ctx.save();
  ctx.translate(875, 260);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PENGUINS', 0, 8);
  ctx.restore();

  // Yard lines & Hashmarks
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  for (let x = 100; x < 850; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x, 520);
    ctx.stroke();

    // Numbers
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    const yardNum = x <= 450 ? Math.round(x / 9) : 100 - Math.round(x / 9);
    ctx.fillText(yardNum, x, 40);
    ctx.fillText(yardNum, x, 490);
  }

  // First Down Line (Yellow)
  const fdx = 140 + yardsToGo * 7;
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(fdx, 0); ctx.lineTo(fdx, 520);
  ctx.stroke();
  ctx.setLineDash([]);

  // Aiming Guide Line
  if (playState === 'aiming' && dragStart) {
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(qb.x, qb.y);
    ctx.lineTo(qb.x + aimVector.x * 1.6, qb.y + aimVector.y * 1.6);
    ctx.stroke();
    ctx.setLineDash([]);

    // Target reticle
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(qb.x + aimVector.x * 1.6, qb.y + aimVector.y * 1.6, 16, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Draw Offensive Line & Defensive Line
  oLine.forEach(ol => drawPlayer(ol.x, ol.y, '#38bdf8', 'OL'));
  dLine.forEach(dl => drawPlayer(dl.x, dl.y, '#ef4444', 'DL'));

  // Draw QB
  drawPlayer(qb.x, qb.y, '#0284c7', '9', ball.holder === 'qb');

  // Draw Receivers
  receivers.forEach(r => drawPlayer(r.x, r.y, r.color, r.number, r.hasBall));

  // Draw Defenders
  defenders.forEach(d => drawPlayer(d.x, d.y, d.color, d.number));

  // Draw Flying Ball
  if (ball.inAir) {
    ctx.save();
    ctx.translate(ball.x, ball.y - ball.height);
    ctx.fillStyle = '#854d0e';
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 6, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

initPlay();
loop();
</script>
</body>
</html>`;
}

// ==================== COOKIE CLICKER ====================
export function getCookieClickerBuiltInHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Cookie Clicker - Classic Edition</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; user-select:none; }
  body { background:#18110b; color:#fff; font-family:system-ui, -apple-system, sans-serif; display:flex; height:100vh; overflow:hidden; }
  #left-panel { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; position:relative; background:radial-gradient(circle at center, #2e1d13 0%, #150d08 100%); border-right:3px solid #78350f; }
  #right-panel { width:340px; background:#1c130c; display:flex; flex-direction:column; border-left:1px solid #451a03; }
  #shop-header { padding:14px; background:#29180e; font-size:16px; font-weight:bold; color:#fbbf24; border-bottom:2px solid #78350f; display:flex; justify-content:space-between; align-items:center; }
  #shop-list { flex:1; overflow-y:auto; padding:10px; display:flex; flex-direction:column; gap:8px; }
  .shop-item { background:#2a1b12; border:1px solid #78350f; border-radius:8px; padding:10px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition:all 0.15s; }
  .shop-item:hover:not(.locked) { background:#3b2416; transform:translateY(-2px); border-color:#d97706; }
  .shop-item.locked { opacity:0.5; filter:grayscale(0.7); cursor:not-allowed; }
  .item-title { font-weight:bold; font-size:14px; color:#fde68a; }
  .item-desc { font-size:11px; color:#a1a1aa; }
  .item-cost { font-weight:900; font-size:13px; color:#fbbf24; }
  .item-qty { font-weight:900; font-size:18px; color:#71717a; padding-left:10px; }
  #cookie-counter { text-align:center; margin-bottom:24px; }
  #count { font-size:42px; font-weight:900; color:#fbbf24; text-shadow:0 0 25px rgba(251,191,36,0.5); }
  #cps { font-size:14px; color:#d97706; font-weight:600; margin-top:4px; }
  #cookie-btn { width:220px; height:220px; border-radius:50%; background:radial-gradient(circle at 35% 35%, #d97706, #78350f 70%, #451a03 100%); box-shadow:0 15px 35px rgba(0,0,0,0.6), 0 0 50px rgba(217,119,6,0.3); border:4px solid #b45309; cursor:pointer; position:relative; transition:transform 0.08s ease; outline:none; }
  #cookie-btn:active { transform:scale(0.93); }
  .chip { position:absolute; width:22px; height:22px; background:#291408; border-radius:50%; box-shadow:inset 1px 1px 3px rgba(0,0,0,0.8); }
  .floating-num { position:absolute; font-weight:900; font-size:22px; color:#fef08a; pointer-events:none; animation:floatUp 0.8s ease-out forwards; text-shadow:0 2px 4px #000; }
  @keyframes floatUp { 0% { opacity:1; transform:translateY(0) scale(1); } 100% { opacity:0; transform:translateY(-70px) scale(1.3); } }
  #golden-cookie { position:absolute; width:60px; height:60px; border-radius:50%; background:radial-gradient(circle, #fef08a, #eab308 60%, #ca8a04 100%); box-shadow:0 0 25px #fef08a; cursor:pointer; display:none; animation:pulse 1s infinite alternate; }
  @keyframes pulse { 0% { transform:scale(0.95); } 100% { transform:scale(1.1); } }
  #frenzy-banner { position:absolute; top:20px; background:#ea580c; color:#fff; font-weight:900; padding:6px 16px; border-radius:20px; font-size:14px; display:none; box-shadow:0 0 20px #ea580c; }
</style>
</head>
<body>
<div id="left-panel">
  <div id="frenzy-banner">🔥 GOLDEN FRENZY: 7x COOKIES! (<span id="frenzy-timer">15</span>s)</div>
  <div id="cookie-counter">
    <div id="count">0</div>
    <div id="cps">per second: 0.0</div>
  </div>
  <div id="cookie-btn">
    <div class="chip" style="top:35px; left:55px;"></div>
    <div class="chip" style="top:70px; left:140px; width:26px; height:26px;"></div>
    <div class="chip" style="top:125px; left:40px; width:18px; height:18px;"></div>
    <div class="chip" style="top:140px; left:120px; width:28px; height:28px;"></div>
    <div class="chip" style="top:80px; left:95px; width:20px; height:20px;"></div>
    <div class="chip" style="top:40px; left:115px; width:16px; height:16px;"></div>
  </div>
  <div id="golden-cookie"></div>
</div>
<div id="right-panel">
  <div id="shop-header">
    <span>BUILDINGS STORE</span>
    <span style="font-size:12px;color:#a1a1aa">Auto-CPS</span>
  </div>
  <div id="shop-list"></div>
</div>

<script>
let cookies = 0;
let multiplier = 1;
let frenzyTimer = 0;

const buildings = [
  { id: 'cursor', name: 'Auto-Clicker', cost: 15, cps: 0.2, qty: 0, desc: 'Auto clicks once every 5 seconds.' },
  { id: 'grandma', name: 'Grandma', cost: 100, cps: 1.2, qty: 0, desc: 'A nice grandma to bake more cookies.' },
  { id: 'farm', name: 'Cookie Farm', cost: 1100, cps: 8, qty: 0, desc: 'Grows cookie plants from rich cocoa soil.' },
  { id: 'mine', name: 'Cocoa Mine', cost: 12000, cps: 47, qty: 0, desc: 'Mines deep chocolate chunks and chips.' },
  { id: 'factory', name: 'Cookie Factory', cost: 130000, cps: 260, qty: 0, desc: 'Produces massive batches of crunch.' },
  { id: 'bank', name: 'Cookie Bank', cost: 1400000, cps: 1400, qty: 0, desc: 'Generates interest in fresh cookies.' }
];

// Audio synth
let audioCtx;
function playSound(freq, duration = 0.08) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) {}
}

const countEl = document.getElementById('count');
const cpsEl = document.getElementById('cps');
const cookieBtn = document.getElementById('cookie-btn');
const shopListEl = document.getElementById('shop-list');
const goldenCookieEl = document.getElementById('golden-cookie');
const frenzyBanner = document.getElementById('frenzy-banner');
const frenzyTimerEl = document.getElementById('frenzy-timer');

function getCps() {
  const baseCps = buildings.reduce((sum, b) => sum + (b.cps * b.qty), 0);
  return baseCps * multiplier;
}

function formatNum(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return Math.floor(num).toLocaleString();
}

function renderShop() {
  shopListEl.innerHTML = '';
  buildings.forEach((b, idx) => {
    const canAfford = cookies >= b.cost;
    const item = document.createElement('div');
    item.className = 'shop-item' + (canAfford ? '' : ' locked');
    item.innerHTML = \`
      <div>
        <div class="item-title">\${b.name}</div>
        <div class="item-desc">\${b.desc} (+\${b.cps} CPS)</div>
        <div class="item-cost">🍪 \${formatNum(b.cost)}</div>
      </div>
      <div class="item-qty">\${b.qty}</div>
    \`;
    item.addEventListener('click', () => buyBuilding(idx));
    shopListEl.appendChild(item);
  });
}

function buyBuilding(idx) {
  const b = buildings[idx];
  if (cookies >= b.cost) {
    cookies -= b.cost;
    b.qty++;
    b.cost = Math.round(b.cost * 1.15);
    playSound(520, 0.12);
    updateUI();
  }
}

function spawnFloatingNum(x, y, text) {
  const num = document.createElement('div');
  num.className = 'floating-num';
  num.innerText = text;
  num.style.left = (x - 20) + 'px';
  num.style.top = (y - 30) + 'px';
  document.getElementById('left-panel').appendChild(num);
  setTimeout(() => num.remove(), 800);
}

cookieBtn.addEventListener('pointerdown', e => {
  const gain = 1 * multiplier;
  cookies += gain;
  playSound(600 + Math.random() * 200, 0.05);

  const rect = document.getElementById('left-panel').getBoundingClientRect();
  spawnFloatingNum(e.clientX - rect.left, e.clientY - rect.top, '+' + gain);
  updateUI();
});

// Golden cookie spawn
function checkGoldenCookie() {
  if (Math.random() < 0.005 && goldenCookieEl.style.display !== 'block' && multiplier === 1) {
    const leftW = document.getElementById('left-panel').clientWidth;
    const leftH = document.getElementById('left-panel').clientHeight;
    goldenCookieEl.style.left = (50 + Math.random() * (leftW - 140)) + 'px';
    goldenCookieEl.style.top = (50 + Math.random() * (leftH - 140)) + 'px';
    goldenCookieEl.style.display = 'block';
    playSound(880, 0.3);

    setTimeout(() => {
      goldenCookieEl.style.display = 'none';
    }, 9000);
  }
}

goldenCookieEl.addEventListener('click', () => {
  goldenCookieEl.style.display = 'none';
  multiplier = 7;
  frenzyTimer = 15;
  frenzyBanner.style.display = 'block';
  playSound(1040, 0.4);
});

function updateUI() {
  countEl.innerText = formatNum(cookies);
  cpsEl.innerText = 'per second: ' + getCps().toFixed(1);
  renderShop();
}

// Game tick loop
setInterval(() => {
  cookies += getCps() / 10;
  if (multiplier > 1) {
    frenzyTimer -= 0.1;
    frenzyTimerEl.innerText = Math.max(0, Math.ceil(frenzyTimer));
    if (frenzyTimer <= 0) {
      multiplier = 1;
      frenzyBanner.style.display = 'none';
    }
  }
  checkGoldenCookie();
  countEl.innerText = formatNum(cookies);
}, 100);

renderShop();
</script>
</body>
</html>`;
}

// ==================== TUNNEL RUSH ====================
export function getTunnelRushBuiltInHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Tunnel Rush - 3D Neon Vortex</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; user-select:none; }
  body { background:#030712; color:#fff; font-family:system-ui, -apple-system, sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
  canvas { background:#000; border:2px solid #00f0ff; border-radius:12px; box-shadow:0 0 40px rgba(0,240,255,0.3); max-width:96vw; max-height:84vh; }
  #hud { position:absolute; top:16px; display:flex; gap:18px; font-weight:900; font-size:16px; text-shadow:0 2px 4px #000; }
  .badge { background:rgba(0,0,0,0.8); padding:6px 16px; border-radius:8px; border:1px solid #00f0ff; }
  #msg { position:absolute; color:#ff0055; font-size:36px; font-weight:900; text-align:center; display:none; text-shadow:0 0 30px #ff0055; }
  #controls { position:absolute; bottom:10px; font-size:13px; color:#94a3b8; letter-spacing:1px; }
</style>
</head>
<body>
<div id="hud">
  <div class="badge" style="color:#00f0ff">DISTANCE: <span id="score">0</span>m</div>
  <div class="badge" style="color:#ff007f">SPEED: <span id="spd">1.0</span>x</div>
  <div class="badge" style="color:#facc15">HIGH: <span id="high">0</span>m</div>
</div>
<div id="msg">CRASHED! 💥<br><span style="font-size:16px;color:#fff;font-weight:normal">Press SPACEBAR or CLICK to Retry</span></div>
<canvas id="cv" width="800" height="600"></canvas>
<div id="controls">← → or A / D : ROTATE AROUND TUNNEL | DODGE THE NEON WEDGES</div>
<script>
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const scoreEl = document.getElementById('score');
const spdEl = document.getElementById('spd');
const highEl = document.getElementById('high');
const msgEl = document.getElementById('msg');

let playerAngle = 0;
let score = 0;
let highScore = 0;
let speed = 1.0;
let gameOver = false;
let rings = [];
let obstacles = [];
let keys = {};
let frame = 0;

// Audio synth
let audioCtx;
function playTone(freq, type = 'sine', duration = 0.08) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) {}
}

window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === ' ' && gameOver) resetGame();
});
window.addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
});
cv.addEventListener('pointerdown', () => {
  if (gameOver) resetGame();
});

function resetGame() {
  playerAngle = 0;
  score = 0;
  speed = 1.0;
  gameOver = false;
  obstacles = [];
  rings = [];
  for (let z = 50; z < 1000; z += 50) {
    rings.push(z);
  }
  msgEl.style.display = 'none';
}

function spawnObstacle() {
  const sides = 8; // octagon
  const occupiedSide = Math.floor(Math.random() * sides);
  const color = ['#ff0055', '#ff9900', '#00f0ff', '#bd00ff'][Math.floor(Math.random() * 4)];
  obstacles.push({
    z: 950,
    side: occupiedSide,
    span: 1 + (Math.random() > 0.6 ? 1 : 0),
    color: color
  });
}

function update() {
  if (gameOver) return;
  frame++;
  score += Math.round(speed * 2);
  speed = Math.min(2.8, 1.0 + (score / 12000));
  scoreEl.innerText = score;
  spdEl.innerText = speed.toFixed(1);
  if (score > highScore) {
    highScore = score;
    highEl.innerText = highScore;
  }

  // Player rotation
  const rotSpeed = 0.085;
  if (keys['arrowleft'] || keys['a']) playerAngle -= rotSpeed;
  if (keys['arrowright'] || keys['d']) playerAngle += rotSpeed;

  // Move tunnel rings
  for (let i = 0; i < rings.length; i++) {
    rings[i] -= 10 * speed;
    if (rings[i] <= 20) rings[i] = 1000;
  }

  // Spawn obstacles
  if (frame % Math.max(16, Math.round(45 / speed)) === 0) {
    spawnObstacle();
  }

  // Update obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const ob = obstacles[i];
    ob.z -= 11 * speed;

    // Check collision at player plane (z ≈ 120)
    if (ob.z < 150 && ob.z > 70) {
      // Check angle overlap
      const sides = 8;
      const anglePerSide = (Math.PI * 2) / sides;
      let normPlayer = ((playerAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const playerSide = Math.floor(normPlayer / anglePerSide);

      for (let s = 0; s < ob.span; s++) {
        const checkSide = (ob.side + s) % sides;
        if (playerSide === checkSide) {
          gameOver = true;
          playTone(130, 'sawtooth', 0.4);
          msgEl.style.display = 'block';
          return;
        }
      }
    }

    if (ob.z < 20) {
      obstacles.splice(i, 1);
      playTone(480, 'triangle', 0.05);
    }
  }
}

function draw() {
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, 800, 600);

  const cx = 400;
  const cy = 300;
  const sides = 8;
  const angleStep = (Math.PI * 2) / sides;

  ctx.save();
  ctx.translate(cx, cy);

  // Draw tunnel rings
  rings.forEach((z, idx) => {
    const scale = 380 / (z * 0.4 + 40);
    const r = 240 * scale;
    ctx.strokeStyle = (idx % 2 === 0) ? '#00f0ff' : '#a855f7';
    ctx.lineWidth = Math.max(1, 4 * scale);
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const a = i * angleStep - playerAngle;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });

  // Draw radial tunnel ridges
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i < sides; i++) {
    const a = i * angleStep - playerAngle;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 450, Math.sin(a) * 450);
    ctx.stroke();
  }

  // Draw Obstacles (3D neon wedge slices)
  obstacles.forEach(ob => {
    const scale = 380 / (ob.z * 0.4 + 40);
    const r = 240 * scale;
    ctx.fillStyle = ob.color;
    ctx.shadowColor = ob.color;
    ctx.shadowBlur = 15;

    for (let s = 0; s < ob.span; s++) {
      const a1 = (ob.side + s) * angleStep - playerAngle;
      const a2 = (ob.side + s + 1) * angleStep - playerAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
      ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
  ctx.shadowBlur = 0;

  // Draw Player Marker at fixed position (bottom rim)
  const playerR = 210;
  ctx.fillStyle = '#00f0ff';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(0, playerR, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Glow pointer
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(0, playerR - 16);
  ctx.lineTo(-8, playerR - 2);
  ctx.lineTo(8, playerR - 2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

resetGame();
loop();
</script>
</body>
</html>`;
}

// ==================== PAPER.IO 2 ====================
export function getPaperIoBuiltInHtml(): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Paper.io 2 - Arena Conquest</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; user-select:none; }
  body { background:#0f172a; color:#fff; font-family:system-ui, -apple-system, sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
  canvas { background:#f8fafc; border:3px solid #0284c7; border-radius:12px; box-shadow:0 0 35px rgba(2,132,199,0.25); max-width:96vw; max-height:82vh; cursor:crosshair; }
  #hud { position:absolute; top:14px; display:flex; gap:16px; font-weight:900; font-size:15px; }
  .badge { background:rgba(15,23,42,0.85); padding:6px 16px; border-radius:8px; border:1px solid #334155; }
  #leaderboard { position:absolute; top:14px; right:20px; background:rgba(15,23,42,0.85); padding:10px 16px; border-radius:8px; border:1px solid #334155; font-size:12px; }
  #msg { position:absolute; color:#ef4444; font-size:32px; font-weight:900; text-align:center; display:none; text-shadow:0 0 25px rgba(239,68,68,0.6); }
  #controls { position:absolute; bottom:8px; font-size:12px; color:#94a3b8; }
</style>
</head>
<body>
<div id="hud">
  <div class="badge" style="color:#0284c7">TERRITORY: <span id="perc">2.5</span>%</div>
  <div class="badge" style="color:#22c55e">KILLS: <span id="kills">0</span></div>
  <div class="badge" style="color:#f59e0b">SURVIVORS: <span id="survivors">5</span></div>
</div>
<div id="leaderboard">
  <div style="font-weight:900;color:#38bdf8;margin-bottom:4px;">ARENA STANDINGS</div>
  <div id="lb-content"></div>
</div>
<div id="msg">ELIMINATED! 💥<br><span style="font-size:16px;color:#fff;font-weight:normal">Press SPACEBAR or CLICK to Respawn</span></div>
<canvas id="cv" width="800" height="600"></canvas>
<div id="controls">WASD / ARROW KEYS or MOUSE : STEER YOUR PAPER BLOCK | CONQUER LAND & CUT RIVAL TRAILS!</div>
<script>
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const percEl = document.getElementById('perc');
const killsEl = document.getElementById('kills');
const survivorsEl = document.getElementById('survivors');
const lbEl = document.getElementById('lb-content');
const msgEl = document.getElementById('msg');

// Grid Arena: 80x60 tiles
const COLS = 80;
const ROWS = 60;
const TILE = 10;
let grid = new Int8Array(COLS * ROWS); // 0=neutral, 1=player, 2=red, 3=blue, 4=yellow, 5=purple

let player = {
  id: 1, name: 'You (Penguin)', x: 200, y: 150, vx: 2.5, vy: 0,
  trail: [], color: '#0284c7', territoryColor: 'rgba(2,132,199,0.3)', kills: 0, alive: true
};

let bots = [];
let keys = {};
let gameOver = false;

// Audio synth
let audioCtx;
function playSound(freq, duration = 0.08) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) {}
}

window.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  keys[k] = true;
  if (k === ' ' && gameOver) resetGame();

  if (player.alive) {
    if ((k === 'w' || k === 'arrowup') && player.vy === 0) { player.vx = 0; player.vy = -2.6; }
    if ((k === 's' || k === 'arrowdown') && player.vy === 0) { player.vx = 0; player.vy = 2.6; }
    if ((k === 'a' || k === 'arrowleft') && player.vx === 0) { player.vx = -2.6; player.vy = 0; }
    if ((k === 'd' || k === 'arrowright') && player.vx === 0) { player.vx = 2.6; player.vy = 0; }
  }
});
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
cv.addEventListener('pointerdown', () => { if (gameOver) resetGame(); });

function initBots() {
  bots = [
    { id: 2, name: 'CrimsonBot', x: 600, y: 150, vx: -2.2, vy: 0, trail: [], color: '#ef4444', territoryColor: 'rgba(239,68,68,0.3)', alive: true },
    { id: 3, name: 'CobaltBot', x: 200, y: 450, vx: 2.2, vy: 0, trail: [], color: '#3b82f6', territoryColor: 'rgba(59,130,246,0.3)', alive: true },
    { id: 4, name: 'ViperBot', x: 600, y: 450, vx: -2.2, vy: 0, trail: [], color: '#eab308', territoryColor: 'rgba(234,179,8,0.3)', alive: true },
    { id: 5, name: 'PhantomBot', x: 400, y: 300, vx: 0, vy: 2.2, trail: [], color: '#a855f7', territoryColor: 'rgba(168,85,247,0.3)', alive: true }
  ];

  // Stamp initial territory base for all entities
  [player, ...bots].forEach(ent => {
    const gx = Math.floor(ent.x / TILE);
    const gy = Math.floor(ent.y / TILE);
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const tx = gx + dx;
        const ty = gy + dy;
        if (tx >= 0 && tx < COLS && ty >= 0 && ty < ROWS) {
          grid[ty * COLS + tx] = ent.id;
        }
      }
    }
  });
}

function resetGame() {
  grid.fill(0);
  player = {
    id: 1, name: 'You (Penguin)', x: 200, y: 150, vx: 2.5, vy: 0,
    trail: [], color: '#0284c7', territoryColor: 'rgba(2,132,199,0.3)', kills: 0, alive: true
  };
  gameOver = false;
  msgEl.style.display = 'none';
  initBots();
}

function captureTerritory(ent) {
  if (ent.trail.length === 0) return;
  playSound(580, 0.12);

  // Convert trail points to territory
  ent.trail.forEach(pt => {
    const gx = Math.floor(pt.x / TILE);
    const gy = Math.floor(pt.y / TILE);
    if (gx >= 0 && gx < COLS && gy >= 0 && gy < ROWS) {
      grid[gy * COLS + gx] = ent.id;
    }
  });

  // Simple bounding box fill for enclosed area
  let minX = COLS, maxX = 0, minY = ROWS, maxY = 0;
  ent.trail.forEach(pt => {
    const gx = Math.floor(pt.x / TILE);
    const gy = Math.floor(pt.y / TILE);
    if (gx < minX) minX = gx;
    if (gx > maxX) maxX = gx;
    if (gy < minY) minY = gy;
    if (gy > maxY) maxY = gy;
  });

  // Fill inside bounds safely
  for (let y = Math.max(0, minY); y <= Math.min(ROWS - 1, maxY); y++) {
    for (let x = Math.max(0, minX); x <= Math.min(COLS - 1, maxX); x++) {
      if (Math.random() < 0.65) grid[y * COLS + x] = ent.id;
    }
  }

  ent.trail = [];
}

function checkTrailCollisions(ent) {
  // Check if ent head hits another entity's trail
  const allEntities = [player, ...bots].filter(e => e.alive);
  allEntities.forEach(target => {
    if (target.id === ent.id) {
      // Self collision with own trail
      for (let i = 0; i < ent.trail.length - 15; i++) {
        const pt = ent.trail[i];
        if (Math.hypot(ent.x - pt.x, ent.y - pt.y) < 8) {
          eliminate(ent, null);
        }
      }
    } else {
      // Cutting target trail
      for (let i = 0; i < target.trail.length; i++) {
        const pt = target.trail[i];
        if (Math.hypot(ent.x - pt.x, ent.y - pt.y) < 12) {
          eliminate(target, ent);
          break;
        }
      }
    }
  });
}

function eliminate(victim, killer) {
  victim.alive = false;
  victim.trail = [];
  playSound(200, 0.3);

  // Clear victim's grid ownership
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === victim.id) grid[i] = 0;
  }

  if (killer && killer.id === 1) {
    player.kills++;
    killsEl.innerText = player.kills;
    playSound(880, 0.2);
  }

  if (victim.id === 1) {
    gameOver = true;
    msgEl.style.display = 'block';
  }
}

function updateEntity(ent, isBot = false) {
  if (!ent.alive) return;

  if (isBot) {
    // Basic AI wandering & homing back to territory
    if (Math.random() < 0.03) {
      const dirs = [
        { vx: 2.2, vy: 0 }, { vx: -2.2, vy: 0 },
        { vx: 0, vy: 2.2 }, { vx: 0, vy: -2.2 }
      ];
      const validDirs = dirs.filter(d => (d.vx !== -ent.vx || d.vy !== -ent.vy));
      const pick = validDirs[Math.floor(Math.random() * validDirs.length)];
      ent.vx = pick.vx;
      ent.vy = pick.vy;
    }
  }

  ent.x += ent.vx;
  ent.y += ent.vy;

  // Boundary clamp
  if (ent.x < 10) { ent.x = 10; if (isBot) ent.vx = 2.2; }
  if (ent.x > 790) { ent.x = 790; if (isBot) ent.vx = -2.2; }
  if (ent.y < 10) { ent.y = 10; if (isBot) ent.vy = 2.2; }
  if (ent.y > 590) { ent.y = 590; if (isBot) ent.vy = -2.2; }

  const gx = Math.floor(ent.x / TILE);
  const gy = Math.floor(ent.y / TILE);
  const currentTileOwner = (gx >= 0 && gx < COLS && gy >= 0 && gy < ROWS) ? grid[gy * COLS + gx] : 0;

  if (currentTileOwner === ent.id) {
    // Safely inside territory!
    if (ent.trail.length > 0) {
      captureTerritory(ent);
    }
  } else {
    // Outside territory: leaving trail
    ent.trail.push({ x: ent.x, y: ent.y });
  }

  checkTrailCollisions(ent);
}

function update() {
  if (gameOver) return;

  updateEntity(player, false);
  bots.forEach(b => updateEntity(b, true));

  // Compute territory percentage & leaderboard
  let counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] > 0) counts[grid[i]]++;
  }
  const totalTiles = COLS * ROWS;
  const playerPerc = ((counts[1] / totalTiles) * 100).toFixed(1);
  percEl.innerText = playerPerc;

  const activeSurvivors = [player, ...bots].filter(e => e.alive).length;
  survivorsEl.innerText = activeSurvivors;

  // Leaderboard ranking
  const lbData = [player, ...bots].map(e => ({
    name: e.name,
    perc: ((counts[e.id] / totalTiles) * 100).toFixed(1),
    alive: e.alive,
    color: e.color
  })).sort((a, b) => b.perc - a.perc);

  lbEl.innerHTML = lbData.map((e, idx) => \`
    <div style="display:flex;justify-content:space-between;gap:12px;margin:2px 0;\${e.alive ? '' : 'opacity:0.4;text-decoration:line-through;'}">
      <span style="color:\${e.color};font-weight:bold;">\${idx + 1}. \${e.name}</span>
      <span>\${e.perc}%</span>
    </div>
  \`).join('');
}

function draw() {
  ctx.clearRect(0, 0, 800, 600);

  // Background Grid Lines
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= 800; x += TILE * 2) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 600); ctx.stroke();
  }
  for (let y = 0; y <= 600; y += TILE * 2) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(800, y); ctx.stroke();
  }

  // Draw Owned Territories
  const colors = {
    1: 'rgba(2,132,199,0.35)',
    2: 'rgba(239,68,68,0.35)',
    3: 'rgba(59,130,246,0.35)',
    4: 'rgba(234,179,8,0.35)',
    5: 'rgba(168,85,247,0.35)'
  };
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const owner = grid[y * COLS + x];
      if (owner > 0 && colors[owner]) {
        ctx.fillStyle = colors[owner];
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      }
    }
  }

  // Draw Trails
  [player, ...bots].forEach(ent => {
    if (ent.trail.length > 1) {
      ctx.strokeStyle = ent.color;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(ent.trail[0].x, ent.trail[0].y);
      for (let i = 1; i < ent.trail.length; i++) {
        ctx.lineTo(ent.trail[i].x, ent.trail[i].y);
      }
      ctx.stroke();
    }
  });

  // Draw Blocks / Heads
  [player, ...bots].forEach(ent => {
    if (ent.alive) {
      ctx.fillStyle = ent.color;
      ctx.shadowColor = ent.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(ent.x - 7, ent.y - 7, 14, 14);
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(ent.x - 7, ent.y - 7, 14, 14);
    }
  });
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

resetGame();
loop();
</script>
</body>
</html>`;
}
