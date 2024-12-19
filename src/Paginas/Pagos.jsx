import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import '../Css/mispagos.css';

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

                // Aplanar el array anidado y filtrar datos válidos
                const pagosAplanados = data.prestamos.flat().filter((pago) => pago.idPagos && pago.montoPagado);

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
        if (rowData.montoPagado == null) {
            return 'Monto no disponible'; // Mensaje alternativo para valores nulos o undefined
        }
        return `$${parseFloat(rowData.montoPagado).toFixed(2)}`; // Asegura que se muestre en formato de moneda
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
                tableStyle={{ margin: '0 auto' }} /* Centra la tabla */
            >
                <Column field="idPagos" header="ID Pago" sortable style={{ width: '15%' }} />
                <Column field="montoPagado" header="Monto" body={montoColumnTemplate} sortable style={{ width: '20%' }} />
                <Column field="fechaPago" header="Fecha Pago" body={fechaColumnTemplate} sortable style={{ width: '25%' }} />
                <Column field="medioPago" header="Método de Pago" sortable style={{ width: '20%' }} />
            </DataTable>



        </div>
    );
};

export default Pagos;
