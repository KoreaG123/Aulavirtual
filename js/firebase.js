// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYF_5PJHaClW8h4lwl_EXH5gSZqU57Xyk",
  authDomain: "aulavirtual-13e8d.firebaseapp.com",
  projectId: "aulavirtual-13e8d",
  storageBucket: "aulavirtual-13e8d.appspot.com",
  messagingSenderId: "1042049492955",
  appId: "1:1042049492955:web:e0a2e90a64528d705129fe"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
