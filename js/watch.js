console.log("WATCH JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("course");

  const player = document.getElementById("player");
  const msg = document.getElementById("msg");

  if (!courseId) {
    msg.textContent = "Curso inválido";
    return;
  }

  auth.onAuthStateChanged(async (user) => {
    if (!user) return location.href = "index.html";

    // 🔒 verificar inscripción
    const enroll = await db
      .collection("users")
      .doc(user.uid)
      .collection("enrolledCourses")
      .doc(courseId)
      .get();

    if (!enroll.exists) {
      msg.textContent = "⛔ No estás inscrito en este curso";
      return;
    }

    const data = enroll.data();

    // ✅ mostrar video SOLO si está inscrito
    player.innerHTML = `
      <video controls width="100%">
        <source src="${data.videoUrl}" type="video/mp4">
      </video>
    `;
  });
});
