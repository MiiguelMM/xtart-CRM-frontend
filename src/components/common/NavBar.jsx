import React from 'react'
import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <div className="menu">
          <Link to="/index">Panel Principal</Link>
          <Link to="/clientes" >Gestión de Clientes</Link>
          <Link to="/empleados">Gestión de Empleados</Link>
          <Link to="/productos">Gestión de Productos</Link>
          <Link to="/ventas">Gestión de Ventas</Link>
        </div>
  )
}
