console.log("PROFESOR JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();

  const title = document.getElementById("title");
  const desc = document.getElementById("description");
  const videoInput = document.getElementById("video");
  const list = document.getElementById("coursesList");

  auth.onAuthStateChanged(async (user) => {
    if (!user) return location.href = "index.html";

    const me = await db.collection("users").doc(user.uid).get();
    if (!me.exists || me.data().role !== "profesor") {
      alert("Acceso denegado");
      return location.href = "index.html";
    }

    loadCourses(user.uid);
  });

  document.getElementById("createCourse").onclick = async () => {
    const file = videoInput.files[0];
    if (!file) return alert("Selecciona un video");

    const user = auth.currentUser;

    const ref = storage.ref(`videos/${user.uid}/${Date.now()}_${file.name}`);
    await ref.put(file);
    const videoUrl = await ref.getDownloadURL();

    await db.collection("courses").add({
      title: title.value,
      description: desc.value,
      videoUrl,
      createdBy: user.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    title.value = "";
    desc.value = "";
    videoInput.value = "";

    loadCourses(user.uid);
  };

  async function loadCourses(uid) {
    list.innerHTML = "";
    const snap = await db.collection("courses")
      .where("createdBy", "==", uid).get();

    snap.forEach(doc => {
      const c = doc.data();
      list.innerHTML += `
        <li>
          <strong>${c.title}</strong><br>
          <video src="${c.videoUrl}" controls width="300"></video>
        </li>
      `;
    });
  }

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
