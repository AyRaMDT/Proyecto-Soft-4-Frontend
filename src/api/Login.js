import axios from 'axios';

const BASE_URL = 'http://localhost:3333';

export const login = async (personaCedula, contrasena) => {
  try {
    const response = await axios.post(
      'http://localhost:3333/auth/login',
      { personaCedula, contrasena },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error en login:', error.response.data);
      throw new Error(error.response.data.mensaje || 'Error en el servidor');
    } else if (error.request) {
      console.error('Error en la red:', error.request);
      throw new Error('Error en la red o el servidor no responde');
    } else {
      console.error('Error desconocido:', error.message);
      throw new Error('Ocurrió un error desconocido');
    }
  }
};


export const logout = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/logout`, {}, {
      withCredentials: true,
    });

    return response.data; 
  } catch (error) {
    console.error('Error en logout:', error.response?.data?.mensaje || error.message);
    throw new Error(error.response?.data?.mensaje || 'Error al cerrar sesión');
  }
};

export const getProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3333/auth/profile", {
        withCredentials: true, 
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
      throw new Error("No se pudo obtener el perfil del usuario");
    }
  };
  
  
