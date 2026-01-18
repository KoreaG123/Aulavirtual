console.log("PROFESOR JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const videoUrl = document.getElementById("videoUrl");
  const list = document.getElementById("coursesList");

  auth.onAuthStateChanged(async user => {
    if (!user) return location.href = "index.html";

    const me = await db.collection("users").doc(user.uid).get();
    if (!me.exists || me.data().role !== "profesor") {
      alert("Acceso denegado");
      return location.href = "index.html";
    }

    loadCourses(user.uid);

    document.getElementById("createBtn").onclick = () =>
      createCourse(user.uid);
  });

  async function createCourse(uid) {
    if (!title.value || !description.value || !videoUrl.value) {
      alert("Completa todos los campos");
      return;
    }

    await db.collection("courses").add({
      title: title.value,
      description: description.value,
      videoUrl: videoUrl.value,
      createdBy: uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    title.value = "";
    description.value = "";
    videoUrl.value = "";

    loadCourses(uid);
  }

  async function loadCourses(uid) {
    list.innerHTML = "";

    const snapshot = await db
      .collection("courses")
      .where("createdBy", "==", uid)
      .get();

    if (snapshot.empty) {
      list.innerHTML = "<p>No tienes cursos creados</p>";
      return;
    }

    snapshot.forEach(doc => {
      const c = doc.data();

      list.innerHTML += `
        <div class="course-card">
          <h4>${c.title}</h4>
          <p>${c.description}</p>
        </div>
        <hr>
      `;
    });
  }

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
