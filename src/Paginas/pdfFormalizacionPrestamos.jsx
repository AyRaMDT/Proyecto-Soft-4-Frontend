import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { obtenerPrestamosTODO } from "../api/RegistrarPrestamo.api";

export const generarPdfFormalizacionPrestamos = async () => {
  try {
    const prestamos = await obtenerPrestamosTODO();

    if (!Array.isArray(prestamos)) {
      console.error("Los datos obtenidos no son un array:", prestamos);
      alert("No se pudieron obtener los datos correctamente.");
      return;
    }

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
      doc.addImage(logoUrl, "PNG", 14, 10, logoWidth, logoHeight);

      doc.setFontSize(18);
      doc.text("Ouro Bank", pageWidth / 2, 25, { align: "center" });

      const today = new Date();
      const formattedDate = today.toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Fecha de impresión: ${formattedDate}`, pageWidth - 60, 10);
    };

    const addFooter = (pageNumber) => {
      doc.setFontSize(10);
      doc.text(`Página ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    };

    addHeader();

    const tableColumn = [
      "ID",
      "Monto",
      "Plazo (Meses)",
      "Número Préstamo",
      "Día Pago",
      "Cédula Cliente",
      "Estado",
    ];
    const tableRows = [];

    prestamos.forEach((prestamo) => {
      const row = [
        prestamo.idPrestamos,
        `$${parseFloat(prestamo.monto).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        prestamo.PlazoMeses,
        prestamo.numeroPrestamo,
        prestamo.diaPago,
        prestamo.clientesPersonaCedula,
        prestamo.estadoPrestamo,
      ];
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: "linebreak",
        halign: "left",
        valign: "middle",
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      didDrawPage: (data) => {
        addFooter(doc.internal.getNumberOfPages());
      },
    });

    doc.save("Reporte_Prestamos.pdf");
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    alert("Ocurrió un error al generar el reporte.");
  }
};
