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
  const [tasaInteresMoratoria, setInteresesMoratorios] = useState()

  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const { rowData } = location.state || {};


  useEffect(() => {
    const obtenerDatosPrestamo = async () => {
      try {
        if (prestamo.idPrestamos) {
          // Obtener todos los préstamos
          const response = await axios.get('http://localhost:3333/formalizacion/listarTODO');
          console.log('Respuesta completa de la API:', response.data);

          // Filtrar el préstamo por ID
          const prestamoSeleccionado = response.data?.data?.find(
            (item) => item.idPrestamos === prestamo.idPrestamos
          );

          if (prestamoSeleccionado) {
            console.log('Préstamo seleccionado:', prestamoSeleccionado);
            const cuota = prestamoSeleccionado.prestamoClienteCuota || '0';

            // Actualizar el estado con los datos correctos
            setFormData((prevState) => ({
              ...prevState,
              cuotaPago: cuota,
              amortizacion: cuota,
              idPrestamos: prestamoSeleccionado.idPrestamos,
              montoPagado: cuota,
              intereses: prestamo.intereses || '0.00', // Reemplaza valores vacíos por 0.00
              tasaInteresMoratoria: prestamoSeleccionado.tasaInteresMoratoria || '0.00', // Nueva asignación
            }));
          } else {
            console.warn('No se encontró el préstamo correspondiente.');
            toast.current.show({
              severity: 'warn',
              summary: 'Advertencia',
              detail: 'Préstamo no encontrado en la base de datos.',
              life: 3000,
            });
          }
        }
      } catch (error) {
        console.error('Error al obtener los datos del préstamo:', error);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo obtener la información del préstamo.',
          life: 3000,
        });
      }
    };

    obtenerDatosPrestamo();
  }, [prestamo]);




  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultadoValidacion = validarNumeroPagos(
      formData.numeroPagos,
      parseFloat(formData.cuotaPago) / formData.numeroPagos, // Cuota individual
      parseFloat(formData.saldo)
    );

    // Validar y limpiar datos
    const formDataToSend = {
      ...formData,
      intereses: formData.intereses && formData.intereses !== '' ? formData.intereses : '0.00',
      amortizacion: formData.amortizacion && formData.amortizacion !== '' ? formData.amortizacion : '0.00',
      cuotaPago: formData.cuotaPago && formData.cuotaPago !== '' ? formData.cuotaPago : '0.00',
    };

    console.log("Enviando formulario con datos:", formDataToSend);

    try {
      const resultado = await insertarPago(formDataToSend);
      console.log("Pago realizado exitosamente:", resultado);
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Pago realizado correctamente.', life: 3000 });
    } catch (error) {
      console.error("Error al realizar el pago:", error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al realizar el pago.', life: 3000 });
    }
  };

  const validarNumeroPagos = (numeroPagos, cuotaPago, saldo) => {
    if (numeroPagos <= 0) {
      return { esValido: false, mensaje: 'El número de pagos no puede ser negativo o cero.' };
    }

    const amortizacionTotal = numeroPagos * cuotaPago;

    if (amortizacionTotal > saldo) {
      return { esValido: false, mensaje: 'La amortización total no puede exceder el saldo pendiente.' };
    }

    return { esValido: true };
  };

  const handleNumeroPagosChange = (e) => {
    const nuevoNumeroPagos = parseInt(e.target.value, 10) || 1;

    // Validar el nuevo número de pagos usando formData
    const resultadoValidacion = validarNumeroPagos(
      nuevoNumeroPagos,
      parseFloat(formData.cuotaPago) / formData.numeroPagos, // Cuota individual
      parseFloat(prestamo.saldo || 0) // Usa el saldo del préstamo
    );

    if (!resultadoValidacion.esValido) {
      toast.current.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: resultadoValidacion.mensaje,
        life: 3000
      });
      return;
    }

    // Actualizar el estado con los nuevos valores
    const nuevaCuotaTotal = parseFloat(formData.cuotaPago) / formData.numeroPagos * nuevoNumeroPagos;

    setFormData((prevState) => ({
      ...prevState,
      numeroPagos: nuevoNumeroPagos,
      cuotaPago: nuevaCuotaTotal.toFixed(2), // Actualiza cuota total
      amortizacion: nuevaCuotaTotal.toFixed(2), // Amortización también
    }));
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
                <label htmlFor="tasaInteresMoratoria" className="form-label">Interés moratorio</label>
                <input
                  type="text"
                  id="tasaInteresMoratoria"
                  name="tasaInteresMoratoria"
                  value={formData.tasaInteresMoratoria + '%'} // Accede desde formData
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
                  value={formData.cuotaPago}

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

              <div>
                <label htmlFor="numeroPagos" className="form-label">Número de Pagos</label>
                <input
                  type="number"
                  id="numeroPagos"
                  name="numeroPagos"
                  value={formData.numeroPagos}
                  min="1"
                  onChange={handleNumeroPagosChange} // Sin rowData
                  className="form-input"
                />
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
