import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCA9E0Xpz_7DmzS24R1-Ps3QuqXc8ZMlyA",
    authDomain: "cashregister-fc41b.firebaseapp.com",
    databaseURL: "https://cashregister-fc41b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cashregister-fc41b",
    storageBucket: "cashregister-fc41b.appspot.com",
    messagingSenderId: "189218978752",
    appId: "1:189218978752:web:757d7fede02559d146a625"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
