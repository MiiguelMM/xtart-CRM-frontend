import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import facturaService from '../../services/facturaService.js';
import '../../styles/DashboardGrafica.css';

const DashboardGrafica = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('monthly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Obtenemos datos reales del backend
        const facturas = await facturaService.listarFacturas();
        const ventasPorProducto = await facturaService.ventasPorProducto();
        const ventasPorVendedor = await facturaService.ventasPorVendedor();

        // Procesamos los datos para el gráfico de ventas por fecha
        const ventasPorFecha = procesarVentasPorFecha(facturas);
        setChartData(ventasPorFecha);

        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeFrame]);

  // Función para procesar las facturas y agruparlas por fecha
  const procesarVentasPorFecha = (facturas) => {
    // Crear un mapa para agrupar las ventas por fecha
    const ventasPorFecha = {};

    facturas.forEach(factura => {
      // Obtener la fecha de la factura y formatearla según el timeFrame
      const fecha = new Date(factura.fecha);
      let fechaFormateada;

      if (timeFrame === 'monthly') {
        fechaFormateada = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
      } else if (timeFrame === 'weekly') {
        // Obtener la semana del año
        const primerDia = new Date(fecha.getFullYear(), 0, 1);
        const dias = Math.floor((fecha - primerDia) / (24 * 60 * 60 * 1000));
        const semana = Math.ceil((dias + primerDia.getDay() + 1) / 7);
        fechaFormateada = `Semana ${semana}, ${fecha.getFullYear()}`;
      } else {
        // Diario
        fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
      }

      // Sumar el monto de la factura a la fecha correspondiente
      if (!ventasPorFecha[fechaFormateada]) {
        ventasPorFecha[fechaFormateada] = 0;
      }
      ventasPorFecha[fechaFormateada] += factura.total;
    });

    // Convertir el mapa a un array para el gráfico y redondear a 3 decimales
    return Object.keys(ventasPorFecha).map(fecha => ({
      fecha: fecha,
      ventas: Math.round(ventasPorFecha[fecha])
    }));
  };

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  // Formateador personalizado para el tooltip y ejes
  const formatoDinero = (valor) => {
    return `$${valor.toLocaleString('es-ES')}`;  // Formato español con separadores de miles
  };

  if (isLoading) {
    return <div className="loading">Cargando datos</div>;
  }

  return (
    <div className="dashboard-grafica-container">
      <h2>VENTAS</h2>

      <div className="time-controls">
        <button
          className={timeFrame === 'daily' ? 'active' : ''}
          onClick={() => handleTimeFrameChange('daily')}
        >
          Diario
        </button>
        <button
          className={timeFrame === 'weekly' ? 'active' : ''}
          onClick={() => handleTimeFrameChange('weekly')}
        >
          Semanal
        </button>
        <button
          className={timeFrame === 'monthly' ? 'active' : ''}
          onClick={() => handleTimeFrameChange('monthly')}
        >
          Mensual
        </button>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(32, 129, 255, 0.2)" />
            <XAxis dataKey="fecha" stroke="#89c4ff" />
            <YAxis
              stroke="#89c4ff"
              tickFormatter={formatoDinero}
            />
            <Tooltip formatter={(value) => formatoDinero(value)} />
            <Legend formatter={() => 'Dinero Generado'} />
            <Area
              type="monotone"
              name="Dinero Generado"
              dataKey="ventas"
              stroke="#2081ff"
              fill="url(#colorGradient)"
              fillOpacity={0.8}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2081ff" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0a1929" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardGrafica;