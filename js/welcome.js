console.log("WELCOME JS CARGADO");

const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(async user => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  const doc = await db.collection("users").doc(user.uid).get();

  if (!doc.exists || doc.data().role !== "guest") {
    location.href = "dashboard.html";
    return;
  }
});

document.getElementById("logoutBtn").onclick = () => {
  auth.signOut().then(() => location.href = "index.html");
};

window.requestAccess = () => {
  alert(
    "Para convertirte en alumno, contacta al administrador o adquiere un plan."
  );
};
