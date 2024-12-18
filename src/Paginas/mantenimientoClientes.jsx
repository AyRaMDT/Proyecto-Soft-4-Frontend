import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { obtenerClientes } from '../api/RegistrarCliente.api'; 
import { eliminarCliente } from '../api/RegistrarCliente.api'; 
import UserDialog from '../Modals/UserDialog'; 
import RegisterClientModal from '../Modals/RegistrarCliente'; 
import '../Css/mantenimientoCliente.css';
import { Toast } from 'primereact/toast'; 
import LoansDialog from '../Modals/LoansDialog';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]); 
    const [editDialogVisible, setEditDialogVisible] = useState(false); 
    const [registerDialogVisible, setRegisterDialogVisible] = useState(false); 
    const [selectedUser, setSelectedUser] = useState(null); 
    const [isEditing, setIsEditing] = useState(false); 
    const [loans, setLoans] = useState([]); 
    const [loansDialogVisible, setLoansDialogVisible] = useState(false); 
    
    
    const toast = useRef(null); 

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await obtenerClientes();
                console.log(response);
                setUsers(response.clientes || []);
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
            }
        };

        fetchUsers();
    }, []); 


    const openEditDialog = (user) => {
        setSelectedUser(user);
        console.log("Usuario seleccionado:", user);
        setIsEditing(true);
        setEditDialogVisible(true);
    };

    const fetchLoans = async (personaCedula) => {
        try {
            const response = await fetch(`http://localhost:3333/prestamos/prestamoporcedula/${personaCedula}`);
            const data = await response.json();
    
            console.log("Respuesta de la API:", data);
    
            const prestamos = data.prestamos?.flat() || [];
            const prestamosValidos = prestamos.filter(p => p.numeroPrestamo && p.monto);
    
            if (prestamosValidos.length > 0) {
                setLoans(prestamosValidos);
                setLoansDialogVisible(true);
            } else {
                toast.current.show({
                    severity: 'warn',
                    summary: 'No hay préstamos',
                    detail: 'No se encontraron préstamos para este usuario.',
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Error al obtener los préstamos:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudieron cargar los préstamos.',
                life: 3000,
            });
        }
    };
    
    
    
    
    
    
    const deleteUser = async (user) => {
        try {
            const response = await eliminarCliente(user.idClientes);
            if (response.success) { 
                setUsers(users.filter(u => u.idClientes !== user.idClientes)); 
    
               
                toast.current.show({
                    severity: 'success',
                    summary: 'Cliente eliminado',
                    detail: 'El cliente se ha eliminado exitosamente.',
                    life: 3000
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error al eliminar',
                    detail: 'No se pudo eliminar el cliente.',
                    life: 3000
                });
            }
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            toast.current.show({
                severity: 'error',
                summary: 'Error al eliminar',
                detail: 'Hubo un error al intentar eliminar el cliente.',
                life: 3000
            });
        }
    };
    

    const onInputChange = (e, name) => {
        const val = e.target.value || '';
        setSelectedUser(prev => prev ? { ...prev, [name]: val } : null);
    };

    const saveUser = () => {
        if (!selectedUser) return;

        const _users = [...users];
        if (isEditing) {
            const index = _users.findIndex(u => u.personaCedula === selectedUser.personaCedula);
            _users[index] = selectedUser;
        } else {
            _users.push(selectedUser);
        }

        setUsers(_users);
        setEditDialogVisible(false);
        setRegisterDialogVisible(false);
        setSelectedUser(null);
    };

    const actionTemplate = (rowData) => (
        <div className="flex-gap">
            <button className="btn-edit" onClick={() => openEditDialog(rowData)}>
                <i className="pi pi-pencil"></i>
            </button>
            <button className="btn-delete" onClick={() => deleteUser(rowData)}>
                <i className="pi pi-trash"></i>
            </button>
            <button className="btn-info" onClick={() => fetchLoans(rowData.Cedula)}>
                <i className="pi pi-info-circle"></i>
            </button>
        </div>
    );
    

    return (
        <div className="user-management-container">
            <div className="card">
                <div className="card-header">
                    <h1>Gestión de Clientes</h1>
                    <RegisterClientModal
                        dialogVisible={registerDialogVisible}
                        selectedUser={selectedUser}
                        onInputChange={onInputChange}
                        saveUser={saveUser}
                        className="btnNuevo"
                        hideDialog={() => setRegisterDialogVisible(false)} 
                    />
                </div>

                <DataTable
                    value={users}
                    className="p-datatable-turquoise"
                    stripedRows
                    paginator
                    rows={5}
                    emptyMessage="No se encontraron usuarios"
                >
                    <Column field="Cedula" header="Cédula" />
                    <Column field="Nombre" header="Nombre" />
                    <Column field="PrimerApellido" header="Primer Apellido" />
                    <Column field="SegundoApellido" header="Segundo Apellido" />
                    <Column field="correoElectronico" header="Correo Electrónico" />
                    <Column field="telefono" header="Teléfono" />
                    <Column field="direccion" header="Dirección" />
                    <Column body={actionTemplate} header="Acciones" /> 
                </DataTable>
            </div>


            <UserDialog
                dialogVisible={editDialogVisible}
                isEditing={isEditing}
                selectedUser={selectedUser}
                onInputChange={onInputChange}
                saveUser={saveUser}
                hideDialog={() => setEditDialogVisible(false)} 
            />

<LoansDialog
    visible={loansDialogVisible}
    loans={loans}
    hideDialog={() => setLoansDialogVisible(false)}
/>


            <Toast ref={toast} /> 
        </div>
    );
};

export default UserManagementPage;
