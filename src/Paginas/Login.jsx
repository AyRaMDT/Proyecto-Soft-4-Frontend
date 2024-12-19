import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [cedula, setCedula] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {IniciarSesion} = useAuth()
    const navigate = useNavigate();


    const handleLogin = async () => {
        setLoading(true);
        setError("");
      
        try {
          const result = await IniciarSesion(cedula, password);
          console.log(result);
          
          alert(result.mensaje);       
          if (result.rol === "cliente") {
            navigate("/");
          } else if (result.rol === "analista") {
            navigate("/InicioAnalistas");
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      

    return (
        <div className="login-container">
            <div className="login-section">
                <div className="login-header">
                    <span className="active">Inicio de Sesión</span>
                </div>

                <div className="login-form">
                    {error && <p className="error-message">{error}</p>}

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
                <img src="/img/login.png" alt="Decorative" className='imagenLogin' />
            </div>
        </div >
    );
};

export default Login;