console.log("AUTH JS CARGADO");

const auth = firebase.auth();
const db = firebase.firestore();

/* =======================
   LOGIN EMAIL / PASSWORD
======================= */
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const msg = document.getElementById("message");

  if (!email || !password) {
    msg.textContent = "Completa todos los campos";
    return;
  }

  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    await redirectByRole(cred.user);
  } catch (err) {
    msg.textContent = err.message;
  }
});

/* =======================
   LOGIN GOOGLE
======================= */
document.getElementById("googleBtn").addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    const result = await auth.signInWithPopup(provider);
    await redirectByRole(result.user);
  } catch (err) {
    alert(err.message);
  }
});

/* =======================
   REDIRECCIÓN POR ROL
======================= */
async function redirectByRole(user) {
  try {
    const ref = db.collection("users").doc(user.uid);
    const doc = await ref.get();

    // 👉 SI NO EXISTE, CREAR USUARIO POR DEFECTO
    if (!doc.exists) {
      await ref.set({
        name: user.displayName || "Alumno",
        email: user.email,
        role: "alumno",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      location.href = "alumno.html";
      return;
    }

    const role = doc.data().role;

    if (role === "admin") {
      location.href = "admin.html";
    } else if (role === "profesor") {
      location.href = "prof.html";
    } else {
      location.href = "alumno.html";
    }

  } catch (error) {
    alert("Error al redirigir: " + error.message);
  }
}

/* =======================
   REGISTRO
======================= */
document.getElementById("registerBtn").addEventListener("click", async () => {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const pass = document.getElementById("registerPassword").value.trim();
  const pass2 = document.getElementById("registerPasswordConfirm").value.trim();
  const msg = document.getElementById("message");

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

    location.href = "alumno.html";
  } catch (err) {
    msg.textContent = err.message;
  }
});

/* =======================
   UI HELPERS
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
