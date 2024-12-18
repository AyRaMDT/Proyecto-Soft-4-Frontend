import axios from 'axios';

export const insertarAnalista = async (analistaNuevo) => {
  try {
    const { nombre, primerApellido, segundoApellido, personaCedula, telefono, correoElectronico, contrasena } = analistaNuevo;
    console.log('Datos enviados para insertar analista:', { nombre, primerApellido, segundoApellido, personaCedula, telefono, correoElectronico, contrasena });

    const response = await axios.post('http://localhost:3333/analistas/insertar', {
      nombre,
      primerApellido,
      segundoApellido,
      personaCedula,
      telefono,
      correoElectronico,
      contrasena,
    });

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

export const obtenerAnalistas = async () => {
  try {
    const response = await axios.get('http://localhost:3333/analistas/listar');
    return response.data;
  } catch (error) {
    console.error('Error al obtener la lista de analistas:', error);
    throw error;
  }
};

export const obtenerAnalistaPorId = async (personaCedula) => {
  try {
    const response = await axios.get(`http://localhost:3333/analista/obtenerAnalista/${personaCedula}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el analista por cédula:', error);
    throw error;
  }
};

export const eliminarAnalista = async (idanalistaCredito) => {
  try {
      console.log('ID enviado al backend:', idanalistaCredito); // Depuración
      const response = await axios.delete(`http://localhost:3333/analistas/eliminar/${idanalistaCredito}`);
      return response.data;
  } catch (error) {
      console.error('Error al eliminar el analista:', error);
      throw error;
  }
};



export const modificarAnalista = async (analistaActualizado) => {
  try {
    const response = await axios.put(
      'http://localhost:3333/analistas/modificarAnalista',
      analistaActualizado,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Response from API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in modificarAnalista:', error.response || error.message);
    throw error;
  }
};





