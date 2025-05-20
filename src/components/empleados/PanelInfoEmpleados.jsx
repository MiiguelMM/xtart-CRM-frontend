import React from 'react'

export default function PanelInfoEmpleados({empleadoStats,isLoading}) {

    if (isLoading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }
  return (
    <div className="status-panel">
          <div className="status-card">
            <div className="status-card-title">EMPLEADOS TOTALES</div>
            <div className="status-card-value">{empleadoStats.total}</div>
          </div>
          <div className="status-card">
            <div className="status-card-title">EMPLEADOS ACTIVOS</div>
            <div className="status-card-value">{empleadoStats.activos}</div>
          </div>
          <div className="status-card">
            <div className="status-card-title">EMPLEADOS INACTIVOS</div>
            <div className="status-card-value">{empleadoStats.inactivos}</div>
          </div>
        </div>
  )
}
