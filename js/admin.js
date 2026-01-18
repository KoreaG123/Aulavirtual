console.log("ADMIN JS CARGADO");

document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const usersTable = document.getElementById("usersTable");
  const coursesTable = document.getElementById("coursesTable");
  const requestsList = document.getElementById("requestsList");

  let alumnos = [];

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
    loadCourses();
    loadRequests();
  });

  /* =======================
     USUARIOS
  ======================= */
  async function loadUsers() {
    const snapshot = await db.collection("users").get();
    usersTable.innerHTML = "";
    alumnos = [];

    snapshot.forEach(doc => {
      const u = doc.data();

      usersTable.innerHTML += `
        <tr>
          <td>${u.name || "-"}</td>
          <td>${u.email}</td>
          <td>${u.role}</td>
        </tr>
      `;

      if (u.role === "alumno") {
        alumnos.push({ uid: doc.id, ...u });
      }
    });
  }

  /* =======================
     SOLICITUDES GUEST → ALUMNO
  ======================= */
  async function loadRequests() {
    requestsList.innerHTML = "";

    const snapshot = await db
      .collection("requests")
      .where("status", "==", "pending")
      .get();

    if (snapshot.empty) {
      requestsList.innerHTML = "<p>No hay solicitudes pendientes</p>";
      return;
    }

    snapshot.forEach(doc => {
      const r = doc.data();

      requestsList.innerHTML += `
        <div class="course-card">
          <p><strong>${r.name}</strong><br>${r.email}</p>
          <button onclick="approveUser('${r.uid}')">
            ✅ Aprobar como alumno
          </button>
        </div>
      `;
    });
  }

  window.approveUser = async (uid) => {
    await db.collection("users").doc(uid).update({
      role: "alumno"
    });

    await db.collection("requests").doc(uid).update({
      status: "approved"
    });

    alert("🎉 Usuario aprobado como alumno");
    loadUsers();
    loadRequests();
  };

  /* =======================
     CURSOS
  ======================= */
  async function loadCourses() {
    const snapshot = await db.collection("courses").get();
    coursesTable.innerHTML = "";

    snapshot.forEach(doc => {
      const c = doc.data();

      let options = alumnos.map(a =>
        `<option value="${a.uid}">${a.name}</option>`
      ).join("");

      coursesTable.innerHTML += `
        <div class="course-card">
          <h4>${c.title}</h4>
          <select id="sel-${doc.id}">
            <option value="">Seleccionar alumno</option>
            ${options}
          </select>
          <button onclick="enroll('${doc.id}', '${c.title}', '${c.videoUrl}')">
            Inscribir alumno
          </button>
        </div>
        <hr>
      `;
    });
  }

  window.enroll = async (courseId, title, videoUrl) => {
    const select = document.getElementById(`sel-${courseId}`);
    const uid = select.value;

    if (!uid) {
      alert("Selecciona un alumno");
      return;
    }

    await db
      .collection("users")
      .doc(uid)
      .collection("enrolledCourses")
      .doc(courseId)
      .set({
        title,
        videoUrl,
        enrolledAt: firebase.firestore.FieldValue.serverTimestamp()
      });

    alert("Alumno inscrito correctamente 🎓");
  };

  /* =======================
     LOGOUT
  ======================= */
  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
