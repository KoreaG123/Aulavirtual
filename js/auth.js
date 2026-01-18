console.log("AUTH JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {

  const auth = firebase.auth();
  const db = firebase.firestore();

  /* =======================
     LOGIN EMAIL / PASSWORD
  ======================= */
  const loginBtn = document.getElementById("loginBtn");
  const googleBtn = document.getElementById("googleBtn");
  const registerBtn = document.getElementById("registerBtn");
  const msg = document.getElementById("message");

  if (!loginBtn || !googleBtn || !registerBtn) {
    console.error("❌ Botones no encontrados en el DOM");
    return;
  }

  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    msg.textContent = "";

    if (!email || !password) {
      msg.textContent = "Completa todos los campos";
      return;
    }

    try {
      await auth.signInWithEmailAndPassword(email, password);
      location.href = "dashboard.html";
    } catch (err) {
      msg.textContent = err.message;
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
      const doc = await ref.get();

      if (!doc.exists) {
        await ref.set({
          name: user.displayName || "Alumno",
          email: user.email,
          role: "alumno",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }

      location.href = "dashboard.html";
    } catch (err) {
      alert(err.message);
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
        role: "alumno",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      location.href = "dashboard.html";
    } catch (err) {
      msg.textContent = err.message;
    }
  });

  /* =======================
     HELPERS
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
      .catch(err => alert(err.message));
  };

});
