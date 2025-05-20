import api from './api';
const detalleFacturaService = {
    // Crear un nuevo detalle de factura
    crearDetalleFactura: async (facturaId, productoId, cantidad) => {
        const params = new URLSearchParams();
        params.append('facturaId', facturaId);
        params.append('productoId', productoId);
        params.append('cantidad', cantidad);
        const response = await api.post('/api/detalle-factura', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    },
    // Obtener detalles por factura
    obtenerDetallesPorFactura: async (facturaId) => {
        const response = await api.get(`/api/detalle-factura/${facturaId}`);
        return response.data;
    },
    // Editar un detalle de factura
    editarDetalleFactura: async (id, nuevaCantidad, nuevoPrecioUnitario) => {
        const params = new URLSearchParams();
        if (nuevaCantidad !== undefined) params.append('nuevaCantidad', nuevaCantidad);
        if (nuevoPrecioUnitario !== undefined) params.append('nuevoPrecioUnitario', nuevoPrecioUnitario)
        const response = await api.put(`/api/detalle-factura/${id}`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    },
    // Eliminar un detalle de factura
    eliminarDetalleFactura: async (id) => {
        const response = await api.delete(`/api/detalle-factura/${id}`);
        return response.data;
    },
    // Listar todos los detalles
    listarTodosLosDetalles: async () => {
        const response = await api.get('/api/detalle-factura');
        return response.data;
    }
};
export default detalleFacturaService;