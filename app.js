// app.js — MediTech | Light Theme + Emergency Type Tags + My Report Tab
import { 
  initFirebase, fetchHospitalsFromFirestore, seedFirestoreIfEmpty,
  savePatientProfileToDB, loadPatientProfileFromDB,
  uploadPatientReport, loadPatientReportsFromDB, deletePatientReportFromDB
} from "./firebase.js";

// ═══════════════════════════════════════════════
//  HOSPITAL DATA
// ═══════════════════════════════════════════════
const FALLBACK_HOSPITALS = [
  { id: "brims", name: "Bidar Institute of Medical Sciences (BRIMS)", city: "Bidar", address: "BRIMS Campus, Bidar – 585401", phone: "08482-278700", lat: 17.9185808, lng: 77.5157939, emergency24x7: true, specialties: ["cardiology", "trauma", "critical care", "general medicine"], doctors: ["Cardiologist", "Trauma Surgeon", "Emergency Physician"], equipment: ["ICU", "Ventilator", "ECG", "X-Ray"], ambulance: true, icu: true, ventilator: false },
  { id: "vishwa", name: "Vishwa Hospital", city: "Bidar", address: "Station Road, Bidar – 585401", phone: "08482-240101", lat: 17.9195998, lng: 77.5079454, emergency24x7: true, specialties: ["cardiology", "pulmonology", "general medicine", "endocrinology"], doctors: ["Cardiologist", "Pulmonologist", "General Physician"], equipment: ["ICU", "Ventilator", "ECG", "Oxygen"], ambulance: true, icu: true, ventilator: true },
  { id: "safa", name: "Safa Multi Speciality Hospital", city: "Bidar", address: "Udgir Road, Bidar – 585401", phone: "08482-241234", lat: 17.913816, lng: 77.5220267, emergency24x7: true, specialties: ["trauma", "general medicine", "emergency"], doctors: ["General Physician", "Emergency Doctor"], equipment: ["X-Ray", "Basic ICU"], ambulance: true, icu: true, ventilator: false },
  { id: "bmc-hayaat", name: "BMC Hayaat Hospital", city: "Bidar", address: "Naubad, Bidar – 585401", phone: "08482-243210", lat: 17.9119845, lng: 77.5283849, emergency24x7: true, specialties: ["trauma", "general medicine", "multi-speciality"], doctors: ["General Physician", "Surgeon"], equipment: ["ICU", "X-Ray"], ambulance: false, icu: true, ventilator: false },
  { id: "guru-nanak", name: "Guru Nanak Hospital", city: "Bidar", address: "Gurudwara Road, Bidar – 585401", phone: "08482-226610", lat: 17.927532, lng: 77.509462, emergency24x7: true, specialties: ["cardiology", "general medicine", "endocrinology"], doctors: ["Cardiologist", "General Physician"], equipment: ["ECG", "Basic ICU"], ambulance: true, icu: true, ventilator: true },
  { id: "prayavi", name: "Prayavi Hospital", city: "Bidar", address: "Old Town, Bidar – 585401", phone: "08482-236000", lat: 17.9176996, lng: 77.5176589, emergency24x7: false, specialties: ["general medicine", "surgery"], doctors: ["General Physician", "Surgeon"], equipment: ["Basic Care"], ambulance: false, icu: false, ventilator: false },
  { id: "krishnamurthy", name: "Krishnamurthy Hospital", city: "Bidar", address: "Kamthana Road, Bidar – 585401", phone: "08482-231000", lat: 17.9133684, lng: 77.5229446, emergency24x7: true, specialties: ["orthopedic", "trauma"], doctors: ["Orthopedic Surgeon"], equipment: ["X-Ray"], ambulance: true, icu: false, ventilator: false },
  { id: "apex", name: "Apex Hospital", city: "Bidar", address: "Bidar–Hyderabad Highway, Bidar – 585401", phone: "08482-239000", lat: 17.9159916, lng: 77.512209, emergency24x7: true, specialties: ["general medicine", "orthopedic"], doctors: ["General Physician"], equipment: ["X-Ray"], ambulance: true, icu: false, ventilator: false },
  { id: "basaveshwar", name: "Basaveshwar Hospital", city: "Bidar", address: "Basavakalyan Road, Bidar – 585401", phone: "08482-237500", lat: 17.9162935, lng: 77.5071405, emergency24x7: true, specialties: ["general medicine"], doctors: ["General Physician"], equipment: ["Basic Care"], ambulance: true, icu: false, ventilator: false },
  { id: "bhagirathi", name: "Bhagirathi Hospital Emergency Care Centre", city: "Bidar", address: "Chittaguppa Road, Bidar – 585401", phone: "08482-245000", lat: 18.0175919, lng: 77.0052256, emergency24x7: true, specialties: ["emergency", "critical care"], doctors: ["Emergency Physician"], equipment: ["ICU", "Ventilator"], ambulance: true, icu: true, ventilator: true },
];

