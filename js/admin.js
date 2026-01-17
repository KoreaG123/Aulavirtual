document.addEventListener("DOMContentLoaded", async () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const usersList = document.getElementById("usersList");

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    loadUsers(user.uid);
  });

  async function loadUsers(currentUid) {
    usersList.innerHTML = "Cargando usuarios...";

    const snapshot = await db.collection("users").get();
    usersList.innerHTML = "";

    snapshot.forEach(doc => {
      const u = doc.data();
      const uid = doc.id;

      if (uid === currentUid) return; // admin no se cambia a sí mismo

      const div = document.createElement("div");
      div.className = "course-card";
      div.innerHTML = `
        <strong>${u.name}</strong><br>
        ${u.email}<br>
        Rol actual: <b>${u.role}</b><br><br>

        <button onclick="changeRole('${uid}', 'alumno')">Alumno</button>
        <button onclick="changeRole('${uid}', 'profesor')">Profesor</button>
      `;
      usersList.appendChild(div);
    });
  }

  window.changeRole = async (uid, role) => {
    try {
      await db.collection("users").doc(uid).update({ role });
      alert("Rol actualizado");
      loadUsers(auth.currentUser.uid);
    } catch (e) {
      alert("No autorizado");
    }
  };

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
