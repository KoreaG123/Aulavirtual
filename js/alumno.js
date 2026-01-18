console.log("ALUMNO JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const container = document.getElementById("coursesList");

  auth.onAuthStateChanged(async (user) => {
    if (!user) return location.href = "index.html";

    const me = await db.collection("users").doc(user.uid).get();
    if (!me.exists || me.data().role !== "alumno") {
      alert("Acceso denegado");
      return location.href = "index.html";
    }

    loadCourses();
  });

  async function loadCourses() {
    container.innerHTML = "";

    const snapshot = await db.collection("courses")
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) {
      container.innerHTML = "<p>No hay cursos aún</p>";
      return;
    }

    snapshot.forEach(doc => {
      const c = doc.data();

      container.innerHTML += `
        <div class="course-card">
          <h3>${c.title}</h3>
          <p>${c.description}</p>
          <video src="${c.videoUrl}" controls width="100%"></video>
        </div>
        <hr>
      `;
    });
  }

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
