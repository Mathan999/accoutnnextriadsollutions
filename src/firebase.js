import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyD8ye-N3aG3N_ue_Ezcp9kudjddR7rE3VE",
  authDomain: "nextriadsolution-account.firebaseapp.com",
  databaseURL: "https://nextriadsolution-account-default-rtdb.firebaseio.com",
  projectId: "nextriadsolution-account",
  storageBucket: "nextriadsolution-account.firebasestorage.app",
  messagingSenderId: "480826735868",
  appId: "1:480826735868:web:c17643611d98ad46aaab79",
  measurementId: "G-N2H4VHZPPD"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);