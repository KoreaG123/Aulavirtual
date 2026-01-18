document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    const doc = await db.collection("users").doc(user.uid).get();

    if (!doc.exists) {
      await auth.signOut();
      location.href = "index.html";
      return;
    }

    // ✅ SOLO validar sesión
    // ❌ NO redirigir aquí
  });
});
