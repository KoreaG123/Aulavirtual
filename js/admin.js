document.addEventListener("DOMContentLoaded", () => {
  const db = firebase.firestore();
  const auth = firebase.auth();

  const titleInput = document.getElementById("courseTitle");
  const descInput = document.getElementById("courseDescription");
  const createBtn = document.getElementById("createCourseBtn");
  const list = document.getElementById("coursesList");
  const logoutBtn = document.getElementById("logoutBtn");

  createBtn.onclick = async () => {
    if (!titleInput.value || !descInput.value) {
      alert("Completa todos los campos");
      return;
    }

    await db.collection("courses").add({
      title: titleInput.value,
      description: descInput.value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    titleInput.value = "";
    descInput.value = "";
    loadCourses();
  };

  async function loadCourses() {
    list.innerHTML = "";
    const snapshot = await db.collection("courses").orderBy("createdAt", "desc").get();
    snapshot.forEach(doc => {
      const li = document.createElement("li");
      li.textContent = doc.data().title;
      list.appendChild(li);
    });
  }

  loadCourses();

  logoutBtn.onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
