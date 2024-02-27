// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_8qxjHRDHRiPBCC4ZdIEsxHZUf4qSs4M",
  authDomain: "financely-react-27072.firebaseapp.com",
  projectId: "financely-react-27072",
  storageBucket: "financely-react-27072.appspot.com",
  messagingSenderId: "734839127157",
  appId: "1:734839127157:web:b754bc7232062bcce70c3c",
  measurementId: "G-VK2DGKPXGM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, analytics, db, auth, provider , doc , setDoc };