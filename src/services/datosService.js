// src/services/datosService.js
import api from './api'; 

const DatosService = {
  resetDatos() {
    return api.post('/api/datos/reset');
  }
  
  
};

export default DatosService;