import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productoService } from '../services';
import '../styles/styles.css';
import '../styles/productos.css';
import Header from './common/Header.jsx';
import Footer from './common/Footer.jsx';
import BackgroundEffects from './common/BackgroundEffects.jsx';
import NavBar2 from './common/NavBar.jsx';
import PanelInfoProductos from './productos/PanelInfoProductos.jsx';
import PanelLateralProductos from './productos/PanelLateralProductos.jsx';

export default function Productos() {
  // Estados para los datos principales
  const [productos, setProductos] = useState([]);
  const [productosStats, setProductosStats] = useState({
    total: 0,
    activos: 0,
    stockTotal: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeForm, setActiveForm] = useState("main-content");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estados para los formularios
  const [idActualizar, setIdActualizar] = useState("");
  const [productoActualizar, setProductoActualizar] = useState(null);
  const [idInventario, setIdInventario] = useState("");
  const [cantidadInventario, setCantidadInventario] = useState(1);
  const [agregarStock, setAgregarStock] = useState(true);
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(1000);
  
  // Estado para nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    activo: true
  });

  // Cargo todos los datos cuando se monta el componente
  useEffect(() => {
    cargarDatos();
  }, []);
  
  // Función para cargar datos iniciales
  const cargarDatos = async () => {
    try {
      setIsLoading(true);
      
      // Primero cargo la lista de productos
      const productosData = await productoService.listarProductos();
      setProductos(productosData);
      
      // Luego cargo las estadísticas
      const statsData = await productoService.getProductoCount();
      
      // Calculo el stock total sumando el stock de cada producto
      let stockTotal = 0;
      productosData.forEach(producto => {
        stockTotal += producto.stock || 0;
      });
      
      setProductosStats({
        total: statsData.total || 0,
        activos: statsData.activos || 0,
        stockTotal: stockTotal
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Buscar productos por nombre
  const handleBuscarProducto = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setIsLoading(true);
      const resultados = await productoService.buscarProducto(searchTerm);
      setProductos(resultados);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar un producto para editarlo
  const handleCargarProducto = async () => {
    if (!idActualizar) return;
    
    try {
      // Busco el producto por ID entre los que ya tengo cargados
      const producto = productos.find(p => p.id == idActualizar);
      
      if (producto) {
        setProductoActualizar(producto);
      } else {
        console.error('Producto no encontrado');
      }
    } catch (error) {
      console.error('Error al cargar producto:', error);
    }
  };
  
  // Agregar un nuevo producto
  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await productoService.agregarProducto(nuevoProducto);
      
      // Recargo todos los datos
      await cargarDatos();
      
      // Limpio el formulario
      setNuevoProducto({
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        activo: true
      });
      
      setActiveForm("main-content");
    } catch (error) {
      console.error('Error al agregar producto:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cambiar el estado del producto (activar/desactivar)
  const handleToggleEstadoProducto = async (producto) => {
    try {
      setIsLoading(true);
      // Cambio el estado actual por su opuesto
      const nuevoEstado = !producto.activo;
      
      await productoService.actualizarProducto(producto.id, { activo: nuevoEstado });
      
      // Actualizo la lista sin recargar todo
      const productosActualizados = productos.map(p => {
        if (p.id === producto.id) {
          return { ...p, activo: nuevoEstado };
        }
        return p;
      });
      
      setProductos(productosActualizados);
      
      // Actualizo solo la estadística de activos
      const statsData = await productoService.getProductoCount();
      setProductosStats({
        ...productosStats,
        activos: statsData.activos || 0,
      });
      
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Actualizar un producto existente
  const handleActualizarProducto = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await productoService.actualizarProducto(productoActualizar.id, productoActualizar);
      
      // Recargo todos los datos
      await cargarDatos();
      
      setActiveForm("main-content");
      setProductoActualizar(null);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gestionar inventario (agregar o quitar stock)
  const handleGestionarInventario = async () => {
    if (!idInventario || cantidadInventario <= 0) {
      console.error('ID inválido o cantidad menor o igual a 0');
      return;
    }
    
    try {
      setIsLoading(true);
      
      await productoService.gestionarInventario(idInventario, cantidadInventario, agregarStock);
      
      // Recargo la lista de productos
      const productosData = await productoService.listarProductos();
      setProductos(productosData);
      
      // Actualizo el stock total
      let stockTotal = 0;
      productosData.forEach(producto => {
        stockTotal += producto.stock || 0;
      });
      
      setProductosStats({
        ...productosStats,
        stockTotal: stockTotal
      });
      
      setActiveForm("main-content");
      
      // Limpio los campos
      setIdInventario("");
      setCantidadInventario(1);
    } catch (error) {
      console.error('Error al actualizar inventario:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filtrar productos por rango de precio
  const handleFiltrarPorPrecio = async () => {
    if (precioMin < 0 || precioMax <= precioMin) {
      console.error('Rango de precios inválido');
      return;
    }
    
    try {
      setIsLoading(true);
      const resultados = await productoService.filtrarPorPrecio(precioMin, precioMax);
      setProductos(resultados);
      
      setActiveForm("main-content");
    } catch (error) {
      console.error('Error al filtrar por precio:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mostrar productos más vendidos
  const handleMostrarMasVendidos = async () => {
    try {
      setIsLoading(true);
      
      const respuesta = await productoService.productosMasVendidos(true);
      console.log("Productos más vendidos:", respuesta);
      
      if (!respuesta || respuesta.length === 0) {
        console.log('No hay productos vendidos para mostrar');
        setIsLoading(false);
        return;
      }
      
      // Formateo los productos añadiendo la info de ventas
      const productosFormateados = respuesta.map(item => {
        if (Array.isArray(item) && item.length >= 2) {
          const producto = item[0]; // El producto
          const cantidadVendida = item[1]; // Cantidad vendida
          
          return {
            ...producto,
            cantidadVendida: cantidadVendida
          };
        }
        return item[0] || { 
          id: 0, 
          nombre: "Desconocido", 
          descripcion: "", 
          precio: 0, 
          stock: 0, 
          activo: true,
          cantidadVendida: 0
        };
      });
      
      setProductos(productosFormateados);
    } catch (error) {
      console.error('Error al obtener productos más vendidos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mostrar productos con baja existencia
  const handleMostrarBajaExistencia = async () => {
    try {
      setIsLoading(true);
      const bajaExistencia = await productoService.productosBajaExistencia();
      setProductos(bajaExistencia);
    } catch (error) {
      console.error('Error al obtener productos con baja existencia:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Eliminar un producto
  const handleEliminarProducto = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;
    
    try {
      setIsLoading(true);
      await productoService.eliminarProducto(id);
      
      // Recargo todos los datos después de eliminar
      await cargarDatos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
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
        <h2 className="subtitle">GESTIÓN DE PRODUCTOS - Sistema avanzado de inventario y catálogo</h2>
        
        <NavBar2></NavBar2>
        
        <PanelInfoProductos
          productosStats={productosStats}
        />
        
        <div className="product-panel">
          <PanelLateralProductos 
            onAgregarClick={() => setActiveForm("form-agregar")}
            onListarTodosClick={async () => {
              setIsLoading(true);
              const data = await productoService.listarProductos();
              setProductos(data);
              setActiveForm("main-content");
              setIsLoading(false);
            }}
            onActualizarClick={() => setActiveForm("form-actualizar")}
            onFiltrarPrecioClick={() => setActiveForm("form-filtrar-precio")}
            onMostrarMasVendidosClick={handleMostrarMasVendidos}
            onMostrarBajaExistenciaClick={handleMostrarBajaExistencia}
          />
          
          {/* Listado principal de productos */}
          {activeForm === "main-content" && (
            <div className="content-area">
              <div className="search-box">
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Buscar producto por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  className="search-button"
                  onClick={handleBuscarProducto}
                >
                  Buscar
                </button>
              </div>
              
              <div className="product-table-container">
                {isLoading ? (
                  <div className="loading">Cargando productos...</div>
                ) : (
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        {/* Muestro columna de ventas solo si hay datos */}
                        {productos.some(p => p.cantidadVendida !== undefined) && <th>Ventas</th>}
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.length > 0 ? (
                        productos.map(producto => (
                          <tr key={producto.id}>
                            <td>{producto.id}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.descripcion}</td>
                            <td>${producto && producto.precio !== undefined ? producto.precio.toLocaleString() : '0.00'}</td>
                            <td>{producto.stock}</td>
                            {/* Muestro celda de ventas solo si hay datos */}
                            {productos.some(p => p.cantidadVendida !== undefined) && 
                              <td>{producto.cantidadVendida !== undefined ? producto.cantidadVendida : '-'}</td>
                            }
                            <td>
                              <span className={`status-badge ${producto.activo ? 'active' : 'inactive'}`}>
                                {producto.activo ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td className="action-buttons">
                              <button 
                                className="btn-action btn-view"
                                onClick={() => {
                                  setIdActualizar(producto.id);
                                  setProductoActualizar(producto);
                                  setActiveForm("form-actualizar");
                                }}
                                title="Editar producto"
                              >
                                <i className="fas fa-edit"></i> Editar
                              </button>
                              <button 
                                className="btn-action btn-delete"
                                onClick={() => handleEliminarProducto(producto.id)}
                                title="Eliminar producto"
                              >
                                <i className="fas fa-trash"></i> Eliminar
                              </button>
                              <button 
                                className={`btn-action ${producto.activo ? 'btn-deactivate' : 'btn-activate'}`}
                                onClick={() => handleToggleEstadoProducto(producto)}
                                title={producto.activo ? "Desactivar producto" : "Activar producto"}
                              >
                                <i className={`fas ${producto.activo ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i> 
                                {producto.activo ? 'Desactivar' : 'Activar'}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={productos.some(p => p.cantidadVendida !== undefined) ? 8 : 7} className="no-data">
                            No se encontraron productos
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Formulario para agregar producto */}
          {activeForm === "form-agregar" && (
            <div className="content-area">
              <h3 className="panel-title">Agregar Nuevo Producto</h3>

              <div className="form-container">
                <form onSubmit={handleAgregarProducto}>
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={nuevoProducto.nombre}
                      onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea 
                      className="form-input" 
                      rows="3"
                      value={nuevoProducto.descripcion}
                      onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Precio</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      step="0.01" 
                      min="0"
                      value={nuevoProducto.precio}
                      onChange={(e) => setNuevoProducto({...nuevoProducto, precio: parseFloat(e.target.value)})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="0"
                      value={nuevoProducto.stock}
                      onChange={(e) => setNuevoProducto({...nuevoProducto, stock: parseInt(e.target.value)})}
                      required 
                    />
                  </div>
                  <button type="submit" className="submit-btn">Guardar Producto</button>
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
          
          {/* Formulario para actualizar producto */}
          {activeForm === "form-actualizar" && (
            <div className="content-area">
              <h3 className="panel-title">Actualizar Producto</h3>
              
              <div className="form-container">
                {!productoActualizar ? (
                  <div>
                    <div className="form-group">
                      <label className="form-label">ID del Producto</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={idActualizar}
                        onChange={(e) => setIdActualizar(e.target.value)}
                        required 
                      />
                      <button 
                        className="submit-btn" 
                        onClick={handleCargarProducto}
                        style={{marginTop: '10px'}}
                      >
                        Cargar Producto
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleActualizarProducto}>
                    <div className="form-group">
                      <label className="form-label">Nombre</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={productoActualizar.nombre}
                        onChange={(e) => setProductoActualizar({...productoActualizar, nombre: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Descripción</label>
                      <textarea 
                        className="form-input" 
                        rows="3"
                        value={productoActualizar.descripcion}
                        onChange={(e) => setProductoActualizar({...productoActualizar, descripcion: e.target.value})}
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Precio</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        step="0.01" 
                        min="0"
                        value={productoActualizar.precio}
                        onChange={(e) => setProductoActualizar({...productoActualizar, precio: parseFloat(e.target.value)})}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stock</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        min="0"
                        value={productoActualizar.stock}
                        onChange={(e) => setProductoActualizar({...productoActualizar, stock: parseInt(e.target.value)})}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Estado</label>
                      <select 
                        className="form-input" 
                        value={productoActualizar.activo.toString()}
                        onChange={(e) => setProductoActualizar({
                          ...productoActualizar, 
                          activo: e.target.value === "true"
                        })}
                      >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </select>
                    </div>
                    <button type="submit" className="submit-btn">Actualizar Producto</button>
                  </form>
                )}
                
                <button 
                  type="button" 
                  className="nav-back" 
                  onClick={() => {
                    setActiveForm("main-content");
                    setProductoActualizar(null);
                  }}
                >
                  ← Volver al listado
                </button>
              </div>
            </div>
          )}
          
          {/* Formulario para filtrar por precio */}
          {activeForm === "form-filtrar-precio" && (
            <div className="content-area">
              <h3 className="panel-title">Filtrar Productos por Precio</h3>
              
              <div className="form-container">
                <div className="form-group">
                  <label className="form-label">Precio Mínimo</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="0" 
                    step="0.01"
                    value={precioMin}
                    onChange={(e) => setPrecioMin(parseFloat(e.target.value))}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio Máximo</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="0" 
                    step="0.01"
                    value={precioMax}
                    onChange={(e) => setPrecioMax(parseFloat(e.target.value))}
                    required 
                  />
                </div>
                <button 
                  className="submit-btn"
                  onClick={handleFiltrarPorPrecio}
                >
                  Aplicar Filtro
                </button>
                
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
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}