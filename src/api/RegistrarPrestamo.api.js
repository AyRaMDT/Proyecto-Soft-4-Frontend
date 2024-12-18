import axios from "axios";

export const insertarPrestamo = async (prestamoNuevo) => {
  try {
    const response = await axios.post("http://localhost:3333/prestamos/nuevoPrestamo", prestamoNuevo);
    return response.data; 
  } catch (error) {
    if (error.response) {
      console.error("Error del servidor:", error.response.data);
    } else {
      console.error("Error al insertar el préstamo:", error.message);
    }
    throw error;
  }
};


export const obtenerPrestamos = async () => {
  try {
    const response = await axios.get("http://localhost:3333/prestamos/listaPrestamos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de préstamos:", error);
    throw error;
  }
};

export const obtenerPrestamosTODO = async () => {
  try {
    const response = await axios.get("http://localhost:3333/prestamos/listaPrestamos");
    console.log("Respuesta completa de la API:", response.data); // Depura la respuesta completa

    // Extrae solo el array de préstamos (posición [0] de "prestamos")
    const prestamos = response.data.prestamos?.[0];

    if (!Array.isArray(prestamos)) {
      throw new Error("Los datos de préstamos no están en el formato esperado.");
    }

    return prestamos; // Devuelve solo el array de préstamos
  } catch (error) {
    console.error("Error al obtener la lista de préstamos:", error);
    throw error;
  }
};

  


export const obtenerUltimoPrestamo = async () => {
  try {
    const response = await axios.get("http://localhost:3333/prestamos/obtenerultimo");
    return response.data;
  } catch (error) {
    console.error("Error al obtener el último préstamo:", error);
    throw error;
  }
};


export const eliminarPrestamoPorId = async (idPrestamos) => {
  try {
    const response = await axios.delete(`http://localhost:3333/prestamos/eliminarPrestamo/${idPrestamos}`);
    return response.data; 
  } catch (error) {
    if (error.response) {
      console.error("Error del servidor:", error.response.data);
    } else {
      console.error("Error al eliminar el préstamo:", error.message);
    }
    throw error;
  }
};


export const modificarPrestamo = async (idPrestamos, prestamoActualizado) => {
  try {
    const response = await axios.put(
      `http://localhost:3333/prestamos/actualizarPrestamo/${idPrestamos}`,
      prestamoActualizado
    );
    return response.data;
  } catch (error) {
    console.error("Error al modificar el préstamo:", error);
    throw error;
  }
};

export const aprobarPrestamo = async (idPrestamo) => {
  try {
    const response = await axios.put(
      "http://localhost:3333/prestamos/aprobar",
      { idPrestamo }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error del servidor al aprobar el préstamo:", error.response.data);
    } else {
      console.error("Error al aprobar el préstamo:", error.message);
    }
    throw error;
  }
};


export const rechazarPrestamo = async (idPrestamo) => {
  try {
    const response = await axios.put(
      "http://localhost:3333/prestamos/rechazar",
      { idPrestamo }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error del servidor al rechazar el préstamo:", error.response.data);
    } else {
      console.error("Error al rechazar el préstamo:", error.message);
    }
    throw error;
  }
};
