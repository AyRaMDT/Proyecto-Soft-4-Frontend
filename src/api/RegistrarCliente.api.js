import axios from "axios";

export const insertarCliente = async (clienteNuevo) => {
  try {
    const { nombre, primerApellido, segundoApellido, direccion, telefono, correoElectronico, personaCedula, contrasena } = clienteNuevo;
    console.log("Datos enviados para insertar cliente:", { direccion, telefono, correoElectronico, personaCedula, contrasena });

    const response = await axios.post("http://localhost:3333/cliente/crear-cliente", {
      nombre,
      primerApellido,
      segundoApellido,
      direccion,
      telefono,
      correoElectronico,
      personaCedula,
      contrasena,
    });

    console.log("Respuesta de la API:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error del servidor:", error.response.data);
    } else {
      console.error("Error al insertar el cliente:", error.message);
    }
    throw error;
  }
};


export const obtenerClientes = async () => {
  try {
    const response = await axios.get("http://localhost:3333/cliente/obtener-clientes");
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de clientes:", error);
    throw error;
  }
};

export const obtenerClientePorId = async (idClientes) => {
  try {
    const response = await axios.get(`http://localhost:3333/cliente/leer-cliente`, {
      params: { idClientes }
    });
    console.log("Cliente obtenido:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    throw error;
  }
};


export const eliminarCliente = async (idClientes) => {
  try {
    const response = await axios.delete(`http://localhost:3333/cliente/eliminar-cliente?idClientes=${idClientes}`);
    
    if (response.data.success && response.data.affectedRows > 0) {
      return { success: false, message: 'Cliente eliminado exitosamente' };
    } else {
      return { success: true, message: 'No se encontró el cliente para eliminar' };
    }
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    return { success: false, message: 'Hubo un error al intentar eliminar el cliente.' };
  }
};


export const actualizarCliente = async (clienteData) => {
  try {
      const response = await axios.put('http://localhost:3333/cliente/modificar-cliente', clienteData);
      return response.data;
  } catch (error) {
      if (error.response) {
          throw new Error(error.response.data || 'Error en la respuesta del backend');
      } else {
          throw new Error(error.message || 'Error al modificar cliente');
      }
  }
};





