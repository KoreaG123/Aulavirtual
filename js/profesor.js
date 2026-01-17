const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const form = document.getElementById("courseForm");
const coursesDiv = document.getElementById("courses");

// Subir curso
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const videoFile = document.getElementById("video").files[0];

  if (!videoFile) return alert("Sube un video");

  const user = auth.currentUser;
  const videoRef = storage.ref(`courses/${user.uid}/${Date.now()}_${videoFile.name}`);

  await videoRef.put(videoFile);
  const videoUrl = await videoRef.getDownloadURL();

  await db.collection("courses").add({
    title,
    description,
    videoUrl,
    createdBy: user.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("Curso subido correctamente");
  form.reset();
  loadCourses();
});

// Cargar cursos del profesor
async function loadCourses() {
  coursesDiv.innerHTML = "";

  const user = auth.currentUser;
  const snapshot = await db.collection("courses")
    .where("createdBy", "==", user.uid)
    .get();

  snapshot.forEach(doc => {
    const c = doc.data();
    coursesDiv.innerHTML += `
      <div>
        <h3>${c.title}</h3>
        <p>${c.description}</p>
        <video src="${c.videoUrl}" controls width="300"></video>
        <hr>
      </div>
    `;
  });
}

auth.onAuthStateChanged(user => {
  if (user) loadCourses();
});

document.getElementById("logoutBtn").onclick = () => {
  auth.signOut().then(() => location.href = "index.html");
};
