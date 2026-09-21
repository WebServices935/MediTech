// ============================================================
//  firebase.js — MediTech Full Backend
//  Services used:
//    • Firestore     → Hospital directory
//    • Realtime DB   → Patient profiles | Hospital state | Alerts
//    • Storage       → Patient medical report files
// ============================================================

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getFirestore, collection, getDocs, addDoc, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  getDatabase, ref, set, get, push, update, remove,
  onValue, off, serverTimestamp as rtdbTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import {
  getStorage, ref as storageRef,
  uploadBytes, getDownloadURL, deleteObject,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ─────────────────────────────────────────────────────────────
//  Firebase Config
// ─────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyB97wZhoRa7LDk37uTPboWnjlX2XuW5tHU",
  authDomain:        "meditech-bb963.firebaseapp.com",
  databaseURL:       "https://meditech-bb963-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "meditech-bb963",
  storageBucket:     "meditech-bb963.firebasestorage.app",
  messagingSenderId: "416589177581",
  appId:             "1:416589177581:web:7a1e1610cb279a116462e4",
  measurementId:     "G-J780VWLY16",
};

// ─────────────────────────────────────────────────────────────
//  Module-level handles
// ─────────────────────────────────────────────────────────────
let _app     = null;
let _db      = null;   // Firestore
let _rtdb    = null;   // Realtime Database
let _storage = null;   // Firebase Storage
let _auth    = null;   // Firebase Auth
let _ready   = false;

// ─────────────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────────────
export async function initFirebase() {
  try {
    _app     = initializeApp(firebaseConfig);
    _db      = getFirestore(_app);
    _rtdb    = getDatabase(_app);
    _storage = getStorage(_app);
    _auth    = getAuth(_app);
    _ready   = true;
    console.log("[MediTech] Firebase connected ✓");
    return true;
  } catch (err) {
    console.error("[MediTech] Firebase init failed:", err);
    return false;
  }
}

function assertReady(svc = "Firebase") {
  if (!_ready) throw new Error(`${svc} not initialised. Call initFirebase() first.`);
}

// ════════════════════════════════════════════════════════════
//  FIREBASE AUTH — Hospital Login
// ════════════════════════════════════════════════════════════

export async function loginHospital(email, password) {
  assertReady();
  try {
    const userCredential = await signInWithEmailAndPassword(_auth, email, password);
    return userCredential.user;
  } catch (err) {
    console.error("[MediTech] Login error:", err);
    throw err;
  }
}

export async function logoutHospital() {
  assertReady();
  try {
    await signOut(_auth);
  } catch (err) {
    console.error("[MediTech] Logout error:", err);
    throw err;
  }
}

export function onHospitalAuthStateChanged(callback) {
  assertReady();
  return onAuthStateChanged(_auth, callback);
}

// ════════════════════════════════════════════════════════════
//  FIRESTORE — Hospital Directory
// ════════════════════════════════════════════════════════════

export async function fetchHospitalsFromFirestore() {
  if (!_ready) return null;
  try {
    const snap = await getDocs(collection(_db, "hospitals"));
    const hospitals = [];
    snap.forEach(d => hospitals.push({ id: d.id, ...d.data() }));
    console.log(`[MediTech] Loaded ${hospitals.length} hospitals from Firestore`);
    return hospitals.length ? hospitals : null;
  } catch (err) {
    console.error("[MediTech] Firestore fetch error:", err);
    return null;
  }
}

export async function seedFirestoreIfEmpty(hospitals) {
  if (!_ready) return;
  try {
    const snap = await getDocs(collection(_db, "hospitals"));
    if (!snap.empty) return;
    const col = collection(_db, "hospitals");
    for (const h of hospitals) {
      await addDoc(col, { ...h, createdAt: serverTimestamp() });
    }
    console.log("[MediTech] Firestore seeded with", hospitals.length, "hospitals.");
  } catch (err) {
    console.error("[MediTech] Seeding error:", err);
  }
}

// ════════════════════════════════════════════════════════════
//  REALTIME DATABASE — Patient Profile
//  Path: /patients/{profileId}/profile
// ════════════════════════════════════════════════════════════

export async function savePatientProfileToDB(profileId, profileData) {
  assertReady();
  try {
    await set(ref(_rtdb, `patients/${profileId}/profile`), {
      ...profileData,
      updatedAt: rtdbTimestamp(),
    });
    console.log("[MediTech] Patient profile saved:", profileId);
    return true;
  } catch (err) {
    console.error("[MediTech] Save profile error:", err);
    return false;
  }
}

