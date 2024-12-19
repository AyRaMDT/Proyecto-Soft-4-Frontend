import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import '../Css/formalizacion.css';
import { useNavigate } from 'react-router-dom';

// Obtener los préstamos de un cliente
const obtenerPrestamosPorCliente = async (idCliente) => {
    try {
        console.log(`Obteniendo préstamos para el cliente con ID: ${idCliente}`);
        const response = await axios.get(`http://localhost:3333/prestamos/listarID?idCliente=${idCliente}`);
        console.log('Respuesta de préstamos:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la lista de préstamos:', error);
        throw error;
    }
};

// Obtener perfil del usuario logueado
const getProfile = async () => {
    try {
        console.log('Obteniendo perfil del usuario...');
        const response = await axios.get("http://localhost:3333/auth/profile", {
            withCredentials: true,
        });
        console.log('Perfil del usuario obtenido:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        throw new Error("No se pudo obtener el perfil del usuario");
    }
};
const Prestamos = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEstado, setSelectedEstado] = useState('TODOS');
    const [prestamosData, setPrestamosData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [idCliente, setIdCliente] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const profileResponse = await getProfile();
                const profile = profileResponse.perfil;

                console.log('Usuario logueado:', profile);
                setIdCliente(profile.idClientes || null);
            } catch (error) {
                console.error('Error al obtener los datos del usuario logueado:', error);
                setError('No se pudo obtener el perfil del usuario logueado.');
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (!idCliente) return;

        const cargarPrestamos = async () => {
            try {
                console.log('Cargando préstamos para el cliente:', idCliente);
                setIsLoading(true);
                setError(null);

                const data = await obtenerPrestamosPorCliente(idCliente);

                // Accede correctamente al array de préstamos en el índice 0
                const prestamosArray =
                    Array.isArray(data.prestamos) && Array.isArray(data.prestamos[0])
                        ? data.prestamos[0]
                        : [];
                console.log('Préstamos cargados desde índice 0:', prestamosArray);

                setPrestamosData(prestamosArray);
            } catch (err) {
                console.error('Error al cargar los préstamos:', err);
                setError('No se pudo cargar la lista de préstamos.');
            } finally {
                setIsLoading(false);
            }
        };

        cargarPrestamos();
    }, [idCliente]);

    const estadoDropdownOptions = [
        { label: 'Todos los Estados', value: 'TODOS' },
        { label: 'Activo', value: 'Activo' },
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'Rechazado', value: 'Rechazado' },
        { label: 'Cancelado', value: 'Cancelado' },
    ];

    const filteredPrestamos = useMemo(() => {
        console.log('Filtrando préstamos con los siguientes criterios:', {
            searchTerm,
            selectedEstado,
            prestamosData,
        });
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
        const dateValue = rowData[field];
        return dateValue ? formatDate(dateValue) : 'N/A';
    };

    const estadoTagTemplate = (rowData) => {
        const estado = rowData.estadoPrestamo || 'Desconocido';
        const severity = {
            'Activo': 'success',
            'Pendiente': 'warning',
            'Rechazado': 'danger',
            'Cancelado': 'info',
        };
        return <Tag severity={severity[estado] || 'info'} value={estado} />;
    };

    const accionesColumnTemplate = (rowData) => {
        const isPagarDisponible = rowData.estadoPrestamo?.match(/^Activo$/);
        return (
            <div className="actions-container">
                <Button
                    icon={isPagarDisponible ? "pi pi-check" : "pi pi-ban"}
                    className={`p-button-rounded ${isPagarDisponible ? "custom-button-success" : "custom-button-danger"
                        }`}
                    tooltip={isPagarDisponible ? "Pagar" : "No disponible para pagar"}
                    onClick={() =>
                        isPagarDisponible &&
                        navigate('/RealizarPago', { state: { rowData } })
                    }
                    disabled={!isPagarDisponible}
                />
            </div>
        );
    };

    if (isLoading) return <p>Cargando datos...</p>;
    if (error) return <p className="error-message">{error}</p>;

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
                emptyMessage={
                    <div style={{ textAlign: 'center', padding: '10px', fontSize: '1.2em', color: '#555' }}>
                        <strong>No se encontraron préstamos.</strong>
                    </div>
                }
                className="custom-datatable"
            >
                <Column field="idPrestamos" header="ID" sortable />
                <Column field="numeroPrestamo" header="Número Préstamo" />
                <Column field="monto" header="Monto" sortable />
                <Column field="PlazoMeses" header="Plazo (Meses)" sortable />
                <Column field="fechaInicio" header="Fecha Inicio" body={(rowData) => fechaColumnTemplate(rowData, 'fechaInicio')} sortable />
                <Column field="tasaInteresMoratoria" header="Tasa Mora (%)" sortable />
                <Column field="tasaInteresAnual" header="Tasa Anual (%)" sortable />
                <Column field="fechaVencimiento" header="Vencimiento" body={(rowData) => fechaColumnTemplate(rowData, 'fechaVencimiento')} sortable />
                <Column field="saldo" header="Saldo" sortable />
                <Column field="estadoPrestamo" header="Estado" body={estadoTagTemplate} />
                <Column header="Acciones" body={accionesColumnTemplate} />
            </DataTable>


        </div>
    );
};

export default Prestamos;
