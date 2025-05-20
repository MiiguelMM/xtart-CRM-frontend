import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Grafica from './PaginaPrincipal/DashboardGrafica.jsx';
import Header from './common/Header.jsx';
import Footer from './common/Footer.jsx';
import Sidebar from './common/Sidebar.jsx';
import RecentActivity from './PaginaPrincipal/RecentActivity.jsx';
import BackgroundEffects from './common/BackgroundEffects.jsx';

import { 
  clienteService, 
  empleadoService, 
  productoService, 
  facturaService 
} from '../services';


export default function Dashboard() {
  // Estados para los datos que obtendrás de la API (sin crecimiento)
  const [clientesData, setClientesData] = useState({ total: 0 });
  const [empleadosData, setEmpleadosData] = useState({ total: 0 });
  const [productosData, setProductosData] = useState({ total: 0 });
  const [ventasData, setVentasData] = useState({ total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  
  // Cargar datos desde la API
  useEffect(() => {
    const cargarData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener datos utilizando tus servicios
        const clientesResponse = await clienteService.obtenerConteo();
        const empleadosResponse = await empleadoService.getEmpleadoCount();
        const productosResponse = await productoService.getProductoCount();
        const ventasResponse = await facturaService.getVentasTotal();
        
        // Actualizar estados solo con el total, sin crecimiento
        setClientesData({
          total: clientesResponse.total || 1245
        });
        
        setEmpleadosData({
          total: empleadosResponse.total || 87
        });
        
        setProductosData({
          total: productosResponse.total || 523
        });
        
        setVentasData({
          total: ventasResponse.total || 432000
        });
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    cargarData();
  }, []);

  return (
    <>
      <BackgroundEffects></BackgroundEffects>
      
      <Header></Header>
      
      <div className="container main-content">
        <p className="subtitle">
          Acceda a nuestras herramientas de gestión corporativa de próxima
          generación
        </p>
        <div className="holographic-display">
          <div className="holo-scanner" />
        </div>
        <div className="dashboard-layout">
          <Sidebar></Sidebar>
          <main className="main-dashboard">
            <div className="dashboard-header">
              <h2 className="panel-title">Panel de Control</h2>
              <div className="quick-actions">
                <button className="action-button">
                  <span className="action-icon">🔔</span>
                  
                </button>
                <button className="action-button">
                  <span className="action-icon">✉️</span>
                  
                </button>
              </div>
            </div>
            <div className="dashboard-cards">
              {isLoading ? (
                <div className="loading-indicator">Cargando datos...</div>
              ) : (
                <>
                  <div className="dashboard-card">
                    <div className="card-icon">👥</div>
                    <div className="card-content">
                      <h3 className="card-title">Clientes</h3>
                      <p className="card-value">{clientesData.total}</p>
                    </div>
                    <div className="card-tech-detail" />
                  </div>
                  <div className="dashboard-card">
                    <div className="card-icon">👨‍💼</div>
                    <div className="card-content">
                      <h3 className="card-title">Empleados</h3>
                      <p className="card-value">{empleadosData.total}</p>
                    </div>
                    <div className="card-tech-detail" />
                  </div>
                  <div className="dashboard-card">
                    <div className="card-icon">📦</div>
                    <div className="card-content">
                      <h3 className="card-title">Productos</h3>
                      <p className="card-value">{productosData.total}</p>
                    </div>
                    <div className="card-tech-detail" />
                  </div>
                  <div className="dashboard-card">
                    <div className="card-icon">📊</div>
                    <div className="card-content">
                      <h3 className="card-title">Ventas</h3>
                      <p className="card-value">${(ventasData.total / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="card-tech-detail" />
                  </div>
                </>
              )}
            </div>
            <div className="dashboard-panel">
              <div className="panel-header">
                <h3>Ventas Recientes</h3>
              </div>
              <RecentActivity></RecentActivity>
              <div className="panel-footer">
                <Link className="view-all" to="/ventas">
                  Ver todas las ventas
                </Link>
              </div>
            </div>
            <Grafica></Grafica>
          </main>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}