
document.addEventListener("DOMContentLoaded", async () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    const doc = await db.collection("users").doc(user.uid).get();

    if (!doc.exists) {
      auth.signOut();
      window.location.href = "index.html";
      return;
    }

    const role = doc.data().role;

    const page = window.location.pathname;

    // ADMIN
    if (role === "admin" && !page.includes("admin.html")) {
      window.location.href = "admin.html";
    }

    // PROFESOR
    if (role === "profesor" && !page.includes("profesor.html")) {
      window.location.href = "profesor.html";
    }

    // ALUMNO
    if (role === "alumno" && !page.includes("alumno.html")) {
      window.location.href = "alumno.html";
    }
  });
});
