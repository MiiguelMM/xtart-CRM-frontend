import React, { useEffect, useState } from 'react';
import { facturaService } from '../../services';


export default function RecentActivity() {

  const [cargandoActividades, setCargandoActividades] = useState(true);
  const [actividadesVentas, setActividadesVentas] = useState([]);

  useEffect(() => {
  const cargarVentasRecientes = async () => {
    try {
      setCargandoActividades(true);
      
      // Obtener facturas (ventas)
      const facturas = await facturaService.listarFacturas();
      
      console.log('Facturas recibidas del servidor:', facturas);
      
      // Procesar ventas directamente con la información obtenida
      if (facturas && Array.isArray(facturas)) {
        const ventas = facturas.map(factura => {
          return {
            id: factura.id || factura.facturaId,
            clienteNombre: factura.cliente || 'Cliente desconocido', // Usar directamente factura.cliente
            monto: factura.total ? `$${factura.total.toLocaleString()}` : 'Monto no disponible',
            fecha: factura.fecha || new Date(Date.now() - Math.random() * 86400000 * 7)
          };
        });
        
        // Ordenar por fecha (más recientes primero)
        ventas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        // Tomar las 5 ventas más recientes
        setActividadesVentas(ventas.slice(0, 5));
        
        console.log('Ventas procesadas:', ventas);
      }
    } catch (error) {
      console.error('Error al cargar ventas recientes:', error);
      // En caso de error, establecer ventas predeterminadas (mantén el código original de respaldo)
      setActividadesVentas([
        {
          id: '28945',
          clienteNombre: 'Empresa ABC',
          monto: '$5,850',
          fecha: new Date(Date.now() - 5 * 60000) // 5 minutos atrás
        },
        {
          id: '28944',
          clienteNombre: 'Carlos Rodríguez',
          monto: '$12,450',
          fecha: new Date(Date.now() - 27 * 60000) // 27 minutos atrás
        },
        {
          id: '28943',
          clienteNombre: 'Distribuidora XYZ',
          monto: '$3,275',
          fecha: new Date(Date.now() - 43 * 60000) // 43 minutos atrás
        },
        {
          id: '28942',
          clienteNombre: 'María López',
          monto: '$720',
          fecha: new Date(Date.now() - 60 * 60000) // 1 hora atrás
        },
        {
          id: '28941',
          clienteNombre: 'Tecnologías Modernas S.A.',
          monto: '$8,690',
          fecha: new Date(Date.now() - 3 * 60 * 60000) // 3 horas atrás
        }
      ]);
    } finally {
      setCargandoActividades(false);
    }
  };
  
  cargarVentasRecientes();
  }, []);

  const formatearTiempoRelativo = (fecha) => {
    const ahora = new Date();
    const fechaActividad = new Date(fecha);
    const diferencia = Math.floor((ahora - fechaActividad) / 1000); // diferencia en segundos

    if (diferencia < 60) {
      return `Hace ${diferencia} segundos`;
    } else if (diferencia < 3600) {
      const minutos = Math.floor(diferencia / 60);
      return `Hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    } else if (diferencia < 86400) {
      const horas = Math.floor(diferencia / 3600);
      return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    } else {
      const dias = Math.floor(diferencia / 86400);
      return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
    }
  };

  return (
    <div className="activity-list">
      {cargandoActividades ? (
        <div className="loading-indicator">Cargando ventas recientes...</div>
      ) : (
        actividadesVentas.map((venta, index) => (
          <div className="activity-item" key={`venta-${index}`}>
            <div className="activity-icon">💰</div>
            <div className="activity-content">
              <p className="activity-text">
                <span className="highlight">{venta.clienteNombre}</span> - Venta{" "}
                <span className="highlight">#{venta.id}</span>
              </p>
              <div className="activity-details">
                <span className="activity-amount">{venta.monto}</span>
                <span className="activity-time">{formatearTiempoRelativo(venta.fecha)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

