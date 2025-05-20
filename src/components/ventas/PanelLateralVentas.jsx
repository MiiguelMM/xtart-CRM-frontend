import React from 'react'

export default function PanelLateralVentas({
  onNuevaVentaClick,
  onListarVentasClick,
  onBuscarVentaClick,
  onVerDetalleVentaClick,
  onVentasPorClienteClick,
  onVentasPorVendedorClick,
  onAplicarDescuentoClick,
  onGenerarReporteClick
}) {
  return (
    <div className="control-panel">
      <h3 className="panel-title">Panel de Control</h3>
      
      <div className="control-option">
        <button 
          className="control-button" 
          onClick={onNuevaVentaClick}
        >
          Nueva Venta
        </button>
      </div>
      
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onListarVentasClick}
        >
          Listar Todas las Ventas
        </button>
      </div>
      
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onVerDetalleVentaClick}
        >
          Ver Detalle de Venta
        </button>
      </div>
      
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onVentasPorClienteClick}
        >
          Ventas por Cliente
        </button>
      </div>
      
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onVentasPorVendedorClick}
        >
          Ventas por Vendedor
        </button>
      </div>
      
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onAplicarDescuentoClick}
        >
          Aplicar Descuento
        </button>
      </div>
      
    </div>
  )
}