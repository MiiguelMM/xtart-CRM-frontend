import React from 'react'

export default function PanelInfoProductos({productosStats}) {
  return (
    <div className="status-panel">
          <div className="status-card">
            <div className="status-card-title">PRODUCTOS TOTALES</div>
            <div className="status-card-value">{productosStats.total}</div>
          </div>
          <div className="status-card">
            <div className="status-card-title">PRODUCTOS ACTIVOS</div>
            <div className="status-card-value">{productosStats.activos}</div>
          </div>
          <div className="status-card">
            <div className="status-card-title">STOCK TOTAL</div>
            <div className="status-card-value">{productosStats.stockTotal}</div>
          </div>
        </div>
  )
}
