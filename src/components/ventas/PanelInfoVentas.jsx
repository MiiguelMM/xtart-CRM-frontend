import React from 'react'

export default function PanelInfoVentas({ventasStats}) {
  return (
    <div className="status-panel">
          <div className="status-card">
            <div className="status-card-title">VENTAS TOTALES</div>
            <div className="status-card-value">{ventasStats.total}</div>
          </div>
          <div className="status-card">
            <div className="status-card-title">INGRESOS TOTAL</div>
            <div className="status-card-value">${ventasStats.ingresos.toLocaleString()}</div>
          </div>
          <div className="status-card">
            <div className="status-card-title">VENTAS HOY</div>
            <div className="status-card-value">{ventasStats.hoy}</div>
          </div>
        </div>
  )
}
