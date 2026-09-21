import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

class FirebaseService {
  public app: FirebaseApp | null = null;
  public db: Firestore | null = null;
  public isConfigured: boolean = false;

  constructor() {
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      try {
        if (!getApps().length) {
          this.app = initializeApp(firebaseConfig);
        } else {
          this.app = getApps()[0];
        }
        this.db = getFirestore(this.app);
        this.isConfigured = true;
        console.log("Firebase initialized successfully.");
      } catch (e) {
        console.warn("Firebase initialization failed, operating in offline/local sync mode:", e);
        this.isConfigured = false;
      }
    } else {
      console.log("Firebase config not provided in .env, utilizing BroadcastChannel cross-tab synchronization.");
      this.isConfigured = false;
    }
  }
}

export const firebaseService = new FirebaseService();
