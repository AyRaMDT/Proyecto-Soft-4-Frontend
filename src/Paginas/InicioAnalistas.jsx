import React from 'react';
import { Users, UserRoundCog, FileSpreadsheet, CreditCard, Calculator, CircleDollarSign } from 'lucide-react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';  
import '../Css/inicioAnalistas.css'; 

const LoanAnalystDashboard = () => {
  const navigate = useNavigate(); 

  const services = [
    {
      icon: <Users className="icon-style" />,
      title: "Gestión de Clientes",
      description: "Administración integral de datos y relaciones con clientes",
      route: "/GestionClientes" 
    },
    {
      icon: <UserRoundCog  className="icon-style" />,
      title: "Gestión de Analistas",
      description: "Administración integral de datos y modificación de los mismos",
      route: "/mantenimientoAnalistas" 
    },
    {
      icon: <CircleDollarSign  className="icon-style" />,
      title: "Gestión de Préstamos",
      description: "Administración integral de datos y mayor informacion de la formalizacion",
      route: "/mantenimientoFormalizacion" 
    },
    {
      icon: <FileSpreadsheet className="icon-style" />,
      title: "Formalización de Préstamos",
      description: "Proceso completo de solicitud y aprobación de préstamos",
      route: "/FormalizacionPrestamos"
    },
    {
      icon: <Calculator className="icon-style" />,
      title: "Cálculo y Programación de Pagos",
      description: "Simulación y planificación detallada de cuotas",
      route: "/cálculo-pagos"
    },
    {
      icon: <CreditCard className="icon-style" />,
      title: "Cobro de Pagos",
      description: "Seguimiento y gestión de cobranzas",
      route: "/cobro-pagos"
    },
  ];

 
  const handleNavigate = (route) => {
    navigate(route);  
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Panel de Analista Financiero</h1>
        <p>Gestión integral de préstamos y servicios financieros</p>
      </div>

      <div className="dashboard-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="icon-container">{service.icon}</div>
            <h2 className="service-title">{service.title}</h2>
            <p className="service-description">{service.description}</p>
            <Button 
              label="Acceder" 
              className="p-button-success custom-button" 
              onClick={() => handleNavigate(service.route)}  
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanAnalystDashboard;
