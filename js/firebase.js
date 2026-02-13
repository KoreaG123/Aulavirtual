// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaMirones",
  authDomain: "aula",
  projectId: "aulavir",
  storageBucket: "aula",
  messagingSenderId: "10",
  appId: "1:10"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
