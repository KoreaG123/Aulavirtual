console.log("PROFESOR JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const titleInput = document.getElementById("title");
  const descInput = document.getElementById("description");
  const list = document.getElementById("coursesList");

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    const me = await db.collection("users").doc(user.uid).get();
    if (!me.exists || me.data().role !== "profesor") {
      alert("Acceso solo para profesores");
      location.href = "index.html";
      return;
    }

    loadCourses(user.uid);
  });

  document.getElementById("createCourse").onclick = async () => {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (!title || !description) {
      alert("Completa todos los campos");
      return;
    }

    const user = auth.currentUser;

    await db.collection("courses").add({
      title,
      description,
      createdBy: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    titleInput.value = "";
    descInput.value = "";

    loadCourses(user.uid);
  };

  async function loadCourses(uid) {
    list.innerHTML = "";

    const snapshot = await db.collection("courses")
      .where("createdBy", "==", uid)
      .get();

    snapshot.forEach(doc => {
      const c = doc.data();
      list.innerHTML += `<li><strong>${c.title}</strong> - ${c.description}</li>`;
    });
  }

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
