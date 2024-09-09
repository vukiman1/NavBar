// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdwNdsaJSygnysIChGFi_Oio6JnLlcsVc",
  authDomain: "navbar-2af6d.firebaseapp.com",
  projectId: "navbar-2af6d",
  storageBucket: "navbar-2af6d.appspot.com",
  messagingSenderId: "327533658716",
  appId: "1:327533658716:web:2941392e80a934e2fa9c99",
  measurementId: "G-BYF8W0RVH1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
