import api from './api';

const productoService = {
    // Listar todos los productos
    listarProductos: async () => {
        const response = await api.get('/api/productos');
        return response.data;
    },
    // Agregar un nuevo producto
    agregarProducto: async (producto) => {
        const response = await api.post('/api/productos/agregar', producto);
        return response.data;
    },
    // Eliminar un producto
    eliminarProducto: async (id) => {
        const response = await api.delete(`/api/productos/${id}`);
        return response.data;
    },
    listarProductosActivos: async () => {
        const response = await api.get('/api/productos/activos');
        return response.data;
    },
    // Buscar productos por nombre
    buscarProducto: async (nombre) => {
        const response = await api.get(`/api/productos/buscar?nombre=${nombre}`);
        return response.data;
    },
    // Actualizar información de un producto
    actualizarProducto: async (id, producto) => {
        const response = await api.put(`/api/productos/actualizar/${id}`, producto);
        return response.data;
    },
    // Gestionar inventario (agregar o remover stock)
    gestionarInventario: async (id, cantidad, agregar) => {
        const response = await api.put(`/api/productos/inventario/${id}?cantidad=${cantidad}&agregar=${agregar}`)
        return response.data;
    },
    // Filtrar productos por rango de precio
    filtrarPorPrecio: async (min, max) => {
        const response = await api.get(`/api/productos/filtrar/precio?min=${min}&max=${max}`);
        return response.data;
    },

    // Ver productos más vendidos (top 5 o bottom 5)
    productosMasVendidos: async (top = true) => {
        const response = await api.get(`/api/productos/mas-vendidos?top=${top}`);
        return response.data;
    },
    // Ver productos con baja existencia
    productosBajaExistencia: async () => {
        const response = await api.get('/api/productos/baja-existencia');
        return response.data;
    },
    // Obtener conteo de productos (simulado ya que no existe en el controlador)
    getProductoCount: async () => {
        const response = await api.get('/api/productos/conteo');
        return response.data;
    }
};

export default productoService;