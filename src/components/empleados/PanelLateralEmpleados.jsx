import React from 'react'

export default function PanelLateralEmpleados({
  onAgregarClick,
  onListarTodosClick,
  onBuscarClick,
  onActualizarClick,
  onDetallesClick,
  onAsignarRolClick
}) {
  return (
    <div className="control-panel">
      <h3 className="panel-title">Panel de Control</h3>
      <div className="control-option">
        <button 
          className="control-button" 
          onClick={onAgregarClick}
        >
          Agregar Empleado
        </button>
      </div>
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onListarTodosClick}
        >
          Listar Todos los Empleados
        </button>
      </div>

      <div className="control-option">
        <button 
          className="control-button"
          onClick={onActualizarClick}
        >
          Actualizar Empleado
        </button>
      </div>
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onDetallesClick}
        >
          Ver Detalles de Empleado
        </button>
      </div>
      <div className="control-option">
        <button 
          className="control-button"
          onClick={onAsignarRolClick}
        >
          Asignar Rol
        </button>
      </div>
    </div>
  )
}