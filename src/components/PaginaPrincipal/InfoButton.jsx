// InfoButton.jsx con React Portal
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/InfoButton.css';

const InfoButton = () => {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
    // Prevenir scroll cuando el modal está abierto
    document.body.style.overflow = showInfo ? 'auto' : 'hidden';
  };

  // Componente Modal que será renderizado en el portal
  const Modal = () => (
    <div className="info-modal-overlay" onClick={toggleInfo}>
      <div className="info-modal-content" onClick={e => e.stopPropagation()}>
        <button className="info-close-btn" onClick={toggleInfo}>×</button>
        
        <h3 className="info-title">Integridad de la Base de Datos</h3>
        
        <div className="info-section">
          <h4>¿Por qué no puedo eliminar algunos registros?</h4>
          <p>
            Los <strong>clientes</strong>, <strong>empleados</strong> y <strong>productos</strong> que están 
            relacionados con facturas no pueden ser eliminados para mantener la integridad 
            de los datos en el sistema.
          </p>
          
          <div className="info-example">
            <strong>Ejemplo:</strong> Si eliminas un cliente que tiene facturas asociadas, 
            estas quedarían sin una referencia válida, causando inconsistencias 
            en los reportes financieros.
          </div>
        </div>
        
        <div className="info-section">
          <h4>¿Qué puedo hacer entonces?</h4>
          <p>
            En lugar de eliminar, puedes <strong>desactivar</strong> estos registros usando 
            el botón correspondiente. Los registros desactivados:
          </p>
          <ul>
            <li>No aparecerán en las listas de selección para nuevas transacciones</li>
            <li>Seguirán visibles en el historial de transacciones pasadas</li>
            <li>Pueden reactivarse en cualquier momento si es necesario</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <li className="sidebar-item">
        <button 
          className="sidebar-link" 
          onClick={toggleInfo}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            textAlign: 'left',
            cursor: 'pointer'
          }}
        >
          <span className="sidebar-icon">ℹ️</span>
          <span className="sidebar-text">Información del Sistema</span>
          <span className="menu-indicator" />
        </button>
      </li>
      
      {/* Usar createPortal para renderizar el modal en el body */}
      {showInfo && ReactDOM.createPortal(<Modal />, document.body)}
    </>
  );
};

export default InfoButton;