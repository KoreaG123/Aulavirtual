document.addEventListener("DOMContentLoaded", async () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    document.getElementById("userName").textContent =
      user.displayName || "Alumno";

    document.getElementById("userEmail").textContent = user.email;

    // 🔥 CARGAR CURSOS
    const coursesDiv = document.getElementById("courses");
    coursesDiv.innerHTML = "Cargando cursos...";

    try {
      const snapshot = await db.collection("courses").get();
      coursesDiv.innerHTML = "";

      if (snapshot.empty) {
        coursesDiv.innerHTML = "<p>No hay cursos disponibles</p>";
        return;
      }

      snapshot.forEach(doc => {
        const course = doc.data();

        const card = document.createElement("div");
        card.className = "course-card";
        card.innerHTML = `
          <h3>${course.title}</h3>
          <p>${course.description}</p>
          <iframe 
            src="${course.videoUrl}" 
            allowfullscreen>
          </iframe>
        `;

        coursesDiv.appendChild(card);
      });

    } catch (e) {
      coursesDiv.innerHTML = "<p>Error al cargar cursos</p>";
      console.error(e);
    }
  });

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
