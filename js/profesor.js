console.log("PROFESOR JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const videoUrl = document.getElementById("videoUrl");
  const createBtn = document.getElementById("createBtn");
  const myCourses = document.getElementById("myCourses");

  let currentUser = null;

  auth.onAuthStateChanged(async (user) => {
    if (!user) return location.href = "index.html";

    const me = await db.collection("users").doc(user.uid).get();
    if (!me.exists || me.data().role !== "profesor") {
      alert("Acceso denegado");
      return location.href = "index.html";
    }

    currentUser = user;
    loadMyCourses();
  });

  // CREAR CURSO
  createBtn.onclick = async () => {
    if (!title.value || !description.value || !videoUrl.value) {
      alert("Completa todos los campos");
      return;
    }

    await db.collection("courses").add({
      title: title.value,
      description: description.value,
      videoUrl: videoUrl.value,
      createdBy: currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    title.value = "";
    description.value = "";
    videoUrl.value = "";

    loadMyCourses();
  };

  // CARGAR MIS CURSOS
  async function loadMyCourses() {
    myCourses.innerHTML = "";

    const snapshot = await db
      .collection("courses")
      .where("createdBy", "==", currentUser.uid)
      .get();

    if (snapshot.empty) {
      myCourses.innerHTML = "<p>No tienes cursos creados</p>";
      return;
    }

    snapshot.forEach(doc => {
      const c = doc.data();

      myCourses.innerHTML += `
        <div class="course-card">
          <h3>${c.title}</h3>
          <p>${c.description}</p>
          <button onclick="watch('${c.videoUrl}')">▶ Ver video</button>
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
