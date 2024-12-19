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
    const [filteredAnalistas, setFilteredAnalistas] = useState([]);
    const [selectedAnalista, setSelectedAnalista] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState({}); // Estado para errores de validación
    const toast = useRef(null);

    useEffect(() => {
        const fetchAnalistas = async () => {
            try {
                const data = await obtenerAnalistas();
                const analistasProcesados = normalizeKeys(data.analistas?.[0] || []);
                setAnalistas(analistasProcesados);
                setFilteredAnalistas(analistasProcesados);
            } catch (error) {
                console.error('Error al obtener analistas:', error);
            }
        };

        fetchAnalistas();
    }, []);

    useEffect(() => {
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
                    key === 'personaCedula' ? 'cedula' : key.charAt(0).toLowerCase() + key.slice(1);
                normalizedItem[normalizedKey] = item[key];
            }
            return normalizedItem;
        });
    };

    const validateFields = () => {
        const newErrors = {};

        if (!selectedAnalista.personaCedula || !/^\d{1,9}$/.test(selectedAnalista.personaCedula)) {
            newErrors.personaCedula = 'La cédula debe contener solo números y tener máximo 9 dígitos.';
        }
        if (!selectedAnalista.nombre || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(selectedAnalista.nombre)) {
            newErrors.nombre = 'El nombre solo puede contener letras.';
        }
        if (!selectedAnalista.primerApellido || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(selectedAnalista.primerApellido)) {
            newErrors.primerApellido = 'El primer apellido solo puede contener letras.';
        }
        if (!selectedAnalista.segundoApellido || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(selectedAnalista.segundoApellido)) {
            newErrors.segundoApellido = 'El segundo apellido solo puede contener letras.';
        }
        if (!selectedAnalista.telefono || !/^\d+$/.test(selectedAnalista.telefono)) {
            newErrors.telefono = 'El teléfono solo puede contener números.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateFields()) {
            toast.current.show({
                severity: 'warn',
                summary: 'Errores en el formulario',
                detail: 'Corrige los errores antes de continuar.',
                life: 3000,
            });
            return;
        }

        try {
            if (isEditing) {
                const analistaToUpdate = {
                    ...selectedAnalista,
                    personaCedula: selectedAnalista.personaCedula || selectedAnalista.cedula,
                };

                if (!analistaToUpdate.personaCedula) {
                    throw new Error('El número de cédula es requerido para modificar un analista.');
                }

                await modificarAnalista(analistaToUpdate);
                toast.current.show({
                    severity: 'success',
                    summary: 'Analista modificado',
                    detail: 'El analista ha sido actualizado.',
                    life: 3000,
                });
                window.location.reload();
            } else {
                await insertarAnalista(selectedAnalista);
                toast.current.show({
                    severity: 'success',
                    summary: 'Analista agregado',
                    detail: 'El analista ha sido agregado exitosamente.',
                    life: 3000,
                });
                window.location.reload();
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
            console.log('ID enviado para eliminar:', idanalistaCredito);

            if (!idanalistaCredito) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se proporcionó un ID válido para eliminar.',
                    life: 3000,
                });
                return;
            }

            await eliminarAnalista(idanalistaCredito);
            toast.current.show({
                severity: 'success',
                summary: 'Analista eliminado',
                detail: 'El analista ha sido eliminado exitosamente.',
                life: 3000,
            });

            // Actualiza el estado localmente
            const updatedAnalistas = analistas.filter(
                (analista) => analista.idanalistaCredito !== idanalistaCredito
            );
            setAnalistas(updatedAnalistas);
            setFilteredAnalistas(updatedAnalistas);
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
                idanalistaCredito: '',
                personaCedula: '',
                nombre: '',
                primerApellido: '',
                segundoApellido: '',
                telefono: '',
                correoElectronico: '',
                contrasena: '',
            }
        );
        setIsEditing(!!analista);
        setIsDialogVisible(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    const validateCedula = (value) => {
        if (!/^\d{0,9}$/.test(value)) {
            setErrors((prev) => ({
                ...prev,
                personaCedula: "La cédula debe contener solo números y tener máximo 9 dígitos.",
            }));
        } else {
            setErrors((prev) => ({ ...prev, personaCedula: null }));
        }
    };

    const validateNombre = (value) => {
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
            setErrors((prev) => ({
                ...prev,
                nombre: "El nombre solo puede contener letras.",
            }));
        } else {
            setErrors((prev) => ({ ...prev, nombre: null }));
        }
    };

    const validatePrimerApellido = (value) => {
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
            setErrors((prev) => ({
                ...prev,
                primerApellido: "El primer apellido solo puede contener letras.",
            }));
        } else {
            setErrors((prev) => ({ ...prev, primerApellido: null }));
        }
    };

    const validateSegundoApellido = (value) => {
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
            setErrors((prev) => ({
                ...prev,
                segundoApellido: "El segundo apellido solo puede contener letras.",
            }));
        } else {
            setErrors((prev) => ({ ...prev, segundoApellido: null }));
        }
    };

    const validateTelefono = (value) => {
        if (!/^\d*$/.test(value)) {
            setErrors((prev) => ({
                ...prev,
                telefono: "El teléfono solo puede contener números.",
            }));
        } else {
            setErrors((prev) => ({ ...prev, telefono: null }));
        }
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
                onClick={() => handleDelete(rowData.idanalistaCredito)}
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
                    value={filteredAnalistas}
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
                        <label htmlFor="personaCedula">Número de cédula</label>
                        <InputText
                            id="personaCedula"
                            value={selectedAnalista?.personaCedula || ''}
                            onChange={(e) =>
                                setSelectedAnalista((prev) => ({
                                    ...prev,
                                    personaCedula: e.target.value,
                                }))
                            }
                            onInput={(e) => validateCedula(e.target.value)}
                        />
                        {errors.cedula && (
                            <small className="p-error">{errors.personaCedula}</small>
                        )}
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
                            onInput={(e) => validateNombre(e.target.value)}
                        />
                        {errors.nombre && <small className="p-error">{errors.nombre}</small>}
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
                            onInput={(e) => validatePrimerApellido(e.target.value)}
                        />
                        {errors.primerApellido && (
                            <small className="p-error">{errors.primerApellido}</small>
                        )}
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
                            onInput={(e) => validateSegundoApellido(e.target.value)}
                        />
                        {errors.segundoApellido && (
                            <small className="p-error">{errors.segundoApellido}</small>
                        )}
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
                        {errors.telefono && (
                            <span className="p-error">{errors.telefono}</span>
                        )}
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
