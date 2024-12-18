import axios from "axios";

export const agregarFormalizacion = async (formalizacion) => {
  try {
    const response = await axios.post(
      "http://localhost:3333/formalizacion/agregar",
      formalizacion
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error del servidor:", error.response.data);
    } else {
      console.error("Error al agregar la formalización:", error.message);
    }
    throw error;
  }
};

export const modificarFormalizacion = async (formalizacionActualizada) => {
  try {
    const response = await axios.put(
      "http://localhost:3333/formalizacion/modificar",
      formalizacionActualizada
    );
    return response.data;
  } catch (error) {
    console.error("Error al modificar la formalización:", error);
    throw error;
  }
};

export const listarFormalizaciones = async () => {
  try {
    const response = await axios.get("http://localhost:3333/formalizacion/listar");
    return response.data;
  } catch (error) {
    console.error("Error al listar las formalizaciones:", error);
    throw error;
  }
};

export const eliminarFormalizacionPorId = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:3333/formalizacion/eliminar/${id}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error del servidor:", error.response.data);
    } else {
      console.error("Error al eliminar la formalización:", error.message);
    }
    throw error;
  }
};

export const fetchPrestamosFormalizados = async () => {
  try {
    const response = await axios.get("http://localhost:3333/formalizacion/listarTODO"); // Ajusta tu endpoint
    if (response.data.success) {
      return response.data.data;
    } else {
      console.error("Error al obtener los datos:", response.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return [];
  }
};
