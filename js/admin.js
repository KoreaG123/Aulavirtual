console.log("ADMIN JS CARGADO");

document.addEventListener("DOMContentLoaded", async () => {
  const auth = firebase.auth();
  const db = firebase.firestore();

  const usersTable = document.getElementById("usersTable");
  const coursesTable = document.getElementById("coursesTable");

  let alumnos = [];

  auth.onAuthStateChanged(async user => {
    if (!user) return location.href = "index.html";

    const me = await db.collection("users").doc(user.uid).get();
    if (!me.exists || me.data().role !== "admin") {
      alert("Acceso denegado");
      return location.href = "index.html";
    }

    loadUsers();
    loadCourses();
  });

  async function loadUsers() {
    const snapshot = await db.collection("users").get();
    usersTable.innerHTML = "";
    alumnos = [];

    snapshot.forEach(doc => {
      const u = doc.data();

      usersTable.innerHTML += `
        <tr>
          <td>${u.name}</td>
          <td>${u.email}</td>
          <td>${u.role}</td>
        </tr>
      `;

      if (u.role === "alumno") {
        alumnos.push({ uid: doc.id, ...u });
      }
    });
  }

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

    await db
      .collection("users")
      .doc(uid)
      .collection("enrolledCourses")
      .doc(courseId)
      .set({
        title,
        videoUrl
      });

    alert("Alumno inscrito correctamente");
  };

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => location.href = "index.html");
  };
});
