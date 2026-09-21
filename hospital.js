import {
  initFirebase, loginHospital, logoutHospital, onHospitalAuthStateChanged,
  loadDoctorsFromDB, saveDoctorToDB, toggleDoctorInDB,
  loadEquipmentFromDB, saveEquipmentToDB, saveCustomItemToDB, updateCustomItemCountInDB, deleteCustomItemFromDB, subscribeToEquipment,
  loadAlertsFromDB, pushAlertToDB, markAlertSeenInDB, markAllAlertsSeenInDB, subscribeToAlerts,
  lookupPatientByProfileId
} from "./firebase.js";

const defaultEquipment = {
  icuBeds: 10,
  ventilators: 5,
  ambulances: 3,
  custom: []
};

let hospitalState = {
  doctors: [],
  equipment: { ...defaultEquipment },
  alerts: []
};

async function fetchHospitalData() {
  const [docs, equip] = await Promise.all([
    loadDoctorsFromDB(),
    loadEquipmentFromDB()
  ]);
  
  if (docs) hospitalState.doctors = docs;
  if (equip) {
    hospitalState.equipment.icuBeds = equip.icuBeds || 0;
    hospitalState.equipment.ventilators = equip.ventilators || 0;
    hospitalState.equipment.ambulances = equip.ambulances || 0;
    if (equip.custom) {
      hospitalState.equipment.custom = Object.keys(equip.custom).map(k => ({ id: k, ...equip.custom[k] }));
    } else {
      hospitalState.equipment.custom = [];
    }
  } else {
    // initialize defaults if nothing in DB
    saveEquipmentToDB(defaultEquipment);
  }
  
  renderDashboard();
}

function renderDashboard() {
  document.getElementById("doctorCount").textContent = hospitalState.doctors.length;
  document.getElementById("icuCount").textContent = hospitalState.equipment.icuBeds;
  document.getElementById("ventilatorCount").textContent = hospitalState.equipment.ventilators;
  document.getElementById("ambulanceCount").textContent = hospitalState.equipment.ambulances;
  document.getElementById("inputIcuBeds").value = hospitalState.equipment.icuBeds;
  document.getElementById("inputVentilators").value = hospitalState.equipment.ventilators;
  document.getElementById("inputAmbulances").value = hospitalState.equipment.ambulances;
  renderDoctorList();
  renderCustomEquipment();
  updateDoctorSummary();
}

function renderDoctorList() {
  const list = document.getElementById("doctorList");
  list.innerHTML = hospitalState.doctors.map(doctor => {
    const statusLabel = doctor.available ? "Available" : "Busy";
    const badgeClass = doctor.available ? "status-available" : "status-busy";
    return `
      <div class="doctor-card">
        <div class="doctor-meta">
          <strong>${doctor.name}</strong>
          <p class="text-sm text-slate-500">ID: ${doctor.id.toUpperCase()}</p>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <span class="doctor-status ${badgeClass}">${statusLabel}</span>
          <button class="btn-secondary toggle-doctor-button" data-doctor-id="${doctor.id}">Toggle</button>
        </div>
      </div>`;
  }).join("");
}

function updateDoctorSummary() {
  const available = hospitalState.doctors.filter(doc => doc.available).length;
  const busy = hospitalState.doctors.length - available;
  document.getElementById("doctorStatusSummary").textContent = `${available} available / ${busy} busy`;
}

function renderCustomEquipment() {
  const list = document.getElementById("customEquipmentList");
  list.innerHTML = hospitalState.equipment.custom.map(item => `
    <div class="custom-equipment-row">
      <div>
        <strong>${item.name}</strong>
        <small>Count: ${item.count}</small>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-secondary decrease-custom-item" data-item-id="${item.id}">-</button>
        <button class="btn-secondary increase-custom-item" data-item-id="${item.id}">+</button>
        <button class="btn-secondary remove-custom-item" data-item-id="${item.id}">Remove</button>
      </div>
    </div>`).join("");
}

function renderAlerts() {
  const list = document.getElementById("alertList");
  const unseen = hospitalState.alerts.filter(a => !a.seen);
  if (!unseen.length) {
    list.innerHTML = `<div class="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm text-center text-slate-400"><p class="text-2xl mb-2">✅</p><p class="text-sm font-semibold">No active alerts. Everything is under control.</p></div>`;
    return;
  }
  list.innerHTML = unseen.map(alert => {
    const urgencyText = alert.urgency === "high" ? "🔴 Urgent" : "🟢 Normal";
    const rootClass = alert.urgency === "high" ? "alert-card urgent" : "alert-card";
    return `
      <div class="${rootClass}">
        <div class="min-w-0">
          <strong>${alert.title}</strong>
          <p>${alert.message}</p>
          <p class="text-xs text-slate-400 mt-1">Arrival: ${alert.time} · ${urgencyText}</p>
        </div>
        <button class="btn-secondary mark-alert-seen" data-alert-id="${alert.id}">Mark seen</button>
      </div>`;
  }).join("");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.add("hidden"), 2800);
}

