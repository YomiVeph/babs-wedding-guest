"use strict";
let attending = null;
let plusOne = null;

function setAttending(val) {
  attending = val;
  document.getElementById("btn-yes").classList.toggle("active", val === true);
  document.getElementById("btn-no").classList.toggle("active", val === false);
  document.getElementById("plusone-section").style.display = val
    ? "block"
    : "none";
  if (!val) {
    setPlusOne(false);
    document.getElementById("plusone-name-group").classList.remove("visible");
  }
}

function setPlusOne(val) {
  plusOne = val;
  document
    .getElementById("btn-plus-yes")
    .classList.toggle("active", val === true);
  document
    .getElementById("btn-plus-no")
    .classList.toggle("active", val === false);
  const nameGroup = document.getElementById("plusone-name-group");
  if (val) {
    nameGroup.classList.add("visible");
  } else {
    nameGroup.classList.remove("visible");
    document.getElementById("plusname").value = "";
  }
}

// ── PASTE YOUR DEPLOYED APPS SCRIPT URL HERE ──
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx5sgLcdKEZhC5FKEsZ5KLzDzCnVS3yCmiO_-Lz4TAK4ykpTRRaE63GnUVzDtN2umWV/exec";

async function submitRSVP() {
  const name = document.getElementById("fullname").value.trim();
  if (!name) {
    alert("Please enter your full name.");
    return;
  }
  if (attending === null) {
    alert("Please let us know if you'll be attending.");
    return;
  }
  if (attending && plusOne === null) {
    alert("Please let us know about your plus one.");
    return;
  }
  if (
    attending &&
    plusOne &&
    !document.getElementById("plusname").value.trim()
  ) {
    alert("Please enter your plus one's name.");
    return;
  }

  const submitBtn = document.querySelector(".form-submit");
  submitBtn.textContent = "Sending…";
  submitBtn.disabled = true;

  const payload = {
    name,
    attending: attending ? "Yes" : "No",
    plusOne: attending ? (plusOne ? "Yes" : "No") : "N/A",
    plusOneName:
      attending && plusOne
        ? document.getElementById("plusname").value.trim()
        : "—",
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn("Could not reach sheet, response logged locally.", e);
  }

  // Show success regardless (no-cors means we can't read the response)
  const msg = attending
    ? `We can't wait to celebrate with you${plusOne ? " and your guest" : ""}!`
    : "You will be missed. Thank you for letting us know.";

  document.getElementById("rsvp-form").style.display = "none";
  document.getElementById("success-msg").style.display = "block";
  document.getElementById("success-text").textContent = msg;
}
