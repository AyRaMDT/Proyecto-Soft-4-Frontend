import React, { useState, useEffect, useRef } from 'react';
import '../Css/formalizacionmodal.css';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { insertarPago } from '../api/RegistrarPago.api';

const RealizarPagoModal = ({ visible, onHide, rowData }) => {
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

  const toast = useRef(null);

  useEffect(() => {
    if (rowData) {
      console.log('Selected Loan Details:', rowData); // Logs for debugging
      setFormData({
        cuotaPago: rowData.prestamoClienteCuota || '0',
        amortizacion: rowData.prestamoClienteCuota || '0',
        idPrestamos: rowData.idPrestamos || '',
        montoPagado: rowData.prestamoClienteCuota || '0',
        intereses: rowData.tasaInteresAnual || '0.00',
        medioPago: 'Tarjeta',
        fechaPago: getFormattedDate(new Date()),
        numeroPagos: 1
      });
    }
  }, [rowData]);

  const getFormattedDate = (date) => {
    const anio = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Form Data to Submit:', formData); // Logs for debugging

      const response = await insertarPago(formData);
      console.log('API Response:', response);

      if (response.success) {
        showToast('success', 'Éxito', 'Pago realizado correctamente.');
        onHide();
      } else {
        showToast('success', 'Éxito', response.message || 'Pago realizado correctamente.');
      }
    } catch (error) {
      console.error('Error al realizar el pago:', error);
      showToast('error', 'Error', 'Hubo un problema al realizar el pago.');
    }
  };

  const showToast = (severity, summary, detail) => {
    if (toast.current) {
      toast.current.show({ severity, summary, detail, life: 3000 });
    }
  };

  const handleMedioPagoChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      medioPago: e.target.value
    }));
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Realizar Pago"
      style={{ width: '50vw' }}
      modal
      className="p-fluid"
    >
      <div className="containerPrestamos">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Amortización */}
            <div>
              <label htmlFor="amortizacion" className="form-label">Amortización</label>
              <input
                type="text"
                id="amortizacion"
                name="amortizacion"
                value={formData.amortizacion}
                className="form-input"
                disabled
              />
            </div>

            {/* Cuota de Pago */}
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
            </div>

            {/* Fecha de Pago */}
            <div>
              <label htmlFor="fechaPago" className="form-label">Fecha de Pago</label>
              <input
                type="text"
                id="fechaPago"
                name="fechaPago"
                value={formData.fechaPago}
                className="form-input"
                disabled
              />
            </div>

            {/* ID Préstamo */}
            <div>
              <label htmlFor="idPrestamos" className="form-label">ID Préstamo</label>
              <input
                type="text"
                id="idPrestamos"
                name="idPrestamos"
                value={formData.idPrestamos}
                className="form-input"
                disabled
              />
            </div>

            {/* Intereses */}
            <div>
              <label htmlFor="intereses" className="form-label">Intereses</label>
              <input
                type="text"
                id="intereses"
                name="intereses"
                value={formData.intereses}
                className="form-input"
                disabled
              />
            </div>

            {/* Medio de Pago */}
            <div>
              <label htmlFor="medioPago" className="form-label">Método de Pago</label>
              <select
                id="medioPago"
                name="medioPago"
                value={formData.medioPago}
                onChange={handleMedioPagoChange}
                className="form-input"
              >
                <option value="Tarjeta">Tarjeta</option>
                <option value="Efectivo">Efectivo</option>
              </select>
            </div>

            {/* Monto Pagado */}
            <div>
              <label htmlFor="montoPagado" className="form-label">Monto Pagado</label>
              <input
                type="text"
                id="montoPagado"
                name="montoPagado"
                value={formData.montoPagado}
                className="form-input"
                disabled
              />
            </div>

            {/* Número de Pagos */}
            <div>
              <label htmlFor="numeroPagos" className="form-label">Número de Pagos</label>
              <input
                type="text"
                id="numeroPagos"
                name="numeroPagos"
                value={formData.numeroPagos}
                className="form-input"
                disabled
              />
            </div>
          </div>
          <div className="submit-button-container">
            <button type="submit" className="submit-button">
              Realizar Pago
            </button>
          </div>
        </form>
      </div>
      <Toast ref={toast} />
    </Dialog>
  );
};

export default RealizarPagoModal;
