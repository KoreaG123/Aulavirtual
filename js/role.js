console.log("ROLE JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async user => {

    // ❌ No logueado
    if (!user) {
      return location.href = "index.html";
    }

    const snap = await db.collection("users").doc(user.uid).get();

    if (!snap.exists) {
      alert("Usuario sin permisos");
      return auth.signOut();
    }

    const role = snap.data().role;
    const page = window.location.pathname;

    /* ======================
       PROTECCIÓN POR ROL
    ====================== */

    // GUEST
    if (role === "guest") {
      if (!page.includes("welcome.html")) {
        return location.href = "welcome.html";
      }
    }

    // ALUMNO
    if (role === "alumno") {
      if (page.includes("admin.html")) {
        return location.href = "dashboard.html";
      }
    }

    // ADMIN
    if (role === "admin") {
      // acceso total
    }

    console.log("Acceso permitido:", role);
  });
});
