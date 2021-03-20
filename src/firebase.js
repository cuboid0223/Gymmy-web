import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCcTlCACx5wlGyUxYnAXDCzVpJst_J6odE",
  authDomain: "gymmy-web.firebaseapp.com",
  projectId: "gymmy-web",
  storageBucket: "gymmy-web.appspot.com",
  messagingSenderId: "270409726503",
  appId: "1:270409726503:web:2d4424d7c320f640952c02",
  measurementId: "G-HF0C3Z47VW",
});

const db = firebaseApp.firestore();
const auth = firebase.auth(); // log in func
const storage = firebase.storage(); // to upload image
const provider = new firebase.auth.GoogleAuthProvider();


export { auth, provider };
export default db;

//
