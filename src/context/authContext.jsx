import { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IniciarSesionPeticion, LogoutPeticion, VerificarPeticion } from '../api/auth.api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(); // Contiene los datos del usuario logueado (cliente o analista)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState({});
  const [loader, setLoader] = useState(true);
  const location = useLocation();

  const IniciarSesion = async (personaCedula, contrasena) => {
    try {
      const result = await IniciarSesionPeticion(personaCedula, contrasena);

      console.log(result)
      setUser(result); 
      setIsAuthenticated(true);
      return result;
    } catch (error) {
      setErrors(error);
    } finally {
      setLoader(false);
    }
  };

  const Logout = async () => {
    try {
      await LogoutPeticion();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const publicRoutes = ['/login', '/register'];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await VerificarPeticion();
        console.log(result);
        
        setIsAuthenticated(true);
        setUser(result); // Define el rol del usuario
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoader(false);
      }
    };

    if (!publicRoutes.includes(location.pathname)) {
      checkAuth();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        IniciarSesion,
        Logout,
        user,
        isAuthenticated,
        errors,
        loader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
