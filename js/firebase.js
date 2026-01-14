// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYF_5PJHaClW8h4lwl_EXH5gSZqU57Xyk",
  authDomain: "aulavirtual-13e8d.firebaseapp.com",
  projectId: "aulavirtual-13e8d",
  storageBucket: "aulavirtual-13e8d.appspot.com",
  messagingSenderId: "1042049492955",
  appId: "1:1042049492955:web:e0a2e90a64528d705129fe"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Auth reference
const auth = firebase.auth();



<script>
  const auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    if (!user) {
      // Si no hay sesión → regresar al login
      window.location.href = "index.html";
    } else {
      // Mostrar datos del usuario
      document.getElementById("userName").textContent =
        user.displayName || "Usuario";
      document.getElementById("userEmail").textContent = user.email;
    }
  });

  function logout() {
    auth.signOut().then(() => {
      window.location.href = "index.html";
    });
  }
</script>
