import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyAlztMMVXKXA5oSVpwe0XthJ6TWNe31BSo",
//   authDomain: "fir-course-beba9.firebaseapp.com",
//   projectId: "fir-course-beba9",
//   storageBucket: "fir-course-beba9.appspot.com",
//   messagingSenderId: "236316955671",
//   appId: "1:236316955671:web:2b18d92e1b6644fae3f852",
//   measurementId: "G-HENJ7D82KH",
// };

const firebaseConfig = {
  apiKey: "AIzaSyBRmaWREo6bqsRwQl_EZ0x2ol3FC8mandM",
  authDomain: "react-firebase-536ea.firebaseapp.com",
  projectId: "react-firebase-536ea",
  storageBucket: "react-firebase-536ea.appspot.com",
  messagingSenderId: "952324205550",
  appId: "1:952324205550:web:65e3fcd6ef12233bde3cff",
  measurementId: "G-2H2026Q37S",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
