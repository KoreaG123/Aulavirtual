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
      auth.signOut();
      location.href = "index.html";
      return;
    }

    const role = doc.data().role;
    const page = location.pathname;

    if (role === "admin" && !page.includes("admin.html"))
      location.href = "admin.html";

    if (role === "profesor" && !page.includes("profesor.html"))
      location.href = "profesor.html";

    if (role === "alumno" && !page.includes("alumno.html"))
      location.href = "alumno.html";
  });
});
