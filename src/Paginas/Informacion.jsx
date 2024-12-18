import React, { useState } from 'react';
import { motion } from 'framer-motion';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useNavigate } from 'react-router-dom';

import '../Css/informacion.css';

const LoanMotivationPage = () => {
    const [] = useState(false);
    const navigate = useNavigate();
      
    const handleClick = () => {
        navigate('/RegistroPrestamo');  
    };

    const motivationCards = [
        {
            icon: <i className="pi pi-send" style={{ fontSize: '3rem', color: '#0891b2' }}></i>,
            title: "Impulsa tus Proyectos",
            description: "Transforma tus ideas en realidad con financiamiento rápido y flexible."
        },
        {
            icon: <i className="pi pi-chart-line" style={{ fontSize: '3rem', color: '#0891b2' }}></i>,
            title: "Crece Financieramente",
            description: "Aprovecha oportunidades de inversión y expande tus horizontes económicos."
        },
        {
            icon: <i className="pi pi-star" style={{ fontSize: '3rem', color: '#0891b2' }}></i>,
            title: "Beneficios Exclusivos",
            description: "Tasas preferenciales, plazos adaptados y un proceso simple."
        }
    ];

    const benefitsList = [
        "   Préstamos desde $5,000 hasta $500,000",
        "   Tasas de interés competitivas",
        "   Aprobación en 24 horas",
        "   Sin comisiones ocultas",
        "   Flexibilidad de pago"
    ];

    return (
        <div className="main-section">
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-cyan-800 mb-4">
                        Tu Futuro Financiero Comienza Aquí
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Transforma tus sueños en realidad con préstamos diseñados para impulsar tu éxito.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {motivationCards.map((card, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.2 }}
                            className="motivation-card p-6"
                        >
                            <div className="flex flex-col items-center text-center">
                                {card.icon}
                                <h3 className="mt-4 text-xl font-bold text-cyan-800">{card.title}</h3>
                                <p className="mt-2 text-gray-600">{card.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="benefits-section rounded-2xl shadow-lg overflow-hidden mb-16">
                    <div className="p-12 flex flex-col justify-center items-center text-center">
                        <h2 className="text-3xl font-bold mb-6">
                            ¿Por Qué Elegirnos?
                        </h2>
                        <div className="flex flex-col items-center space-y-3">
                            {benefitsList.map((benefit, index) => (
                                <div key={index} className="benefit-item flex items-center mb-3 justify-center">
                                    <i className="pi pi-check-circle text-cyan-600 mr-2" style={{ fontSize: '1.5rem' }}></i>
                                    <span className="text-lg">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-12 flex flex-col justify-center items-center text-center">
                    <i className="pi pi-shield text-cyan-600" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}></i>
                    <h3 className="text-2xl font-bold text-cyan-800 mb-4">
                        100% Seguro y Confidencial
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Protegemos tu información con los más altos estándares de seguridad.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClick}
                        className="request-button"
                    >
                        Solicitar Préstamo
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default LoanMotivationPage;
