import React from 'react';


export default function PanelInfoClientes({ stats, isLoading }) {

  if (isLoading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  return (
    <div className="status-panel">
      <div className="status-card">
        <div className="status-card-title">CLIENTES TOTALES</div>
        <div className="status-card-value">{stats.total}</div>
      </div>
      <div className="status-card">
        <div className="status-card-title">CLIENTES ACTIVOS</div>
        <div className="status-card-value">{stats.activos}</div>
      </div>
      <div className="status-card">
        <div className="status-card-title">CLIENTES INACTIVOS</div>
        <div className="status-card-value">{stats.inactivos}</div>
      </div>
    </div>
  );
}