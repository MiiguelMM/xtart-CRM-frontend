import api from './api';
const empleadoService = {
    // Listar todos los empleados
    listarEmpleados: async () => {
        const response = await api.get('/api/empleados/listar');
        return response.data;
    },
    // Agregar un nuevo empleado
    agregarEmpleado: async (empleado) => {
        const response = await api.post('/api/empleados/agregar', empleado);
        return response.data;
    },
    // Eliminar un empleado
    eliminarEmpleado: async (id) => {
        const response = await api.delete(`/api/empleados/eliminar/${id}`);
        return response.data;
    },
    // Buscar empleados por nombre o apellido
    buscarEmpleado: async (filtro) => {
        const response = await api.get(`/api/empleados/buscar?filtro=${filtro}`);
        return response.data;
    },
    // Actualizar información de un empleado
    actualizarEmpleado: async (id, empleado) => {
        const response = await api.put(`/api/empleados/actualizar/${id}`, empleado);
        return response.data;
    },
    // Asignar rol a un empleado
    asignarRol: async (id, nuevoRol) => {
        const response = await api.put(`/api/empleados/asignar-rol/${id}?nuevoRol=${nuevoRol}`);
        return response.data;
    },
    // Ver detalles de un empleado
    verDetalles: async (id) => {
        const response = await api.get(`/api/empleados/detalles/${id}`);
        return response.data;
    },

    // Activar/desactivar un empleado
    alternarEstado: async (id) => {
        const response = await api.put(`/api/empleados/alternar-estado/${id}`);
        return response.data;
    },
    // Generar reporte (placeholder)
    generarReporte: async () => {
        const response = await api.get('/api/empleados/reporte');
        return response.data;
    },
    listarEmpleadosActivos: async () => {
        const response = await api.get('/api/empleados/activos');
        return response.data;
    },
    // Obtener conteo de empleados 
    getEmpleadoCount: async () => {
        const response = await api.get('/api/empleados/conteo');
        return response.data;
    }
};
export default empleadoService;