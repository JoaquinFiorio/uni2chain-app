import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { AUTH_ENDPOINTS } from '../utils/constants';

// Definir el tipo para los datos del usuario
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string; // Añadido campo opcional para avatar
  walletAddress?: string; // Añadido campo para la dirección de wallet
  // Otros campos del usuario según tu API
}

// Definir el tipo para la respuesta de login
interface LoginResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Definir el tipo para el contexto
interface UserContextType {
  user: User | null;
  isLoggedIn: boolean; // Nombre más descriptivo que isAuthenticated
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  requireAuth: (callback: () => void, fallback: () => void) => void; // Nueva función
  authenticateUser: (email: string, password: string) => Promise<LoginResponse>;
  addWalletAddress: (walletAddress: string) => Promise<boolean>;
  hasWallet: boolean; // Nueva propiedad para verificar si el usuario tiene wallet
}

// Crear el contexto con un valor predeterminado
const defaultValue: UserContextType = {
  user: null,
  isLoggedIn: false,
  loading: true,
  login: () => {},
  logout: () => {},
  checkAuth: async () => false,
  requireAuth: () => {},
  authenticateUser: async () => ({ success: false, message: 'Not implemented' }),
  addWalletAddress: async () => false,
  hasWallet: false,
};

// Crear el contexto
const UserContext = createContext<UserContextType>(defaultValue);

// Hook personalizado para usar el contexto
export const useUserContext = () => useContext(UserContext);

// Props para el proveedor del contexto
interface UserProviderProps {
  children: ReactNode;
}

// Componente proveedor del contexto
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Verificar autenticación al iniciar
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    
    initAuth();
  }, []);

  // Verificar si hay un token JWT válido
  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      setIsLoggedIn(false);
      return false;
    }
    
    try {
      // Configurar el token para la solicitud
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Verificar si el token es válido con el servidor
      const response = await axios.get(AUTH_ENDPOINTS.VERIFY_TOKEN);
      
      if (response.data.success) {
        setUser(response.data.user);
        setIsLoggedIn(true);
        return true;
      } else {
        // Token inválido
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsLoggedIn(false);
      return false;
    }
  };

  // Función para iniciar sesión
  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    // Aquí se podría añadir lógica para guardar el usuario en localStorage, 
    // hacer peticiones a APIs, etc.
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsLoggedIn(false);
    // Aquí se podría añadir lógica para eliminar tokens, 
    // cookies, localStorage, etc.
  };

  // Nueva función para controlar acciones que requieren autenticación
  const requireAuth = (callback: () => void, fallback: () => void) => {
    if (isLoggedIn && user) {
      callback();
    } else {
      fallback();
    }
  };

  // Nueva función para autenticar usuarios
  const authenticateUser = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      // Llamar a la API de autenticación
      const response = await axios.post(AUTH_ENDPOINTS.LOGIN, { email, password });
      
      if (response.data.success) {
        // Guardar el token JWT en localStorage para mantener la sesión
        localStorage.setItem('token', response.data.token);
        
        // Configurar el token para futuras solicitudes
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Actualizar el contexto de usuario con los datos recibidos
        const userData: User = {
          id: response.data.user._id,
          username: response.data.user.username || email.split('@')[0],
          email: response.data.user.email || email,
          // Puedes incluir más datos del usuario según lo que devuelve tu API
        };
        
        // Usar la función login existente para actualizar el estado
        login(userData);
        
        return { 
          success: true, 
          message: 'Inicio de sesión exitoso' 
        };
      } else {
        return { 
          success: false, 
          message: response.data.message || 'Ocurrió un error durante el inicio de sesión' 
        };
      }
    } catch (err: any) {
      console.error('Error de login:', err);
      
      // Manejar diferentes tipos de errores
      if (err.response) {
        // El servidor respondió con un código de error
        return { 
          success: false, 
          message: err.response.data.message || 'Credenciales incorrectas. Por favor intenta nuevamente.',
          error: err.response.data
        };
      } else if (err.request) {
        // No se recibió respuesta del servidor
        return { 
          success: false, 
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
          error: 'Network error'
        };
      } else {
        return { 
          success: false, 
          message: 'Ocurrió un error durante el inicio de sesión. Intenta nuevamente.',
          error: err.message
        };
      }
    }
  };

  // Nueva función para añadir la dirección de la wallet
  const addWalletAddress = async (walletAddress: string): Promise<boolean> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return false;
    }
    
    try {
      // Configurar el token para la solicitud
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Hacer la petición a la API para actualizar la dirección de la wallet
      const response = await axios.put(AUTH_ENDPOINTS.UPDATE_WALLET, { walletAddress });
      
      if (response.data.success) {
        // Actualizar el estado del usuario en el contexto
        setUser(prevUser => prevUser ? { ...prevUser, walletAddress } : null);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error actualizando la dirección de la wallet:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        logout,
        checkAuth,
        requireAuth,
        authenticateUser,
        addWalletAddress,
        hasWallet: !!user?.walletAddress // Verificar si el usuario tiene una dirección de wallet
      }}
    >
      {children}
    </UserContext.Provider>
  );
};