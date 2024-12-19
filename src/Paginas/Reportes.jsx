import React from 'react';
import { Users, FileHeart, FileChartLine, CreditCard, ListChecks, Calculator, CircleDollarSign } from 'lucide-react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';  
import '../Css/inicioAnalistas.css'; 

const LoanAnalystDashboard = () => {
  const navigate = useNavigate(); 

  const services = [
    {
      icon: <FileChartLine className="icon-style" />,
      title: "Reportes Préstamos",
      description: "Consulta de estaditicas segun fechas brindadas, además de su exportación ",
      route: "/Prestamoporfecha"
    },
    {
        icon: <FileHeart  className="icon-style" />,
        title: "Reportes Clientes",
        description: "Consulta de préstamos realizados por persona en un intervalo de tiempo",
        route: "/Solicitudesporfecha"
      }
  ];

 
  const handleNavigate = (route) => {
    navigate(route);  
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Panel para Reportes</h1>
        <p>Exportación en PDF y consulta de datos</p>
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
