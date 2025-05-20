import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { empleadoService } from '../services';
import '../styles/styles.css';
import '../styles/empleados.css';
import Header from './common/Header.jsx';
import Footer from './common/Footer.jsx';
import BackgroundEffects from './common/BackgroundEffects.jsx';
import NavBar2 from './common/NavBar.jsx';
import PanelInfoEmpleados from './empleados/PanelInfoEmpleados.jsx';
import PanelLateralEmpleados from './empleados/PanelLateralEmpleados.jsx';

export default function Empleados() {
  // Estados para los datos principales
  const [empleados, setEmpleados] = useState([]);
  const [empleadoStats, setEmpleadoStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeForm, setActiveForm] = useState("main-content");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para los diferentes formularios
  const [detallesId, setDetallesId] = useState("");
  const [detallesEmpleado, setDetallesEmpleado] = useState(null);
  const [idActualizar, setIdActualizar] = useState("");
  const [empleadoActualizar, setEmpleadoActualizar] = useState(null);
  const [idRol, setIdRol] = useState("");
  const [nuevoRol, setNuevoRol] = useState("");
  
  // Datos iniciales para nuevo empleado
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    rol: "",
    password: "",
    activo: true
  });

  // Cargo los datos cuando se monta el componente
  useEffect(() => {
    cargarDatos();
  }, []);
  
  // Función para cargar empleados y estadísticas
  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      
      // Primero cargo los empleados
      const empleadosData = await empleadoService.listarEmpleados();
      setEmpleados(empleadosData);
      
      // Luego las estadísticas
      const statsData = await empleadoService.getEmpleadoCount();
      setEmpleadoStats({
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
  
  // Buscar empleados que coincidan con el término
  const handleBuscarEmpleado = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setIsLoading(true);
      const resultados = await empleadoService.buscarEmpleado(searchTerm);
      setEmpleados(resultados);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Ver detalles de un empleado por ID
  const handleBuscarDetalles = async () => {
    if (!detallesId) return;
    
    try {
      const empleado = await empleadoService.verDetalles(detallesId);
      setDetallesEmpleado(empleado);
    } catch (error) {
      console.error('Error al obtener detalles:', error);
    }
  };
  
  // Cargar empleado para edición
  const handleCargarEmpleado = async () => {
    if (!idActualizar) return;
    
    try {
      const empleado = await empleadoService.verDetalles(idActualizar);
      setEmpleadoActualizar(empleado);
    } catch (error) {
      console.error('Error al cargar empleado:', error);
    }
  };
  
  // Agregar un nuevo empleado
  const handleAgregarEmpleado = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await empleadoService.agregarEmpleado(nuevoEmpleado);
      
      // Recargo la lista
      const empleadosData = await empleadoService.listarEmpleados();
      setEmpleados(empleadosData);
      
      // Limpio el formulario
      setNuevoEmpleado({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        rol: "",
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
  
  // Actualizar un empleado existente
  const handleActualizarEmpleado = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Solo envío los campos que quiero actualizar
      const datosActualizar = {
        nombre: empleadoActualizar.nombre,
        apellido: empleadoActualizar.apellido,
        email: empleadoActualizar.email,
        telefono: empleadoActualizar.telefono,
        rol: empleadoActualizar.rol,
        activo: empleadoActualizar.activo
      };
      
      await empleadoService.actualizarEmpleado(empleadoActualizar.id, datosActualizar);
      
      // Recargo los empleados
      const empleadosData = await empleadoService.listarEmpleados();
      setEmpleados(empleadosData);
      
      setActiveForm("main-content");
    } catch (error) {
      console.error('Error al actualizar:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Asignar un nuevo rol a un empleado
  const handleAsignarRol = async () => {
    if (!idRol || !nuevoRol) return;
    
    try {
      setIsLoading(true);
      await empleadoService.asignarRol(idRol, nuevoRol);
      
      // Recargo los datos
      const empleadosData = await empleadoService.listarEmpleados();
      setEmpleados(empleadosData);
      
      setActiveForm("main-content");
    } catch (error) {
      console.error('Error al asignar rol:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Eliminar un empleado
  const handleEliminarEmpleado = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este empleado?')) return;
    
    try {
      setIsLoading(true);
      await empleadoService.eliminarEmpleado(id);
      
      // Recargo la lista y las estadísticas
      const empleadosData = await empleadoService.listarEmpleados();
      setEmpleados(empleadosData);
      
      const statsData = await empleadoService.getEmpleadoCount();
      setEmpleadoStats({
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
        <h2 className="subtitle">GESTIÓN DE EMPLEADOS - Sistema avanzado de administración de personal</h2>
        
        <NavBar2></NavBar2>
        
        <PanelInfoEmpleados
          empleadoStats={empleadoStats}
          isLoading={isLoading}
        />
        
        <div className="employee-panel">
          <PanelLateralEmpleados
            onAgregarClick={() => setActiveForm("form-agregar")}
            onListarTodosClick={async () => {
              setIsLoading(true);
              const data = await empleadoService.listarEmpleados();
              setEmpleados(data);
              setActiveForm("main-content");
              setIsLoading(false);
            }}
            onBuscarClick={() => setActiveForm("main-content")}
            onActualizarClick={() => setActiveForm("form-actualizar")}
            onDetallesClick={() => setActiveForm("form-detalles")}
            onAsignarRolClick={() => setActiveForm("form-asignar-rol")}
          />
          
          {/* Vista principal - Listado de empleados */}
          {activeForm === "main-content" && (
            <div className="content-area">
              <div className="search-box">
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Buscar empleado por nombre o apellido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  className="search-button"
                  onClick={handleBuscarEmpleado}
                >
                  Buscar
                </button>
              </div>
              
              <div className="employee-table-container">
                {isLoading ? (
                  <div className="loading">Cargando empleados...</div>
                ) : (
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empleados.length > 0 ? (
                        empleados.map(empleado => (
                          <tr key={empleado.id}>
                            <td>{empleado.id}</td>
                            <td>{empleado.nombre}</td>
                            <td>{empleado.apellido}</td>
                            <td>{empleado.email}</td>
                            <td>{empleado.telefono}</td>
                            <td>{empleado.rol}</td>
                            <td>
                              <span className={`status-badge ${empleado.activo ? 'active' : 'inactive'}`}>
                                {empleado.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td className="action-buttons">
                              <button 
                                className="btn-action btn-view"
                                onClick={() => {
                                  setIdActualizar(empleado.id);
                                  setEmpleadoActualizar(empleado);
                                  setActiveForm("form-actualizar");
                                }}
                                title="Editar empleado"
                              >
                                <i className="fas fa-edit"></i> Editar
                              </button>
                              <button 
                                className="btn-action btn-delete"
                                onClick={() => handleEliminarEmpleado(empleado.id)}
                                title="Eliminar empleado"
                              >
                                <i className="fas fa-trash"></i> Eliminar
                              </button>
                              <button 
                                className="btn-action btn-info"
                                onClick={() => {
                                  setDetallesId(empleado.id);
                                  setDetallesEmpleado(empleado);
                                  setActiveForm("form-detalles");
                                }}
                                title="Ver detalles"
                              >
                                <i className="fas fa-eye"></i> Detalles
                              </button>
                              <button 
                                className={`btn-action ${empleado.activo ? 'btn-deactivate' : 'btn-activate'}`}
                                onClick={async () => {
                                  try {
                                    setIsLoading(true);
                                    
                                    // Usando la función específica para cambiar estado
                                    await empleadoService.alternarEstado(empleado.id);
                                    
                                    // Actualizo la UI sin recargar todo
                                    const empleadosActualizados = empleados.map(e => {
                                      if (e.id === empleado.id) {
                                        return { ...e, activo: !e.activo };
                                      }
                                      return e;
                                    });
                                    
                                    setEmpleados(empleadosActualizados);
                                    
                                    // Actualizo las estadísticas
                                    const statsData = await empleadoService.getEmpleadoCount();
                                    setEmpleadoStats({
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
                                title={empleado.activo ? "Desactivar empleado" : "Activar empleado"}
                              >
                                <i className={`fas ${empleado.activo ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i> 
                                {empleado.activo ? 'Desactivar' : 'Activar'}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="no-data">No se encontraron empleados</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          
          {/* Formulario para agregar empleado */}
          {activeForm === "form-agregar" && (
            <div className="content-area">
              <h3 className="panel-title">Agregar Nuevo Empleado</h3>
              
              <div className="form-container">
                <form onSubmit={handleAgregarEmpleado}>
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={nuevoEmpleado.nombre}
                      onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, nombre: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellido</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={nuevoEmpleado.apellido}
                      onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, apellido: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={nuevoEmpleado.email}
                      onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={nuevoEmpleado.telefono}
                      onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, telefono: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rol</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={nuevoEmpleado.rol}
                      onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, rol: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contraseña</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      value={nuevoEmpleado.password}
                      onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, password: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={nuevoEmpleado.activo}
                        onChange={(e) => setNuevoEmpleado({...nuevoEmpleado, activo: e.target.checked})}
                      />
                      <span className="checkbox-text">Empleado Activo</span>
                    </label>
                  </div>
                  <button type="submit" className="submit-btn">Guardar Empleado</button>
                </form>
                
                <button 
                  type="button" 
                  className="nav-back" 
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveForm("main-content");
                  }}
                >
                  ← Volver al listado
                </button>
              </div>
            </div>
          )}
          
          {/* Formulario para actualizar empleado */}
          {activeForm === "form-actualizar" && (
            <div className="content-area">
              <h3 className="panel-title">Actualizar Empleado</h3>
              
              <div className="form-container">
                {!empleadoActualizar ? (
                  <div>
                    <div className="form-group">
                      <label className="form-label">ID del Empleado</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={idActualizar}
                        onChange={(e) => setIdActualizar(e.target.value)}
                        required 
                      />
                      <button 
                        className="submit-btn" 
                        onClick={handleCargarEmpleado}
                        style={{marginTop: '10px'}}
                      >
                        Cargar Empleado
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleActualizarEmpleado}>
                    <div className="form-group">
                      <label className="form-label">Nombre</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={empleadoActualizar.nombre}
                        onChange={(e) => setEmpleadoActualizar({...empleadoActualizar, nombre: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Apellido</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={empleadoActualizar.apellido}
                        onChange={(e) => setEmpleadoActualizar({...empleadoActualizar, apellido: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        value={empleadoActualizar.email}
                        onChange={(e) => setEmpleadoActualizar({...empleadoActualizar, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Teléfono</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        value={empleadoActualizar.telefono}
                        onChange={(e) => setEmpleadoActualizar({...empleadoActualizar, telefono: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Rol</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={empleadoActualizar.rol}
                        onChange={(e) => setEmpleadoActualizar({...empleadoActualizar, rol: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Estado</label>
                      <select 
                        className="form-input" 
                        value={empleadoActualizar.activo.toString()}
                        onChange={(e) => setEmpleadoActualizar({
                          ...empleadoActualizar, 
                          activo: e.target.value === "true"
                        })}
                      >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </select>
                    </div>
                    <button type="submit" className="submit-btn">Actualizar Empleado</button>
                  </form>
                )}
                
                <button 
                  type="button" 
                  className="nav-back" 
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveForm("main-content");
                    setEmpleadoActualizar(null);
                  }}
                >
                  ← Volver al listado
                </button>
              </div>
            </div>
          )}
          
          {/* Detalles del empleado */}
          {activeForm === "form-detalles" && (
            <div className="content-area">
              <h3 className="panel-title">Detalles del Empleado</h3>
              
              <div className="form-container">
                {!detallesEmpleado ? (
                  <div className="form-group">
                    <label className="form-label">ID del Empleado</label>
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
                  <div className="employee-details">
                    <h3>{`${detallesEmpleado.nombre} ${detallesEmpleado.apellido}`}</h3>
                    <div className="detail-row">
                      <div className="detail-label">ID:</div>
                      <div className="detail-value">{detallesEmpleado.id}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Nombre:</div>
                      <div className="detail-value">{detallesEmpleado.nombre}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Apellido:</div>
                      <div className="detail-value">{detallesEmpleado.apellido}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Email:</div>
                      <div className="detail-value">{detallesEmpleado.email}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Teléfono:</div>
                      <div className="detail-value">{detallesEmpleado.telefono}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Rol:</div>
                      <div className="detail-value">{detallesEmpleado.rol}</div>
                    </div>
                    <div className="detail-row">
                      <div className="detail-label">Estado:</div>
                      <div className="detail-value">
                        <span className={`status-badge ${detallesEmpleado.activo ? 'active' : 'inactive'}`}>
                          {detallesEmpleado.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <button 
                  type="button" 
                  className="nav-back" 
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveForm("main-content");
                    setDetallesEmpleado(null);
                  }}
                >
                  ← Volver al listado
                </button>
              </div>
            </div>
          )}
          
          {/* Formulario para asignar rol */}
          {activeForm === "form-asignar-rol" && (
            <div className="content-area">
              <h3 className="panel-title">Asignar Rol a Empleado</h3>
              
              <div className="form-container">
                <div className="form-group">
                  <label className="form-label">ID del Empleado</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={idRol}
                    onChange={(e) => setIdRol(e.target.value)}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nuevo Rol</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={nuevoRol}
                    onChange={(e) => setNuevoRol(e.target.value)}
                    required 
                  />
                </div>
                <button 
                  className="submit-btn" 
                  onClick={handleAsignarRol}
                >
                  Asignar Rol
                </button>
                
                <button 
                  type="button" 
                  className="nav-back" 
                  onClick={(e) => {
                    e.preventDefault();
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