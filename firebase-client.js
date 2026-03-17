import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

const PLACEHOLDER_PREFIX = 'YOUR_';

const hasRealValue = value => {
  return typeof value === 'string' && value.trim() !== '' && !value.startsWith(PLACEHOLDER_PREFIX);
};

const firebaseReady = Object.values(firebaseConfig).every(hasRealValue);
const firebaseSetupError = firebaseReady
  ? ''
  : 'Firebase is not configured yet. Replace the placeholder values in firebase-client.js with your Firebase project settings.';

const app = firebaseReady ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

const FIREBASE_COLLECTIONS = {
  admins: 'admins',
  leads: 'leads',
  projects: 'projects'
};

export {
  FIREBASE_COLLECTIONS,
  addDoc,
  auth,
  collection,
  db,
  deleteDoc,
  doc,
  firebaseConfig,
  firebaseReady,
  firebaseSetupError,
  getDoc,
  onAuthStateChanged,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  signInWithEmailAndPassword,
  signOut,
  updateDoc
};
