// ResetDatosButton.jsx
import React from 'react';
import datosService from '../../services/datosService';

const ResetDatosButton = () => {
  const handleReset = () => {
    const confirmed = window.confirm(
      "¿Estás seguro que deseas restablecer TODOS los datos? " +
      "Esta acción eliminará registros actuales y los reemplazará con datos de demostración."
    );

    if (!confirmed) return;
    
    datosService.resetDatos()
      .then(() => {
        alert("Datos restablecidos correctamente");
        window.location.reload();
      })
      .catch(error => {
        alert("Error al restablecer datos");
        console.error(error);
      });
  };

  return (
    <li className="sidebar-item">
      <button 
        className="sidebar-link" 
        onClick={handleReset}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer'
        }}
      >
        <span className="sidebar-icon">⟳</span>
        <span className="sidebar-text">Restablecer Datos de Prueba</span>
        <span className="menu-indicator" />
      </button>
    </li>
  );
};

export default ResetDatosButton;