function playUrgencyTone() {
  if (!window.AudioContext) return;
  const audio = new AudioContext();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 680;
  gain.gain.value = 0.06;
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + 0.16);
  oscillator.onended = () => audio.close();
}

async function addDoctor() {
  const nameInput = document.getElementById("doctorName");
  const statusInput = document.getElementById("doctorStatus");
  const name = nameInput.value.trim();
  if (!name) {
    showToast("Enter a valid doctor name.");
    return;
  }
  const newDoctor = { id: `doc-${Date.now()}`, name, available: statusInput.value === "available" };
  await saveDoctorToDB(newDoctor);
  hospitalState.doctors.unshift(newDoctor);
  renderDoctorList();
  updateDoctorSummary();
  nameInput.value = "";
  showToast("Doctor added to roster.");
}

async function toggleDoctorAvailability(doctorId) {
  const doctor = hospitalState.doctors.find(item => item.id === doctorId);
  if (!doctor) return;
  doctor.available = !doctor.available;
  await toggleDoctorInDB(doctorId, doctor.available);
  renderDoctorList();
  updateDoctorSummary();
  showToast(`${doctor.name} is now ${doctor.available ? "available" : "busy"}.`);
}

async function updateEquipmentInventory() {
  hospitalState.equipment.icuBeds = Number(document.getElementById("inputIcuBeds").value) || 0;
  hospitalState.equipment.ventilators = Number(document.getElementById("inputVentilators").value) || 0;
  hospitalState.equipment.ambulances = Number(document.getElementById("inputAmbulances").value) || 0;
  await saveEquipmentToDB(hospitalState.equipment);
  renderDashboard();
  showToast("Equipment inventory updated.");
}

async function toggleCustomItemCount(itemId, delta) {
  const item = hospitalState.equipment.custom.find(entry => entry.id === itemId);
  if (!item) return;
  item.count = Math.max(0, item.count + delta);
  await updateCustomItemCountInDB(itemId, item.count);
  renderCustomEquipment();
}

async function removeCustomEquipment(itemId) {
  await deleteCustomItemFromDB(itemId);
  hospitalState.equipment.custom = hospitalState.equipment.custom.filter(item => item.id !== itemId);
  renderCustomEquipment();
}

function showAddCustomEquipmentForm() {
  document.getElementById("newCustomEquipmentForm").classList.toggle("hidden");
}

async function saveCustomEquipment() {
  const nameInput = document.getElementById("customEquipmentName");
  const countInput = document.getElementById("customEquipmentCount");
  const name = nameInput.value.trim();
  const count = Number(countInput.value) || 0;
  if (!name || count < 0) {
    showToast("Provide a valid name and count.");
    return;
  }
  const newItem = { id: `custom-${Date.now()}`, name, count };
  await saveCustomItemToDB(newItem);
  hospitalState.equipment.custom.push(newItem);
  renderCustomEquipment();
  nameInput.value = "";
  countInput.value = "";
  showToast("Custom equipment added.");
}

async function createAlert() {
  const newAlert = {
    title: "Emergency arriving in 5 mins",
    message: "Critical case en route to emergency bay.",
    urgency: "high",
    time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    seen: false,
  };
  await pushAlertToDB(newAlert);
  showToast("Urgent arrival alert created.");
}

async function markAlertSeen(alertId) {
  await markAlertSeenInDB(alertId);
  showToast("Alert marked as seen.");
}

async function markAllAlertsSeen() {
  await markAllAlertsSeenInDB();
  showToast("All alerts are marked seen.");
}

async function fetchReport() {
  const patientId = document.getElementById("patientIdInput").value.trim().toUpperCase();
  if (!patientId) {
    showToast("Enter a Patient ID to fetch report.");
    return;
  }
  document.getElementById("fetchReportButton").textContent = "Fetching...";
  const data = await lookupPatientByProfileId(patientId);
  document.getElementById("fetchReportButton").textContent = "Fetch Patient Details";
  
  const reportCard = document.getElementById("reportCard");
  const emptyState = document.getElementById("reportEmptyState");
  if (!data || !data.profile) {
    reportCard.classList.add("hidden");
    emptyState.classList.remove("hidden");
    emptyState.innerHTML = `<p class="font-semibold">No report found for ${patientId}. Please verify the ID.</p>`;
    showToast("Report not found.");
    return;
  }
  
  const profile = data.profile;
  const reports = data.reports || [];
  
  document.getElementById("reportPatientName").textContent = profile.name || "Unknown";
  document.getElementById("reportPatientDetails").textContent = `${patientId} • Age ${profile.age || "N/A"}`;
  document.getElementById("reportHistory").textContent = profile.history || "None";
  document.getElementById("reportDiagnosis").textContent = "See uploaded reports" + (reports.length ? ` (${reports.length} file/s)` : "");
  document.getElementById("reportAllergies").textContent = profile.allergies || "None";
  emptyState.classList.add("hidden");
  reportCard.classList.remove("hidden");
  showToast("Patient report loaded.");
}

