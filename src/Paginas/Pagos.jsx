import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import '../Css/formalizacion.css';

const obtenerPagos = async () => {
    try {
        const response = await axios.get('http://localhost:3333/pagos/listaPagos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener la lista de pagos:', error);
        throw error;
    }
};

const Pagos = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEstado, setSelectedEstado] = useState('TODOS');
    const [pagosData, setPagosData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

   useEffect(() => {
    const cargarPagos = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await obtenerPagos();
            console.log("Datos recibidos:", data);

            // Aplanar el array anidado
            const pagosAplanados = data.prestamos.flat(); 

            setPagosData(pagosAplanados || []);
        } catch (err) {
            setError('No se pudo cargar la lista de pagos.');
        } finally {
            setIsLoading(false);
        }
    };

    cargarPagos();
}, []);


    const filteredPagos = useMemo(() => {
        if (!Array.isArray(pagosData)) return [];
        return pagosData.filter(
            (pago) =>
                (selectedEstado === 'TODOS' || pago.estadoPago === selectedEstado) &&
                (searchTerm === '' ||
                    Object.values(pago).some((valor) =>
                        String(valor).toLowerCase().includes(searchTerm.toLowerCase())
                    ))
        );
    }, [pagosData, selectedEstado, searchTerm]);

    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     return date.toISOString().split('T')[0];
    // };

    // const fechaColumnTemplate = (rowData, field) => {
    //     return formatDate(rowData[field]);
    // };


    const montoColumnTemplate = (rowData) => {
        return `$${rowData.montoPagado}`;
    };

    const fechaColumnTemplate = (rowData) => {
        if (!rowData.fechaPago) {
            return 'Fecha inválida'; // Mensaje claro si no hay fecha
        }
    
        try {
            const fecha = new Date(rowData.fechaPago);
            if (isNaN(fecha)) {
                return 'Fecha inválida'; // Si no es una fecha válida
            }
            return fecha.toISOString().split('T')[0]; // Retorna "YYYY-MM-DD"
        } catch (error) {
            console.error('Error formateando la fecha:', error);
            return 'Fecha inválida'; // Evitar fallos en el renderizado
        }
    };
    
    
    const tableHeader = (
        <div className="header-container">
            <div className="search-filters">
                <div className="search-input-container">
                    <i className="pi pi-search" />
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar pagos"
                        className="search-input"
                    />
                </div>


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
                className="custom-datatable"
            >
                <Column field="idPagos" header="ID Pago" sortable />
                <Column field="montoPagado" header="Monto" body={montoColumnTemplate} sortable />
                <Column field="fechaPago" header="Fecha Pago" body={fechaColumnTemplate} sortable />
                <Column field="medioPago" header="Método de Pago" sortable />
            </DataTable>

        </div>
    );
};

export default Pagos;
