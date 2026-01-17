document.addEventListener("DOMContentLoaded", async () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const table = document.getElementById("usersTable");

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    const me = await db.collection("users").doc(user.uid).get();
    if (!me.exists || me.data().role !== "admin") {
      alert("Acceso denegado");
      location.href = "index.html";
      return;
    }

    loadUsers();
  });

  async function loadUsers() {
    const snapshot = await db.collection("users").get();
    table.innerHTML = "";

    snapshot.forEach(doc => {
      const u = doc.data();

      table.innerHTML += `
        <tr>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>
            <select onchange="changeRole('${doc.id}', this.value)">
              <option value="alumno" ${u.role === "alumno" ? "selected" : ""}>Alumno</option>
              <option value="profesor" ${u.role === "profesor" ? "selected" : ""}>Profesor</option>
              <option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option>
            </select>
          </td>
          <td>✔</td>
        </tr>
      `;
    });
  }

  window.changeRole = async (uid, role) => {
    await db.collection("users").doc(uid).update({ role });
    alert("Rol actualizado");
  };

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
