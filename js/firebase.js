// Configuración Firebase - obtén estos datos desde Firebase Console
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};

//Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencia a Auth para usar en otros archivos
const auth = firebase.auth();
