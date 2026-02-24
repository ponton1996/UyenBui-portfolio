// ===== Particle-wave background (based on your provided snippet) =====
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

let W, H, cols, rows, particles;
let time = 0;
let mouse = { x: -999, y: -999 };

// Adaptive spacing for performance on mobile
let SPACING = window.innerWidth < 768 ? 28 : 18;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  cols = Math.ceil(W / SPACING) + 2;
  rows = Math.ceil(H / SPACING) + 2;
  buildGrid();
}

function buildGrid() {
  particles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      particles.push({ ox: c * SPACING - SPACING, oy: r * SPACING - SPACING });
    }
  }
}

function goldColor(t, brightness) {
  const r = Math.round(255 * t * brightness);
  const g = Math.round(120 * t * brightness);
  const b = 0;
  return `rgb(${r},${g},${b})`;
}

function pointerMove(x, y){
  mouse.x = x;
  mouse.y = y;
}

window.addEventListener('mousemove', (e) => pointerMove(e.clientX, e.clientY), { passive: true });
window.addEventListener('touchstart', (e) => {
  const t = e.touches && e.touches[0];
  if (t) pointerMove(t.clientX, t.clientY);
}, { passive: true });
window.addEventListener('touchmove', (e) => {
  const t = e.touches && e.touches[0];
  if (t) pointerMove(t.clientX, t.clientY);
}, { passive: true });

window.addEventListener('resize', () => {
  SPACING = window.innerWidth < 768 ? 28 : 18;
  resize();
}, { passive: true });

resize();

function draw() {
  ctx.clearRect(0, 0, W, H);
  time += 0.012;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    const wave1 = Math.sin(p.ox * 0.012 + p.oy * 0.008 + time) * 60;
    const wave2 = Math.cos(p.ox * 0.009 - p.oy * 0.013 + time * 1.3) * 40;
    const wave3 = Math.sin(p.ox * 0.018 + time * 0.7) * 25;

    const dz = wave1 + wave2 + wave3;

    const dx = p.ox - mouse.x;
    const dy = p.oy - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const repulse = Math.max(0, 1 - dist / 120);
    const mx = dx * repulse * 0.4;
    const my = dy * repulse * 0.4;

    const x = p.ox + mx;
    const y = p.oy + dz * 0.35 + my;

    const norm = (dz + 125) / 250;
    const bright = 0.3 + norm * 0.9;
    const size = 0.8 + norm * 1.4;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = goldColor(norm, bright);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();

// ===== UI helpers =====
document.getElementById('year').textContent = new Date().getFullYear();

const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

function closeMenu(){
  menu.hidden = true;
  menuBtn.setAttribute('aria-expanded', 'false');
}
function toggleMenu(){
  const open = menu.hidden;
  menu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
menuBtn.addEventListener('click', toggleMenu);

menu.addEventListener('click', (e) => {
  if (e.target && e.target.tagName === 'A') closeMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// Copy button for quick message
const copyBtn = document.getElementById('copyBtn');
copyBtn.addEventListener('click', async () => {
  const name = document.getElementById('name').value.trim();
  const msg = document.getElementById('msg').value.trim();
  const text = `Name: ${name || '(anonymous)'}\nMessage: ${msg || '(empty)'}`;
  try{
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied!';
    setTimeout(()=> copyBtn.textContent = 'Copy message', 900);
  }catch{
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    copyBtn.textContent = 'Copied!';
    setTimeout(()=> copyBtn.textContent = 'Copy message', 900);
  }
});
