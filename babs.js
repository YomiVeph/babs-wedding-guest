"use strict";

const doors = document.getElementById("doors");
const contentCard = document.getElementById("contentCard");
const scene = document.getElementById("scene");
const seal = document.getElementById("seal");

let isOpen = false;

// ── OPEN / CLOSE ─────────────────────────────────────────────────────────────

function triggerOpen() {
  isOpen = true;
  doors.classList.add("open");
  document.querySelectorAll(".reveal-item").forEach((el) => {
    void el.offsetWidth;
  });
  contentCard.classList.add("revealed");
  contentCard.style.cursor = "pointer";
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

// Auto-open after 5 seconds
const autoOpenTimer = setTimeout(triggerOpen, 5_000);

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

document.querySelectorAll(".action-btn").forEach((btn) =>
  ["click", "touchend"].forEach((evt) =>
    btn.addEventListener(evt, (e) => {
      e.stopPropagation();
      btn.blur();
    })
  )
);