export async function loadPatientProfileFromDB(profileId) {
  assertReady();
  try {
    const snap = await get(ref(_rtdb, `patients/${profileId}/profile`));
    return snap.exists() ? snap.val() : null;
  } catch (err) {
    console.error("[MediTech] Load profile error:", err);
    return null;
  }
}

// ════════════════════════════════════════════════════════════
//  FIREBASE STORAGE + RTDB — Patient Medical Reports
//  Storage: /patients/{profileId}/reports/{filename}
//  RTDB:    /patients/{profileId}/reports/{pushKey}
// ════════════════════════════════════════════════════════════

export async function uploadPatientReport(profileId, file, note) {
  assertReady();
  try {
    // 1. Upload file to Storage
    const filename  = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const fileRef   = storageRef(_storage, `patients/${profileId}/reports/${filename}`);
    const snap      = await uploadBytes(fileRef, file);
    const url       = await getDownloadURL(snap.ref);

    // 2. Save metadata to RTDB
    const meta = {
      name:      file.name,
      note:      note || file.name,
      type:      file.type,
      storagePath: snap.ref.fullPath,
      url,
      dateLabel: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      uploadedAt: rtdbTimestamp(),
    };
    const reportRef = await push(ref(_rtdb, `patients/${profileId}/reports`), meta);
    console.log("[MediTech] Report uploaded:", reportRef.key);
    return { key: reportRef.key, ...meta };
  } catch (err) {
    console.error("[MediTech] Upload report error:", err);
    throw err;
  }
}

export async function loadPatientReportsFromDB(profileId) {
  assertReady();
  try {
    const snap = await get(ref(_rtdb, `patients/${profileId}/reports`));
    if (!snap.exists()) return [];
    const reports = [];
    snap.forEach(child => reports.unshift({ key: child.key, ...child.val() }));
    return reports;
  } catch (err) {
    console.error("[MediTech] Load reports error:", err);
    return [];
  }
}

export async function deletePatientReportFromDB(profileId, reportKey, storagePath) {
  assertReady();
  try {
    // Delete from RTDB
    await remove(ref(_rtdb, `patients/${profileId}/reports/${reportKey}`));
    // Delete from Storage
    if (storagePath) {
      await deleteObject(storageRef(_storage, storagePath)).catch(() => {});
    }
    console.log("[MediTech] Report deleted:", reportKey);
    return true;
  } catch (err) {
    console.error("[MediTech] Delete report error:", err);
    return false;
  }
}

// ════════════════════════════════════════════════════════════
//  REALTIME DATABASE — Hospital State
//  Path: /hospital/doctors | /hospital/equipment | /hospital/alerts
// ════════════════════════════════════════════════════════════

// ── Doctors ──────────────────────────────────────────────────

export async function loadDoctorsFromDB() {
  assertReady();
  try {
    const snap = await get(ref(_rtdb, "hospital/doctors"));
    if (!snap.exists()) return null;
    const docs = [];
    snap.forEach(child => docs.push({ id: child.key, ...child.val() }));
    return docs;
  } catch (err) {
    console.error("[MediTech] Load doctors error:", err);
    return null;
  }
}

