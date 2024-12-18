import React, { useState, useEffect, useRef } from 'react'; 
import '../Css/registroPrestamo.css';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { useLocation } from 'react-router-dom';
import { insertarPago } from '../api/RegistrarPago.api';



const RealizarPago = () => {
  
  const [formData, setFormData] = useState({
    fechaPago: '',
    montoPagado: '',
    medioPago: 'Tarjeta',
    intereses: '',
    amortizacion: '',
    cuotaPago: 0,
    numeroPagos: 1,
    idPrestamos: ''
  });

  const location = useLocation();
  const { rowData: prestamo } = location.state || {};
  const [nuevoSaldo, setNuevoSaldo] = useState();
  const [interesesMoratorios, setInteresesMoratorios] = useState()
  
  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  
  useEffect(() => {
    if (prestamo) {
        console.log('Prestamo:', prestamo);

        if (prestamo.monto && prestamo.PlazoMeses) {
            const tasaInteresAnual = prestamo.tasaInteresAnual; // Porcentaje anual (ej. 12%)
            const tasaInteresMoratoria = prestamo.tasaInteresMoratoria; // Porcentaje moratorio
            const saldo = prestamo.saldo;
            const diaPagoSeleccionado = parseInt(prestamo.diaPago);
            const diaActual = new Date().getDate();
            
            // Calcular la tasa mensual
            const tasaMensual = (tasaInteresAnual / 100) / 12;

            // Cuota mensual (solo amortización)
            
            // Intereses mensuales normales
            const interesMensual = (saldo * tasaMensual).toFixed(2);
            
            // Intereses moratorios (aplicados solo si hay retraso)
            const interesesMoratorios = diaActual > diaPagoSeleccionado
            ? (saldo * (tasaInteresMoratoria / 100)).toFixed(2)
                : 0;
                
                // Total de intereses (mensual + moratorio)
                const intereses = (
                  (prestamo.tasaInteresAnual / 100 / 12) + 
                  (diaActual > diaPagoSeleccionado ? prestamo.tasaInteresMoratoria / 100 : 0)
                ).toFixed(2);
                

            const amortizacion = parseFloat((prestamo.monto / prestamo.PlazoMeses).toFixed(2));

            console.log(intereses)
            // Calcular el interés general sobre la amortización
            const interesGeneral = parseFloat(amortizacion * intereses);

            // Sumar el interés general a la amortización
            const cuotaPago = parseFloat((amortizacion + interesGeneral).toFixed(2));
            

            // Actualizar estado
            setFormData((prevState) => ({
                ...prevState,
                montoPagado: cuotaPago,
                intereses: intereses * 100, // % intereses mensuales
                amortizacion: amortizacion,
                cuotaPago,
                idPrestamos: prestamo.idPrestamos
            }));

            if (diaActual > diaPagoSeleccionado) {
              setInteresesMoratorios(tasaInteresMoratoria);
            } else {
              setInteresesMoratorios(0);
            }
            
        }
    }
}, [prestamo]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };


   const validateForm = () => {
    const newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando formulario...");  // Agrega esta línea para verificar

    if (validateForm()) {
      try {
       const { diaPago, ...formDataToSend } = formData;

      const PagoNuevo = {
      ...formDataToSend,
      };
  
        console.log('Datos enviados al backend:', PagoNuevo);
  
        const resultado = await insertarPago(PagoNuevo);
  
        console.log("Pago realizado exitosamente:", resultado);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Pago realizado de manera exitosa', life: 3000 });
      } catch (error) {
        console.error("Error al realizar el pago:", error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al realizar el pago', life: 3000 });
      }
    }
  };
  
  useEffect(() => {
    const obtenerFechaLocal = () => {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0"); 
        const dia = String(hoy.getDate()).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    };

    const today = obtenerFechaLocal();

    setFormData((prevState) => ({
        ...prevState,
        fechaPago: today,
    }));
}, []);


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="containerPrestamos">
        <div className="loan-form-card">
          <h2 className="form-title text-3xl">Realizar Pago</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Número de préstamo */}
              <div>
                <label htmlFor="numeroPrestamo" className="form-label">Número de Préstamo</label>
                <input
                  type="text"
                  id="numeroPrestamo"
                  name="numeroPrestamo"
                  value={prestamo.numeroPrestamo}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Número de préstamo generado"
                  disabled
                />
              </div>

              {/* Monto */}
              <div>
                <label htmlFor="monto" className="form-label">Monto del Préstamo</label>
                <input
                  type="number"
                  id="monto"
                  name="monto"
                  value={prestamo.monto}
                  className="form-input"
                  disabled
                />
                {errors.monto && <p className="error-message">{errors.monto}</p>}
              </div>
              
              {/* Saldo Pendiente */}
              <div>
                <label htmlFor="saldo" className="form-label">Saldo Pendiente</label>
                <input
                  type="text"
                  id="saldo"
                  name="saldo"
                    value={prestamo.saldo}
                  className="form-input"
                  disabled
                />
                {errors.fechaInicio && <p className="error-message">{errors.fechaInicio}</p>}
              </div>

              {/* Fecha de pago */}
              <div>
                <label htmlFor="fechaPago" className="form-label">Fecha de Pago</label>
                <input
                  type='date'
                  id="fechaPago"
                  name="fechaPago"
                  value={formData.fechaPago}
                  className="form-input"
                  disabled
                />
                  
                {errors.plazoMeses && <p className="error-message">{errors.plazoMeses}</p>}
              </div>

              {/* Día de pago */}
              <div>
                <label htmlFor="diaPago" className="form-label">Día de Pago</label>
                <input
                  type="number"
                  id="diaPago"
                  name="diaPago"
                  value={prestamo.diaPago}
                  className="form-input"
                  disabled
                />
                {errors.diaPago && <p className="error-message">{errors.diaPago}</p>}
              </div>
              

              {/* Interes */}
              <div>
                <label htmlFor="intereses" className="form-label">Interés Mensual</label>
                <input
                  type="text"
                  id="intereses"
                  name="intereses"
                  value={prestamo.tasaInteresAnual / 12 + '%'}
                  className="form-input"
                  disabled
                />
              </div>

              {/* Interes Moratorios*/}
              <div>
                <label htmlFor="interesesMoratorios" className="form-label">Interés moratorio</label>
                <input
                  type="text"
                  id="interesesMoratorios"
                  name="interesesMoratorios"
                  value={interesesMoratorios + '%'}
                  className="form-input"
                  disabled
                />
              </div>


              {/* Amortizacion */}
              <div>
                <label htmlFor="amortizacion" className="form-label">Amortización</label>
                <input
                  type="number"
                  id="amortizacion"
                  name="amortizacion"
                  value={formData.amortizacion}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.amortizacion && <p className="error-message">{errors.amortizacion}</p>}
              </div>

              {/* Cédula del Cliente */}
              <div>
                <label htmlFor="cuotaPago" className="form-label">Cuota de Pago</label>
                <input
                  type="text"
                  id="cuotaPago"
                  name="cuotaPago"
                  value={formData.cuotaPago}
                  className="form-input"
                  disabled
                  onChange={handleChange}

                />
                {errors.clientesPersonaCedula && <p className="error-message">{errors.clientesPersonaCedula}</p>}
              </div>

              {/* Metodo de pago */}
              <div>
                <label htmlFor="metodoPago" className="form-label">Método de Pago</label>
                <input
                  type="text"
                  id="metodoPago"
                  name="metodoPago"
                  value={formData.medioPago}
                  className="form-input"
                  disabled
                />
                {errors.fechaInicio && <p className="error-message">{errors.fechaInicio}</p>}
              </div>

              {/* ID Cliente */}
              <div>
                <label htmlFor="numPagos" className="form-label">Número de pagos</label>
                <input
                  type="text"
                  id="numPagos"
                  name="numPagos"
                  value={formData.numeroPagos} // Aquí debe aparecer el idCliente (si existe)
                  className="form-input"
                  disabled
                  onChange={handleChange}
                />
                {errors.IdClientes && <p className="error-message">{errors.IdClientes}</p>}
              </div>
              
            </div>

          
            {/* Botón de envío */}
            <div className="submit-button-container">
              <button
                type="submit"
                className="submit-button"
              >
                  Realizar Pago
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default RealizarPago;
