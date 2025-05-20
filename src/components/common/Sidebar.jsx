import React from 'react';
import { Link } from 'react-router-dom';
import ResetDatosButton from '../PaginaPrincipal/ResetDatosButton';
import InfoButton from '../PaginaPrincipal/InfoButton';


const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="user-panel">
        <div className="user-avatar">
          <div className="avatar-glow" />
        </div>
        <div className="user-info">
          <p className="user-name">Usuario</p>
          <p className="user-role">Administrador</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="menu-category">GESTIÓN PRINCIPAL</li>
          <li className="sidebar-item ">
            <Link className="sidebar-link" to="/clientes">
              <span className="sidebar-icon">👥</span>
              <span className="sidebar-text">Gestión de Clientes</span>
              <span className="menu-indicator" />
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/empleados">
              <span className="sidebar-icon">👨‍💼</span>
              <span className="sidebar-text">Gestión de Empleados</span>
              <span className="menu-indicator" />
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/productos">
              <span className="sidebar-icon">📦</span>
              <span className="sidebar-text">Gestión de Productos</span>
              <span className="menu-indicator" />
            </Link>
          </li>
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/ventas">
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-text">Gestión de Ventas</span>
              <span className="menu-indicator" />
            </Link>
          </li>
          <li className="menu-category">MANTENIMIENTO</li>
          <ResetDatosButton></ResetDatosButton>
          <InfoButton></InfoButton>
          
          

        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="tech-status">
          <div className="status-indicator" />
          <span>Sistema Operativo</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;