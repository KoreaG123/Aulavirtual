document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const videoUrl = document.getElementById("videoUrl");
  const createBtn = document.getElementById("createCourseBtn");
  const myCourses = document.getElementById("myCourses");

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    document.getElementById("userName").textContent =
      user.displayName || "Profesor";
    document.getElementById("userEmail").textContent = user.email;

    loadCourses(user.uid);
  });

  // 🔥 CREAR CURSO
  createBtn.onclick = async () => {
    if (!title.value || !description.value || !videoUrl.value) {
      alert("Completa todos los campos");
      return;
    }

    const user = auth.currentUser;

    try {
      await db.collection("courses").add({
        title: title.value,
        description: description.value,
        videoUrl: videoUrl.value,
        createdBy: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      title.value = "";
      description.value = "";
      videoUrl.value = "";

      loadCourses(user.uid);
      alert("Curso creado correctamente");

    } catch (e) {
      console.error(e);
      alert("Error al crear curso");
    }
  };

  // 🔥 CARGAR CURSOS DEL PROFESOR
  async function loadCourses(uid) {
    myCourses.innerHTML = "Cargando...";

    const snapshot = await db
      .collection("courses")
      .where("createdBy", "==", uid)
      .get();

    myCourses.innerHTML = "";

    if (snapshot.empty) {
      myCourses.innerHTML = "<p>No has creado cursos</p>";
      return;
    }

    snapshot.forEach(doc => {
      const c = doc.data();
      const div = document.createElement("div");
      div.className = "course-card";
      div.innerHTML = `
        <h3>${c.title}</h3>
        <p>${c.description}</p>
      `;
      myCourses.appendChild(div);
    });
  }

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
