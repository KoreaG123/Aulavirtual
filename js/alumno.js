
document.addEventListener("DOMContentLoaded", async () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    const doc = await db.collection("users").doc(user.uid).get();

    if (!doc.exists || doc.data().role !== "alumno") {
      alert("Acceso denegado");
      window.location.href = "index.html";
      return;
    }

    console.log("Alumno autorizado");
  });
});
