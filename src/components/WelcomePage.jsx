import React from 'react';
import '../styles/WelcomePage.css';
import Header from './common/Header';
import BackgroundEffects from './common/BackgroundEffects';
import { Link } from 'react-router-dom';
import Footer from './common/Footer';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      {/* Background Effects */}
      <BackgroundEffects />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container main-content">
        <div className="welcome-container">
          <h2 className="welcome-title">Transforma la forma en que gestionas tus Negocios</h2>

          <div className="welcome-intro">
            <p className="welcome-intro-text">
              Una solución CRM moderna diseñada para pequeñas y medianas empresas que buscan automatizar, visualizar y escalar sus procesos. Simple, rápida y poderosa.
            </p>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <h3 className="welcome-card-title">¿Qué es esta plataforma?</h3>
              <p className="card-text">
                Este sistema CRM integra un back-end robusto con una interfaz clara y eficiente. Permite gestionar clientes, generar facturas , visualizar métricas y automatizar comunicaciones sin complicaciones.
              </p>
              <p className="card-text">
                Está diseñada para ofrecer valor desde el primer día: sin curva de aprendizaje, sin complejidad innecesaria, y con todo lo que una pyme necesita.
              </p>
            </div>

            <div className="info-card">
              <h3 className="welcome-card-title">Beneficios clave</h3>
              <ul className="card-list">

                <li className="card-list-item">Toda la información de tus clientes,productos,empleados y ventas en un solo lugar</li>
                <li className="card-list-item">Informes en PDF con diseño profesional</li>
                <li className="card-list-item">Análisis de datos y gráficos dinámicos en tiempo real</li>
                <li className="card-list-item">Filtros inteligentes y búsqueda avanzada</li>
                <li className="card-list-item">Envío automático de correos con ofertas</li>
    
              </ul>
            </div>

            <div className="info-card">
              <h3 className="welcome-card-title">Tecnologías que impulsan esta solución</h3>
              <p className="card-text">Arquitectura moderna basada en:</p>
              <div className="tech-list">

                <span className="tech-badge">Java</span>
                <span className="tech-badge">Spring Boot</span>
                <span className="tech-badge">React</span>
                <span className="tech-badge">Axios</span>
                <span className="tech-badge">JPA / Hibernate</span>
                <span className="tech-badge">MySQL</span>
                <span className="tech-badge">iText (PDF)</span>
                
              </div>
            </div>
          </div>

          <div className="welcome-action">
            <Link to="/index" className="dashboard-btn">
              Probar el Panel <span className="arrow-icon">→</span>
            </Link>
          </div>

          <div className="welcome-footer">
            <p>Una solución construida con visión empresarial y tecnología actual</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WelcomePage;
