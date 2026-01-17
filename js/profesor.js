
document.addEventListener("DOMContentLoaded", async () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    const doc = await db.collection("users").doc(user.uid).get();

    if (!doc.exists || doc.data().role !== "profesor") {
      alert("Acceso denegado");
      window.location.href = "index.html";
      return;
    }

    console.log("Profesor autorizado");
  });
});

/* 📚 CREAR CURSO */
async function crearCurso(titulo, descripcion) {
  const db = firebase.firestore();

  await db.collection("courses").add({
    titulo,
    descripcion,
    creadoPor: firebase.auth().currentUser.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Curso creado");
}
