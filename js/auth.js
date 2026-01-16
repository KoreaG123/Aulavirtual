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

// ===== FORMULARIOS =====
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

// ===== LOGIN EMAIL =====
loginBtn.onclick = async () => {
  if (!loginUsername.value || !loginPassword.value) {
    return showMessage('Completa todos los campos', 'error');
  }

  try {
    await auth.signInWithEmailAndPassword(
      loginUsername.value,
      loginPassword.value
    );

    window.location.href = 'dashboard.html';
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

    const user = result.user;

    await db.collection('users').doc(user.uid).set({
      name: registerName.value,
      email: registerEmail.value,
      role: 'alumno',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    await user.updateProfile({
      displayName: registerName.value
    });

    window.location.href = 'dashboard.html';
  } catch (error) {
    showMessage('Error al crear la cuenta', 'error');
  }
};

// ===== GOOGLE LOGIN (REDIRECT) =====
googleBtn.onclick = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  await auth.signInWithRedirect(provider);
};

auth.getRedirectResult()
  .then(async (result) => {
    if (!result.user) return;

    const user = result.user;
    const ref = db.collection('users').doc(user.uid);
    const doc = await ref.get();

    if (!doc.exists) {
      await ref.set({
        name: user.displayName || 'Usuario Google',
        email: user.email,
        role: 'alumno',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    window.location.href = 'dashboard.html';
  })
  .catch(console.error);

// ===== RESET PASSWORD =====
async function resetPassword() {
  if (!loginUsername.value) {
    return showMessage('Ingresa tu correo', 'error');
  }

  try {
    await auth.sendPasswordResetEmail(loginUsername.value);
    showMessage('Correo enviado', 'success');
  } catch {
    showMessage('Error al enviar correo', 'error');
  }
}
