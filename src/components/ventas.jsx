import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { facturaService, clienteService, empleadoService, productoService, detalleFacturaService } from '../services';
import '../styles/styles.css';
import '../styles/ventas.css';
import Header from './common/Header.jsx';
import Footer from './common/Footer.jsx';
import BackgroundEffects from './common/BackgroundEffects.jsx';
import NavBar2 from './common/NavBar.jsx';
import PanelInfoVentas from './ventas/PanelInfoVentas.jsx';
import PanelLateralVentas from './ventas/PanelLateralVentas.jsx'; // Corregido el import

export default function Ventas() {
  // Estados principales
  const [ventas, setVentas] = useState([]);
  const [ventasStats, setVentasStats] = useState({
    total: 0,
    ingresos: 0,
    hoy: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeForm, setActiveForm] = useState("main-content");
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para formularios específicos
  const [detalleVentaId, setDetalleVentaId] = useState("");
  const [detalleVenta, setDetalleVenta] = useState(null);
  const [ventasPorVendedorData, setVentasPorVendedorData] = useState([]);
  const [clienteVentasId, setClienteVentasId] = useState("");
  const [clienteVentas, setClienteVentas] = useState(null);
  const [clienteInfo, setClienteInfo] = useState(null);
  const [ventaDescuentoId, setVentaDescuentoId] = useState("");
  const [porcentajeDescuento, setPorcentajeDescuento] = useState(0);

  // Estados para nueva venta
  const [nuevaVenta, setNuevaVenta] = useState({
    clienteId: "",
    empleadoId: "",
    productos: [{ productoId: "", cantidad: 1 }]
  });

  // Estados para datos auxiliares
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [preciosProductos, setPreciosProductos] = useState({});
  const [totalVenta, setTotalVenta] = useState(0);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  // Función para cargar todos los datos iniciales
  const cargarDatosIniciales = async () => {
    try {
      setIsLoading(true);

      // Cargo las ventas
      const ventasData = await facturaService.listarFacturas();

      // Ya no necesitamos el Promise.all ya que no hay operaciones asíncronas
      setVentas(ventasData);

      // Cargo estadísticas
      const statsData = await facturaService.getVentasTotal();

      // Calculo ventas de hoy
      const ventasHoy = ventasData.filter(v => {
        const hoy = new Date();
        const fechaVenta = new Date(v.fecha);
        return fechaVenta.toDateString() === hoy.toDateString();
      }).length;

      setVentasStats({
        total: ventasData.length || 0,
        ingresos: statsData.total || 0,
        hoy: ventasHoy
      });
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos para formulario de nueva venta
  useEffect(() => {
    if (activeForm === "form-nueva-venta") {
      cargarDatosFormularioVenta();
    }
  }, [activeForm]);

  // Función para cargar datos del formulario de venta
  const cargarDatosFormularioVenta = async () => {
    try {
      setIsLoading(true);

      // Cargo solo los clientes ACTIVOS
      const clientesData = await clienteService.listarClientesActivos();
      setClientes(clientesData);

      // Cargo solo los empleados ACTIVOS
      const empleadosData = await empleadoService.listarEmpleadosActivos();
      setEmpleados(empleadosData);

      // Cargo solo los productos ACTIVOS
      const productosData = await productoService.listarProductosActivos();
      setProductos(productosData);

      // Creo objeto con precios para fácil acceso
      const precios = {};
      productosData.forEach(p => {
        precios[p.id] = p.precio;
      });
      setPreciosProductos(precios);
    } catch (error) {
      console.error('Error al cargar datos para formulario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular total de venta cuando cambian los productos
  useEffect(() => {
    const calcularTotal = () => {
      let total = 0;
      nuevaVenta.productos.forEach(prod => {
        if (prod.productoId && preciosProductos[prod.productoId]) {
          total += preciosProductos[prod.productoId] * prod.cantidad;
        }
      });
      setTotalVenta(total);
    };

    calcularTotal();
  }, [nuevaVenta.productos, preciosProductos]);

  // Buscar venta por ID
  const handleBuscarVenta = async () => {
    if (!searchTerm.trim()) return;

    try {
      setIsLoading(true);
      const venta = await facturaService.buscarFactura(searchTerm);

      if (venta) {



        setVentas([venta]);
      } else {
        setVentas([]);
      }
    } catch (error) {
      console.error('Error al buscar venta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar detalle de venta
  const handleVerDetalleVenta = async (id = null) => {
    const ventaId = id || detalleVentaId;
    if (!ventaId) return;

    try {
      setIsLoading(true);
      const detalleData = await facturaService.verDetalleVenta(ventaId);

      // Actualizo el ID si fue pasado como parámetro
      if (id) {
        setDetalleVentaId(id);
      }

      setDetalleVenta(detalleData);
      setActiveForm("form-detalle-venta");
    } catch (error) {
      console.error('Error al obtener detalles de venta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar ventas de un cliente
  const handleBuscarVentasCliente = async () => {
    if (!clienteVentasId) return;

    try {
      setIsLoading(true);

      // Obtengo info del cliente
      const cliente = await clienteService.verDetalles(clienteVentasId);
      setClienteInfo(cliente);

      // Obtengo sus ventas
      const ventasCliente = await facturaService.buscarFacturasPorCliente(clienteVentasId);
      setClienteVentas(ventasCliente);
    } catch (error) {
      console.error('Error al obtener ventas del cliente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Aplicar descuento a una venta
  const handleAplicarDescuento = async () => {
    if (!ventaDescuentoId || !porcentajeDescuento) return;

    try {
      setIsLoading(true);
      await facturaService.aplicarDescuento(ventaDescuentoId, porcentajeDescuento);

      // Recargo los datos
      await cargarDatosIniciales();

      setActiveForm("main-content");
    } catch (error) {
      console.error('Error al aplicar descuento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Añadir un producto a la venta
  const handleAgregarProducto = () => {
    setNuevaVenta({
      ...nuevaVenta,
      productos: [...nuevaVenta.productos, { productoId: "", cantidad: 1 }]
    });
  };

  // Eliminar un producto de la venta
  const handleEliminarProducto = (index) => {
    const updatedProductos = [...nuevaVenta.productos];
    updatedProductos.splice(index, 1);
    setNuevaVenta({
      ...nuevaVenta,
      productos: updatedProductos
    });
  };

  // Cambiar datos de un producto
  const handleProductoChange = (index, field, value) => {
    const updatedProductos = [...nuevaVenta.productos];
    updatedProductos[index][field] = value;
    setNuevaVenta({
      ...nuevaVenta,
      productos: updatedProductos
    });
  };


  // Realizar una nueva venta
  const handleRealizarVenta = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!nuevaVenta.clienteId || !nuevaVenta.empleadoId || !nuevaVenta.productos.length) {
      console.error('Faltan campos requeridos');
      return;
    }

    const productosSinSeleccionar = nuevaVenta.productos.some(p => !p.productoId);
    if (productosSinSeleccionar) {
      console.error('Seleccione todos los productos');
      return;
    }

    try {
      setIsLoading(true);

      // Preparo los datos para el servicio
      const productoIds = nuevaVenta.productos.map(p => p.productoId);
      const cantidades = nuevaVenta.productos.map(p => p.cantidad);

      // Realizo la venta
      const respuesta = await facturaService.realizarVenta(
        nuevaVenta.clienteId,
        nuevaVenta.empleadoId,
        productoIds,
        cantidades
      );

      // Si hay mensaje de error sobre stock insuficiente, mostrarlo
      if (respuesta && respuesta.includes && respuesta.includes("Stock insuficiente")) {
        alert(respuesta);
        setIsLoading(false);
        return;
      }

      // Actualización del stock en el frontend
      // 1. Recargar la lista de productos actualizada
      const productosActualizados = await productoService.listarProductos();
      setProductos(productosActualizados);

      // 2. Actualizar también la tabla de precios
      const preciosActualizados = {};
      productosActualizados.forEach(p => {
        preciosActualizados[p.id] = p.precio;
      });
      setPreciosProductos(preciosActualizados);

      // Recargo todos los datos de ventas
      await cargarDatosIniciales();

      // Reseteo el formulario
      setNuevaVenta({
        clienteId: "",
        empleadoId: "",
        productos: [{ productoId: "", cantidad: 1 }]
      });

      setActiveForm("main-content");
    } catch (error) {
      console.error('Error al realizar venta:', error);
      alert("Error al realizar la venta: " + (error.message || "Intente nuevamente"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BackgroundEffects></BackgroundEffects>
      <Header></Header>

      <div className="container main-content">
        <h2 className="subtitle">GESTIÓN DE VENTAS - Sistema avanzado de facturación y seguimiento</h2>

        <NavBar2></NavBar2>

        <PanelInfoVentas
          ventasStats={ventasStats}
        />

        <div className="sales-panel">
          <PanelLateralVentas
            onNuevaVentaClick={() => setActiveForm("form-nueva-venta")}

            onListarVentasClick={async () => {
              setIsLoading(true);
              await cargarDatosIniciales();
              setActiveForm("main-content");
              setIsLoading(false);
            }}

            onBuscarVentaClick={() => setActiveForm("main-content")}

            onVerDetalleVentaClick={() => {
              setActiveForm("form-detalle-venta");
              setDetalleVenta(null); // Resetear los datos previos
            }}

            onVentasPorClienteClick={() => setActiveForm("form-ventas-cliente")}

            onVentasPorVendedorClick={async () => {
              try {
                setIsLoading(true);
                const respuesta = await facturaService.ventasPorVendedor();
                setVentasPorVendedorData(respuesta);
                setActiveForm("ventas-por-vendedor");
              } catch (error) {
                console.error('Error al obtener ventas por vendedor:', error);
              } finally {
                setIsLoading(false);
              }
            }}

            onAplicarDescuentoClick={() => setActiveForm("form-aplicar-descuento")}

            onGenerarReporteClick={() => {
              console.log('Funcionalidad en desarrollo');
            }}
          />

          {/* Listado principal de ventas */}
          {activeForm === "main-content" && (
            <div className="content-area">
              <div className="search-box">
                <input
                  type="number"
                  className="search-input"
                  placeholder="Buscar venta por ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="search-button"
                  onClick={handleBuscarVenta}
                >
                  Buscar
                </button>
              </div>

              <div className="sales-table-container">
                {isLoading ? (
                  <div className="loading">Cargando ventas...</div>
                ) : (
                  <table className="sales-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Vendedor</th>
                        <th>Total</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventas.length > 0 ? (
                        ventas.map(venta => (
                          <tr key={venta.id}>
                            <td>{venta.id}</td>
                            <td>{venta.cliente}</td>
                            <td>{venta.empleado}</td>
                            <td>${venta.total.toLocaleString()}</td>
                            <td className="action-buttons">
                              <button
                                className="btn-action btn-view"
                                onClick={() => {
                                  setDetalleVentaId(venta.id);
                                  handleVerDetalleVenta(venta.id);
                                }}
                                title="Ver detalles"
                              >
                                <i className="fas fa-eye"></i> Ver
                              </button>
                              <button
                                className="btn-action btn-discount"
                                onClick={() => {
                                  setVentaDescuentoId(venta.id);
                                  setActiveForm("form-aplicar-descuento");
                                }}
                                title="Aplicar descuento"
                              >
                                <i className="fas fa-percent"></i> Descuento
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="no-data">No se encontraron ventas</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Formulario para nueva venta */}
          {activeForm === "form-nueva-venta" && (
            <div className="content-area">
              <h3 className="panel-title">Registrar Nueva Venta</h3>

              <div className="form-container">
                <form onSubmit={handleRealizarVenta}>
                  <div className="form-group">
                    <label className="form-label">Cliente</label>
                    <select
                      className="form-input"
                      value={nuevaVenta.clienteId}
                      onChange={(e) => setNuevaVenta({ ...nuevaVenta, clienteId: e.target.value })}
                      required
                    >
                      <option value="">Seleccione un cliente</option>
                      {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nombre} {cliente.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vendedor</label>
                    <select
                      className="form-input"
                      value={nuevaVenta.empleadoId}
                      onChange={(e) => setNuevaVenta({ ...nuevaVenta, empleadoId: e.target.value })}
                      required
                    >
                      <option value="">Seleccione un vendedor</option>
                      {empleados.map(empleado => (
                        <option key={empleado.id} value={empleado.id}>
                          {empleado.nombre} {empleado.apellido}
                        </option>
                      ))}
                    </select>
                  </div>

                  <h4 className="section-subtitle">Productos</h4>
                  <div id="productos-container">
                    {nuevaVenta.productos.map((producto, index) => (
                      <div key={index} className="producto-row">
                        <div className="form-group">
                          <label className="form-label">Producto</label>
                          <select
                            className="form-input"
                            value={producto.productoId}
                            onChange={(e) => handleProductoChange(index, 'productoId', e.target.value)}
                            required
                          >
                            <option value="">Seleccione un producto</option>
                            {productos.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Cantidad</label>
                          <input
                            type="number"
                            className="form-input"
                            min="1"
                            value={producto.cantidad}
                            onChange={(e) => handleProductoChange(index, 'cantidad', parseInt(e.target.value))}
                            required
                          />
                        </div>
                        <div className="form-group precio-display">
                          <label className="form-label">Precio</label>
                          <div className="precio-valor">
                            ${producto.productoId && preciosProductos[producto.productoId] ?
                              preciosProductos[producto.productoId].toLocaleString() :
                              '0.00'}
                          </div>
                        </div>
                        <div className="form-group subtotal-display">
                          <label className="form-label">Subtotal</label>
                          <div className="subtotal-valor">
                            ${producto.productoId && preciosProductos[producto.productoId] ?
                              (preciosProductos[producto.productoId] * producto.cantidad).toLocaleString() :
                              '0.00'}
                          </div>
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            className="remove-producto-btn"
                            onClick={() => handleEliminarProducto(index)}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="add-producto-container">
                    <button
                      type="button"
                      className="add-producto-btn"
                      onClick={handleAgregarProducto}
                    >
                      + Agregar otro producto
                    </button>
                  </div>

                  <div className="total-container">
                    <div className="total-label">Total:</div>
                    <div className="total-value">${totalVenta.toLocaleString()}</div>
                  </div>

                  <button type="submit" className="submit-btn">Registrar Venta</button>
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

          {/* Ranking de ventas por vendedor */}
          {activeForm === "ventas-por-vendedor" && (
            <div className="content-area">
              <h3 className="panel-title">Ranking de Ventas por Vendedor</h3>

              <div className="sales-table-container">
                {isLoading ? (
                  <div className="loading">Cargando datos...</div>
                ) : (
                  <table className="sales-table">
                    <thead>
                      <tr>
                        <th>Posición</th>
                        <th>Vendedor</th>
                        <th>Total Ventas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventasPorVendedorData.length > 0 ? (
                        ventasPorVendedorData.map((item, index) => (
                          <tr key={index} className={index === 0 ? "top-seller" : ""}>
                            <td>{index + 1}</td>
                            <td>{item.vendedor}</td>
                            <td>{item.ventas}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="no-data">No hay datos de ventas disponibles</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              <button
                type="button"
                className="nav-back"
                onClick={() => setActiveForm("main-content")}
              >
                ← Volver al listado
              </button>
            </div>
          )}

          {/* Formulario para ver detalle de venta */}
          {activeForm === "form-detalle-venta" && (
            <div className="content-area">
              <h3 className="panel-title">Detalle de Venta</h3>

              <div className="form-container">
                {!detalleVenta ? (
                  <div className="form-group">
                    <label className="form-label">ID de la Venta</label>
                    <div className="search-box">
                      <input
                        type="number"
                        className="search-input"
                        value={detalleVentaId}
                        onChange={(e) => setDetalleVentaId(e.target.value)}
                        required
                      />
                      <button
                        className="search-button"
                        onClick={() => handleVerDetalleVenta()}
                      >
                        Buscar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="venta-info">
                    <div className="venta-header">
                      <div className="venta-id">Venta #{detalleVenta.id}</div>
                      <div className="venta-fecha">
                        Fecha: {new Date(detalleVenta.fecha).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="cliente-info">
                      <div className="info-label">Cliente:</div>
                      <div className="info-value">
                        {detalleVenta.cliente || `Cliente #${detalleVenta.clienteId}`}
                      </div>
                    </div>
                    <div className="empleado-info">
                      <div className="info-label">Vendedor:</div>
                      <div className="info-value">
                        {detalleVenta.empleado || `Empleado #${detalleVenta.empleadoId}`}
                      </div>
                    </div>

                    <div className="detalle-productos">
                      <h4 className="detalle-subtitle">Productos</h4>
                      <table className="detalle-table">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Precio Unitario</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {detalleVenta.detalles && detalleVenta.detalles.map((detalle, index) => (
                            <tr key={index}>
                              <td>{detalle.producto || `Producto #${detalle.productoId}`}</td>
                              <td>${detalle.precioUnitario.toLocaleString()}</td>
                              <td>{detalle.cantidad}</td>
                              <td>${(detalle.precioUnitario * detalle.cantidad).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="detalle-totales">
                        <div className="total-row">
                          <div className="total-label">Total:</div>
                          <div className="total-value">
                            {detalleVenta && detalleVenta.total ?
                              `$${detalleVenta.total.toLocaleString()}` :
                              '$0.00'
                            }
                          </div>
                        </div>
                      </div>

                      <div className="action-buttons-container">
                        <button
                          className="btn-action btn-pdf"
                          onClick={() => facturaService.generarPdf(detalleVenta.id)}
                        >
                          <i className="fas fa-file-pdf"></i> Generar PDF
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="nav-back"
                  onClick={() => {
                    setActiveForm("main-content");
                    setDetalleVenta(null);
                  }}
                >
                  ← Volver al listado
                </button>
              </div>
            </div>
          )}

          {/* Formulario para buscar ventas por cliente */}
          {activeForm === "form-ventas-cliente" && (
            <div className="content-area">
              <h3 className="panel-title">Ventas por Cliente</h3>

              <div className="form-container">
                {!clienteVentas ? (
                  <div className="form-group">
                    <label className="form-label">ID del Cliente</label>
                    <div className="search-box">
                      <input
                        type="number"
                        className="search-input"
                        value={clienteVentasId}
                        onChange={(e) => setClienteVentasId(e.target.value)}
                        required
                      />
                      <button
                        className="search-button"
                        onClick={handleBuscarVentasCliente}
                      >
                        Buscar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="cliente-info-header">
                      <h4>Cliente: {clienteInfo ? `${clienteInfo.nombre} ${clienteInfo.apellido}` : `#${clienteVentasId}`}</h4>
                    </div>

                    <div className="ventas-cliente-list">
                      <table className="sales-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clienteVentas.length > 0 ? (
                            clienteVentas.map(venta => (
                              <tr key={venta.id}>
                                <td>{venta.id}</td>
                                <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                                <td>${venta.total.toLocaleString()}</td>
                                <td>
                                  <button
                                    className="btn-action btn-view"
                                    onClick={() => {
                                      setDetalleVentaId(venta.id);
                                      handleVerDetalleVenta(venta.id);
                                    }}
                                  >
                                    <i className="fas fa-eye"></i> Ver
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="no-data">Este cliente no tiene ventas registradas</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="nav-back"
                  onClick={() => {
                    setActiveForm("main-content");
                    setClienteVentas(null);
                    setClienteInfo(null);
                  }}
                >
                  ← Volver al listado
                </button>
              </div>
            </div>
          )}

          {/* Formulario para aplicar descuento */}
          {activeForm === "form-aplicar-descuento" && (
            <div className="content-area">
              <h3 className="panel-title">Aplicar Descuento a Venta</h3>

              <div className="form-container">
                <div className="form-group">
                  <label className="form-label">ID de la Venta</label>
                  <input
                    type="number"
                    className="form-input"
                    value={ventaDescuentoId}
                    onChange={(e) => setVentaDescuentoId(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Porcentaje de Descuento</label>
                  <input
                    type="number"
                    className="form-input"
                    min="0"
                    max="100"
                    step="0.01"
                    value={porcentajeDescuento}
                    onChange={(e) => setPorcentajeDescuento(parseFloat(e.target.value))}
                    required
                  />
                </div>
                <button
                  className="submit-btn"
                  onClick={handleAplicarDescuento}
                >
                  Aplicar Descuento
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