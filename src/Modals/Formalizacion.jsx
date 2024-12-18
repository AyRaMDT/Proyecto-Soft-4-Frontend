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

  // Obtener datos del perfil
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileResponse = await getProfile();
        console.log("Respuesta de getProfile:", profileResponse);

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
        console.log("Datos del préstamo recibidos:", prestamo);

        // Cálculo básico de la cuota
        const cuota =
            prestamo.monto && prestamo.PlazoMeses
                ? (prestamo.monto / prestamo.PlazoMeses).toFixed(2)
                : null;

        if (prestamo.monto && prestamo.PlazoMeses) {
            const tasaInteresAnual = prestamo.tasaInteresAnual; // Porcentaje anual
            const tasaInteresMoratoria = prestamo.tasaInteresMoratoria; // Porcentaje moratorio
            const saldo = prestamo.saldo;
            const diaPagoSeleccionado = parseInt(prestamo.diaPago);
            const diaActual = new Date().getDate();

            // Calcular la tasa mensual
            const tasaMensual = (tasaInteresAnual / 100) / 12;

            // Intereses mensuales normales
            const interesMensual = parseFloat((saldo * tasaMensual).toFixed(2));

            // Intereses moratorios (si aplica)
            const interesesMoratorios = diaActual > diaPagoSeleccionado
                ? parseFloat((saldo * (tasaInteresMoratoria / 100)).toFixed(2))
                : 0;

            // Total de intereses (mensual + moratorio)
            const totalIntereses = interesMensual + interesesMoratorios;

            // Actualizar cuota con intereses
            const cuotaConIntereses = parseFloat((parseFloat(cuota) + totalIntereses).toFixed(2));

            // Actualizar el estado con los cálculos avanzados
            setFormData((prevState) => ({
                ...prevState,
                idPrestamoFormal: prestamo.idPrestamos || null,
                prestamoscliente_idPrestamos: prestamo.idPrestamos || null,
                IdClientes: prestamo.IdClientes || null,
                clientesPersonaCedula: prestamo.clientesPersonaCedula || "",
                prestamoClienteCuota: cuotaConIntereses,
            }));
        } else {
            // Actualizar el estado con la cuota básica si no hay cálculos adicionales
            setFormData((prevState) => ({
                ...prevState,
                idPrestamoFormal: prestamo.idPrestamos || null,
                prestamoscliente_idPrestamos: prestamo.idPrestamos || null,
                IdClientes: prestamo.IdClientes || null,
                clientesPersonaCedula: prestamo.clientesPersonaCedula || "",
                prestamoClienteCuota: cuota,
            }));
        }

        setIsActionDisabled(prestamo.estadoPrestamo === "Pendiente");
    }
}, [prestamo]);




  // Guardar acción
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
          life: 1000,
        });
      } else if (action === "reject") {
        await rechazarPrestamo(formData.idPrestamoFormal);

        toastRef.current.show({
          severity: "info",
          summary: "Préstamo Rechazado",
          detail: "El préstamo fue rechazado correctamente.",
          life: 1000,
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
      />
      <Button
        label={action === "approve" ? "Aprobar" : "Rechazar"}
        icon={action === "approve" ? "pi pi-check" : "pi pi-times"}
        onClick={handleSave}
        className={action === "approve" ? "p-button-success" : "p-button-danger"}
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
        <InputText id="idPrestamoFormal" value={formData.idPrestamoFormal} disabled />
        <InputText id="IdClientes" value={formData.IdClientes} disabled />
        <InputText id="clientesPersonaCedula" value={formData.clientesPersonaCedula} disabled />
        <InputText id="idanalistaCredito" value={formData.idanalistaCredito} disabled />
        <InputText id="personaCedula" value={formData.personaCedula} disabled />
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
