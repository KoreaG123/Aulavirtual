const logoutBtn = document.getElementById("logoutBtn");
const contentDiv = document.getElementById("content");

logoutBtn.onclick = async () => {
  try {
    await firebase.auth().signOut();
    location.href = "index.html";
  } catch (error) {
    alert("Error al cerrar sesión");
  }
};

firebase.auth().onAuthStateChanged(async user => {
  if (!user) return location.href = "index.html";

  try {
    const db = firebase.firestore();
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (!userDoc.exists) throw new Error("Usuario no registrado");

    const role = userDoc.data().role;

    const roleNames = { admin: "Administrador", profesor: "Profesor", alumno: "Alumno", guest: "Invitado" };

    // Contenido base
    let html = `<div class="dashboard">
      <h1>👋 Bienvenido, ${user.displayName || user.email}</h1>
      <p>Tu rol: <strong>${roleNames[role]}</strong></p>
      <div class="stats-section"><h2>📊 Métricas Clave</h2>
        <div class="stats-cards">
          <div class="card"><h4>👥 Usuarios Activos</h4><p>33</p><p>+22 nuevos</p></div>
          <div class="card"><h4>📖 Cursos</h4><p>96</p><p>Totales disponibles</p></div>
          <div class="card"><h4>👨‍🏫 Profesores</h4><p>12</p><p>Activos</p></div>
        </div>
      </div>`;

    // Contenido rápido por rol
    html += `<div class="quick-access-section"><h3>⚡ Accesos Rápidos</h3><div class="quick-cards">`;
    if(role === "admin"){
      html += `<div class="card"><h4>📁 Gestionar Catálogo</h4><p>Archivos y documentos</p></div>
               <div class="card"><h4>📈 Gráficos de Rendimiento</h4><p>Estadísticas del sistema</p></div>`;
    }
    if(role === "profesor" || role === "admin"){
      html += `<div class="card"><h4>📅 Planificar Clases</h4><p>Administra cursos</p></div>`;
    }
    if(role === "alumno" || role === "guest"){
      html += `<div class="card"><h4>📚 Mis Cursos</h4><p>Accede a tus cursos</p></div>
               <div class="card"><h4>📝 Tareas Pendientes</h4><p>Revisa tareas</p></div>`;
    }
    html += `</div></div></div>`;

    contentDiv.innerHTML = html;

  } catch (err) {
    console.error(err);
    contentDiv.innerHTML = `<p style="text-align:center;">❌ Error al cargar datos. <button onclick="location.reload()">Recargar</button></p>`;
  }
});
