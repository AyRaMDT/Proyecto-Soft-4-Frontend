import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { insertarCliente } from "../api/RegistrarCliente.api"; 
import "../Css/RegistrarCliente.css";

const RegistrarCliente = () => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    personaCedula: "",
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    direccion: "",
    telefono: "",
    correoElectronico: "",
    contrasena: "",
  });

  
  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCedulaInput = (e) => {
    const regex = /^[0-9]{0,9}$/;
    if (!regex.test(e.target.value)) {
      e.preventDefault();
      setErrors((prev) => ({
        ...prev,
        personaCedula: "La cédula debe contener solo números.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, personaCedula: "" }));
    }
  };

  const handleTelefonoInput = (e) => {
    const regex = /^[0-9]{0,15}$/;
    if (!regex.test(e.target.value)) {
      e.preventDefault();
      setErrors((prev) => ({
        ...prev,
        telefono: "El número de teléfono solo debe contener números.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, telefono: "" }));
    }
  };

  const handleNombreInput = (e) => {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚ\s]*$/; 
    if (!regex.test(e.target.value)) {
      e.preventDefault();
      setErrors((prev) => ({
        ...prev,
        nombre: "El nombre solo debe contener letras y tildes.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, nombre: "" }));
    }
  };
  
  const handlePrimerApellidoInput = (e) => {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚ\s]*$/; 
    if (!regex.test(e.target.value)) {
      e.preventDefault();
      setErrors((prev) => ({
        ...prev,
        primerApellido: "El primer apellido solo debe contener letras y tildes.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, primerApellido: "" }));
    }
  };
  
  const handleSegundoApellidoInput = (e) => {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚ\s]*$/; 
    if (!regex.test(e.target.value)) {
      e.preventDefault();
      setErrors((prev) => ({
        ...prev,
        segundoApellido: "El segundo apellido solo debe contener letras y tildes.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, segundoApellido: "" }));
    }
  };

  const validateForm = () => {
    const cedulaRegex = /^[0-9]{9}$/;
    if (!cedulaRegex.test(formData.personaCedula)) {
      setErrors((prev) => ({
        ...prev,
        personaCedula: "La cédula debe contener solo 9 dígitos numéricos.",
      }));
      return false;
    }

    const telefonoRegex = /^[0-9]+$/;
    if (!telefonoRegex.test(formData.telefono)) {
      setErrors((prev) => ({
        ...prev,
        telefono: "El número de teléfono solo debe contener números.",
      }));
      return false;
    }

    if (Object.values(formData).some((value) => value.trim() === "")) {
      setErrors((prev) => ({
        ...prev,
        form: "Por favor, completa todos los campos.",
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.current.show({
        severity: "warn",
        summary: "Errores en el formulario",
        detail: "Por favor, corrige los errores antes de continuar.",
      });
      return;
    }
  
    const clienteNuevo = { ...formData };
  
    try {
      const response = await insertarCliente(clienteNuevo);
  
      // Log detallado del valor y tipo de `success`
      console.log("Respuesta completa del backend:", response);
      console.log("Tipo de `success`:", typeof response.success);
      console.log("Valor de `success`:", response.success);
  
      if (response.success === true) { // Verifica explícitamente si `success` es true
        toast.current.show({
          severity: "success",
          summary: "Registro exitoso",
          detail: response.message,
        });
        window.location.reload();

  
        // Limpia el formulario
        setFormData({
          personaCedula: "",
          nombre: "",
          primerApellido: "",
          segundoApellido: "",
          direccion: "",
          telefono: "",
          correoElectronico: "",
          contrasena: "",
        });
        setErrors({});
        setVisible(false);
      } else {
        // Si `success` no es true, muestra el mensaje de error
        toast.current.show({
          severity: "error",
          summary: "Error al registrar cliente",
          detail: response.message || "Error desconocido.",
        });
      }
    } catch (error) {
      // Manejo de errores generales
      console.error("Error en la comunicación con el backend:", error);
      toast.current.show({
        severity: "error",
        summary: "Error en la comunicación",
        detail: error.response?.data?.message || "No se pudo conectar con el servidor.",
      });
    }
  };
  
  
  
  
  
  
  
  
  
  

  return (
    <div>
      <Toast ref={toast} />
      <Button label="Registrar Cliente" icon="pi pi-user-plus" onClick={() => setVisible(true)} />
      <Dialog
        header="Registro de Cliente"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="personaCedula">Digite su cédula</label>
            <InputText
              id="personaCedula"
              name="personaCedula"
              value={formData.personaCedula}
              onChange={handleInputChange}
              onInput={handleCedulaInput}
            />
            {errors.personaCedula && <small className="p-error">{errors.personaCedula}</small>}
          </div>
          <div className="field">
            <label htmlFor="nombre">Digite su nombre</label>
            <InputText
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              onInput={handleNombreInput}
            />
            {errors.nombre && <small className="p-error">{errors.nombre}</small>}
          </div>
          <div className="field">
            <label htmlFor="primerApellido">Digite su primer apellido</label>
            <InputText
              id="primerApellido"
              name="primerApellido"
              value={formData.primerApellido}
              onChange={handleInputChange}
              onInput={handlePrimerApellidoInput}
            />
            {errors.primerApellido && <small className="p-error">{errors.primerApellido}</small>}
          </div>
          <div className="field">
            <label htmlFor="segundoApellido">Digite su segundo apellido</label>
            <InputText
              id="segundoApellido"
              name="segundoApellido"
              value={formData.segundoApellido}
              onChange={handleInputChange}
              onInput={handleSegundoApellidoInput}
            />
            {errors.segundoApellido && <small className="p-error">{errors.segundoApellido}</small>}
          </div>
          <div className="field">
            <label htmlFor="direccion">Digite su dirección</label>
            <InputText
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="telefono">Digite su número de teléfono</label>
            <InputText
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              onInput={handleTelefonoInput}
            />
            {errors.telefono && <small className="p-error">{errors.telefono}</small>}
          </div>
          <div className="field">
            <label htmlFor="correoElectronico">Digite su correo electrónico</label>
            <InputText
              id="correoElectronico"
              name="correoElectronico"
              value={formData.correoElectronico}
              onChange={handleInputChange}
            />
          </div>
          <div className="field">
            <label htmlFor="contrasena">Digite su contraseña</label>
            <Password
              id="contrasena"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleInputChange}
              toggleMask
              feedback
              weakLabel="Muy débil"
              mediumLabel="Débil"
              strongLabel="Fuerte"
            />
          </div>
          <Button label="Registrar" icon="pi pi-check" onClick={handleSubmit} />
        </div>
      </Dialog>
    </div>
  );
};

export default RegistrarCliente;
