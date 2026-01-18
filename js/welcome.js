const auth = firebase.auth();
const db = firebase.firestore();

// PROTEGER PÁGINA
auth.onAuthStateChanged(async user => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  const doc = await db.collection("users").doc(user.uid).get();

  if (!doc.exists || doc.data().role !== "guest") {
    location.href = "alumno.html";
  }
});

// BOTÓN VOLVERTE ALUMNO
async function becomeStudent() {
  const user = auth.currentUser;
  if (!user) return;

  await db.collection("users").doc(user.uid).update({
    role: "alumno"
  });

  alert("🎉 ¡Felicidades! Ahora eres alumno");
  location.href = "alumno.html";
}

// LOGOUT
function logout() {
  auth.signOut().then(() => {
    location.href = "login.html";
  });
}
