import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import '../Css/analistaManagement.css';

const PrestamosFormalizadosPage = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [filteredPrestamos, setFilteredPrestamos] = useState([]);
    const [selectedPrestamo, setSelectedPrestamo] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const toast = useRef(null);

    // Función para formatear fechas
    const formatFecha = (fecha) => {
        if (!fecha) return '';
        return fecha.split('T')[0]; // Elimina la parte de la hora
    };

    // Obtener datos de préstamos formalizados
    useEffect(() => {
        const fetchPrestamos = async () => {
            try {
                const response = await axios.get('http://localhost:3333/formalizacion/listarTODO');
                if (response.data.success) {
                    // Formatea las fechas antes de asignarlas al estado
                    const prestamosConFechasFormateadas = response.data.data.map((prestamo) => ({
                        ...prestamo,
                        fechaInicio: formatFecha(prestamo.fechaInicio),
                        fechaVencimiento: formatFecha(prestamo.fechaVencimiento),
                    }));
                    setPrestamos(prestamosConFechasFormateadas);
                    setFilteredPrestamos(prestamosConFechasFormateadas);
                } else {
                    console.error('Error al obtener los préstamos:', response.data.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        fetchPrestamos();
    }, []);

    // Filtrar préstamos por término de búsqueda
    useEffect(() => {
        const filtered = prestamos.filter((prestamo) =>
            Object.values(prestamo).some((value) =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredPrestamos(filtered);
    }, [searchTerm, prestamos]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleEliminar = async (prestamoFormalId) => {
        try {
            const response = await axios.delete(
                `http://localhost:3333/formalizacion/rechazar?prestamoFormalId=${prestamoFormalId}&estadoRechazadoId=4`
            );

            if (response.data.success) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Préstamo eliminado',
                    detail: response.data.message,
                    life: 3000,
                });
                window.location.reload();
                // Actualiza la lista de préstamos eliminando el registro
                const updatedPrestamos = prestamos.filter((p) => p.idPrestamoFormal !== prestamoFormalId);
                setPrestamos(updatedPrestamos);
                setFilteredPrestamos(updatedPrestamos);
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: response.data.message,
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Error al eliminar el préstamo:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error interno',
                detail: 'No se pudo eliminar el préstamo.',
                life: 3000,
            });
        }
    };
    const openDialog = (prestamo = null) => {
        setSelectedPrestamo(
            prestamo || {
                idPrestamoFormal: '',
                analistaIdAnalista: '',
                analistaPersonaCedula: '',
                prestamoClienteCuota: '',
                prestamoscliente_idPrestamos: '',
                monto: '',
                PlazoMeses: '',
                fechaInicio: '',
                fechaVencimiento: '',
                diaPago: '',
                estadoPrestamo: '',
                clienteNombre: '',
                clientePrimerApellido: '',
                clienteSegundoApellido: '',
                tipoEstado: '',
            }
        );
        setIsDialogVisible(true);
    };

    const openEditDialog = (prestamo) => {
        setSelectedPrestamo(prestamo); // Cargar los datos del préstamo seleccionado
        setIsDialogVisible(true); // Mostrar el diálogo
    };

    const handleGuardar = async () => {
        try {
            const response = await axios.put(
                'http://localhost:3333/formalizacion/modificarTODO',
                {
                    prestamoFormalId: selectedPrestamo.idPrestamoFormal,
                    analistaId: selectedPrestamo.analistaIdAnalista,
                    analistaCedula: selectedPrestamo.analistaPersonaCedula,
                    cuota: selectedPrestamo.prestamoClienteCuota,
                    monto: selectedPrestamo.monto,
                    plazoMeses: selectedPrestamo.PlazoMeses,
                    fechaInicio: selectedPrestamo.fechaInicio,
                    fechaVencimiento: selectedPrestamo.fechaVencimiento,
                    diaPago: selectedPrestamo.diaPago,
                    estadoPrestamoId: selectedPrestamo.estadoPrestamo,
                }
            );

            if (response.data.success) {
                toast.current.show({
                    severity: 'success',
                    summary: 'Préstamo actualizado',
                    detail: response.data.message,
                    life: 3000,
                });
                window.location.reload();
                // Actualiza la lista de préstamos
                const updatedPrestamos = prestamos.map((p) =>
                    p.idPrestamoFormal === selectedPrestamo.idPrestamoFormal ? selectedPrestamo : p
                );
                setPrestamos(updatedPrestamos);
                setFilteredPrestamos(updatedPrestamos);

                setIsDialogVisible(false); // Cierra el diálogo
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: response.data.message,
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Error al actualizar el préstamo:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error interno',
                detail: 'No se pudo actualizar el préstamo.',
                life: 3000,
            });
        }
    };

    const dialogFooter = (
        <div>
            <Button
                label="Cerrar"
                icon="pi pi-times"
                onClick={() => setIsDialogVisible(false)}
                className="p-button-text"
            />
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <div className="btn-container">
            <Button
                icon="pi pi-pencil"
                className="btn-editar"
                onClick={() => openEditDialog(rowData)}
            />
            <Button
                icon="pi pi-trash"
                className="btn-eliminar"
                onClick={() => handleEliminar(rowData.idPrestamoFormal)}
            />
            <Button
                icon="pi pi-info-circle"
                className="btn-info"
                onClick={() => openDialog(rowData)}
            />
        </div>
    );

    return (
        <div className="user-management-container">
            <div className="card">
                <div className="card-header">
                    <div className="search-container">
                        <InputText
                            type="text"
                            placeholder="Buscar préstamos..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                    <h1>Gestión de Préstamos Formalizados</h1>
                </div>
                <DataTable
                    value={filteredPrestamos}
                    stripedRows
                    paginator
                    rows={5}
                    className="p-datatable-turquoise"
                >
                    <Column field="idPrestamoFormal" header="ID Formalización" />
                    <Column field="analistaIdAnalista" header="ID Analista" />
                    <Column field="analistaPersonaCedula" header="Cédula Analista" />
                    <Column field="prestamoClienteCuota" header="Cuota" />
                    <Column field="monto" header="Monto" />
                    <Column field="PlazoMeses" header="Plazo (Meses)" />
                    <Column field="fechaInicio" header="Fecha Inicio" />
                    <Column field="fechaVencimiento" header="Fecha Vencimiento" />
                    <Column field="estadoPrestamo" header="Estado" />
                    <Column body={actionBodyTemplate} header="Acciones" />
                </DataTable>
            </div>

            <Dialog
                header="Detalle del Préstamo"
                visible={isDialogVisible}
                onHide={() => setIsDialogVisible(false)}
                footer={dialogFooter}
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="clienteNombre">Nombre del Cliente</label>
                        <InputText
                            id="clienteNombre"
                            value={`${selectedPrestamo?.clienteNombre || ''} ${selectedPrestamo?.clientePrimerApellido || ''} ${selectedPrestamo?.clienteSegundoApellido || ''}`}
                            readOnly
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="estadoPrestamo">Estado</label>
                        <InputText
                            id="estadoPrestamo"
                            value={selectedPrestamo?.estadoPrestamo || ''}
                            readOnly
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="diaPago">Día de Pago</label>
                        <InputText
                            id="diaPago"
                            value={selectedPrestamo?.diaPago || ''}
                            readOnly
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="fechaInicio">Fecha Inicio</label>
                        <InputText
                            id="fechaInicio"
                            value={selectedPrestamo?.fechaInicio || ''}
                            readOnly
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="fechaVencimiento">Fecha Vencimiento</label>
                        <InputText
                            id="fechaVencimiento"
                            value={selectedPrestamo?.fechaVencimiento || ''}
                            readOnly
                        />
                    </div>
                </div>
            </Dialog>
            <Dialog
                header="Editar Préstamo"
                visible={isDialogVisible}
                onHide={() => setIsDialogVisible(false)}
                footer={
                    <div>
                        <Button
                            label="Guardar"
                            icon="pi pi-check"
                            onClick={handleGuardar}
                            className="p-button-text"
                        />
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            onClick={() => setIsDialogVisible(false)}
                            className="p-button-text"
                        />
                    </div>
                }
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="analistaId">ID Analista</label>
                        <InputText
                            id="analistaId"
                            value={selectedPrestamo?.analistaIdAnalista || ''}
                            onChange={(e) =>
                                setSelectedPrestamo({ ...selectedPrestamo, analistaIdAnalista: e.target.value })
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="analistaCedula">Cédula Analista</label>
                        <InputText
                            id="analistaCedula"
                            value={selectedPrestamo?.analistaPersonaCedula || ''}
                            onChange={(e) =>
                                setSelectedPrestamo({ ...selectedPrestamo, analistaPersonaCedula: e.target.value })
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="cuota">Cuota</label>
                        <InputText
                            id="cuota"
                            value={selectedPrestamo?.prestamoClienteCuota || ''}
                            onChange={(e) =>
                                setSelectedPrestamo({ ...selectedPrestamo, prestamoClienteCuota: e.target.value })
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="monto">Monto</label>
                        <InputText
                            id="monto"
                            value={selectedPrestamo?.monto || ''}
                            onChange={(e) => setSelectedPrestamo({ ...selectedPrestamo, monto: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="plazoMeses">Plazo (Meses)</label>
                        <InputText
                            id="plazoMeses"
                            value={selectedPrestamo?.PlazoMeses || ''}
                            onChange={(e) => setSelectedPrestamo({ ...selectedPrestamo, PlazoMeses: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="fechaInicio">Fecha Inicio</label>
                        <InputText
                            id="fechaInicio"
                            value={selectedPrestamo?.fechaInicio || ''}
                            onChange={(e) => setSelectedPrestamo({ ...selectedPrestamo, fechaInicio: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="fechaVencimiento">Fecha Vencimiento</label>
                        <InputText
                            id="fechaVencimiento"
                            value={selectedPrestamo?.fechaVencimiento || ''}
                            onChange={(e) =>
                                setSelectedPrestamo({ ...selectedPrestamo, fechaVencimiento: e.target.value })
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="diaPago">Día de Pago</label>
                        <InputText
                            id="diaPago"
                            value={selectedPrestamo?.diaPago || ''}
                            onChange={(e) => setSelectedPrestamo({ ...selectedPrestamo, diaPago: e.target.value })}
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="estadoPrestamo">Estado</label>
                        <select
                            id="estadoPrestamo"
                            value={selectedPrestamo?.estadoPrestamo || ''}
                            onChange={(e) =>
                                setSelectedPrestamo({ ...selectedPrestamo, estadoPrestamo: e.target.value })
                            }
                            className="p-inputtext p-component" 
                        >
                            <option value="">Seleccione un estado</option>
                            <option value="1">Activo</option>
                            <option value="2">Pendiente</option>
                            <option value="3">Cancelado</option>
                            <option value="4">Rechazado</option>
                        </select>
                    </div>

                </div>
            </Dialog>


            <Toast ref={toast} />
        </div>
    );
};

export default PrestamosFormalizadosPage;
