import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clienteService } from '../services';
import '../styles/styles.css';
import '../styles/clientes.css';
import Header from './common/Header.jsx';
import Footer from './common/Footer.jsx';
import BackgroundEffects from './common/BackgroundEffects.jsx';
import NavBar2 from './common/NavBar.jsx';
import PanelInfoClientes from './clientes/PanelInfoClientes.jsx';
import PanelControlLateralCliente from './clientes/PanelLateralCliente.jsx';

export default function Clientes() {
  // Estados para datos de clientes
  const [clientes, setClientes] = useState([]);
  const [clientesStats, setClientesStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0
  });
  
  // Estados para UI
  const [isLoading, setIsLoading] = useState(true);
  const [activeForm, setActiveForm] = useState("main-content");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para formularios
  const [detallesId, setDetallesId] = useState("");
  const [detallesCliente, setDetallesCliente] = useState(null);
  const [idActualizar, setIdActualizar] = useState("");
  const [clienteActualizar, setClienteActualizar] = useState(null);
  const [idOferta, setIdOferta] = useState("");
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
    activo: true
  });

  // Carga datos iniciales
  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      
      // Carga clientes y estadísticas
      const clientesData = await clienteService.listarClientes();
      setClientes(clientesData);
      
      const statsData = await clienteService.obtenerConteo();
      setClientesStats({
        total: statsData.total || 0,
        activos: statsData.activos || 0,
        inactivos: statsData.inactivos || 0
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto inicial
  useEffect(() => {
    cargarDatos();
  }, []);
  
  // Búsqueda de clientes
  const handleBuscarCliente = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setIsLoading(true);
      const resultados = await clienteService.buscarCliente(searchTerm);
      setClientes(resultados);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función para cargar detalles
  const handleBuscarDetalles = async () => {
    if (!detallesId) return;
    
    try {
      const cliente = await clienteService.verDetalles(detallesId);
      setDetallesCliente(cliente);
    } catch (error) {
      console.error('Error en detalles:', error);
    }
  };
  
  // Función para cargar cliente a actualizar
  const handleCargarCliente = async () => {
    if (!idActualizar) return;
    
    try {
      const cliente = await clienteService.verDetalles(idActualizar);
      setClienteActualizar(cliente);
    } catch (error) {
      console.error('Error al cargar cliente:', error);
    }
  };
  
  // Agregar cliente
  const handleAgregarCliente = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await clienteService.agregarCliente(nuevoCliente);
      
      // Recargar lista
      const clientesData = await clienteService.listarClientes();
      setClientes(clientesData);
      
      // Limpiar formulario
      setNuevoCliente({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        password: "",
        activo: true
      });
      
      setActiveForm("main-content");
    } catch (error) {
      console.error('Error al agregar:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Actualizar cliente
  const handleActualizarCliente = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await clienteService.actualizarCliente(clienteActualizar.id, clienteActualizar);
      
      // Recargar lista
      const clientesData = await clienteService.listarClientes();
      setClientes(clientesData);
      
      setActiveForm("main-content");
    } catch (error) {
      console.error('Error al actualizar:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Enviar oferta a cliente
  const handleEnviarOferta = async () => {
    if (!idOferta) return;
    
    try {
      setIsLoading(true);
      await clienteService.enviarOferta(idOferta);
      setActiveForm("main-content");
    } catch (error) {
      console.error('Error en oferta:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Eliminar cliente
  const handleEliminarCliente = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este cliente?')) return;
    
    try {
      setIsLoading(true);
      await clienteService.eliminarCliente(id);
      
      // Recargar lista y estadísticas
      const clientesData = await clienteService.listarClientes();
      setClientes(clientesData);
      
      const statsData = await clienteService.obtenerConteo();
      setClientesStats({
        total: statsData.total || 0,
        activos: statsData.activos || 0,
        inactivos: statsData.inactivos || 0
      });
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se puede eliminar por integridad de datos. Revisa la sección "Información del sistema" en el dashboard principal para más detalles.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BackgroundEffects></BackgroundEffects>
      <Header></Header>

      <div className="container main-content">
        <h2 className="subtitle">GESTIÓN DE CLIENTES - Sistema avanzado de administración y seguimiento</h2>
        
        <NavBar2></NavBar2>
        
        <PanelInfoClientes 
          stats={clientesStats} 
          isLoading={isLoading} 
        />
        
        <div className="client-panel">
          <PanelControlLateralCliente 
            onAgregarClick={() => setActiveForm("form-agregar")}
            onListarTodosClick={async () => {
              setIsLoading(true);
              const data = await clienteService.listarClientes();
              setClientes(data);
              setActiveForm("main-content");
              setIsLoading(false);
            }}
            onBuscarClick={() => setActiveForm("main-content")}
            onActualizarClick={() => setActiveForm("form-actualizar")}
            onDetallesClick={() => setActiveForm("form-detalles")}
            onOfertaClick={() => setActiveForm("form-oferta")}
          />
          
          {activeForm === "main-content" && (
            <div className="content-area">
              <div className="search-box">
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Buscar cliente por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  className="search-button"
                  onClick={handleBuscarCliente}
                >
                  Buscar
                </button>
              </div>
              
              <div className="client-table-container">
                {isLoading ? (
                  <div className="loading">Cargando clientes...</div>
                ) : (
                  <table className="client-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientes.length > 0 ? (
                        clientes.map(cliente => (
                          <tr key={cliente.id}>
                            <td>{cliente.id}</td>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.telefono}</td>
                            <td>
                              <span className={`status-badge ${cliente.activo ? 'active' : 'inactive'}`}>
                                {cliente.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td className="action-buttons">
                              <button 
                                className="btn-action btn-view"
                                onClick={() => {
                                  setIdActualizar(cliente.id);
                                  setClienteActualizar(cliente);
                                  setActiveForm("form-actualizar");
                                }}
                                title="Editar cliente"
                              >
                                <i className="fas fa-edit"></i> Editar
                              </button>
                              <button 
                                className="btn-action btn-delete"
                                onClick={() => handleEliminarCliente(cliente.id)}
                                title="Eliminar cliente"
                              >
                                <i className="fas fa-trash"></i> Eliminar
                              </button>
                              <button 
                                className="btn-action btn-info"
                                onClick={() => {
                                  setDetallesId(cliente.id);
                                  setDetallesCliente(cliente);
                                  setActiveForm("form-detalles");
                                }}
                                title="Ver detalles"
                              >
                                <i className="fas fa-eye"></i> Detalles
                              </button>
                              <button 
                                className={`btn-action ${cliente.activo ? 'btn-deactivate' : 'btn-activate'}`}
                                onClick={async () => {
                                  try {
                                    setIsLoading(true);

                                    // Cambiar estado
                                    const clienteActualizado = {...cliente, activo: !cliente.activo};
                                    await clienteService.actualizarCliente(cliente.id, clienteActualizado);

                                    // Actualizar UI localmente
                                    const clientesActualizados = clientes.map(c => {
                                      if (c.id === cliente.id) {
                                        return { ...c, activo: !c.activo };
                                      }
                                      return c;
                                    });

                                    setClientes(clientesActualizados);

                                    // Actualizar estadísticas
                                    const statsData = await clienteService.obtenerConteo();
                                    setClientesStats({
                                      total: statsData.total || 0,
                                      activos: statsData.activos || 0,
                                      inactivos: statsData.inactivos || 0
                                    });
                                  } catch (error) {
                                    console.error('Error al cambiar estado:', error);
                                  } finally {
                                    setIsLoading(false);
                                  }
                                }}
                                title={cliente.activo ? "Desactivar cliente" : "Activar cliente"}
                              >
                                <i className={`fas ${cliente.activo ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i> 
                                {cliente.activo ? 'Desactivar' : 'Activar'}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="no-data">No se encontraron clientes</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          
          {activeForm === "form-agregar" && (
            <div className="content-area">
              <h3 className="panel-title">Agregar Nuevo Cliente</h3>
              
              <div className="form-container">
                <form onSubmit={handleAgregarCliente}>
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={nuevoCliente.nombre}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellido</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={nuevoCliente.apellido}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, apellido: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={nuevoCliente.email}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={nuevoCliente.telefono}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dirección</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={nuevoCliente.direccion}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, direccion: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contraseña</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      value={nuevoCliente.password}
                      onChange={(e) => setNuevoCliente({...nuevoCliente, password: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={nuevoCliente.activo}
                        onChange={(e) => setNuevoCliente({...nuevoCliente, activo: e.target.checked})}
                      />
                      <span className="checkbox-text">Cliente Activo</span>
                    </label>
                  </div>
                  <button type="submit" className="submit-btn">Guardar Cliente</button>
                </form>
                
                <button 
                  type="button" 
                  className="nav-back" 
                  onClick={() => setActiveForm("main-content")}
                >
                  ← Volver al listado
                </button>
              </div>
            </div>
          )}
          
          {activeForm === "form-actualizar" && (
            <div className="content-area">
              <h3 className="panel-title">Actualizar Cliente</h3>
              
              <div className="form-container">
                {!clienteActualizar ? (
                  <div>
                    <div className="form-group">
                      <label className="form-label">ID del Cliente</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={idActualizar}
                        onChange={(e) => setIdActualizar(e.target.value)}
                        required 
                      />
                      <button 
                        className="submit-btn" 
                        onClick={handleCargarCliente}
                        style={{marginTop: '10px'}}
                      >
                        Cargar Cliente
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleActualizarCliente}>
                    <div className="form-group">
                      <label className="form-label">Nombre</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={clienteActualizar.nombre}
                        onChange={(e) => setClienteActualizar({...clienteActualizar, nombre: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        value={clienteActualizar.email}
                        onChange={(e) => setClienteActualizar({...clienteActualizar, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Teléfono</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        value={clienteActualizar.telefono}
                        onChange={(e) => setClienteActualizar({...clienteActualizar, telefono: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Dirección</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={clienteActualizar.direccion}
                        onChange={(e) => setClienteActualizar({...clienteActualizar, direccion: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Estado</label>
                      <select 
                        className="form-input" 
                        value={clienteActualizar.activo.toString()}
                        onChange={(e) => setClienteActualizar({
                          ...clienteActualizar, 
                          activo: e.target.value === "true"
                        })}
                      >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </select>
                    </div>
                    <button type="submit" className="submit-btn">Actualizar Cliente</button>
                  </form>
                )}
                
                <button 
                  type="button" 
                  className="nav-back" 
                  onClick={() => {
                    setActiveForm("main-content");
                    setClienteActualizar(null);
                  }}
                >
                  ← Volver al listado
                </button>
              </div>
            </div>
          )}
          
          {activeForm === "form-detalles" && (
            <div className="content-area">
              <h3 className="panel-title">Detalles del Cliente</h3>
              
              <div className="form-container">
                {!detallesCliente ? (
                  <div className="form-group">
                    <label className="form-label">ID del Cliente</label>
                    <div className="search-box">
                      <input 
                        type="number" 
                        className="search-input" 
                        value={detallesId}
                        onChange={(e) => setDetallesId(e.target.value)}
                        required 
                      />
                      <button 
                        className="search-button" 
                        onClick={handleBuscarDetalles}
                      >
                        Buscar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="client-details">
                    <h3>{detallesCliente.nombre}</h3>
                    <div className="detail-row">
                      <div className="detail-label">ID:</div>
                      <div className="detail-value">{detallesCliente.id}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Email:</div>
                      <div className="detail-value">{detallesCliente.email}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Teléfono:</div>
                      <div className="detail-value">{detallesCliente.telefono}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Dirección:</div>
                      <div className="detail-value">{detallesCliente.direccion}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Estado:</div>
                      <div className="detail-value">
                        <span className={`status-badge ${detallesCliente.activo ? 'active' : 'inactive'}`}>
                          {detallesCliente.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <button 
                  type="button" 
                  className="nav-back" 
                  onClick={() => {
                    setActiveForm("main-content");
                    setDetallesCliente(null);
                  }}
                >
                  ← Volver al listado
                </button>
              </div>
            </div>
          )}
          
          {activeForm === "form-oferta" && (
            <div className="content-area">
              <h3 className="panel-title">Enviar Oferta a Cliente</h3>
              
              <div className="form-container">
                <div className="form-group">
                  <label className="form-label">ID del Cliente</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={idOferta}
                    onChange={(e) => setIdOferta(e.target.value)}
                    required 
                  />
                </div>
                <button 
                  className="submit-btn" 
                  onClick={handleEnviarOferta}
                >
                  Enviar Oferta
                </button>
                
                <button 
                  type="button" 
                  className="nav-back" 
                  onClick={() => {
                    setActiveForm("main-content");
                  }}
                >
                  ← Volver al listado
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}