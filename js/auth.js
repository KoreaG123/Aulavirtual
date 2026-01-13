// Seleccionar elementos del DOM
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailLoginBtn = document.getElementById('emailLogin');
const facebookLoginBtn = document.getElementById('facebookLogin');
const messageDiv = document.getElementById('message');

// Mostrar mensajes al usuario
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type} show`;
  
  // Ocultar mensaje después de 4 segundos
  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 4000);
}

// Manejar login/registro con email
emailLoginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Validar campos vacíos
  if (!email || !password) {
    showMessage('Por favor completa todos los campos', 'error');
    return;
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    showMessage('La contraseña debe tener mínimo 6 caracteres', 'error');
    return;
  }

  // Cambiar estado del botón
  emailLoginBtn.textContent = 'Procesando...';
  emailLoginBtn.disabled = true;

  try {
    // Intentar login primero
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      showMessage('¡Bienvenido de nuevo!', 'success');
      console.log('Login exitoso:', userCredential.user.email);
      
      // Redirigir a dashboard
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1200);
      
    } catch (error) {
      // Si el usuario no existe, registrarlo
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        const newUser = await auth.createUserWithEmailAndPassword(email, password);
        showMessage('¡Cuenta creada con éxito!', 'success');
        console.log('Usuario registrado:', newUser.user.email);
        
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1200);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error de autenticación:', error);
    
    // Mensajes de error personalizados
    let mensaje = 'Ocurrió un error. Intenta nuevamente.';
    
    if (error.code === 'auth/invalid-email') {
      mensaje = 'El correo electrónico no es válido';
    } else if (error.code === 'auth/email-already-in-use') {
      mensaje = 'Este correo ya está registrado';
    } else if (error.code === 'auth/weak-password') {
      mensaje = 'Contraseña muy débil. Usa al menos 6 caracteres';
    } else if (error.code === 'auth/network-request-failed') {
      mensaje = 'Error de conexión. Revisa tu internet';
    }
    
    showMessage(mensaje, 'error');
  } finally {
    // Restaurar botón
    emailLoginBtn.textContent = 'Entrar / Registrarse';
    emailLoginBtn.disabled = false;
  }
});

// Login con Facebook
facebookLoginBtn.addEventListener('click', async () => {
  facebookLoginBtn.textContent = 'Conectando...';
  facebookLoginBtn.disabled = true;

  try {
    const provider = new firebase.auth.FacebookAuthProvider();
    const result = await auth.signInWithPopup(provider);
    
    showMessage('¡Conectado con Facebook!', 'success');
    console.log('Usuario Facebook:', result.user.displayName);
    
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1200);
    
  } catch (error) {
    console.error('Error Facebook login:', error);
    
    let mensaje = 'No se pudo conectar con Facebook';
    
    if (error.code === 'auth/popup-closed-by-user') {
      mensaje = 'Cerraste la ventana. Intenta de nuevo';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      mensaje = 'Ya existe una cuenta con este correo';
    }
    
    showMessage(mensaje, 'error');
  } finally {
    facebookLoginBtn.textContent = 'Continuar con Facebook';
    facebookLoginBtn.disabled = false;
  }
});

// Login con Enter
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    emailLoginBtn.click();
  }
});

// Focus al siguiente campo con Enter
emailInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    passwordInput.focus();
  }
});

// Detectar cambios en autenticación
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('Usuario activo:', user.email || user.displayName);
  }
});
