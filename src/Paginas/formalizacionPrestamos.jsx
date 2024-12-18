import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import LoanModal from '../Modals/Formalizacion';
import '../Css/formalizacion.css';

const obtenerPrestamos = async () => {
    try {
        const response = await axios.get('http://localhost:3333/prestamos/listaPrestamos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener la lista de préstamos:', error);
        throw error;
    }
};

const PrestamosTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEstado, setSelectedEstado] = useState('TODOS');
    const [prestamosData, setPrestamosData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [selectedPrestamo, setSelectedPrestamo] = useState(null);

    useEffect(() => {
        const cargarPrestamos = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await obtenerPrestamos();
                setPrestamosData(data.prestamos[0] || []);
            } catch (err) {
                setError('No se pudo cargar la lista de préstamos.');
            } finally {
                setIsLoading(false);
            }
        };

        cargarPrestamos();
    }, []);

    const openModal = (action, prestamo) => {
        setModalAction(action);
        setSelectedPrestamo(prestamo);
        setModalVisible(true);
    };

    const estadoDropdownOptions = [
        { label: 'Todos los Estados', value: 'TODOS' },
        { label: 'Activo', value: 'Activo' },
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'Rechazado', value: 'Rechazado' }
    ];

    const filteredPrestamos = useMemo(() => {
        if (!Array.isArray(prestamosData)) return [];
        return prestamosData.filter(
            (prestamo) =>
                (selectedEstado === 'TODOS' || prestamo.estadoPrestamo === selectedEstado) &&
                (searchTerm === '' ||
                    Object.values(prestamo).some((valor) =>
                        String(valor).toLowerCase().includes(searchTerm.toLowerCase())
                    ))
        );
    }, [prestamosData, selectedEstado, searchTerm]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const fechaColumnTemplate = (rowData, field) => {
        return formatDate(rowData[field]);
    };

    const estadoTagTemplate = (rowData) => {
        const severity = {
            'Activo': 'success',
            'Pendiente': 'warning',
            'Rechazado': 'danger'
        };
        return <Tag severity={severity[rowData.estadoPrestamo] || 'info'} value={rowData.estadoPrestamo} />;
    };

    const montoColumnTemplate = (rowData) => {
        return (rowData.monto);
    };

    const accionesColumnTemplate = (rowData) => {
        const isDisabled = rowData.estadoPrestamo === "Activo" || rowData.estadoPrestamo === "Rechazado";
    
        return (
            <div className="actions-container">
                <Button
                    icon="pi pi-check"
                    className="p-button-rounded custom-button-success"
                    tooltip="Aprobar"
                    onClick={() => openModal('approve', rowData)}
                    disabled={isDisabled}
                />
                <Button
                    icon="pi pi-times"
                    className="p-button-rounded custom-button-danger"
                    tooltip="Rechazar"
                    onClick={() => openModal('reject', rowData)}
                    disabled={isDisabled} 
                />
            </div>
        );
    };
    

    const tableHeader = (
        <div className="header-container">
            <div className="search-filters">
                <div className="search-input-container">
                    <i className="pi pi-search" />
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar préstamos"
                        className="search-input"
                    />
                </div>

                <Dropdown
                    value={selectedEstado}
                    options={estadoDropdownOptions}
                    onChange={(e) => setSelectedEstado(e.value)}
                    placeholder="Filtrar por Estado"
                    className="estado-dropdown"
                />
            </div>
        </div>
    );

    if (isLoading) return <p>Cargando datos...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="prestamos-container">
            <DataTable
                value={filteredPrestamos}
                header={tableHeader}
                showGridlines
                stripedRows
                paginator
                rows={5}
                responsiveLayout="scroll"
                className="custom-datatable"
            >
                <Column field="idPrestamos" header="ID" sortable />
                <Column field="clientesPersonaCedula" header="Cédula cliente" sortable />
                <Column field="numeroPrestamo" header="Número Préstamo" />
                <Column field="monto" header="Monto" body={montoColumnTemplate} sortable />
                <Column field="PlazoMeses" header="Plazo (Meses)" sortable />
                <Column field="fechaInicio" header="Fecha Inicio" body={(rowData) => fechaColumnTemplate(rowData, 'fechaInicio')} sortable />
                <Column field="tasaInteresMoratoria" header="Tasa Mora (%)" sortable />
                <Column field="tasaInteresAnual" header="Tasa Anual (%)" sortable />
                <Column field="fechaVencimiento" header="Vencimiento" body={(rowData) => fechaColumnTemplate(rowData, 'fechaVencimiento')} sortable />
                <Column field="estadoPrestamo" header="Estado" body={estadoTagTemplate} />
                <Column header="Acciones" body={accionesColumnTemplate} />
            </DataTable>

            {modalVisible && (
                <LoanModal
                    visible={modalVisible}
                    action={modalAction}
                    prestamo={selectedPrestamo}
                    onHide={() => setModalVisible(false)}
                />
            )}
        </div>
    );
};

export default PrestamosTable;