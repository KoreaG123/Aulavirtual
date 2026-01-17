document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const list = document.getElementById("coursesList");

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    const doc = await db.collection("users").doc(user.uid).get();
    if (!doc.exists || doc.data().role !== "alumno") {
      alert("Acceso denegado");
      location.href = "index.html";
      return;
    }

    cargarCursos();
  });

  async function cargarCursos() {
    list.innerHTML = "";

    const snapshot = await db.collection("courses").get();

    if (snapshot.empty) {
      list.innerHTML = "<li>No hay cursos aún</li>";
      return;
    }

    snapshot.forEach(doc => {
      const curso = doc.data();

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${curso.title}</strong><br>
        ${curso.description}
        <hr>
      `;

      list.appendChild(li);
    });
  }

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
