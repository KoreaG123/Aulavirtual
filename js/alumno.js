console.log("ALUMNO JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const list = document.getElementById("coursesList");

  auth.onAuthStateChanged(async (user) => {
    if (!user) return location.href = "index.html";

    const me = await db.collection("users").doc(user.uid).get();
    if (!me.exists || me.data().role !== "alumno") {
      alert("Acceso denegado");
      return location.href = "index.html";
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

      list.innerHTML += `
        <div class="course-card">
          <h3>${c.title}</h3>

          <button onclick="watch('${c.videoUrl}')">
            Ver curso
          </button>
        </div>
        <hr>
      `;
    });
  }

  window.watch = (url) => {
    window.open(url, "_blank");
  };

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
