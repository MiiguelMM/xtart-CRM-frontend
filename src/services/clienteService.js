import api from './api';

const clienteService = {
    // Listar todos los clientes
    listarClientes: async () => {
        const response = await api.get('/api/clientes/listar');
        return response.data;
    },
    // Agregar un nuevo cliente
    agregarCliente: async (cliente) => {
        const response = await api.post('/api/clientes/agregar', cliente);
        return response.data;
    },
    // Eliminar un cliente
    eliminarCliente: async (id) => {
        const response = await api.delete(`/api/clientes/eliminar/${id}`);
        return response.data;
    },
    //Listar activos
     listarClientesActivos: async () => {
        const response = await api.get('/api/clientes/activos');
        return response.data;
    },
    // Buscar clientes por nombre
    buscarCliente: async (nombre) => {
        const response = await api.get(`/api/clientes/buscar?nombre=${nombre}`);
        return response.data;
    },
    // Actualizar información de un cliente
    actualizarCliente: async (id, cliente) => {
        const response = await api.put(`/api/clientes/actualizar/${id}`, cliente);
        return response.data;
    },
    // Ver detalles de un cliente
    verDetalles: async (id) => {
        const response = await api.get(`/api/clientes/detalles/${id}`);
        return response.data;
    },
    // Enviar oferta a un cliente
    enviarOferta: async (id) => {
        const response = await api.post(`/api/clientes/enviar-oferta/${id}`);
        return response.data;
    },
    // Ver clientes más frecuentes
    clientesFrecuentes: async () => {
        const response = await api.get('/api/clientes/frecuentes');
        return response.data;
    },
    // Ver clientes inactivos
    clientesInactivos: async () => {
        const response = await api.get('/api/clientes/inactivos');
        return response.data;
    },
    // Cambiar estado de un cliente (activar/desactivar)
    cambiarEstado: async (id, activo) => {
        const response = await api.patch(`/api/clientes/${id}/estado?activo=${activo}`);
        return response.data;
    },
    // Obtener conteo de clientes
    obtenerConteo: async () => {
        const response = await api.get('/api/clientes/conteo');
        return response.data;
    }
};
export default clienteService;