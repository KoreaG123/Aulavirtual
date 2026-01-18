console.log("ALUMNO JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const list = document.getElementById("coursesList");

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    const me = await db.collection("users").doc(user.uid).get();

    if (!me.exists || me.data().role !== "alumno") {
      alert("Acceso denegado");
      location.href = "index.html";
      return;
    }

    loadMyCourses(user.uid);
  });

  async function loadMyCourses(uid) {
    list.innerHTML = "";

    const snapshot = await db
      .collection("users")
      .doc(uid)
      .collection("enrolledCourses")
      .get();

    if (snapshot.empty) {
      list.innerHTML = "<p>No estás inscrito en ningún curso</p>";
      return;
    }

    snapshot.forEach(doc => {
      const c = doc.data();

      const title = c.title || "Curso sin título";
      const videoUrl = c.videoUrl || "";

      list.innerHTML += `
        <div class="course-card">
          <h3>${title}</h3>

          ${
            videoUrl
              ? `<button class="primary-btn" onclick="watchVideo('${videoUrl}')">
                   Ver curso
                 </button>`
              : `<p>Video no disponible</p>`
          }
        </div>
        <hr>
      `;
    });
  }

  // 👉 Redirige al reproductor
  window.watchVideo = (videoUrl) => {
    location.href = `watch.html?video=${encodeURIComponent(videoUrl)}`;
  };

  // 👉 Logout
  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => {
      location.href = "index.html";
    });
  };
});
