import React from 'react';

const Error404 = () => {
  return (
    <div
      style={{
        height: '100vh', // Toda la altura de la pantalla
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111827', // Fondo negro
        textAlign: 'center',
        position: 'relative', // Necesario para el posicionamiento absoluto del texto
      }}
    >
      {/* Imagen como fondo */}
      <img
        src="/img/404.png"
        alt="Error 404"
        style={{
          width: '55%', // Ajusta el tamaño de la imagen
          height: 'auto', // Mantiene proporciones
        }}
      />
      {/* Mensaje centrado sobre la imagen */}
      <div
        style={{
          position: 'absolute', // Posición absoluta dentro del contenedor
          top: '25%', // Centro vertical
          left: '35%', // Centro horizontal
          transform: 'translate(-50%, -50%)', // Ajusta para centrar exactamente
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo semitransparente para el texto
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
        }}
      >
        <h1>Error 404</h1>
        <p>La página que estás buscando no existe.</p>
      </div>
    </div>
  );
};

export default Error404;
