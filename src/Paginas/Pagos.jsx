import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import '../Css/mispagos.css';

const obtenerPerfil = async () => {
    try {
        const response = await axios.get('http://localhost:3333/auth/profile', { withCredentials: true });
        console.log('Perfil del usuario logueado:', response.data); // Log del perfil
        return response.data;
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        throw new Error('No se pudo obtener el perfil del usuario.');
    }
};
const obtenerPagosPorCliente = async (idCliente) => {
    try {
        const response = await axios.get(`http://localhost:3333/pagos/listaPagosporID?idCliente=${idCliente}`);
        console.log('Pagos obtenidos del API:', response.data); // Log del array anidado
        return response.data;
    } catch (error) {
        console.error('Error al obtener los pagos:', error);
        throw new Error('No se pudo obtener la lista de pagos.');
    }
};

const Pagos = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [pagosData, setPagosData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Obtener perfil del usuario logueado
                const perfil = await obtenerPerfil();
                const idCliente = perfil.perfil.idClientes;

                console.log('ID del cliente logueado:', idCliente);

                // Obtener pagos del cliente logueado
                const data = await obtenerPagosPorCliente(idCliente);

                // Aplanar el array anidado
                const pagosAplanados = data.pagos.flatMap((pago) => Array.isArray(pago) ? pago : []);
                console.log('Pagos procesados (aplanados):', pagosAplanados);

                setPagosData(pagosAplanados);
            } catch (err) {
                console.error('Error al cargar los datos:', err);
                setError('No se pudo cargar la lista de pagos.');
            } finally {
                setIsLoading(false);
            }
        };

        cargarDatos();
    }, []);

    const filteredPagos = useMemo(() => {
        if (!Array.isArray(pagosData)) return [];
        const pagosFiltrados = pagosData.filter((pago) =>
            searchTerm === '' ||
            Object.values(pago).some((valor) =>
                String(valor).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        console.log('Pagos filtrados:', pagosFiltrados);
        return pagosFiltrados;
    }, [pagosData, searchTerm]);

    const montoColumnTemplate = (rowData) => `$${parseFloat(rowData.montoPagado).toFixed(2)}`;
    const fechaColumnTemplate = (rowData) => {
        if (!rowData.fechaPago) return 'Fecha inválida';
        const fecha = new Date(rowData.fechaPago);
        return fecha.toISOString().split('T')[0];
    };

    const tableHeader = (
        <div className="header-container">
            <div className="search-input-container">
                <i className="pi pi-search" />
                <InputText
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar pagos"
                />
            </div>
        </div>
    );

    if (isLoading) return <p>Cargando datos...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="pagos-container">
            <DataTable
                value={filteredPagos}
                header={tableHeader}
                showGridlines
                stripedRows
                paginator
                rows={5}
                responsiveLayout="scroll"
                emptyMessage={
                    <div style={{ textAlign: 'center', padding: '10px', fontSize: '1.2em', color: '#555' }}>
                        <strong>No se encontraron pagos.</strong>
                    </div>
                }
                className="custom-datatable"
                
            >
                <Column field="idPagos" header="ID Pago" sortable />
                <Column field="montoPagado" header="Monto" body={montoColumnTemplate} sortable />
                <Column field="amortizacion" header="Amortización" sortable />
                <Column field="numeroPagos" header="# de Pagos" sortable />
                <Column field="fechaPago" header="Fecha Pago" body={fechaColumnTemplate} sortable />
                <Column field="medioPago" header="Método de Pago" sortable />
            </DataTable>
        </div>
    );
};

export default Pagos;
