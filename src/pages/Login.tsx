import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { FaWallet, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from '../styles/Login.module.css';
import cubelogo from '../assets/images/cube/cubelogo.png';

export default function Login() {
  const { authenticateUser } = useUserContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Input validation
    if (!email || !password) {
      setError('Por favor ingresa tu email y contraseña');
      setLoading(false);
      return;
    }

    try {
      // Usar la función authenticateUser del contexto
      const result = await authenticateUser(email, password);
      
      if (result.success) {
        // Redirigir a la página principal después de un inicio de sesión exitoso
        navigate('/');
      } else {
        setError(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.authContainer}>
        <div className={styles.logoContainer}>
          <img src={cubelogo} alt="UNI2CHAIN Logo" className={styles.logo} />
        </div>
        
        <h1 className={styles.title}>Iniciar sesión</h1>
        <p className={styles.subtitle}>Introduce tu email y contraseña para iniciar sesión</p>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email*</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@email.com"
              required
              disabled={loading}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Contraseña*</label>
            <div className={styles.passwordInput}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                disabled={loading}
              />
              <button 
                type="button"
                className={styles.showPasswordButton}
                onClick={toggleShowPassword}
                tabIndex={-1}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.walletButton} disabled={loading}>
              <FaWallet />
            </button>
            <button 
              type="submit" 
              className={styles.button}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
      
      <div className={styles.footer}>
        <p className={styles.copyright}>© 2025 UNI2CHAIN. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}