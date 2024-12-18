import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";

export const obtenerClientes = async () => {
  try {
    const response = await axios.get("http://localhost:3333/cliente/obtener-clientes");
    return response.data; // Asegúrate de devolver los datos completos
  } catch (error) {
    console.error("Error al obtener la lista de clientes:", error);
    throw error;
  }
};

export const generarPdfClientes = async () => {
  try {
    const response = await obtenerClientes();

    // Accede a la propiedad "clientes"
    const clientes = response.clientes;

    if (!Array.isArray(clientes)) {
      console.error("Los datos obtenidos no son un array:", clientes);
      alert("No se pudieron obtener los datos correctamente.");
      return;
    }

    if (clientes.length === 0) {
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
      "Cédula",
      "Nombre",
      "Primer Apellido",
      "Segundo Apellido",
      "Correo Electrónico",
      "Teléfono",
    ];
    const tableRows = [];

    clientes.forEach((cliente) => {
      const row = [
        cliente.Cedula,
        cliente.Nombre,
        cliente.PrimerApellido,
        cliente.SegundoApellido,
        cliente.correoElectronico || "N/A",
        cliente.telefono || "N/A",
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

    doc.save("Reporte_Clientes.pdf");
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    alert("Ocurrió un error al generar el reporte.");
  }
};
