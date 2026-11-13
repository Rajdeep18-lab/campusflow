import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase keys are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your_api_key_here'
);

let app;
let auth;
let db;

if (isFirebaseConfigured) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn(
    '[CampusFlow] Firebase environment variables not detected or incomplete. ' +
    'Please configure VITE_FIREBASE_* variables in your .env or Vercel dashboard.'
  );
  // Provide a safe placeholder app if initialized to prevent crashes on import
  try {
    app = !getApps().length ? initializeApp({
      apiKey: 'dummy-api-key',
      authDomain: 'localhost',
      projectId: 'campusflow-demo',
      appId: '1:123456789:web:abcdef',
    }) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error('[CampusFlow] Error initializing fallback Firebase instance:', e);
  }
}

export { app, auth, db };
export default app;

