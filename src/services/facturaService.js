import api from './api';

const facturaService = {
    // Listar todas las facturas
    listarFacturas: async () => {
        const response = await api.get('/api/facturas');
        return response.data;
    },
    
    // Crear nueva factura (venta)
    realizarVenta: async (clienteId, empleadoId, productoIds, cantidades) => {
        const params = new URLSearchParams();
        params.append('clienteId', clienteId);
        params.append('empleadoId', empleadoId);
        // Agregar múltiples valores para las listas
        productoIds.forEach(id => params.append('productoIds', id));
        cantidades.forEach(cantidad => params.append('cantidades', cantidad));
        
        const response = await api.post('/api/facturas/nueva', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    },
    
    // Buscar factura por ID
    buscarFactura: async (id) => {
        const response = await api.get(`/api/facturas/${id}`);
        return response.data;
    },
    
    // Ver detalle de una factura
    verDetalleVenta: async (facturaId) => {
        const response = await api.get(`/api/facturas/detalle/${facturaId}`);
        return response.data;
    },
    
    // Aplicar descuento a una factura
    aplicarDescuento: async (facturaId, porcentaje) => {
        const response = await api.put(`/api/facturas/descuento/${facturaId}?porcentaje=${porcentaje}`);
        return response.data;
    },
    
    // Ver ventas por producto
    ventasPorProducto: async () => {
        const response = await api.get('/api/facturas/producto');
        return response.data;
    },
    
    // Ver ventas por vendedor
    ventasPorVendedor: async () => {
        const response = await api.get('/api/facturas/vendedor');
        return response.data;
    },
    
    // Buscar facturas por cliente
    buscarFacturasPorCliente: async (clienteId) => {
        const response = await api.get(`/api/facturas/cliente/${clienteId}`);
        return response.data;
    },

    //Generar pdf
    generarPdf: async (id) => {
    window.open(`/api/facturas/pdf/${id}`, '_blank');
    },   
    
    // Obtener datos de ventas totales (simulado para el dashboard)
    getVentasTotal: async () => {
        try {
            // Obtenemos todas las facturas
            const facturas = await facturaService.listarFacturas();
            // Calculamos el total
            let total = 0;
            facturas.forEach(factura => {
                total += factura.total || 0;
            });
            // Simulación de crecimiento (en un caso real, esto vendría del backend)
            const crecimiento = 15.2;
            return {
                total,
                crecimiento
            };
        } catch (error) {
            console.error('Error al obtener total de ventas:', error);
            return {
                total: 432000, // Valor predeterminado
                crecimiento: 15.2
            };
        }
    }
};

export default facturaService;