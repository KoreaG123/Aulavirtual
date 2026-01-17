document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");
  const btn = document.getElementById("createCourseBtn");
  const list = document.getElementById("coursesList");

  let currentUser = null;

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    const doc = await db.collection("users").doc(user.uid).get();
    if (!doc.exists || doc.data().role !== "profesor") {
      alert("Acceso denegado");
      location.href = "index.html";
      return;
    }

    currentUser = user;
    cargarCursos();
  });

  btn.onclick = async () => {
    if (!titleInput.value || !descInput.value) {
      alert("Completa todos los campos");
      return;
    }

    await db.collection("courses").add({
      title: titleInput.value,
      description: descInput.value,
      createdBy: currentUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    titleInput.value = "";
    descInput.value = "";
    cargarCursos();
  };

  async function cargarCursos() {
    list.innerHTML = "";
    const snapshot = await db
      .collection("courses")
      .where("createdBy", "==", currentUser.uid)
      .get();

    snapshot.forEach(doc => {
      const li = document.createElement("li");
      li.textContent = doc.data().title;
      list.appendChild(li);
    });
  }

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
