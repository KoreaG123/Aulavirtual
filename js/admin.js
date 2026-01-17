document.addEventListener("DOMContentLoaded", async () => {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const table = document.getElementById("usersTable");

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    // Verificar que sea admin
    const doc = await db.collection("users").doc(user.uid).get();
    if (!doc.exists || doc.data().role !== "admin") {
      alert("Acceso denegado");
      location.href = "index.html";
      return;
    }

    cargarUsuarios();
  });

  async function cargarUsuarios() {
    table.innerHTML = "";
    const snapshot = await db.collection("users").get();

    snapshot.forEach(doc => {
      const data = doc.data();

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${data.name || "—"}</td>
        <td>${data.email}</td>
        <td>${data.role}</td>
        <td>
          <select data-id="${doc.id}">
            <option value="alumno">Alumno</option>
            <option value="profesor">Profesor</option>
            <option value="admin">Admin</option>
          </select>
          <button>Guardar</button>
        </td>
      `;

      const select = tr.querySelector("select");
      select.value = data.role;

      const button = tr.querySelector("button");
      button.onclick = async () => {
        await db.collection("users").doc(doc.id).update({
          role: select.value
        });
        alert("Rol actualizado");
      };

      table.appendChild(tr);
    });
  }

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
