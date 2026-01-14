const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
