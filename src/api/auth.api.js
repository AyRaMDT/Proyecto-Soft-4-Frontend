import axios from 'axios';

export const RegistrarAnalistaPeticion = async (analistaNuevo) => {
  try {
    const { nombre, primerApellido, segundoApellido, personaCedula, telefono, correoElectronico, contrasena } = analistaNuevo;
    console.log('Datos enviados para insertar analista:', { nombre, primerApellido, segundoApellido, personaCedula, telefono, correoElectronico, contrasena });

    const response = await axios.post('http://localhost:3333/auth/register', {
      nombre,
      primerApellido,
      segundoApellido,
      personaCedula,
      telefono,
      correoElectronico,
      contrasena,
    }, {withCredentials: true});

    console.log('Respuesta de la API:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error del servidor:', error.response.data);
    } else {
      console.error('Error al insertar el analista:', error.message);
    }
    throw error;
  }
};


export const IniciarSesionPeticion = async (personaCedula, contrasena) => {
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


export const LogoutPeticion = async () => {
  try {

    const response = await axios.post('http://localhost:3333/auth/logout',
  {},
  { withCredentials: true });

    console.log('Respuesta de la API:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error del servidor:', error.response.data);
    } else {
      console.error('Error al insertar el analista:', error.message);
    }
    throw error;
  }
};


export const VerificarPeticion = async () => {
  try {
    const response = await axios.get(`http://localhost:3333/auth/verify`, {withCredentials: true});

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error del servidor:', error.response.data);
    } else {
      console.error('Error al insertar el analista:', error.message);
    }
    throw error;
  }
};
