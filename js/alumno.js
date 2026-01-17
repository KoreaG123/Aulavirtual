document.addEventListener("DOMContentLoaded", () => {
  const auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    if (!user) {
      location.href = "index.html";
      return;
    }

    document.getElementById("userName").textContent =
      user.displayName || "Alumno";

    document.getElementById("userEmail").textContent = user.email;
  });

  document.getElementById("logoutBtn").onclick = () => {
    auth.signOut().then(() => {
      location.href = "index.html";
    });
  };
});
