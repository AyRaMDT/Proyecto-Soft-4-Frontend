import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import "../Css/LoansDialog.css";

const LoansDialog = ({ visible, loans, hideDialog, onEditLoan, onDeleteLoan }) => {
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [loading, setLoading] = useState(false);
    const toastRef = useRef(null);

    const modificarPrestamo = async (loan) => {
        try {
            const fechaInicioFormatted = new Date(loan.fechaInicio).toISOString().split('T')[0];

            const response = await axios.put('http://localhost:3333/prestamos/actualizarPrestamo', {
                idPrestamos: loan.idPrestamos,
                monto: loan.monto,
                plazoMeses: loan.plazoMeses,
                fechaInicio: fechaInicioFormatted,
                numeroPrestamo: loan.numeroPrestamo,
                tasaInteresMoratoria: loan.tasaInteresMoratoria,
                tasaInteresAnual: loan.tasaInteresAnual || 0,
                estadoPrestamo: loan.estadoPrestamo,
                diaPago: loan.diaPago,
                IdClientes: loan.IdClientes,
                clientesPersonaCedula: loan.clientesPersonaCedula,
            });

            console.log('Préstamo actualizado:', response.data);
        } catch (error) {
            console.error(
                'Error al modificar el préstamo:',
                error.response ? error.response.data : error.message
            );
        }
    };

    const handleEditLoan = (loan) => {
        setSelectedLoan({ ...loan, tasaInteresAnual: loan.tasaInteresAnual || 0 });
    };

    const handleSaveChanges = async () => {
        if (!selectedLoan) return;

        const requiredFields = [
            'monto',
            'plazoMeses',
            'fechaInicio',
            'numeroPrestamo',
            'tasaInteresMoratoria',
            'tasaInteresAnual',
            'estadoPrestamo',
            'diaPago',
            'IdClientes',
            'clientesPersonaCedula',
        ];

        for (let field of requiredFields) {
            if (!selectedLoan[field]) {
                toastRef.current.show({ severity: 'error', summary: 'Error', detail: `El campo ${field} es obligatorio`, life: 3000 });
                return;
            }
        }

        setLoading(true);
        try {
            const updatedLoan = await modificarPrestamo(selectedLoan);

            if (onEditLoan) {
                onEditLoan(updatedLoan);
            }

            setSelectedLoan(null);
            toastRef.current.show({ severity: 'success', summary: 'Éxito', detail: 'El préstamo se actualizó correctamente', life: 3000 });
            window.location.reload();
        } catch (error) {
            console.error("Error al modificar el préstamo:", error);
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un problema al actualizar el préstamo.',
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <Toast ref={toastRef} />
            <Dialog
                visible={visible}
                style={{ width: '50vw' }}
                header="Préstamos"
                modal
                onHide={hideDialog}
                className="loans-dialog"
            >
                <div className="loans-container">
                    {loans.length === 0 ? (
                        <div className="no-loans-message">No hay préstamos disponibles</div>
                    ) : (
                        <ul className="loans-list">
                            {loans.map((loan) => (
                                <li key={loan.numeroPrestamo || loan.idPrestamos} className="loan-item">
                                    <div className="loan-details">
                                        <div className="loan-header">
                                            <span className="loan-number">Préstamo #{loan.numeroPrestamo}</span>
                                            <span
                                                className={`loan-status ${loan.estadoPrestamo === 1
                                                        ? 'activo'
                                                        : loan.estadoPrestamo === 2
                                                            ? 'pendiente'
                                                            : loan.estadoPrestamo === 4
                                                                ? 'rechazado'
                                                                : ''
                                                    }`}
                                            >
                                                {loan.estadoPrestamo === 1
                                                    ? 'Activo'
                                                    : loan.estadoPrestamo === 2
                                                        ? 'Pendiente'
                                                        : loan.estadoPrestamo === 4
                                                            ? 'Rechazado'
                                                            : ''}
                                            </span>
                                        </div>

                                        <div className="loan-info">
                                            <div className="loan-info-row">
                                                <span className="label">Plazo:</span>
                                                <span className="value">{loan.PlazoMeses} meses</span>
                                            </div>
                                            <div className="loan-info-row">
                                                <span className="label">Monto:</span>
                                                <span className="value">${loan.monto.toLocaleString()}</span>
                                            </div>
                                            <div className="loan-info-row">
                                                <span className="label">Fecha de Inicio:</span>
                                                <span className="value">{new Date(loan.fechaInicio).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="loan-actions">
                                        <Button
                                            icon="pi pi-pencil"
                                            className="edit-btn"
                                            onClick={() => handleEditLoan(loan)}
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="delete-btn"
                                            onClick={() => onDeleteLoan(loan)}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {selectedLoan && (
                    <Dialog
                        visible={Boolean(selectedLoan)}
                        style={{ width: '50vw' }}
                        header="Editar Préstamo"
                        modal
                        onHide={() => setSelectedLoan(null)}
                        className="loan-edit-dialog"
                    >
                        <div className="loan-edit-container">
                            <h3 className="loan-edit-title">Detalles del préstamo</h3>
                            <div className="loan-edit-form">
                                <div className="form-row">
                                    <label>Préstamo #:</label>
                                    <span className="readonly-value">{selectedLoan.numeroPrestamo}</span>
                                </div>
                                <div className="form-row">
                                    <label>Monto:</label>
                                    <input
                                        type="number"
                                        value={selectedLoan.monto}
                                        onChange={(e) => setSelectedLoan({ ...selectedLoan, monto: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-row">
                                    <label>Plazo (Meses):</label>
                                    <select
                                        value={selectedLoan.plazoMeses || ""} // Usa el valor actual o un valor vacío como fallback
                                        onChange={(e) =>
                                            setSelectedLoan({ ...selectedLoan, plazoMeses: parseInt(e.target.value, 10) }) // Actualiza el estado con el nuevo valor
                                        }
                                        className="form-input"
                                    >
                                        {/* Placeholder dinámico */}
                                        <option value="" disabled>
                                            {selectedLoan.plazoMeses ? `${selectedLoan.plazoMeses} meses` : "Seleccione un plazo"}
                                        </option>

                                        {/* Opciones seleccionables */}
                                        {[6, 12, 18, 24, 36, 48, 60].map((mes) => (
                                            <option key={mes} value={mes}>
                                                {mes} meses
                                            </option>
                                        ))}
                                    </select>


                                </div>
                                <div className="form-row">
                                    <label>Fecha de Inicio:</label>
                                    <input
                                        type="date"
                                        value={new Date(selectedLoan.fechaInicio).toISOString().split('T')[0]}
                                        onChange={(e) => setSelectedLoan({ ...selectedLoan, fechaInicio: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-row">
                                    <label>Tasa de Interés Moratoria:</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={selectedLoan.tasaInteresMoratoria}
                                        onChange={(e) => setSelectedLoan({ ...selectedLoan, tasaInteresMoratoria: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-row">
                                    <label>Día de Pago:</label>
                                    <input
                                        type="number"
                                        value={selectedLoan.diaPago}
                                        onChange={(e) => setSelectedLoan({ ...selectedLoan, diaPago: e.target.value })}
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-row">
                                    <label>ID Cliente:</label>
                                    <input
                                        type="number"
                                        value={selectedLoan.IdClientes}
                                        onChange={(e) => setSelectedLoan({ ...selectedLoan, IdClientes: e.target.value })}
                                        disabled
                                        className="form-input disabled"
                                    />
                                </div>
                                <div className="form-row">
                                    <label>Cédula Cliente:</label>
                                    <input
                                        type="text"
                                        value={selectedLoan.clientesPersonaCedula}
                                        onChange={(e) => setSelectedLoan({ ...selectedLoan, clientesPersonaCedula: e.target.value })}
                                        disabled
                                        className="form-input disabled"
                                    />
                                </div>
                                <div className="form-row">
                                    <label>Estado del Préstamo:</label>
                                    <select
                                        value={selectedLoan.estadoPrestamo}
                                        onChange={(e) => setSelectedLoan({ ...selectedLoan, estadoPrestamo: e.target.value })}
                                        className="form-input"
                                    >
                                        <option value="1">Activo</option>
                                        <option value="2">Pendiente</option>
                                        <option value="3">Rechazado</option>
                                    </select>
                                </div>

                                <div className="form-actions">
                                    <Button
                                        label={loading ? "Guardando..." : "Guardar Cambios"}
                                        onClick={handleSaveChanges}
                                        disabled={loading}
                                        className="save-button"
                                    />
                                </div>
                            </div>
                        </div>

                    </Dialog>
                )}
            </Dialog>
        </>
    );
};

export default LoansDialog;
