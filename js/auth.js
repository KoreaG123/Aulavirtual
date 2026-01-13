const auth = firebase.auth();

// Login o registro con email
document.getElementById("emailLogin").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Completa todos los campos");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(() => {
      auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          window.location.href = "dashboard.html";
        })
        .catch(error => alert(error.message));
    });
});

// Login con Facebook
document.getElementById("facebookLogin").addEventListener("click", () => {
  const provider = new firebase.auth.FacebookAuthProvider();

  auth.signInWithPopup(provider)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(error => alert(error.message));
});
