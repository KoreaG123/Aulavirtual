console.log("AUTH JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {

  const auth = firebase.auth();
  const db = firebase.firestore();

  const loginBtn = document.getElementById("loginBtn");
  const googleBtn = document.getElementById("googleBtn");
  const registerBtn = document.getElementById("registerBtn");
  const msg = document.getElementById("message");

  // 🔒 Seguridad básica DOM
  if (!loginBtn || !googleBtn || !registerBtn) {
    console.warn("Auth.js cargado en una página sin formulario");
    return;
  }

  /* =======================
     LOGIN EMAIL / PASSWORD
  ======================= */
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    msg.textContent = "";

    if (!email || !password) {
      msg.textContent = "Completa todos los campos";
      return;
    }

    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      await redirectByRole(cred.user.uid);
    } catch (err) {
      msg.textContent = "Correo o contraseña incorrectos";
    }
  });

  /* =======================
     LOGIN GOOGLE
  ======================= */
  googleBtn.addEventListener("click", async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      const ref = db.collection("users").doc(user.uid);
      const snap = await ref.get();

      // 👉 Usuario nuevo = guest
      if (!snap.exists) {
        await ref.set({
          name: user.displayName || "Usuario",
          email: user.email,
          role: "guest",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        location.href = "welcome.html";
        return;
      }

      await redirectByRole(user.uid);

    } catch (err) {
      alert("Error al iniciar sesión con Google");
    }
  });

  /* =======================
     REGISTRO
  ======================= */
  registerBtn.addEventListener("click", async () => {
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const pass = document.getElementById("registerPassword").value.trim();
    const pass2 = document.getElementById("registerPasswordConfirm").value.trim();

    msg.textContent = "";

    if (!name || !email || !pass || !pass2) {
      msg.textContent = "Completa todos los campos";
      return;
    }

    if (pass !== pass2) {
      msg.textContent = "Las contraseñas no coinciden";
      return;
    }

    try {
      const cred = await auth.createUserWithEmailAndPassword(email, pass);

      await db.collection("users").doc(cred.user.uid).set({
        name,
        email,
        role: "guest",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      location.href = "welcome.html";

    } catch (err) {
      msg.textContent = "No se pudo crear la cuenta";
    }
  });

  /* =======================
     REDIRECCIÓN POR ROL
  ======================= */
  async function redirectByRole(uid) {
    try {
      const doc = await db.collection("users").doc(uid).get();

      if (!doc.exists) {
        await auth.signOut();
        alert("Usuario sin rol asignado");
        return;
      }

      const role = doc.data().role;

      if (role === "admin") {
        location.href = "admin.html";
      } 
      else if (role === "profesor") {
        location.href = "profesor.html";
      } 
      else if (role === "alumno") {
        location.href = "dashboard.html";
      } 
      else {
        location.href = "welcome.html";
      }

    } catch (err) {
      alert("Error al verificar permisos");
      auth.signOut();
    }
  }

  /* =======================
     HELPERS UI
  ======================= */
  window.showRegister = () => {
    document.getElementById("loginForm").classList.remove("active");
    document.getElementById("registerForm").classList.add("active");
  };

  window.showLogin = () => {
    document.getElementById("registerForm").classList.remove("active");
    document.getElementById("loginForm").classList.add("active");
  };

  window.resetPassword = () => {
    const email = document.getElementById("loginUsername").value;
    if (!email) return alert("Ingresa tu correo");

    auth.sendPasswordResetEmail(email)
      .then(() => alert("Correo enviado"))
      .catch(() => alert("No se pudo enviar el correo"));
  };

});
