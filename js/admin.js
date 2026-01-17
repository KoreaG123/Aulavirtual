
document.addEventListener("DOMContentLoaded", async () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
    if (!user) return;

    const userDoc = await db.collection("users").doc(user.uid).get();

    if (!userDoc.exists || userDoc.data().role !== "admin") {
      alert("Acceso denegado");
      window.location.href = "index.html";
      return;
    }

    console.log("Admin autorizado");
  });
});

/* 🔥 CAMBIAR ROL DE USUARIOS */
async function cambiarRol(uid, nuevoRol) {
  const db = firebase.firestore();

  await db.collection("users").doc(uid).update({
    role: nuevoRol
  });

  alert("Rol actualizado");
}
