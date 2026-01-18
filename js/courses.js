console.log("COURSES JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const list = document.getElementById("coursesList");

  let currentUser = null;

  auth.onAuthStateChanged(async (user) => {
    if (!user) return location.href = "index.html";

    const me = await db.collection("users").doc(user.uid).get();
    if (!me.exists || me.data().role !== "alumno") {
      alert("Acceso denegado");
      return location.href = "index.html";
    }

    currentUser = user;
    loadCourses();
  });

  async function loadCourses() {
    list.innerHTML = "";

    const snapshot = await db.collection("courses").get();

    if (snapshot.empty) {
      list.innerHTML = "<p>No hay cursos disponibles</p>";
      return;
    }

    snapshot.forEach(doc => {
      const c = doc.data();

      list.innerHTML += `
        <div class="course-card">
          <h3>${c.title}</h3>
          <p>${c.description}</p>
          <button class="primary-btn" onclick="enroll('${doc.id}')">
            Inscribirme
          </button>
        </div>
        <hr>
      `;
    });
  }

  window.enroll = async (courseId) => {
    const course = await db.collection("courses").doc(courseId).get();
    if (!course.exists) return alert("Curso no encontrado");

    await db
      .collection("users")
      .doc(currentUser.uid)
      .collection("enrolledCourses")
      .doc(courseId)
      .set({
        title: course.data().title,
        videoUrl: course.data().videoUrl,
        enrolledAt: firebase.firestore.FieldValue.serverTimestamp()
      });

    alert("Inscripción exitosa 🎉");
  };

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
