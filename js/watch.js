console.log("WATCH JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("course");

  const video = document.getElementById("videoPlayer");
  const title = document.getElementById("courseTitle");

  if (!courseId) {
    alert("Curso no válido");
    location.href = "alumno.html";
    return;
  }

  auth.onAuthStateChanged(async (user) => {
    if (!user) return location.href = "index.html";

    const me = await db.collection("users").doc(user.uid).get();
    if (!me.exists || me.data().role !== "alumno") {
      alert("Acceso denegado");
      return location.href = "index.html";
    }

    loadCourse(user.uid, courseId);
  });

  async function loadCourse(uid, courseId) {
    const doc = await db
      .collection("users")
      .doc(uid)
      .collection("enrolledCourses")
      .doc(courseId)
      .get();

    if (!doc.exists) {
      alert("No tienes acceso a este curso");
      location.href = "alumno.html";
      return;
    }

    const data = doc.data();

    title.innerText = `📺 ${data.title}`;
    video.src = data.videoUrl;
  }
});
