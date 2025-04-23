// Archivo principal de JavaScript para el sitio web de patrones espirituales
document.addEventListener('DOMContentLoaded', function() {
  // Crear estrellas para el fondo cósmico
  const createStars = () => {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    const starsCount = 100;
    
    for (let i = 0; i < starsCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Tamaño aleatorio
      const size = Math.random() * 3;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Posición aleatoria
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Animación con retraso aleatorio
      star.style.animationDelay = `${Math.random() * 4}s`;
      
      starsContainer.appendChild(star);
    }
  };
  
  // Inicializar el fondo cósmico
  createStars();
  
  // Manejar formulario de login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Validación básica
      if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
      }
      
      // Simulación de login exitoso
      alert('Inicio de sesión exitoso. Redirigiendo al dashboard...');
      
      // En una implementación real, aquí se haría la petición al backend
      // y se manejaría la respuesta
    });
  }
  
  // Manejar cambio entre login y registro
  const showRegisterLink = document.getElementById('showRegister');
  if (showRegisterLink) {
    const loginHeader = document.querySelector('.login-header h1');
    const loginSubheader = document.querySelector('.login-header p');
    const loginButton = document.querySelector('.btn');
    const loginFooter = document.querySelector('.login-footer p');
    
    let isLoginForm = true;
    
    showRegisterLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (isLoginForm) {
        // Cambiar a formulario de registro
        loginHeader.textContent = 'Registro de Usuario';
        loginSubheader.textContent = 'Crea tu cuenta para acceder al portal';
        loginButton.textContent = 'Registrarse';
        loginFooter.innerHTML = '¿Ya tienes una cuenta? <a href="#" id="showLogin">Inicia Sesión</a>';
        document.getElementById('showLogin').addEventListener('click', toggleForm);
      } else {
        // Cambiar a formulario de login
        loginHeader.textContent = 'Portal de Patrones Espirituales';
        loginSubheader.textContent = 'Accede para gestionar tus patrones de ascensión espiritual';
        loginButton.textContent = 'Iniciar Sesión';
        loginFooter.innerHTML = '¿No tienes una cuenta? <a href="#" id="showRegister">Regístrate</a>';
        document.getElementById('showRegister').addEventListener('click', toggleForm);
      }
      
      isLoginForm = !isLoginForm;
    });
    
    function toggleForm(e) {
      e.preventDefault();
      showRegisterLink.click();
    }
  }
});
