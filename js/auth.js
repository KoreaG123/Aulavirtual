// referencias
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');

function showRegister(){loginForm.classList.remove('active');registerForm.classList.add('active')}
function showLogin(){registerForm.classList.remove('active');loginForm.classList.add('active')}

function showMessage(msg,type){
  messageDiv.textContent = msg;
  messageDiv.className = `message ${type} show`;
}

loginBtn.onclick = async () => {
  try {
    await auth.signInWithEmailAndPassword(loginUsername.value, loginPassword.value);
    location.href = "dashboard.html";
  } catch {
    showMessage("Credenciales incorrectas","error");
  }
};

registerBtn.onclick = async () => {
  try {
    const res = await auth.createUserWithEmailAndPassword(registerEmail.value, registerPassword.value);
    await db.collection("users").doc(res.user.uid).set({
      name: registerName.value,
      email: registerEmail.value,
      role: "alumno",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await res.user.updateProfile({displayName: registerName.value});
    location.href = "dashboard.html";
  } catch {
    showMessage("Error al registrar","error");
  }
};

googleBtn.onclick = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const res = await auth.signInWithPopup(provider);
  const ref = db.collection("users").doc(res.user.uid);
  if (!(await ref.get()).exists) {
    await ref.set({
      name: res.user.displayName,
      email: res.user.email,
      role: "alumno",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  location.href = "dashboard.html";
};

async function resetPassword(){
  await auth.sendPasswordResetEmail(loginUsername.value);
  showMessage("Correo enviado","success");
}
