console.log("AUTH JS CARGADO");

const auth = firebase.auth();
const db = firebase.firestore();

// =======================
// LOGIN EMAIL / PASSWORD
// =======================
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
    redirectByRole(cred.user.uid);
  } catch (err) {
    msg.textContent = err.message;
  }
});

// =======================
// LOGIN GOOGLE
// =======================
document.getElementById("googleBtn").addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;

    const ref = db.collection("users").doc(user.uid);
    const snap = await ref.get();

    if (!snap.exists) {
      await ref.set({
        name: user.displayName,
        email: user.email,
        role: "alumno",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    redirectByRole(user.uid);
  } catch (err) {
    alert(err.message);
  }
});

// =======================
// REDIRECCIÓN POR ROL
// =======================
async function redirectByRole(uid) {
  const doc = await db.collection("users").doc(uid).get();

  if (!doc.exists) {
    alert("Usuario sin rol asignado");
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
}

// =======================
// REGISTRO
// =======================
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

// =======================
// UI HELPERS
// =======================
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
