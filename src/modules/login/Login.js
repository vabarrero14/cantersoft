import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Archivo de estilos (opcional)

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Login con email y contraseña
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirige al dashboard después del login
    } catch (err) {
      setError(handleAuthError(err.code));
      setLoading(false);
    }
  };

  // Login con Google
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(handleAuthError(err.code));
    }
  };

  // Mapeo de errores de Firebase a mensajes amigables
  const handleAuthError = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido';
      case 'auth/user-disabled':
        return 'Tu cuenta ha sido deshabilitada';
      case 'auth/user-not-found':
        return 'No existe una cuenta con este correo';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde';
      default:
        return 'Error al iniciar sesión';
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleEmailLogin}>
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="separator">o</div>

      <button 
        onClick={handleGoogleLogin} 
        className="google-btn"
        type="button"
      >
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
          alt="Google logo" 
        />
        Continuar con Google
      </button>

      <div className="footer-links">
        <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
        <span>¿No tienes cuenta? <a href="/register">Regístrate</a></span>
      </div>
    </div>
  );
};

export default Login;