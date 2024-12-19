import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { getProfile } from "../api/Login";
import { agregarFormalizacion } from "../api/RegistrarFormalizacion";
import { aprobarPrestamo, rechazarPrestamo } from "../api/RegistrarPrestamo.api";
import "../Css/loanFormalizacion.css";

const LoanModal = ({ visible, action, prestamo, onHide }) => {
  const [formData, setFormData] = useState({
    idPrestamoFormal: null,
    idanalistaCredito: null,
    personaCedula: "",
    prestamoClienteCuota: null,
    prestamoscliente_idPrestamos: null,
    IdClientes: "",
    clientesPersonaCedula: "",
  });
  const [isCuotaEditable, setIsCuotaEditable] = useState(false);
  const [isActionDisabled, setIsActionDisabled] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileResponse = await getProfile();
        const profile = profileResponse.perfil;

        setFormData((prevState) => ({
          ...prevState,
          idanalistaCredito: profile.idanalistaCredito || "",
          personaCedula: profile.personaCedula || "",
        }));
      } catch (error) {
        console.error("Error al obtener los datos del usuario logueado:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (prestamo) {
      const cuota =
        prestamo.monto && prestamo.PlazoMeses
          ? (prestamo.monto / prestamo.PlazoMeses).toFixed(2)
          : null;

      setFormData((prevState) => ({
        ...prevState,
        idPrestamoFormal: prestamo.idPrestamos || null,
        prestamoscliente_idPrestamos: prestamo.idPrestamos || null,
        IdClientes: prestamo.IdClientes || "",
        clientesPersonaCedula: prestamo.clientesPersonaCedula || "",
        prestamoClienteCuota: cuota,
      }));

      setIsActionDisabled(prestamo.estadoPrestamo === 1 || prestamo.estadoPrestamo === 4);
    }
  }, [prestamo]);

  const handleSave = async () => {
    if (!formData.idPrestamoFormal || !formData.prestamoscliente_idPrestamos) {
      toastRef.current.show({
        severity: "warn",
        summary: "Campos obligatorios",
        detail: "Por favor, complete todos los campos.",
        life: 3000,
      });
      return;
    }

    try {
      if (action === "approve") {
        await aprobarPrestamo(formData.idPrestamoFormal);
        await agregarFormalizacion({
          analistaIdAnalista: formData.idanalistaCredito,
          analistaPersonaCedula: formData.personaCedula,
          prestamoClienteCuota: formData.prestamoClienteCuota,
          prestamoscliente_idPrestamos: formData.prestamoscliente_idPrestamos,
        });

        toastRef.current.show({
          severity: "success",
          summary: "Préstamo Aprobado",
          detail: "El préstamo fue aprobado y formalizado correctamente.",
          life: 3000,
        });
      } else if (action === "reject") {
        await rechazarPrestamo(formData.idPrestamoFormal);

        toastRef.current.show({
          severity: "info",
          summary: "Préstamo Rechazado",
          detail: "El préstamo fue rechazado correctamente.",
          life: 3000,
        });
      }

      setIsActionDisabled(true);

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: `Error al ${action === "approve" ? "aprobar" : "rechazar"} el préstamo.`,
        life: 3000,
      });
      console.error(
        `Error al ${action === "approve" ? "aprobar" : "rechazar"} el préstamo:`,
        error
      );
    }
  };

  const dialogFooter = (
    <div className="flex justify-content-end">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-text p-button-secondary mr-2"
        disabled={isActionDisabled}
      />
      <Button
        label={action === "approve" ? "Aprobar" : "Rechazar"}
        icon={action === "approve" ? "pi pi-check" : "pi pi-times"}
        onClick={handleSave}
        className={action === "approve" ? "p-button-success" : "p-button-danger"}
        disabled={isActionDisabled}
      />
    </div>
  );

  return (
    <Dialog
      header={action === "approve" ? "Aprobar Préstamo" : "Rechazar Préstamo"}
      visible={visible}
      style={{ width: "40vw", borderRadius: "12px" }}
      onHide={onHide}
      footer={dialogFooter}
      className="p-fluid loan-modal"
    >
      <Toast ref={toastRef} />
      <form style={{ display: "grid", gap: "1rem", padding: "1.5rem" }}>
        <label htmlFor="idPrestamoFormal">ID de Préstamo Formal</label>
        <InputText id="idPrestamoFormal" value={formData.idPrestamoFormal} disabled />

        <label htmlFor="IdClientes">ID de Clientes</label>
        <InputText id="IdClientes" value={formData.IdClientes} disabled />

        <label htmlFor="clientesPersonaCedula">Cédula del Cliente</label>
        <InputText id="clientesPersonaCedula" value={formData.clientesPersonaCedula} disabled />

        <label htmlFor="idanalistaCredito">ID de Analista de Crédito</label>
        <InputText id="idanalistaCredito" value={formData.idanalistaCredito} disabled />

        <label htmlFor="personaCedula">Cédula del Analista</label>
        <InputText id="personaCedula" value={formData.personaCedula} disabled />

        
        <label htmlFor="prestamoClienteCuota">Cuota del Préstamo</label>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <InputNumber
            id="prestamoClienteCuota"
            value={formData.prestamoClienteCuota}
            mode="decimal"
            minFractionDigits={2}
            maxFractionDigits={2}
            className="p-inputnumber"
            disabled={!isCuotaEditable}
            onChange={(e) =>
              setFormData({ ...formData, prestamoClienteCuota: e.value })
            }
          />
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-secondary"
            onClick={(e) => {
              e.preventDefault();
              setIsCuotaEditable(!isCuotaEditable);
            }}
            tooltip={isCuotaEditable ? "Deshabilitar edición" : "Habilitar edición"}
          />
        </div>
        
      </form>
    </Dialog>
  );
};

export default LoanModal;
