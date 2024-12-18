import axios from "axios";

export const insertarPago = async (PagoNuevo) => {
  try {
    const response = await axios.post("http://localhost:3333/pagos/realizarPago", PagoNuevo);
    return response.data; 
  } catch (error) {
    if (error.response) {
      console.error("Error del servidor:", error.response.data);
    } else {
      console.error("Error al realizar el pago:", error.message);
    }
    throw error;
  }
};


