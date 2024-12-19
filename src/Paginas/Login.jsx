import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null); // Reference for the Toast
    const { IniciarSesion } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);

        try {
            const result = await IniciarSesion(cedula, password);

            if (result?.rol === 'cliente') {
                navigate('/');
            } else if (result?.rol === 'analista') {
                navigate('/InicioAnalistas');
            } else {
                throw new Error('Credenciales inválidas');
            }
        } catch (err) {
            // Display a Toast message if login fails
            toast.current.show({
                severity: 'error',
                summary: 'Error de autenticación',
                detail: 'Cédula o contraseña incorrecta. Por favor, intente de nuevo.',
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Toast ref={toast} /> {/* Toast Component */}
            <div className="login-section">
                <div className="login-header">
                    <span className="active">Inicio de Sesión</span>
                </div>

                <div className="login-form">
                    <span className="p-input-icon-left">
                        <i className="pi pi-user" />
                        <InputText
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            placeholder="Digite número de cédula"
                            disabled={loading}
                        />
                    </span>

                    <span className="p-input-icon-left">
                        <i className="pi pi-lock" />
                        <InputText
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            disabled={loading}
                        />
                    </span>

                    <Button
                        label={loading ? 'Cargando...' : 'Iniciar Sesión'}
                        onClick={handleLogin}
                        className="login-btn"
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="image-section">
                <img src="/img/login.png" alt="Decorative" className="imagenLogin" />
            </div>
        </div>
    );
};

export default Login;