async function handleLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const pwd = document.getElementById("loginPassword").value;
  if (!email || !pwd) { showToast("Enter email and password."); return; }
  
  const btn = document.getElementById("loginButton");
  btn.textContent = "Signing In...";
  try {
    await loginHospital(email, pwd);
  } catch (err) {
    showToast("Login failed. Check credentials.");
    btn.textContent = "Sign In";
  }
}

async function handleLogout() {
  await logoutHospital();
}

function bindEventHandlers() {
  document.getElementById("loginButton").addEventListener("click", handleLogin);
  document.getElementById("logoutButton").addEventListener("click", handleLogout);
  document.getElementById("addDoctorButton").addEventListener("click", addDoctor);
  document.getElementById("saveEquipmentButton").addEventListener("click", updateEquipmentInventory);
  document.getElementById("newAlertButton").addEventListener("click", createAlert);
  document.getElementById("markAllSeenButton").addEventListener("click", markAllAlertsSeen);
  document.getElementById("addCustomItemButton").addEventListener("click", showAddCustomEquipmentForm);
  document.getElementById("saveCustomEquipmentButton").addEventListener("click", saveCustomEquipment);
  document.getElementById("fetchReportButton").addEventListener("click", fetchReport);

  document.addEventListener("click", event => {
    if (event.target.matches(".toggle-doctor-button")) {
      toggleDoctorAvailability(event.target.dataset.doctorId);
    }
    if (event.target.matches(".decrease-custom-item")) {
      toggleCustomItemCount(event.target.dataset.itemId, -1);
    }
    if (event.target.matches(".increase-custom-item")) {
      toggleCustomItemCount(event.target.dataset.itemId, 1);
    }
    if (event.target.matches(".remove-custom-item")) {
      removeCustomEquipment(event.target.dataset.itemId);
    }
    if (event.target.matches(".mark-alert-seen")) {
      markAlertSeen(event.target.dataset.alertId);
    }
  });
}

let _dataInitialized = false;

async function initializeDashboard() {
  await initFirebase();
  bindEventHandlers();
  
  onHospitalAuthStateChanged(async (user) => {
    const authScreen = document.getElementById("authScreen");
    const dashboard = document.getElementById("dashboardShell");
    
    if (user) {
      authScreen.classList.add("hidden");
      dashboard.classList.remove("hidden");
      showToast("Logged in as " + user.email);
      
      if (!_dataInitialized) {
        _dataInitialized = true;
        // Setup real-time listener for alerts
        subscribeToAlerts((alerts) => {
          const previousUnseen = hospitalState.alerts.filter(a => !a.seen).length;
          hospitalState.alerts = alerts;
          const newUnseen = alerts.filter(a => !a.seen).length;
          renderAlerts();
          if (newUnseen > previousUnseen) {
            playUrgencyTone();
          }
        });
        
        // Setup real-time listener for equipment
        subscribeToEquipment((equip) => {
          if (!equip) return;
          hospitalState.equipment.icuBeds = equip.icuBeds || 0;
          hospitalState.equipment.ventilators = equip.ventilators || 0;
          hospitalState.equipment.ambulances = equip.ambulances || 0;
          if (equip.custom) {
            hospitalState.equipment.custom = Object.keys(equip.custom).map(k => ({ id: k, ...equip.custom[k] }));
          } else {
            hospitalState.equipment.custom = [];
          }
          renderCustomEquipment();
          document.getElementById("icuCount").textContent = hospitalState.equipment.icuBeds;
          document.getElementById("ventilatorCount").textContent = hospitalState.equipment.ventilators;
          document.getElementById("ambulanceCount").textContent = hospitalState.equipment.ambulances;
        });

        // Ensure first tab is visible
        document.querySelectorAll(".h-tab-page").forEach((s, i) => {
          if (i === 0) s.classList.remove("hidden");
          else s.classList.add("hidden");
        });
        document.querySelectorAll("[data-htab]").forEach((b, i) => {
          b.classList.toggle("active", i === 0);
        });
        
        await fetchHospitalData();
      }
    } else {
      dashboard.classList.add("hidden");
      authScreen.classList.remove("hidden");
      document.getElementById("loginButton").textContent = "Sign In";
      document.getElementById("loginPassword").value = "";
    }
  });
}

window.addEventListener("DOMContentLoaded", initializeDashboard);
