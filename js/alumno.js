document.addEventListener("DOMContentLoaded", async () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const coursesList = document.getElementById("coursesList");

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    loadCourses();
  });

  async function loadCourses() {
    coursesList.innerHTML = "Cargando cursos...";

    try {
      const snapshot = await db.collection("courses").orderBy("createdAt", "desc").get();
      coursesList.innerHTML = "";

      if (snapshot.empty) {
        coursesList.innerHTML = "<p>No hay cursos disponibles.</p>";
        return;
      }

      snapshot.forEach(doc => {
        const course = doc.data();
        const div = document.createElement("div");
        div.className = "course-card";
        div.innerHTML = `
          <h3>${course.title}</h3>
          <p>${course.description || ""}</p>
          ${course.videoUrl ? `<video width="320" controls src="${course.videoUrl}"></video>` : ""}
          <hr>
        `;
        coursesList.appendChild(div);
      });

    } catch (err) {
      console.error(err);
      coursesList.innerHTML = "<p>Error al cargar los cursos.</p>";
    }
  }

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
