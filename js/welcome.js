const auth = firebase.auth();
const db = firebase.firestore();

// PROTEGER LA PÁGINA
auth.onAuthStateChanged(async user => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  const ref = db.collection("users").doc(user.uid);
  const doc = await ref.get();

  // Si ya es alumno → dashboard
  if (doc.exists && doc.data().role === "alumno") {
    location.href = "dashboard.html";
  }
});

// VOLVERTE ALUMNO
document.getElementById("beStudentBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  await db.collection("users").doc(user.uid).update({
    role: "alumno"
  });

  alert("🎉 ¡Ahora eres alumno!");
  location.href = "dashboard.html";
});

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await auth.signOut();
  location.href = "index.html";
});
