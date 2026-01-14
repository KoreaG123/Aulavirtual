// Login con Google
document.getElementById("googleLogin").addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert("Error con Google: " + error.message);
    });
});
