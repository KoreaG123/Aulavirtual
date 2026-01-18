console.log("WATCH JS CARGADO");

document.addEventListener("DOMContentLoaded", async () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const player = document.getElementById("videoPlayer");

  const params = new URLSearchParams(window.location.search);
  const videoUrl = params.get("video");

  if (!videoUrl) {
    alert("Video no disponible");
    return location.href = "alumno.html";
  }

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

    // 🔥 Reproducir video
    player.src = videoUrl;
  });
});

// 👉 Volver
function goBack() {
  location.href = "alumno.html";
}
