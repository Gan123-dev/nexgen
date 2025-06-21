import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzS7Buy0KNn2PYALbuChKzcokZPDdmWAY",
  authDomain: "mathlearn-46684.firebaseapp.com",
  projectId: "mathlearn-46684",
  storageBucket: "mathlearn-46684.firebasestorage.app",
  messagingSenderId: "124644359976",
  appId: "1:124644359976:web:26ce5e87c1adf69acc5a1d",
  measurementId: "G-RR483LP55F"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export default app;