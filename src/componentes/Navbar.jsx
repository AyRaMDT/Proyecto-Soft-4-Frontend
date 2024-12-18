import React, { useState} from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/Login";
import { generarPdfFormalizacionPrestamos } from "../Paginas/pdfFormalizacionPrestamos";
import { generarPdfClientes } from "../Paginas/pdfClientes";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import RegistrarCliente from "../Modals/RegistrarCliente";

const Navbar = ({ role, setRole }) => {
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setRole(null);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleRegister = (formData) => {
    console.log("Datos registrados:", formData);
    handleCloseModal();
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="nav">
          <Button
            icon="pi pi-bars"
            onClick={() => setVisible(true)}
            className="menuHamburguesa"
          />

          {/* Logo */}
          <div className="logo" style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/img/navbar.png"
              alt="Logo"
              style={{ width: "40px", height: "40px", marginRight: "10px" }}
            />
            <span
              style={{
                fontWeight: "bold",
                fontSize: "1.5rem",
                color: "#005f73",
                marginLeft: "40px",
              }}
            >
              Ouro Bank
            </span>
          </div>

          {/* Sidebar (Menú lateral) */}
          <Sidebar
            visible={visible}
            onHide={() => setVisible(false)}
            className="menuHamburguesa"
          >
            <div className="navbar-menu">
              {/* Opciones para usuarios no autenticados */}
              {!role && (
                <>
                  <Button
                    label="Inicio"
                    icon="pi pi-home"
                    onClick={() => navigate("/")}
                    className="barraNavegacion"
                    style={{ width: "100%" }}
                  />
                  <Button
                    label="Iniciar Sesión"
                    icon="pi pi-sign-in"
                    onClick={() => navigate("/IniciarSesion")}
                    className="barraNavegacion"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                </>
              )}

              {/* Opciones para analistas */}
              {role === "analista" && (
                <>
                  <Button
                    label="Inicio Analistas"
                    icon="pi pi-home"
                    onClick={() => navigate("/InicioAnalistas")}
                    className="barraNavegacion"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                  <Button
                    label="Registrar Analista"
                    icon="pi pi-user-plus"
                    onClick={() => navigate("/RegistroAnalista")}
                    className="barraNavegacion"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                  <Button
                    label="Gestionar Clientes"
                    icon="pi pi-users"
                    onClick={() => navigate("/GestionClientes")}
                    className="barraNavegacion"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                    <Button
                    label="Reporte Formalizacion"
                    icon="pi pi-file"
                    onClick={generarPdfFormalizacionPrestamos} // Llama a la función importada
                    className="barraNavegacion"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                        <Button
                    label="Reporte Clientes"
                    icon="pi pi-file"
                    onClick={generarPdfClientes} // Llama a la función importada
                    className="barraNavegacion"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                </>
              )}

              {/* Opciones para clientes */}
              {role === "cliente" && (
                <>
                  <Button
                    label="Inicio Clientes"
                    icon="pi pi-home"
                    onClick={() => navigate("/")}
                    className="barraNavegacion"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                  <Button
                    label="Registrar Préstamo"
                    icon="pi pi-wallet"
                    onClick={() => navigate("/RegistroPrestamo")}
                    className="barraNavegacion"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                  <Button
                    label="Mis préstamos"
                    icon="pi pi-wallet"
                    onClick={() => navigate("/MisPrestamos")}
                    className="barraNavegacion"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                  <Button
                    label="Mis Pagos"
                    icon="pi pi-money-bill"
                    onClick={() => navigate("/MisPagos")}
                    className="barraNavegacion"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                  <Button
                    label="Información"
                    icon="pi pi-info-circle"
                    onClick={() => navigate("/Informacion")}
                    className="barraNavegacion"
                    style={{ width: "100%", marginTop: "10px" }}
                  />
                </>
              )}

              {/* Botón de salir para todos los usuarios autenticados */}
              {role && (
                <Button
                  label="Salir"
                  icon="pi pi-sign-out"
                  onClick={handleLogout}
                  className="barraNavegacion"
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
            </div>
          </Sidebar>

          {/* Modal de registro */}
          <RegistrarCliente
            visible={isModalVisible}
            onHide={handleCloseModal}
            onRegister={handleRegister}
            className="join-btn"
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
