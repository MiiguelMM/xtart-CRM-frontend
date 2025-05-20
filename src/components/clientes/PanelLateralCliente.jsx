import React from 'react'

export default function PanelLateralCliente({
  onAgregarClick,
  onListarTodosClick,
  onBuscarClick,
  onActualizarClick,
  onDetallesClick,
  onOfertaClick
}) {
  return (
    <div className="control-panel">
      <h3 className="panel-title">Panel de Control</h3>
      <div className="control-option">
        <button 
          className="control-button" 
          onClick={onAgregarClick}
        >
          Agregar Cliente
        </button>
      </div>
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onListarTodosClick}
        >
          Listar Todos los Clientes
        </button>
      </div>
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onActualizarClick}
        >
          Actualizar Cliente
        </button>
      </div>
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onDetallesClick}
        >
          Ver Detalles de Cliente
        </button>
      </div>
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onOfertaClick}
        >
          Enviar Oferta
        </button>
      </div>
    </div>
  )
}