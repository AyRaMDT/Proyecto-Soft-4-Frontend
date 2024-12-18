import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import {
    insertarAnalista,
    obtenerAnalistas,
    modificarAnalista,
    eliminarAnalista,
} from '../api/RegistrarAnalista.api';
import '../Css/analistaManagement.css';

const AnalistaManagementPage = () => {
    const [analistas, setAnalistas] = useState([]);
    const [filteredAnalistas, setFilteredAnalistas] = useState([]); // Nuevo estado para usuarios filtrados
    const [selectedAnalista, setSelectedAnalista] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
    const toast = useRef(null);

    useEffect(() => {
        const fetchAnalistas = async () => {
            try {
                const data = await obtenerAnalistas();
                const analistasProcesados = normalizeKeys(data.analistas?.[0] || []);
                setAnalistas(analistasProcesados);
                setFilteredAnalistas(analistasProcesados); // Inicializa usuarios filtrados
            } catch (error) {
                console.error('Error al obtener analistas:', error);
            }
        };

        fetchAnalistas();
    }, []);

    useEffect(() => {
        // Filtro dinámico basado en el término de búsqueda
        const filtered = analistas.filter((analista) =>
            Object.values(analista).some((value) =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredAnalistas(filtered);
    }, [searchTerm, analistas]);

    const normalizeKeys = (data) => {
        return data.map((item) => {
            const normalizedItem = {};
            for (const key in item) {
                const normalizedKey =
                    key === 'personaCedula' ? 'Cedula' : key.charAt(0).toLowerCase() + key.slice(1);
                normalizedItem[normalizedKey] = item[key];
            }
            return normalizedItem;
        });
    };


    const handleSave = async () => {
        try {
            if (isEditing) {
                const analistaToUpdate = {
                    ...selectedAnalista,
                    personaCedula: selectedAnalista.personaCedula || selectedAnalista.cedula, // Asegúrate de usar el nombre correcto
                };

                if (!analistaToUpdate.personaCedula) {
                    throw new Error('El número de cédula es requerido para modificar un analista.');
                }

                await modificarAnalista(analistaToUpdate); // Pasa el objeto completo
                toast.current.show({
                    severity: 'success',
                    summary: 'Analista modificado',
                    detail: 'El analista ha sido actualizado.',
                    life: 3000,
                });
            } else {
                await insertarAnalista(selectedAnalista); // Enviar en formato JSON
                toast.current.show({
                    severity: 'success',
                    summary: 'Analista agregado',
                    detail: 'El analista ha sido agregado exitosamente.',
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Error in handleSave:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Hubo un problema al guardar el analista.',
                life: 3000,
            });
        }
    };



    const handleDelete = async (idanalistaCredito) => {
        try {
            console.log('ID enviado para eliminar:', idanalistaCredito); // Agregar depuración

            if (!idanalistaCredito) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se proporcionó un ID válido para eliminar.',
                    life: 3000,
                });
                return;
            }

            await eliminarAnalista(idanalistaCredito); // Pasar el ID directamente

            toast.current.show({
                severity: 'success',
                summary: 'Analista eliminado',
                detail: 'El analista ha sido eliminado exitosamente.',
                life: 3000,
            });

            const data = await obtenerAnalistas(); // Actualizar la tabla después de eliminar
            setAnalistas(data.analistas || []);
        } catch (error) {
            console.error('Error al eliminar analista:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo eliminar el analista.',
                life: 3000,
            });
        }
    };


    const openDialog = (analista = null) => {
        setSelectedAnalista(
            analista || {
                idanalistaCredito: '', // Inicializa todos los campos necesarios
                personaCedula: '',
                nombre: '',
                primerApellido: '',
                segundoApellido: '',
                telefono: '',
                correoElectronico: '',
                contrasena: '',
            }
        );
        setIsEditing(!!analista); // true si es edición
        setIsDialogVisible(true);
    };


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    const dialogFooter = (
        <div>
            <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={() => setIsDialogVisible(false)}
                className="p-button-text"
            />
            <Button
                label="Guardar"
                icon="pi pi-check"
                onClick={handleSave}
                style={{ backgroundColor: '#40e0d0', borderColor: '#40e0d0' }}
            />
        </div>
    );

    const actionBodyTemplate = (rowData) => (
        <div className="btn-container">
            <Button
                icon="pi pi-pencil"
                className="btn-editar"
                onClick={() => openDialog(rowData)}
            />
            <Button
                icon="pi pi-trash"
                className="btn-eliminar"
                onClick={() => handleDelete(rowData.idanalistaCredito)} // Pasar el ID directamente
            />
        </div>
    );

    return (
        <div className="user-management-container">
            <div className="card">
                <div className="card-header">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar analistas..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                    </div>
                    <h1>Gestión de Analistas</h1>
                    <Button
                        label="Nuevo Analista"
                        icon="pi pi-plus"
                        style={{ backgroundColor: '#40e0d0', borderColor: '#40e0d0' }}
                        onClick={() => openDialog()}
                    />
                </div>
                <DataTable
                    value={filteredAnalistas} // Filtra los analistas que se muestran
                    stripedRows
                    paginator
                    rows={5}
                    className="p-datatable-turquoise"
                >
                    <Column field="idanalistaCredito" header="ID" />
                    <Column field="cedula" header="Cédula" />
                    <Column field="nombre" header="Nombre" />
                    <Column field="primerApellido" header="Primer Apellido" />
                    <Column field="segundoApellido" header="Segundo Apellido" />
                    <Column field="correoElectronico" header="Correo Electrónico" />
                    <Column field="telefono" header="Teléfono" />
                    <Column body={actionBodyTemplate} header="Acciones" />
                </DataTable>
            </div>


            <Dialog

                header={isEditing ? 'Editar Analista' : 'Nuevo Analista'}
                visible={isDialogVisible}
                onHide={() => setIsDialogVisible(false)}
                footer={dialogFooter}
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="idanalistaCredito">ID analista</label>
                        <InputText
                            id="idanalistaCredito"
                            value={selectedAnalista?.idanalistaCredito || ''}
                            onChange={(e) =>
                                setSelectedAnalista((prev) => ({
                                    ...prev,
                                    idanalistaCredito: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="personaCedula">Número de cédula</label>
                        <InputText
                            id="personaCedula"
                            value={selectedAnalista?.cedula || ''} // Usa personaCedula directamente
                            onChange={(e) =>
                                setSelectedAnalista((prev) => ({
                                    ...prev,
                                    personaCedula: e.target.value,
                                }))
                            }
                            readOnly={isEditing} // Deshabilitar solo en modo edición
                            placeholder={!isEditing ? 'Ingrese la cédula' : ''} // Mostrar placeholder si es nuevo
                        />
                    </div>


                    <div className="p-field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText
                            id="nombre"
                            value={selectedAnalista?.nombre || ''}
                            onChange={(e) =>
                                setSelectedAnalista((prev) => ({
                                    ...prev,
                                    nombre: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="primerApellido">Primer Apellido</label>
                        <InputText
                            id="primerApellido"
                            value={selectedAnalista?.primerApellido || ''}
                            onChange={(e) =>
                                setSelectedAnalista((prev) => ({
                                    ...prev,
                                    primerApellido: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="segundoApellido">Segundo Apellido</label>
                        <InputText
                            id="segundoApellido"
                            value={selectedAnalista?.segundoApellido || ''}
                            onChange={(e) =>
                                setSelectedAnalista((prev) => ({
                                    ...prev,
                                    segundoApellido: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="correoElectronico">Correo Electrónico</label>
                        <InputText
                            id="correoElectronico"
                            value={selectedAnalista?.correoElectronico || ''}
                            onChange={(e) =>
                                setSelectedAnalista((prev) => ({
                                    ...prev,
                                    correoElectronico: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="telefono">Teléfono</label>
                        <InputText
                            id="telefono"
                            value={selectedAnalista?.telefono || ''}
                            onChange={(e) =>
                                setSelectedAnalista((prev) => ({
                                    ...prev,
                                    telefono: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="p-field">
                        <label htmlFor="contrasena">Contraseña</label>
                        <InputText
                            id="contrasena"
                            value={selectedAnalista?.contrasena || ''}
                            onChange={(e) =>
                                setSelectedAnalista((prev) => ({
                                    ...prev,
                                    contrasena: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>
            </Dialog>


            <Toast ref={toast} />
        </div>
    );
};

export default AnalistaManagementPage;