export async function saveDoctorToDB(doctor) {
  assertReady();
  try {
    await set(ref(_rtdb, `hospital/doctors/${doctor.id}`), {
      name:      doctor.name,
      available: doctor.available,
      updatedAt: rtdbTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("[MediTech] Save doctor error:", err);
    return false;
  }
}

export async function toggleDoctorInDB(doctorId, available) {
  assertReady();
  try {
    await update(ref(_rtdb, `hospital/doctors/${doctorId}`), {
      available,
      updatedAt: rtdbTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("[MediTech] Toggle doctor error:", err);
    return false;
  }
}

// ── Equipment ─────────────────────────────────────────────────

export async function loadEquipmentFromDB() {
  assertReady();
  try {
    const snap = await get(ref(_rtdb, "hospital/equipment"));
    return snap.exists() ? snap.val() : null;
  } catch (err) {
    console.error("[MediTech] Load equipment error:", err);
    return null;
  }
}

export async function saveEquipmentToDB(equipmentData) {
  assertReady();
  try {
    await update(ref(_rtdb, "hospital/equipment"), {
      icuBeds:    equipmentData.icuBeds,
      ventilators:equipmentData.ventilators,
      ambulances: equipmentData.ambulances,
      updatedAt:  rtdbTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("[MediTech] Save equipment error:", err);
    return false;
  }
}

export async function saveCustomItemToDB(item) {
  assertReady();
  try {
    await set(ref(_rtdb, `hospital/equipment/custom/${item.id}`), {
      name:  item.name,
      count: item.count,
    });
    return true;
  } catch (err) {
    console.error("[MediTech] Save custom item error:", err);
    return false;
  }
}

export async function updateCustomItemCountInDB(itemId, count) {
  assertReady();
  try {
    await update(ref(_rtdb, `hospital/equipment/custom/${itemId}`), { count });
    return true;
  } catch (err) {
    console.error("[MediTech] Update custom item error:", err);
    return false;
  }
}

export async function deleteCustomItemFromDB(itemId) {
  assertReady();
  try {
    await remove(ref(_rtdb, `hospital/equipment/custom/${itemId}`));
    return true;
  } catch (err) {
    console.error("[MediTech] Delete custom item error:", err);
    return false;
  }
}

// ── Alerts ────────────────────────────────────────────────────

export async function loadAlertsFromDB() {
  assertReady();
  try {
    const snap = await get(ref(_rtdb, "hospital/alerts"));
    if (!snap.exists()) return [];
    const alerts = [];
    snap.forEach(child => alerts.unshift({ id: child.key, ...child.val() }));
    return alerts;
  } catch (err) {
    console.error("[MediTech] Load alerts error:", err);
    return [];
  }
}

export async function pushAlertToDB(alertData) {
  assertReady();
  try {
    const alertRef = await push(ref(_rtdb, "hospital/alerts"), {
      ...alertData,
      createdAt: rtdbTimestamp(),
    });
    return alertRef.key;
  } catch (err) {
    console.error("[MediTech] Push alert error:", err);
    return null;
  }
}

export async function markAlertSeenInDB(alertId) {
  assertReady();
  try {
    await update(ref(_rtdb, `hospital/alerts/${alertId}`), { seen: true });
    return true;
  } catch (err) {
    console.error("[MediTech] Mark alert seen error:", err);
    return false;
  }
}

export async function markAllAlertsSeenInDB() {
  assertReady();
  try {
    const snap = await get(ref(_rtdb, "hospital/alerts"));
    if (!snap.exists()) return;
    const updates = {};
    snap.forEach(child => { updates[`hospital/alerts/${child.key}/seen`] = true; });
    await update(ref(_rtdb), updates);
    return true;
  } catch (err) {
    console.error("[MediTech] Mark all seen error:", err);
    return false;
  }
}

// ── Real-time listener for alerts (hospital dashboard) ────────

let _alertsListener = null;

export function subscribeToAlerts(callback) {
  if (!_ready) return;
  const alertsRef = ref(_rtdb, "hospital/alerts");
  _alertsListener = onValue(alertsRef, snap => {
    const alerts = [];
    if (snap.exists()) snap.forEach(child => alerts.unshift({ id: child.key, ...child.val() }));
    callback(alerts);
  });
  return () => off(alertsRef, "value", _alertsListener);
}

// ── Real-time listener for hospital equipment ─────────────────

export function subscribeToEquipment(callback) {
  if (!_ready) return;
  const eqRef = ref(_rtdb, "hospital/equipment");
  onValue(eqRef, snap => {
    if (snap.exists()) callback(snap.val());
  });
  return () => off(eqRef);
}

// ── Patient report lookup by profileId (for hospital Reports tab) ──

export async function lookupPatientByProfileId(profileId) {
  assertReady();
  try {
    const [profileSnap, reportsSnap] = await Promise.all([
      get(ref(_rtdb, `patients/${profileId}/profile`)),
      get(ref(_rtdb, `patients/${profileId}/reports`)),
    ]);
    if (!profileSnap.exists()) return null;
    const profile = profileSnap.val();
    const reports = [];
    if (reportsSnap.exists()) {
      reportsSnap.forEach(c => reports.unshift({ key: c.key, ...c.val() }));
    }
    return { profile, reports };
  } catch (err) {
    console.error("[MediTech] Lookup patient error:", err);
    return null;
  }
}
