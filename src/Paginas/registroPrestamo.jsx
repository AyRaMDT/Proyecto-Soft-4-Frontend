import React, { useState, useEffect, useRef } from 'react'; 
import '../Css/registroPrestamo.css';
import { insertarPrestamo } from "../api/RegistrarPrestamo.api";
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { getProfile } from '../api/Login';


const BankLoanForm = () => {
  const [formData, setFormData] = useState({
    monto: '',
    plazoMeses: '',
    fechaInicio: '',
    fechaVencimiento: '',
    numeroPrestamo: '',
    tasaInteresMoratoria: 10,
    tasaInteresAnual: 12.00,
    diaPago: '',
    clientesPersonaCedula: '',
    IdClientes: '',
    estadoPrestamo: 2,
  });

  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileResponse = await getProfile();
        const profile = profileResponse.perfil; 
  
        console.log('Usuario logueado:', profile);
  
  
        setFormData((prevState) => ({
          ...prevState,
          clientesPersonaCedula: profile.personaCedula || '',
          IdClientes: profile.idClientes || '', 
        }));
      } catch (error) {
        console.error('Error al obtener los datos del usuario logueado:', error);
      }
    };
  
    fetchUserData();
  }, []); 
  
  useEffect(() => {
    const fetchLastLoanNumber = async () => {
      try {
        const response = await axios.get("http://localhost:3333/prestamos/obtenerultimo");
        console.log("Respuesta de la API:", response.data);

        const ultimoPrestamo = response.data.ultimoPrestamo || "PRE-0";

        const numeroPrestamo = parseInt(ultimoPrestamo.split("PRE-")[1], 10);

        const nuevoNumeroPrestamo = `PRE-${numeroPrestamo + 1}`;

        setFormData(prevState => ({
          ...prevState,
          numeroPrestamo: nuevoNumeroPrestamo
        }));
      } catch (error) {
        console.error("Error al obtener el último número de préstamo:", error);
      }
    };

    fetchLastLoanNumber();
  }, []);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
    if (name === 'plazoMeses' || name === 'fechaInicio') {
      calculateFechaVencimiento(value, name);
    }
  };

  const calculateFechaVencimiento = (value, field) => {
    let fechaInicio = formData.fechaInicio ? new Date(formData.fechaInicio) : null;
    let plazoMeses = formData.plazoMeses;

    if (field === 'plazoMeses') plazoMeses = value;
    if (field === 'fechaInicio') fechaInicio = value ? new Date(value) : null;

    if (fechaInicio && !isNaN(fechaInicio) && plazoMeses) {
      const fechaVencimiento = new Date(fechaInicio);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + parseInt(plazoMeses, 10));

      setFormData((prevState) => ({
        ...prevState,
        fechaVencimiento: fechaVencimiento.toISOString().split('T')[0]
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== 'fechaVencimiento') {
        newErrors[key] = 'Este campo es requerido';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando formulario...");  // Agrega esta línea para verificar

    if (validateForm()) {
      try {
        const prestamoNuevo = {
          ...formData,
          estadoPrestamo: 2,
        };
  
        console.log('Datos enviados al backend:', prestamoNuevo);
  
        const resultado = await insertarPrestamo(prestamoNuevo);
  
        console.log("Préstamo insertado exitosamente:", resultado);
        toast.current.show({ severity: 'success', summary: 'Exitoso', detail: 'Préstamo procesado de manera exitosa', life: 3000 });
      } catch (error) {
        console.error("Error al insertar el préstamo:", error);
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Hubo un problema al registrar el préstamo', life: 3000 });
      }
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="containerPrestamos">
        <div className="loan-form-card">
          <h2 className="form-title text-3xl">Solicitud de Préstamo</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Número de préstamo */}
              <div>
                <label htmlFor="numeroPrestamo" className="form-label">Número de Préstamo</label>
                <input
                  type="text"
                  id="numeroPrestamo"
                  name="numeroPrestamo"
                  value={formData.numeroPrestamo}
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
                  value={formData.monto}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ingrese monto"
                />
                {errors.monto && <p className="error-message">{errors.monto}</p>}
              </div>

              {/* Plazo Meses */}
              <div>
                <label htmlFor="plazoMeses" className="form-label">Plazo (Meses)</label>
                <select
                  id="plazoMeses"
                  name="plazoMeses"
                  value={formData.plazoMeses}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Seleccione plazo</option>
                  {[6, 12, 18, 24, 36, 48, 60].map((mes) => (
                    <option key={mes} value={mes}>{mes} meses</option>
                  ))}
                </select>
                {errors.plazoMeses && <p className="error-message">{errors.plazoMeses}</p>}
              </div>

              {/* Fecha de inicio */}
              <div>
                <label htmlFor="fechaInicio" className="form-label">Fecha de inicio</label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.fechaInicio && <p className="error-message">{errors.fechaInicio}</p>}
              </div>

              {/* Fecha de vencimiento */}
              <div>
                <label htmlFor="fechaVencimiento" className="form-label">Fecha de vencimiento</label>
                <input
                  type="date"
                  id="fechaVencimiento"
                  name="fechaVencimiento"
                  value={formData.fechaVencimiento}
                  onChange={handleChange}
                  className="form-input"
                  disabled
                />
              </div>

              {/* Día de pago */}
              <div>
                <label htmlFor="diaPago" className="form-label">Día de Pago</label>
                <input
                  type="number"
                  id="diaPago"
                  name="diaPago"
                  value={formData.diaPago}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ingrese día de pago"
                  min="1"
                  max="31"
                />
                {errors.diaPago && <p className="error-message">{errors.diaPago}</p>}
              </div>

              <div>
                <label htmlFor="saldo" className="form-label">Saldo Pendiente</label>
                <input
                  type="number"
                  id="saldo"
                  name="saldo"
                  value={formData.monto}
                  onChange={handleChange}
                  className="form-input"
                  disabled
                />
                {errors.diaPago && <p className="error-message">{errors.diaPago}</p>}
              </div>
              {/* Cédula del Cliente */}
              <div>
                <label htmlFor="clientesPersonaCedula" className="form-label">Cédula del Cliente</label>
                <input
                  type="text"
                  id="clientesPersonaCedula"
                  name="clientesPersonaCedula"
                  value={formData.clientesPersonaCedula} // Aquí debe aparecer personaCedula
                  className="form-input"
                  disabled
                  onChange={handleChange}

                />
                {errors.clientesPersonaCedula && <p className="error-message">{errors.clientesPersonaCedula}</p>}
              </div>

              {/* ID Cliente */}
              <div>
                <label htmlFor="IdClientes" className="form-label">ID del Cliente</label>
                <input
                  type="text"
                  id="IdClientes"
                  name="IdClientes"
                  value={formData.IdClientes} // Aquí debe aparecer el idCliente (si existe)
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
                Registrar Préstamo
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toast ref={toast} />
    </div>
  );
};

export default BankLoanForm;
