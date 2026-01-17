document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();

  const titleInput = document.getElementById("courseTitle");
  const descInput = document.getElementById("courseDescription");
  const videoInput = document.getElementById("courseVideo");
  const uploadBtn = document.getElementById("uploadBtn");
  const messageDiv = document.getElementById("message");

  auth.onAuthStateChanged(user => {
    if (!user) location.href = "index.html";
  });

  uploadBtn.onclick = async () => {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const videoFile = videoInput.files[0];

    if (!title || !description || !videoFile) {
      showMessage("Completa todos los campos y selecciona un video.", "error");
      return;
    }

    try {
      showMessage("Subiendo video...", "success");

      // Subir video a Storage
      const storageRef = storage.ref();
      const videoRef = storageRef.child(`videos/${Date.now()}_${videoFile.name}`);
      await videoRef.put(videoFile);
      const videoUrl = await videoRef.getDownloadURL();

      // Guardar curso en Firestore
      await db.collection("courses").add({
        title,
        description,
        videoUrl,
        createdBy: auth.currentUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      showMessage("Curso subido correctamente", "success");

      // Limpiar campos
      titleInput.value = "";
      descInput.value = "";
      videoInput.value = "";

    } catch (err) {
      console.error(err);
      showMessage("Error al subir el curso", "error");
    }
  };

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.style.color = type === "error" ? "red" : "green";
  }

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
