console.log("ALUMNO JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const container = document.getElementById("coursesList");

  let currentUser = null;

  auth.onAuthStateChanged(async (user) => {
    if (!user) return location.href = "index.html";

    currentUser = user;

    const me = await db.collection("users").doc(user.uid).get();
    if (!me.exists || me.data().role !== "alumno") {
      alert("Acceso denegado");
      return location.href = "index.html";
    }

    loadCourses();
  });

  async function loadCourses() {
    container.innerHTML = "";

    const snapshot = await db.collection("courses").get();

    if (snapshot.empty) {
      container.innerHTML = "<p>No hay cursos disponibles</p>";
      return;
    }

    snapshot.forEach(doc => {
      const c = doc.data();

      container.innerHTML += `
        <div class="course-card">
          <h3>${c.title}</h3>
          <p>${c.description}</p>

          <button onclick="enroll('${doc.id}')">
            Inscribirme
          </button>
        </div>
        <hr>
      `;
    });
  }

  window.enroll = async (courseId) => {
    const courseDoc = await db.collection("courses").doc(courseId).get();
    if (!courseDoc.exists) return alert("Curso no existe");

    await db.collection("users")
      .doc(currentUser.uid)
      .collection("enrolledCourses")
      .doc(courseId)
      .set({
        title: courseDoc.data().title,
        videoUrl: courseDoc.data().videoUrl,
        enrolledAt: firebase.firestore.FieldValue.serverTimestamp()
      });

    alert("Inscripción exitosa");
  };

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
