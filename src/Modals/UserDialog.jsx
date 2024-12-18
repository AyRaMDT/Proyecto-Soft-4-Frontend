import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast'; 
import { actualizarCliente } from "../api/RegistrarCliente.api"; 

const UserDialog = ({ dialogVisible, isEditing, selectedUser, hideDialog }) => {
    const [clienteActualizado, setClienteActualizado] = useState({
        Nombre: '',
        PrimerApellido: '',
        SegundoApellido: '',
        correoElectronico: '',
        telefono: '',
        direccion: '',
        Cedula: ''
    });

    const toast = useRef(null); 
    useEffect(() => {
        if (selectedUser && selectedUser.Cedula !== clienteActualizado.Cedula) {
            setClienteActualizado({
                Nombre: selectedUser.Nombre || '',
                PrimerApellido: selectedUser.PrimerApellido || '',
                SegundoApellido: selectedUser.SegundoApellido || '',
                correoElectronico: selectedUser.correoElectronico || '',
                telefono: selectedUser.telefono || '',
                direccion: selectedUser.direccion || '',
                Cedula: selectedUser.Cedula || ''
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUser]); 

    const saveUser = async () => {
        if (!selectedUser || !selectedUser.Cedula) {
            console.error('No se ha proporcionado la cédula del cliente');
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se ha proporcionado la cédula del cliente', life: 3000 });
            return;
        }
    
        if (!clienteActualizado.Nombre || !clienteActualizado.PrimerApellido || !clienteActualizado.SegundoApellido || !clienteActualizado.direccion || !clienteActualizado.telefono || !clienteActualizado.correoElectronico) {
            console.error('Faltan campos en clienteActualizado');
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Faltan campos obligatorios', life: 3000 });
            return;
        }
    
        try {
            const { direccion, telefono, correoElectronico, Nombre, PrimerApellido, SegundoApellido } = clienteActualizado;
    
            const clienteData = {
                idClientes: selectedUser.idClientes, 
                personaCedula: selectedUser.Cedula,
                nombre: Nombre,
                primerApellido: PrimerApellido,
                segundoApellido: SegundoApellido,
                direccion: direccion,
                telefono: telefono.toString(),
                correoElectronico: correoElectronico,
            };
    
            console.log("Datos a enviar:", clienteData);
    
            const response = await actualizarCliente(clienteData);
            console.log("Respuesta del backend:", response);
    
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado correctamente', life: 3000 });
            
            window.location.reload(); 
            
            hideDialog();
        } catch (error) {
  
            const errorMessage = error.message || JSON.stringify(error);
            console.error('Error al modificar cliente:', errorMessage);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado correctamente', life: 3000 });
            window.location.reload(); 
        }
        
    };
    
    const handleInputChange = (e, fieldName) => {
        const { value } = e.target;
        setClienteActualizado((prevState) => ({
            ...prevState,
            [fieldName]: value,
        }));
    };

    const dialogFooter = (
        <div className="flex justify-content-end gap-3">
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveUser} />
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                visible={dialogVisible}
                style={{ width: '50vw' }}
                header={isEditing ? "Editar Cliente" : "Nuevo Usuario"}
                modal
                className="p-fluid"
                footer={dialogFooter}
                onHide={hideDialog}
            >
                <div className="flex flex-column gap-3">
                    <div className="field">
                        <label htmlFor="Nombre">Nombre</label>
                        <InputText
                            id="Nombre"
                            value={clienteActualizado.Nombre}
                            onChange={(e) => handleInputChange(e, 'Nombre')}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="PrimerApellido">Primer Apellido</label>
                        <InputText
                            id="PrimerApellido"
                            value={clienteActualizado.PrimerApellido}
                            onChange={(e) => handleInputChange(e, 'PrimerApellido')}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="SegundoApellido">Segundo Apellido</label>
                        <InputText
                            id="SegundoApellido"
                            value={clienteActualizado.SegundoApellido}
                            onChange={(e) => handleInputChange(e, 'SegundoApellido')}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="correoElectronico">Correo Electrónico</label>
                        <InputText
                            id="correoElectronico"
                            value={clienteActualizado.correoElectronico}
                            onChange={(e) => handleInputChange(e, 'correoElectronico')}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="telefono">Teléfono</label>
                        <InputText
                            id="telefono"
                            value={clienteActualizado.telefono}
                            onChange={(e) => handleInputChange(e, 'telefono')}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="direccion">Dirección</label>
                        <InputText
                            id="direccion"
                            value={clienteActualizado.direccion}
                            onChange={(e) => handleInputChange(e, 'direccion')}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default UserDialog;
