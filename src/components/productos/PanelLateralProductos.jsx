import React from 'react'

export default function PanelLateralProductos({
  onAgregarClick,
  onListarTodosClick,
  onActualizarClick,
  onFiltrarPrecioClick,
  onMostrarMasVendidosClick,
  onMostrarBajaExistenciaClick
}) {
  return (
    <div className="control-panel">
      <h3 className="panel-title">Panel de Control</h3>
      <div className="control-option">
        <button 
          className="control-button" 
          onClick={onAgregarClick}
        >
          Agregar Producto
        </button>
      </div>
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onListarTodosClick}
        >
          Listar Todos los Productos
        </button>
      </div>
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onActualizarClick}
        >
          Actualizar Producto
        </button>
      </div>
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onFiltrarPrecioClick}
        >
          Filtrar por Precio
        </button>
      </div>
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onMostrarMasVendidosClick}
        >
          Productos Más Vendidos
        </button>
      </div>
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onMostrarBajaExistenciaClick}
        >
          Productos Baja Existencia
        </button>
      </div>
    </div>
  )
}