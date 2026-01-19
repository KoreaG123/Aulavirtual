
const logoutBtn = document.getElementById("logoutBtn");
const contentDiv = document.getElementById("content");

logoutBtn.onclick = async () => {
  try {
    await firebase.auth().signOut();
    location.href = "index.html";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("Error al cerrar sesión. Intenta nuevamente.");
  }
};

firebase.auth().onAuthStateChanged(async user => {
  if (!user) return location.href = "index.html";

  try {
    const db = firebase.firestore();
    const userDoc = await db.collection("users").doc(user.uid).get();

    if (!userDoc.exists) {
      alert("Usuario no registrado en el sistema");
      await firebase.auth().signOut();
      location.href = "index.html";
      return;
    }

    const role = userDoc.data().role;

    // ======================
    // CONTENIDO PARA INVITADO (GUEST)
    // ======================
    if (role === "guest") {
      const req = await db.collection("requests").doc(user.uid).get();
      const requestSent = req.exists;

      contentDiv.innerHTML = `
        <section class="welcome-section">
          <h2>¡Bienvenido a tu aula virtual!</h2>
          <p>Estás usando una cuenta de <strong>invitado</strong>. Explora los videos básicos y aprende a tu ritmo.</p>
        </section>

        <section class="videos-section">
          <h3>📚 Videos básicos</h3>
          <div class="video-cards">
            <div class="card">
              <h4>Introducción</h4>
              <video controls src="videos/intro.mp4"></video>
            </div>
            <div class="card">
              <h4>Primeros pasos</h4>
              <video controls src="videos/primeros_pasos.mp4"></video>
            </div>
          </div>
        </section>

        <section class="request-section">
          <h3>¿Quieres acceso completo?</h3>
          <p>Solicita convertirte en alumno para acceder a todos los cursos y materiales.</p>
          <button id="requestAccessBtn" class="primary-btn" ${requestSent ? "disabled" : ""}>
            ${requestSent ? "✓ Solicitud enviada" : "Solicitar acceso de alumno"}
          </button>
          <p id="statusMsg">${requestSent ? "⏳ Esperando aprobación" : ""}</p>
        </section>
      `;

      const requestBtn = document.getElementById("requestAccessBtn");
      const statusMsg = document.getElementById("statusMsg");

      if (!requestSent) {
        requestBtn.onclick = async () => {
          try {
            const ref = db.collection("requests").doc(user.uid);
            const snap = await ref.get();
            if (snap.exists) { alert("⏳ Ya enviaste una solicitud."); return; }

            await ref.set({
              uid: user.uid,
              email: user.email,
              name: user.displayName || "Usuario",
              status: "pending",
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            requestBtn.disabled = true;
            requestBtn.textContent = "✓ Solicitud enviada";
            statusMsg.textContent = "✅ Solicitud enviada correctamente. Un administrador la revisará pronto.";
          } catch (err) {
            console.error("Error al enviar solicitud:", err);
            alert("❌ No se pudo enviar la solicitud. Intenta nuevamente.");
          }
        };
      }
      return;
    }

    // ======================
    // CONTENIDO PARA ALUMNO / PROFESOR / ADMIN
    // ======================
    const roleNames = { admin: "Administrador", profesor: "Profesor", alumno: "Alumno" };

    contentDiv.innerHTML = `
      <div class="dashboard">
        <h1>👋 Bienvenido, ${user.displayName || user.email}</h1>
        <p>Tu rol: <strong>${roleNames[role] || role}</strong></p>

        <div class="stats-section">
          <h2>📊 Métricas Clave</h2>
          <div class="stats-cards">
            <div class="card"><h4>👥 Usuarios Activos</h4><p>33</p><p>+22 nuevos este mes</p></div>
            <div class="card"><h4>📖 Cursos</h4><p>96</p><p>Totales disponibles</p></div>
            <div class="card"><h4>👨‍🏫 Profesores</h4><p>12</p><p>Activos actualmente</p></div>
          </div>
        </div>

        <div class="quick-access-section">
          <h3>⚡ Accesos Rápidos</h3>
          <div class="quick-cards">
            ${role === "admin" ? `
              <div class="card"><h4>📁 Gestionar Catálogo</h4><p>Administra archivos y documentos</p></div>
              <div class="card"><h4>📈 Gráficos de Rendimiento</h4><p>Visualiza estadísticas y métricas</p></div>` : ""}
            ${role === "profesor" || role === "admin" ? `
              <div class="card"><h4>📅 Planificar Clases</h4><p>Administra la planificación de cursos</p></div>` : ""}
            ${role === "alumno" ? `
              <div class="card"><h4>📚 Mis Cursos</h4><p>Accede a tus cursos inscritos</p></div>
              <div class="card"><h4>📝 Tareas Pendientes</h4><p>Revisa y entrega tus tareas</p></div>` : ""}
          </div>
        </div>
      </div>
    `;

  } catch (error) {
    console.error("Error al cargar datos:", error);
    contentDiv.innerHTML = `
      <div style="text-align:center; padding:2rem;">
        <h2>❌ Error al cargar datos</h2>
        <p>Hubo un problema al cargar tu información. Por favor, recarga la página.</p>
        <button class="primary-btn" onclick="location.reload()">Recargar</button>
      </div>
    `;
  }
});