// ═══════════════════════════════════════════════
//  SPECIALTY → EMERGENCY TYPE TAG MAP
//  Shows what emergency conditions the hospital handles
// ═══════════════════════════════════════════════
const SPECIALTY_TAGS = [
  { matches: ["cardiology", "cardiac"], cls: "tag-heart", icon: "❤️", label: "Heart Attack" },
  { matches: ["trauma"], cls: "tag-accident", icon: "🚗", label: "Accident/Trauma" },
  { matches: ["orthopedic"], cls: "tag-fracture", icon: "🦴", label: "Fracture" },
  { matches: ["pulmonology"], cls: "tag-breathing", icon: "😮‍💨", label: "Breathing Issues" },
  { matches: ["critical care"], cls: "tag-critical", icon: "🚨", label: "Critical Care" },
  { matches: ["emergency"], cls: "tag-emergency", icon: "🚑", label: "Emergency" },
  { matches: ["surgery"], cls: "tag-surgery", icon: "🔬", label: "Surgery" },
  { matches: ["endocrinology"], cls: "tag-diabetes", icon: "🩺", label: "Diabetes/Endo" },
  { matches: ["general medicine", "multi-speciality"], cls: "tag-general", icon: "💊", label: "General Care" },
];

// ═══════════════════════════════════════════════
//  SEARCH KEYWORD MAP
// ═══════════════════════════════════════════════
const QUERY_MAP = {
  "heart attack": ["cardiology", "cardiac", "critical care"],
  "cardiac": ["cardiology", "cardiac"],
  "accident": ["trauma", "emergency", "general medicine"],
  "fracture": ["orthopedic", "trauma"],
  "breathing problem": ["pulmonology", "critical care", "cardiology"],
  "breathing": ["pulmonology", "critical care"],
  "trauma": ["trauma", "emergency"],
  "icu": ["critical care", "cardiology", "trauma"],
  "ventilator": ["critical care", "pulmonology"],
  "stroke": ["cardiology", "critical care", "neurology"],
  "surgery": ["surgery", "trauma"],
};

function resolveKeywords(raw) {
  const q = raw.toLowerCase().trim();
  for (const [k, v] of Object.entries(QUERY_MAP)) {
    if (q.includes(k)) return v;
  }
  return [q];
}

// ═══════════════════════════════════════════════
//  GLOBAL STATE
// ═══════════════════════════════════════════════
let hospitals = [];
let userLat = null;
let userLng = null;
let activeTab = "search";
let nearbySortMode = "distance";
let currentQuery = "";

