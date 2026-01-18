console.log("WELCOME JS CARGADO");

const auth = firebase.auth();
const db = firebase.firestore();

/* =======================
   CONTROL DE ACCESO
======================= */
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  try {
    const doc = await db.collection("users").doc(user.uid).get();

    if (!doc.exists) {
      await auth.signOut();
      location.href = "index.html";
      return;
    }

    const role = doc.data().role;

    // 🔒 Solo GUEST puede permanecer aquí
    if (role !== "guest") {
      if (role === "admin") location.href = "admin.html";
      else if (role === "profesor") location.href = "profesor.html";
      else if (role === "alumno") location.href = "dashboard.html";
    }

  } catch (err) {
    alert("Error al verificar permisos");
    auth.signOut();
    location.href = "index.html";
  }
});

/* =======================
   SOLICITAR ACCESO
======================= */
window.requestAccess = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const ref = db.collection("requests").doc(user.uid);
    const snap = await ref.get();

    if (snap.exists) {
      alert("⏳ Ya enviaste una solicitud. Espera aprobación.");
      return;
    }

    await ref.set({
      uid: user.uid,
      email: user.email,
      name: user.displayName || "Usuario",
      status: "pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("✅ Solicitud enviada. Un administrador la revisará.");

  } catch (err) {
    alert("❌ No se pudo enviar la solicitud");
  }
};
