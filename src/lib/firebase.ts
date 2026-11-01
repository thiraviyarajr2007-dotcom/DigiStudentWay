import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { AnalysisReport } from '../types';

// Check if Firebase config is provided in env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'digistudentway-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'digistudentway-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'digistudentway-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
};

export const isConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key' &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_api_key' &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'digistudentway-demo' &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'your-project'
);

let app: any;
let auth: any;
let db: any;

if (isConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.warn('Firebase initialization error:', e);
  }
}

// LocalStorage fallback key
const LOCAL_STORAGE_KEY = 'digi_saved_analyses';

export { auth, db };

/**
 * Saves an analysis report to Firestore under users/{uid}/analyses,
 * with graceful fallback to localStorage if offline or unconfigured.
 */
export async function saveAnalysisToStorage(userId: string, report: AnalysisReport): Promise<void> {
  // Always update localStorage as immediate resilient cache
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const filtered = existing.filter((item: AnalysisReport) => item.id !== report.id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([report, ...filtered]));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }

  // Attempt Firestore sync if configured
  if (isConfigured && db && userId) {
    try {
      const docRef = doc(db, 'users', userId, 'analyses', report.id);
      await setDoc(docRef, {
        ...report,
        savedAt: new Date().toISOString(),
      });
    } catch (fsErr) {
      console.warn('Firestore sync failed, local copy preserved:', fsErr);
    }
  }
}

/**
 * Retrieves past saved analyses from Firestore or localStorage fallback.
 */
export async function getSavedAnalysesFromStorage(userId?: string): Promise<AnalysisReport[]> {
  const localItems: AnalysisReport[] = (() => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  })();

  if (isConfigured && db && userId) {
    try {
      const q = query(
        collection(db, 'users', userId, 'analyses'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const remoteItems: AnalysisReport[] = [];
      snapshot.forEach(docSnap => {
        remoteItems.push(docSnap.data() as AnalysisReport);
      });
      if (remoteItems.length > 0) return remoteItems;
    } catch (fsErr) {
      console.warn('Firestore fetch failed, falling back to local cache:', fsErr);
    }
  }

  return localItems;
}

/**
 * Deletes an analysis from storage.
 */
export async function deleteAnalysisFromStorage(userId: string, reportId: string): Promise<void> {
  // Delete from local cache
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const updated = existing.filter((item: AnalysisReport) => item.id !== reportId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('LocalStorage delete error:', err);
  }

  // Delete from Firestore
  if (isConfigured && db && userId) {
    try {
      await deleteDoc(doc(db, 'users', userId, 'analyses', reportId));
    } catch (fsErr) {
      console.warn('Firestore delete error:', fsErr);
    }
  }
}

