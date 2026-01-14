const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const messageDiv = document.getElementById('message');

const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const googleBtn = document.getElementById('googleBtn');

const registerName = document.getElementById('registerName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerPasswordConfirm = document.getElementById('registerPasswordConfirm');
const registerBtn = document.getElementById('registerBtn');

/* Mostrar formularios */
function showRegister() {
  loginForm.classList.remove('active');
  registerForm.classList.add('active');
  hideMessage();
}

function showLogin() {
  registerForm.classList.remove('active');
  loginForm.classList.add('active');
  hideMessage();
}

/* Mensajes */
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type} show`;
}

function hideMessage() {
  messageDiv.className = 'message';
}

/* LOGIN EMAIL */
loginBtn.onclick = async () => {
  if (!loginUsername.value || !loginPassword.value) {
    return showMessage('Completa todos los campos', 'error');
  }

  try {
    await auth.signInWithEmailAndPassword(
      loginUsername.value,
      loginPassword.value
    );
    showMessage('Bienvenido', 'success');
    setTimeout(() => location.href = 'dashboard.html', 1000);
  } catch (e) {
    showMessage('Credenciales incorrectas', 'error');
  }
};

/* REGISTRO */
registerBtn.onclick = async () => {
  if (
    !registerName.value ||
    !registerEmail.value ||
    !registerPassword.value ||
    !registerPasswordConfirm.value
  ) {
    return showMessage('Completa todos los campos', 'error');
  }

  if (registerPassword.value !== registerPasswordConfirm.value) {
    return showMessage('Las contraseñas no coinciden', 'error');
  }

  try {
    const user = await auth.createUserWithEmailAndPassword(
      registerEmail.value,
      registerPassword.value
    );

    await user.user.updateProfile({
      displayName: registerName.value
    });

    showMessage('Cuenta creada correctamente', 'success');
    setTimeout(() => location.href = 'dashboard.html', 1000);
  } catch (e) {
    showMessage('Error al crear la cuenta', 'error');
  }
};

/* GOOGLE LOGIN (PROFESIONAL) */
googleBtn.onclick = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    await auth.signInWithPopup(provider);
    showMessage('Conectado con Google', 'success');
    setTimeout(() => location.href = 'dashboard.html', 1000);
  } catch {
    showMessage('Error con Google', 'error');
  }
};
