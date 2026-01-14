// ===== REFERENCIAS DOM =====
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

// ===== MOSTRAR FORMULARIOS =====
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

// ===== MENSAJES =====
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type} show`;
}

function hideMessage() {
  messageDiv.className = 'message';
}

// ===== LOGIN EMAIL / PASSWORD =====
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
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);

  } catch (error) {
    showMessage('Correo o contraseña incorrectos', 'error');
  }
};

// ===== REGISTRO =====
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
    const result = await auth.createUserWithEmailAndPassword(
      registerEmail.value,
      registerPassword.value
    );

    await result.user.updateProfile({
      displayName: registerName.value
    });

    showMessage('Cuenta creada correctamente', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);

  } catch (error) {
    showMessage('Error al crear la cuenta', 'error');
  }
};

// ===== LOGIN CON GOOGLE =====
googleBtn.onclick = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  try {
    await auth.signInWithPopup(provider);
    showMessage('Conectado con Google', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);

  } catch (error) {
    showMessage('Error al iniciar con Google', 'error');
  }
};

// ===== OLVIDÉ MI CONTRASEÑA =====
async function resetPassword() {
  if (!loginUsername.value) {
    return showMessage('Ingresa tu correo primero', 'error');
  }

  try {
    await auth.sendPasswordResetEmail(loginUsername.value);
    showMessage('Te enviamos un correo para restablecer tu contraseña', 'success');
  } catch (error) {
    showMessage('Error al enviar el correo', 'error');
  }
}
