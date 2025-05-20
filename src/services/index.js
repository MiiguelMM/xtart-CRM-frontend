// Importamos todos los servicios
import api from './api';
import clienteService from './clienteService';
import detalleFacturaService from './detalleFacturaService';
import empleadoService from './empleadoService';
import facturaService from './facturaService';
import productoService from './productoService';

// Exportamos todos los servicios desde un único archivo
export {
  api,
  clienteService,
  detalleFacturaService,
  empleadoService,
  facturaService,
  productoService
};

// Exportar todo como un objeto para importación simplificada
const services = {
  api,
  clienteService,
  detalleFacturaService,
  empleadoService,
  facturaService,
  productoService
};

export default services;