// ═══════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════
function calcDist(la1, ln1, la2, ln2) {
  const R = 6371, dL = deg2rad(la2 - la1), dN = deg2rad(ln2 - ln1);
  const a = Math.sin(dL / 2) ** 2 + Math.cos(deg2rad(la1)) * Math.cos(deg2rad(la2)) * Math.sin(dN / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function deg2rad(d) { return d * Math.PI / 180; }
function fmtDist(km) { return km == null ? "–" : km < 1 ? `${(km * 1000).toFixed(0)} m` : `${km.toFixed(1)} km`; }
function titleCase(s) { return s.replace(/\b\w/g, c => c.toUpperCase()); }
function nowTime() { return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); }

function toast(msg, dur = 2500) {
  const el = document.getElementById("toast");
  el.textContent = msg; el.classList.remove("hidden");
  clearTimeout(el._t); el._t = setTimeout(() => el.classList.add("hidden"), dur);
}

function attachDistances() {
  if (userLat === null) return;
  hospitals.forEach(h => { h._dist = calcDist(userLat, userLng, h.lat, h.lng); });
}

function score(h, keywords = []) {
  let s = 0;
  if (h.icu) s += 30;
  if (h.ventilator) s += 20;
  if (h.ambulance) s += 10;
  if (h.emergency24x7) s += 15;
  keywords.forEach(k => {
    const all = [...(h.specialties || []), ...(h.doctors || [])].join(" ").toLowerCase();
    if (all.includes(k)) s += 25;
  });
  if (h._dist != null) s -= h._dist * 3;
  return s;
}

// ═══════════════════════════════════════════════
//  FILTER
// ═══════════════════════════════════════════════
function filterByQuery(query) {
  if (!query.trim()) return [...hospitals].sort((a, b) => (a._dist ?? 99) - (b._dist ?? 99));
  const kws = resolveKeywords(query);
  return hospitals
    .filter(h => {
      const t = [...(h.specialties || []), ...(h.doctors || []), ...(h.equipment || []), h.name, h.city].join(" ").toLowerCase();
      return kws.some(k => t.includes(k));
    })
    .sort((a, b) => score(b, kws) - score(a, kws));
}

// ═══════════════════════════════════════════════
//  BUILD EMERGENCY TYPE TAGS from specialties
// ═══════════════════════════════════════════════
function buildEmergencyTags(specialties) {
  const shown = new Set();
  const tags = [];
  (specialties || []).forEach(sp => {
    const lower = sp.toLowerCase();
    for (const def of SPECIALTY_TAGS) {
      if (def.matches.some(m => lower.includes(m)) && !shown.has(def.label)) {
        shown.add(def.label);
        const span = document.createElement("span");
        span.className = `tag ${def.cls}`;
        span.textContent = `${def.icon} ${def.label}`;
        tags.push(span);
        break;
      }
    }
  });
  return tags;
}

// ═══════════════════════════════════════════════
//  SPECIALTY HIGHLIGHT
// ═══════════════════════════════════════════════
function buildSpecialtyHTML(specialties, keywords) {
  return specialties.map(sp => {
    const match = keywords.length && keywords.some(k => sp.toLowerCase().includes(k));
    const label = titleCase(sp);
    return match
      ? `<span class="specialty-match">${label}</span>`
      : `<span class="text-slate-400">${label}</span>`;
  }).join('<span class="text-slate-300"> · </span>');
}

// ═══════════════════════════════════════════════
//  CARD BUILDER
// ═══════════════════════════════════════════════
function buildCard(h, opts = {}) {
  const tpl = document.getElementById("hospitalCardTpl");
  const clone = tpl.content.cloneNode(true);
  const card = clone.querySelector(".hospital-card");

  if (opts.best) card.querySelector(".card-best-badge").classList.remove("hidden");
  if (opts.nearest) card.querySelector(".card-nearest-badge").classList.remove("hidden");

  card.querySelector(".card-name").textContent = h.name;
  card.querySelector(".card-city").textContent = "📍 " + (h.address || h.city);
  card.querySelector(".card-distance").textContent = fmtDist(h._dist);

  // Emergency badge
  const emEl = card.querySelector(".card-emergency-badge");
  if (h.emergency24x7) {
    emEl.textContent = "24×7 Open";
    emEl.style.cssText = "background:#dcfce7;color:#15803d;border:1px solid #86efac;";
  } else {
    emEl.textContent = "Limited Hours";
    emEl.style.cssText = "background:#fef9c3;color:#a16207;border:1px solid #fde68a;";
  }

  // Emergency TYPE tags (Heart Attack, Accident, Fracture…)
  const tagsEl = card.querySelector(".card-tags");
  buildEmergencyTags(h.specialties).forEach(t => tagsEl.appendChild(t));

  // Specialties with highlight
  const kws = currentQuery ? resolveKeywords(currentQuery) : [];
  const specEl = card.querySelector(".card-specialties");
  if (h.specialties?.length) {
    specEl.innerHTML = "🔬 " + buildSpecialtyHTML(h.specialties, kws);
  }

  // Doctors
  if (h.doctors?.length) {
    card.querySelector(".card-doctors").textContent = "👨‍⚕️ " + h.doctors.join(", ");
  }

  // Buttons
  card.querySelector(".card-call-btn").addEventListener("click", () => {
    window.location.href = `tel:${h.phone || ""}`;
  });
  card.querySelector(".card-route-btn").addEventListener("click", () => {
    const dest = h.lat != null && h.lng != null ? `${h.lat},${h.lng}` : encodeURIComponent(h.name + " " + h.city);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}&travelmode=driving`, "_blank");
  });
  card.querySelector(".card-avail-btn").addEventListener("click", () => openAvailability(h));

  return card;
}

// ═══════════════════════════════════════════════
//  AVAILABILITY MODAL
// ═══════════════════════════════════════════════
function openAvailability(h) {
  document.getElementById("sheetHospitalName").textContent = h.name;
  document.getElementById("sheetHospitalCity").textContent = h.address || h.city;
  document.getElementById("sheetTimestamp").textContent = "Updated: " + nowTime();

  // Derive emergency types this hospital handles
  const shown = new Set();
  const emTypes = [];
  (h.specialties || []).forEach(sp => {
    for (const def of SPECIALTY_TAGS) {
      if (def.matches.some(m => sp.toLowerCase().includes(m)) && !shown.has(def.label)) {
        shown.add(def.label); emTypes.push(`${def.icon} ${def.label}`);
      }
    }
  });

  const rows = [
    { icon: "🕐", bg: "background:#eff6ff;", label: "Emergency Availability", value: h.emergency24x7 ? "Open 24 × 7" : "Limited Hours", pill: h.emergency24x7 ? '<span class="pill-open">● OPEN NOW</span>' : '<span class="pill-closed">● LIMITED</span>', sub: h.emergency24x7 ? "Round-the-clock emergency services" : "Call ahead to confirm" },
    { icon: "❤️", bg: "background:#fef2f2;", label: "Handles Emergencies", value: emTypes.join("  ·  ") || "General Care", pill: "", sub: "Emergency conditions treated at this hospital" },
    { icon: "👨‍⚕️", bg: "background:#f0fdf4;", label: "Available Doctors", value: (h.doctors || ["General Physician"]).join(", "), pill: `<span class="pill-yes">${h.doctors?.length || 1} Doctors</span>`, sub: "On-call specialists present" },
    { icon: "🏥", bg: "background:#eff6ff;", label: "ICU", value: h.icu ? "ICU Available" : "No ICU", pill: h.icu ? '<span class="pill-yes">✓ Available</span>' : '<span class="pill-no">✗ Not Available</span>', sub: h.icu ? "Intensive care unit ready" : "Refer to BRIMS for ICU" },
    { icon: "🫁", bg: "background:#faf5ff;", label: "Ventilator", value: h.ventilator ? "Ventilators Available" : "No Ventilator", pill: h.ventilator ? '<span class="pill-yes">✓ Available</span>' : '<span class="pill-no">✗ Not Available</span>', sub: h.ventilator ? "Mechanical ventilation ready" : "Not available here" },
    { icon: "🚑", bg: "background:#f0fdf4;", label: "Ambulance Service", value: h.ambulance ? "Ambulance Available" : "No Ambulance", pill: h.ambulance ? '<span class="pill-yes">✓ Available</span>' : '<span class="pill-no">✗ Not Available</span>', sub: h.ambulance ? "Call hospital to dispatch" : "Dial 112 for ambulance" },
    { icon: "🛠️", bg: "background:#fefce8;", label: "Equipment", value: (h.equipment || ["Basic Care"]).join(", "), pill: "", sub: "Diagnostic & treatment equipment on site" },
    { icon: "📞", bg: "background:#f0fdf4;", label: "Contact Number", value: h.phone || "N/A", pill: "", sub: "Call directly for bed & availability info" },
  ];

  document.getElementById("sheetContent").innerHTML = rows.map(r => `
    <div class="avail-row">
      <div class="avail-icon" style="${r.bg}">${r.icon}</div>
      <div class="flex-1 min-w-0">
        <div class="avail-label">${r.label}</div>
        <div class="avail-value">${r.value}</div>
        <div class="avail-sub">${r.sub}</div>
      </div>
      ${r.pill ? `<div class="flex-shrink-0 self-center">${r.pill}</div>` : ""}
    </div>`).join("");

  const modal = document.getElementById("availabilityModal");
  const sheet = document.getElementById("availabilitySheet");
  modal.classList.remove("hidden");
  requestAnimationFrame(() => sheet.classList.add("open"));
  modal.onclick = e => { if (e.target === modal) closeAvailability(); };
}

window.closeAvailability = function () {
  const sheet = document.getElementById("availabilitySheet");
  sheet.classList.remove("open");
  setTimeout(() => document.getElementById("availabilityModal").classList.add("hidden"), 350);
};

// ═══════════════════════════════════════════════
//  RENDER
// ═══════════════════════════════════════════════
function renderCards(id, list, opts = {}) {
  const el = document.getElementById(id); el.innerHTML = "";
  const items = opts.limit ? list.slice(0, opts.limit) : list;
  if (!items.length) {
    el.innerHTML = `<div class="text-center py-10 text-slate-400">
      <div class="text-4xl mb-3">🔍</div>
      <p class="font-bold text-slate-600">No hospitals found</p>
      <p class="text-xs mt-1">Try a different search</p>
    </div>`;
    return;
  }
  items.forEach((h, i) => el.appendChild(buildCard(h, {
    best: opts.bestIdx != null && i === opts.bestIdx,
    nearest: opts.nearestIdx != null && i === opts.nearestIdx,
  })));
}

function renderSearch(query = "") {
  currentQuery = query;
  const results = filterByQuery(query);
  document.getElementById("searchResultCount").textContent = results.length ? `${results.length} found` : "";
  renderCards("searchResults", results, { limit: 6, bestIdx: 0 });
}

// ═══════════════════════════════════════════════
//  MY REPORT TAB — Patient Profile & File Uploads
// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
//  MY REPORT TAB — Patient Profile & File Uploads
// ═══════════════════════════════════════════════
const PROFILE_KEY = "meditechPatientProfile";

function generateProfileId() {
  const stored = localStorage.getItem("meditechProfileId");
  if (stored) return stored;
  const id = "MT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  localStorage.setItem("meditechProfileId", id);
  return id;
}

let currentReports = [];

async function loadPatientProfile() {
  const id = generateProfileId();
  const profile = await loadPatientProfileFromDB(id);
  if (!profile) {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null; } catch { return null; }
  }
  return profile;
}

async function savePatientProfile(data) {
  const id = generateProfileId();
  await savePatientProfileToDB(id, data);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
}

async function fetchUploadedReports() {
  const id = generateProfileId();
  currentReports = await loadPatientReportsFromDB(id);
  renderUploadedReports();
}

function renderProfileView(profile) {
  const view = document.getElementById("profileView");
  const form = document.getElementById("profileForm");
  const editBtn = document.getElementById("editProfileBtn");
  if (!profile) {
    view.classList.add("hidden"); form.classList.remove("hidden");
    editBtn.classList.add("hidden"); return;
  }
  document.getElementById("pName").value = profile.name || "";
  document.getElementById("pAge").value = profile.age || "";
  document.getElementById("pBlood").value = profile.blood || "";
  document.getElementById("pGender").value = profile.gender || "";
  document.getElementById("pPhone").value = profile.phone || "";
  document.getElementById("pEmergency").value = profile.emergency || "";
  document.getElementById("pAllergies").value = profile.allergies || "";
  document.getElementById("pHistory").value = profile.history || "";

  const fields = [
    { icon: "👤", label: "Name", val: profile.name },
    { icon: "🎂", label: "Age", val: profile.age ? profile.age + " yrs" : "" },
    { icon: "🩸", label: "Blood Group", val: profile.blood },
    { icon: "⚧", label: "Gender", val: profile.gender },
    { icon: "📞", label: "Phone", val: profile.phone },
    { icon: "🆘", label: "Emergency Contact", val: profile.emergency },
    { icon: "⚠️", label: "Allergies", val: profile.allergies },
    { icon: "📋", label: "Medical History", val: profile.history },
  ].filter(f => f.val);

  view.innerHTML = fields.map(f => `
    <div class="flex items-start gap-2 bg-slate-50 rounded-xl px-3 py-2">
      <span class="text-base mt-0.5">${f.icon}</span>
      <div class="min-w-0">
        <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">${f.label}</p>
        <p class="text-sm text-slate-800 font-semibold mt-0.5 leading-snug">${f.val}</p>
      </div>
    </div>`).join("");

  view.classList.remove("hidden");
  form.classList.add("hidden");
  editBtn.textContent = "Edit";
  editBtn.classList.remove("hidden");
}

function renderUploadedReports() {
  const list = currentReports;
  const el = document.getElementById("uploadedReportsList");
  const empty = document.getElementById("reportsEmptyState");
  const badge = document.getElementById("reportCountBadge");
  badge.textContent = list.length + " file" + (list.length !== 1 ? "s" : "");
  if (!list.length) { el.innerHTML = ""; empty.classList.remove("hidden"); return; }
  empty.classList.add("hidden");
  el.innerHTML = list.map((r, i) => {
    const isImg = r.type && r.type.startsWith("image");
    return `
      <div class="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${isImg ? "bg-blue-50" : "bg-red-50"}">
          ${isImg ? "🖼️" : "📄"}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-bold text-slate-800 truncate"><a href="${r.url}" target="_blank" class="hover:underline">${r.note || r.name}</a></p>
          <p class="text-xs text-slate-400 mt-0.5">${r.name} · ${r.dateLabel}</p>
        </div>
        <button class="report-delete-btn text-slate-300 hover:text-red-400 transition text-lg" data-idx="${i}">🗑️</button>
      </div>`;
  }).join("");
}

async function handleFileUpload(files) {
  if (!files || !files.length) return;
  const note = document.getElementById("reportNote").value.trim();
  const id = generateProfileId();
  
  toast("Uploading reports...");
  let processed = 0;
  for (const file of Array.from(files)) {
    if (file.size > 10 * 1024 * 1024) { toast("File too large: " + file.name); continue; }
    try {
      await uploadPatientReport(id, file, note);
      processed++;
    } catch(err) {
      toast("Error uploading " + file.name);
    }
  }
  if (processed > 0) {
     toast("✅ " + processed + " report" + (processed > 1 ? "s" : "") + " uploaded!");
     document.getElementById("reportNote").value = "";
     document.getElementById("reportFileInput").value = "";
     await fetchUploadedReports();
  }
}

async function deleteReport(idx) {
  const report = currentReports[idx];
  if (!report) return;
  const id = generateProfileId();
  await deletePatientReportFromDB(id, report.key, report.storagePath);
  await fetchUploadedReports();
  toast("Report removed.");
}

async function renderReportTab() {
  document.getElementById("patientProfileId").textContent = generateProfileId();
  const profile = await loadPatientProfile();
  renderProfileView(profile);
  await fetchUploadedReports();
}

function renderNearby(sort = "distance") {
  let sorted = [...hospitals];
  attachDistances();
  if (sort === "distance") sorted.sort((a, b) => (a._dist ?? 999) - (b._dist ?? 999));
  else if (sort === "icu") sorted.sort((a, b) => b.icu - a.icu || (a._dist ?? 999) - (b._dist ?? 999));
  else if (sort === "emergency") sorted.sort((a, b) => b.emergency24x7 - a.emergency24x7 || (a._dist ?? 999) - (b._dist ?? 999));
  else if (sort === "ambulance") sorted.sort((a, b) => b.ambulance - a.ambulance || (a._dist ?? 999) - (b._dist ?? 999));
  document.getElementById("nearbyCount").textContent = `${sorted.length} hospitals`;
  renderCards("nearbyResults", sorted, { nearestIdx: 0 });
}

// ═══════════════════════════════════════════════
//  TAB NAVIGATION
// ═══════════════════════════════════════════════
function switchTab(tab) {
  document.querySelectorAll(".tab-page").forEach(p => p.classList.add("hidden"));
  document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove("active"));
  document.getElementById(`tab-${tab}`).classList.remove("hidden");
  document.getElementById(`nav-${tab}`).classList.add("active");
  activeTab = tab;
  if (tab === "search") renderSearch(document.getElementById("searchInput").value);
  if (tab === "nearby") renderNearby(nearbySortMode);
  if (tab === "report") renderReportTab();
}

// ═══════════════════════════════════════════════
//  GEOLOCATION
// ═══════════════════════════════════════════════
function locateUser() {
  if (!navigator.geolocation) { setLocLabel("Geolocation unavailable"); return; }
  navigator.geolocation.getCurrentPosition(
    pos => {
      userLat = pos.coords.latitude; userLng = pos.coords.longitude;
      const lbl = `${userLat.toFixed(4)}, ${userLng.toFixed(4)}`;
      setLocLabel(lbl); attachDistances();
      if (activeTab === "nearby") renderNearby(nearbySortMode);
      toast("📍 Location detected!");
    },
    err => { console.warn(err); setLocLabel("Location unavailable"); },
    { enableHighAccuracy: true, timeout: 8000 }
  );
}
function setLocLabel(txt) {
  document.getElementById("locationText").textContent = txt.length > 22 ? "Located ✓" : txt;
  document.getElementById("nearbyLocationLabel").textContent = "Location Detected";
  document.getElementById("nearbyLocationSub").textContent = txt;
}
window.refreshLocation = function () {
  document.getElementById("nearbyLocationLabel").textContent = "Detecting location…";
  document.getElementById("locationText").textContent = "Locating…";
  locateUser();
};

// ═══════════════════════════════════════════════
//  BOOT
// ═══════════════════════════════════════════════
async function boot() {
  const dot = document.getElementById("firebaseDot");
  const ok = await initFirebase();
  if (ok) {
    const fetched = await fetchHospitalsFromFirestore();
    if (fetched && fetched.length) {
      hospitals = fetched;
      dot.className = "w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-green-200"; dot.title = "Firebase connected";
    } else {
      seedFirestoreIfEmpty(FALLBACK_HOSPITALS); hospitals = FALLBACK_HOSPITALS;
    }
  } else {
    hospitals = FALLBACK_HOSPITALS;
    dot.className = "w-2.5 h-2.5 rounded-full bg-yellow-400 ring-2 ring-yellow-200"; dot.title = "Offline – local data";
  }
  locateUser();
  await new Promise(r => setTimeout(r, 1300));
  const splash = document.getElementById("splashScreen");
  splash.style.transition = "opacity 0.4s"; splash.style.opacity = "0";
  setTimeout(() => { splash.classList.add("hidden"); document.getElementById("appShell").classList.remove("hidden"); renderSearch(); }, 400);
}

// ═══════════════════════════════════════════════
//  EVENT LISTENERS
// ═══════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  // ── Nav tabs ──
  document.querySelectorAll(".nav-tab").forEach(b => b.addEventListener("click", () => switchTab(b.dataset.tab)));

  // ── Search ──
  const inp = document.getElementById("searchInput");
  let deb;
  inp.addEventListener("input", () => { clearTimeout(deb); deb = setTimeout(() => renderSearch(inp.value), 280); });
  document.querySelectorAll(".suggestion-chip").forEach(c => {
    c.addEventListener("click", () => { inp.value = c.dataset.query; renderSearch(c.dataset.query); });
  });

  // ── Nearby sort chips ──
  document.querySelectorAll(".sort-chip").forEach(c => {
    c.addEventListener("click", () => {
      document.querySelectorAll(".sort-chip").forEach(x => x.classList.remove("active"));
      c.classList.add("active"); nearbySortMode = c.dataset.sort; renderNearby(nearbySortMode);
    });
  });

  // ── My Report: Save Profile ──
  document.getElementById("saveProfileBtn").addEventListener("click", async () => {
    const profile = {
      name:      document.getElementById("pName").value.trim(),
      age:       document.getElementById("pAge").value.trim(),
      blood:     document.getElementById("pBlood").value,
      gender:    document.getElementById("pGender").value,
      phone:     document.getElementById("pPhone").value.trim(),
      emergency: document.getElementById("pEmergency").value.trim(),
      allergies: document.getElementById("pAllergies").value.trim(),
      history:   document.getElementById("pHistory").value.trim(),
    };
    if (!profile.name) { toast("Please enter your full name."); return; }
    document.getElementById("saveProfileBtn").textContent = "Saving...";
    await savePatientProfile(profile);
    renderProfileView(profile);
    document.getElementById("saveProfileBtn").textContent = "💾 Save Profile";
    toast("✅ Profile saved successfully!");
  });

  // ── My Report: Edit toggle ──
  document.getElementById("editProfileBtn").addEventListener("click", () => {
    const form = document.getElementById("profileForm");
    const view = document.getElementById("profileView");
    const isHidden = form.classList.contains("hidden");
    form.classList.toggle("hidden", !isHidden);
    view.classList.toggle("hidden", isHidden);
    document.getElementById("editProfileBtn").textContent = isHidden ? "Cancel" : "Edit";
  });

  // ── My Report: File upload ──
  document.getElementById("reportFileInput").addEventListener("change", e => {
    handleFileUpload(e.target.files);
  });

  // ── My Report: Delete report (event delegation) ──
  document.getElementById("uploadedReportsList").addEventListener("click", e => {
    const btn = e.target.closest(".report-delete-btn");
    if (btn) deleteReport(Number(btn.dataset.idx));
  });

  // ── My Report: Copy profile ID ──
  document.getElementById("copyProfileIdBtn").addEventListener("click", () => {
    const id = document.getElementById("patientProfileId").textContent;
    navigator.clipboard.writeText(id).then(() => toast("📋 Profile ID copied!")).catch(() => toast("Copy: " + id));
  });

  boot();
});
