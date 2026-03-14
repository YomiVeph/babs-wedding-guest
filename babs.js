"use strict";

const doors = document.getElementById("doors");
const contentCard = document.getElementById("contentCard");
const scene = document.getElementById("scene");
const canvas = document.getElementById("particles");
const seal = document.getElementById("seal");
const ctx = canvas.getContext("2d");

let isOpen = false;
let particlesStarted = false;
let W,
  H,
  pts = [];

function sizeCanvas() {
  W = canvas.width = scene.offsetWidth;
  H = canvas.height = scene.offsetHeight;
}

function initPts() {
  pts = Array.from({ length: 45 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 3 + 1.5,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6,
    o: Math.random() * 0.4 + 0.5,
    pulse: Math.random() * Math.PI * 2,
  }));
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach((p) => {
    p.pulse += 0.025;
    const r = p.r + Math.sin(p.pulse) * 0.8;
    const o = p.o + Math.sin(p.pulse) * 0.15;

    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 3.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,168,76,${o * 0.12})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220,185,80,${o})`;
    ctx.fill();

    p.x = (p.x + p.dx + W) % W;
    p.y = (p.y + p.dy + H) % H;
  });
  requestAnimationFrame(draw);
}

function startParticles() {
  sizeCanvas();
  initPts();
  draw();
  setTimeout(() => {
    canvas.style.opacity = "1";
  }, 1000);
}

window.addEventListener("resize", () => {
  sizeCanvas();
  initPts();
});

// ── OPEN / CLOSE ─────────────────────────────────────────────────────────────

function triggerOpen() {
  isOpen = true;
  doors.classList.add("open");
  contentCard.classList.add("revealed");
  contentCard.style.cursor = "pointer";
  if (!particlesStarted) {
    particlesStarted = true;
    startParticles();
  }
}

function openDoors(e) {
  e.preventDefault();
  e.stopPropagation();
  clearTimeout(autoOpenTimer);
  triggerOpen();
}

function closeDoors() {
  isOpen = false;
  doors.classList.remove("open");
  contentCard.classList.remove("revealed");
  contentCard.style.cursor = "default";
}

// Auto-open after 3 seconds
const autoOpenTimer = setTimeout(triggerOpen, 3_000);

// ── LISTENERS ────────────────────────────────────────────────────────────────

["click", "touchend"].forEach((evt) => seal.addEventListener(evt, openDoors));

["click", "touchend"].forEach((evt) =>
  contentCard.addEventListener(evt, (e) => {
    if (isOpen) {
      e.preventDefault();
      closeDoors();
    }
  })
);

document
  .querySelectorAll(".action-btn")
  .forEach((btn) =>
    ["click", "touchend"].forEach((evt) =>
      btn.addEventListener(evt, (e) => e.stopPropagation())
    )
  );
