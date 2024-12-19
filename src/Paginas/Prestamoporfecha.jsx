import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "primereact/resources/themes/lara-light-teal/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../Css/reporteprestamos.css";

const ListaPrestamos = () => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarTabla, setMostrarTabla] = useState(false);

  const handleFiltrar = async () => {
    if (!fechaInicio || !fechaFin) return;

    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3333/prestamos/filtroPrestamo",
        {
          params: {
            fechaInicio: fechaInicio.toISOString().split("T")[0],
            fechaFin: fechaFin.toISOString().split("T")[0],
          },
        }
      );

      if (response.data.prestamos && response.data.prestamos[0]) {
        setPrestamos(response.data.prestamos[0]);
        setMostrarTabla(true);
      }
    } catch (error) {
      console.error("Error al filtrar préstamos:", error);
    } finally {
      setLoading(false);
    }
  };

  const generarPdfPrestamos = () => {
    if (prestamos.length === 0) {
      alert("No hay datos para generar el reporte.");
      return;
    }
  
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
  
    const logoUrl = "/img/navbar.png";
  
    const addHeader = () => {
      const logoWidth = 15;
      const logoHeight = 15;
  
      // Agrega el logo
      doc.addImage(logoUrl, "PNG", 10, 10, logoWidth, logoHeight);
  
      // Título del reporte
      doc.setFontSize(18);
      doc.text("Reporte de Préstamos", pageWidth / 2, 20, { align: "center" });
  
      // Fecha de impresión
      const today = new Date();
      const formattedDate = today.toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Fecha de impresión: ${formattedDate}`, pageWidth - 60, 10);
  
      // Intervalo de fechas consultadas
      const fechaInicioText = fechaInicio
        ? fechaInicio.toLocaleDateString()
        : "No especificada";
      const fechaFinText = fechaFin ? fechaFin.toLocaleDateString() : "No especificada";
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
      doc.text(`Página ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    };
  
    // Encabezados de la tabla
    const tableColumn = ["Estado", "Cantidad de Préstamos"];
    const tableRows = [];
  
    // Datos de la tabla
    prestamos.forEach((prestamo) => {
      const row = [prestamo.Estado, prestamo.CantidadPrestamos];
      tableRows.push(row);
    });
  
    addHeader();
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Espacio debajo del encabezado
      styles: {
        fontSize: 10,
        cellPadding: 5,
        overflow: "linebreak",
        halign: "center", // Centra el texto de las celdas
        valign: "middle",
      },
      headStyles: {
        fillColor: [0, 150, 136], // Color verde para el encabezado
        textColor: 255,
        fontSize: 12,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], // Fondo gris claro para filas alternas
      },
      margin: { top: 50 }, // Márgenes para la tabla
      didDrawPage: (data) => {
        addFooter(doc.internal.getNumberOfPages());
      },
    });
  
    doc.save("Reporte_Prestamos.pdf");
  };
  
  

  return (
    <div className="container mx-auto p-6">
      <Card>
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
          Reporte de Préstamos
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
              onClick={generarPdfPrestamos}
              disabled={!mostrarTabla}
            />
          </div>
        </div>

        {/* Tabla de préstamos */}
        {mostrarTabla && (
          <div className="mt-8">
            <DataTable
              value={prestamos}
              paginator
              rows={5}
              loading={loading}
              className="p-datatable-elegant"
              showGridlines
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No se encontraron préstamos"
              style={{
                "--primary-color": "#00695c",
                "--primary-light-color": "#4db6ac",
              }}
            >
              <Column
                field="Estado"
                header="Estado"
                sortable
                style={{
                  color: "#00695c",
                  fontWeight: 600,
                }}
              />
              <Column
                field="CantidadPrestamos"
                header="Cantidad de Préstamos"
                sortable
                style={{
                  color: "#00695c",
                  fontWeight: 500,
                }}
              />
            </DataTable>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ListaPrestamos;
