import React, { useState } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "primereact/resources/themes/lara-light-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../Css/reporteprestamos.css";

const ListaSolicitudesPrestamos = () => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);

  const handleFiltrar = async () => {
    if (!fechaInicio || !fechaFin) {
      alert("Por favor selecciona ambas fechas.");
      return;
    }
  
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3333/prestamos/solicitudes?fechaInicio=${fechaInicio
          .toISOString()
          .split("T")[0]}&fechaFin=${fechaFin.toISOString().split("T")[0]}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Error al consultar las solicitudes de préstamos.");
      }
  
      const data = await response.json();
  
      console.log("Datos recibidos:", data); // Verifica que los datos se reciben correctamente
  
      if (data.solicitudes && data.solicitudes[0]?.length > 0) {
        setSolicitudes(data.solicitudes[0]); // Ajusta aquí para acceder al array correcto
        setMostrarTabla(true);
      } else {
        setMostrarTabla(false);
        alert(data.message || "No se encontraron solicitudes en este rango.");
      }
    } catch (error) {
      console.error("Error al filtrar solicitudes de préstamos:", error);
      alert("Ocurrió un error al consultar las solicitudes.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const generarPdfSolicitudes = () => {
    if (solicitudes.length === 0) {
      alert("No hay datos para generar el reporte.");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    const logoUrl = "/img/navbar.png";
  


    const addHeader = () => {
      const logoWidth = 15;
      const logoHeight = 15;
      doc.setFontSize(18);
      doc.text("Reporte de Solicitudes de Préstamos", pageWidth / 2, 20, {
        align: "center",
      });
      
      doc.addImage(logoUrl, "PNG", 10, 10, logoWidth, logoHeight);
  
      const today = new Date();
      const formattedDate = today.toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Fecha de impresión: ${formattedDate}`, pageWidth - 60, 10);

      const fechaInicioText = fechaInicio
        ? fechaInicio.toLocaleDateString()
        : "No especificada";
      const fechaFinText = fechaFin
        ? fechaFin.toLocaleDateString()
        : "No especificada";
      doc.setFontSize(12);
      doc.text(
        `Fechas Consultadas: ${fechaInicioText} - ${fechaFinText}`,
        pageWidth / 2,
        30,
        { align: "center" }
      );
    };

    const addFooter = (pageNumber) => {
      doc.setFontSize(10);
      doc.text(`Página ${pageNumber}`, pageWidth / 2, doc.internal.pageSize.height - 10, {
        align: "center",
      });
    };

    const tableColumn = [
      "Cédula",
      "Nombre",
      "Apellido Paterno",
      "Apellido Materno",
      "Cantidad de Préstamos",
      "Monto Total",
    ];
    const tableRows = [];

    solicitudes.forEach((solicitud) => {
      const row = [
        solicitud.Cedula,
        solicitud.Nombre,
        solicitud.Primer_Apellido,
        solicitud.Segundo_Apellido,
        solicitud.Cantidad_Prestamos,
        solicitud.Monto_Total,
      ];
      tableRows.push(row);
    });

    addHeader();

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 5,
        overflow: "linebreak",
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [0, 150, 136],
        textColor: 255,
        fontSize: 12,
        fontStyle: "bold",
      },
      didDrawPage: (data) => {
        addFooter(doc.internal.getNumberOfPages());
      },
    });

    doc.save("Reporte_Solicitudes_Prestamos.pdf");
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          Reporte de Solicitudes de Préstamos
        </h2>

        {/* Filtros y Botones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end">
          <div className="flex flex-col">
            <label className="mb-2 text-600">Fecha Inicio:</label>
            <Calendar
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.value)}
              showIcon
              className="w-full"
              style={{ borderColor: "#00695c" }}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-600">Fecha Fin:</label>
            <Calendar
              value={fechaFin}
              onChange={(e) => setFechaFin(e.value)}
              showIcon
              className="w-full"
              style={{ borderColor: "#00695c" }}
            />
          </div>
          <div className="flex items-center space-x-6">
            <Button
              label="Filtrar"
              icon="pi pi-search"
              onClick={handleFiltrar}
              loading={loading}
              className="p-button-primary"
              style={{ backgroundColor: "#00695c", border: "none" }}
            />
            <Button
              label="Exportar a PDF"
              icon="pi pi-file-pdf"
              className="p-button-success"
              onClick={generarPdfSolicitudes}
              disabled={!mostrarTabla}
            />
          </div>
        </div>

        {/* Tabla de solicitudes */}
        {mostrarTabla && (
          <div className="mt-8">
            <DataTable
              value={solicitudes}
              paginator
              rows={5}
              loading={loading}
              className="p-datatable-elegant"
              showGridlines
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No se encontraron solicitudes de préstamos"
              style={{
                "--primary-color": "#00695c",
                "--primary-light-color": "#4db6ac",
              }}
            >
              <Column field="Cedula" header="Cédula" sortable />
              <Column field="Nombre" header="Nombre" sortable />
              <Column field="Primer_Apellido" header="Apellido Paterno" sortable />
              <Column field="Segundo_Apellido" header="Apellido Materno" sortable />
              <Column
                field="Cantidad_Prestamos"
                header="Cantidad de Préstamos"
                sortable
              />
              <Column field="Monto_Total" header="Monto Total" sortable />
            </DataTable>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ListaSolicitudesPrestamos;
