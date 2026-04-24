// firebase.js — Firebase Firestore integration for Meditech

import { initializeApp }      from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore,
         collection,
         getDocs,
         addDoc,
         serverTimestamp }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ─────────────────────────────────────────────
//  🔧 REPLACE these values with your own Firebase project config
//  Go to: https://console.firebase.google.com
//  → Project Settings → Your Apps → Web App → SDK Config
// ─────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

let db   = null;
let app  = null;
let firebaseReady = false;

export async function initFirebase() {
  try {
    // Guard: placeholder config → skip Firebase, use fallback data
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
      console.warn("[Meditech] Firebase config not set – using offline fallback data.");
      return false;
    }

    app = initializeApp(firebaseConfig);
    db  = getFirestore(app);
    firebaseReady = true;
    console.log("[Meditech] Firebase connected ✓");
    return true;
  } catch (err) {
    console.error("[Meditech] Firebase init failed:", err);
    return false;
  }
}

// ── Fetch all hospitals from Firestore ──
export async function fetchHospitalsFromFirestore() {
  if (!firebaseReady || !db) return null;
  try {
    const snap = await getDocs(collection(db, "hospitals"));
    const hospitals = [];
    snap.forEach(doc => hospitals.push({ id: doc.id, ...doc.data() }));
    console.log(`[Meditech] Loaded ${hospitals.length} hospitals from Firestore`);
    return hospitals;
  } catch (err) {
    console.error("[Meditech] Firestore fetch error:", err);
    return null;
  }
}

// ── Seed Firestore with local data (call once if collection is empty) ──
export async function seedFirestoreIfEmpty(hospitals) {
  if (!firebaseReady || !db) return;
  try {
    const snap = await getDocs(collection(db, "hospitals"));
    if (!snap.empty) {
      console.log("[Meditech] Firestore already seeded.");
      return;
    }
    const col = collection(db, "hospitals");
    for (const h of hospitals) {
      await addDoc(col, { ...h, createdAt: serverTimestamp() });
    }
    console.log("[Meditech] Firestore seeded with", hospitals.length, "hospitals.");
  } catch (err) {
    console.error("[Meditech] Seeding error:", err);
  }
}
