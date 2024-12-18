import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import RealizarPagoModal from '../Modals/RealizaPago';
import '../Css/analistaManagement.css';

const PrestamosFormalizadosPage = () => {
    const [prestamos, setPrestamos] = useState([]);
    const [filteredPrestamos, setFilteredPrestamos] = useState([]);
    const [selectedPrestamo, setSelectedPrestamo] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const toast = useRef(null);

    useEffect(() => {
        const fetchPrestamos = async () => {
            try {
                const response = await axios.get('http://localhost:3333/formalizacion/listarTODO');
                if (response.data.success) {
                    setPrestamos(response.data.data);
                    setFilteredPrestamos(response.data.data);
                } else {
                    console.error('Error al obtener los préstamos:', response.data.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        fetchPrestamos();
    }, []);

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

    const openDialog = (prestamo) => {
        setSelectedPrestamo(prestamo);
        setIsDialogVisible(true);
    };

    const closeDialog = () => {
        setSelectedPrestamo(null);
        setIsDialogVisible(false);
    };

    const actionBodyTemplate = (rowData) => (
        <div className="btn-container">
            <Button
                icon="pi pi-wallet"
                label="Pagar"
                className="btn-pagar"
                onClick={() => openDialog(rowData)}
                disabled={rowData.estadoPrestamoPago === 'Pagado'}
            />
        </div>
    );

    const estadoBodyTemplate = (rowData) => {
        const severity = {
            Pagado: 'success',
            Pendiente: 'danger',
        };
        return (
            <span className={`p-tag p-tag-${severity[rowData.estadoPrestamoPago] || 'info'}`}>
                {rowData.estadoPrestamoPago}
            </span>
        );
    };

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
                    <Column field="prestamoClienteCuota" header="Cuota" />
                    <Column field="prestamoscliente_idPrestamos" header="ID Préstamo Cliente" />
                    <Column field="IdClientes" header="ID Cliente" />
                    <Column field="clienteCedula" header="Cédula Cliente" />
                    <Column
                        header="Nombre Completo Cliente"
                        body={(rowData) =>
                            `${rowData.clienteNombre} ${rowData.clientePrimerApellido} ${rowData.clienteSegundoApellido}`
                        }
                    />
                    <Column field="tasaInteresMoratoria" header="Tasa Mora (%)" />
                    <Column field="tasaInteresAnual" header="Tasa Anual (%)" />
                    <Column field="diaPago" header="Día de Pago" />
                    <Column field="estadoPrestamoPago" header="Estado" body={estadoBodyTemplate} />
                    <Column body={actionBodyTemplate} header="Acciones" />
                </DataTable>
            </div>

            {isDialogVisible && (
                <RealizarPagoModal
                    visible={isDialogVisible}
                    rowData={selectedPrestamo}
                    onHide={closeDialog}
                />
            )}

            <Toast ref={toast} />
        </div>
    );
};

export default PrestamosFormalizadosPage;
