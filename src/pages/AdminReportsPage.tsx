import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJSType,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJSType.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

interface TopProduct {
  product_name: string;
  total_quantity_sold: number;
}
interface OrdersByDate {
  order_date: string;
  order_count: number;
}

const AdminReportsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [ordersByDate, setOrdersByDate] = useState<OrdersByDate[]>([]);
  const [dataReady, setDataReady] = useState(false);
 
  const barChartRef = useRef<ChartJSType | null>(null);   // Ref para el gráfico de barras
  const lineChartRef = useRef<ChartJSType | null>(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        console.error('AdminReports: No hay sesión o error al obtenerla.', sessionError?.message);
        navigate('/login', { replace: true });
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (profileError || !profileData || profileData.role !== 'admin') {
        alert('Acceso denegado: No tienes permisos de administrador para ver reportes.');
        navigate('/products', { replace: true });
        return;
      }

      await fetchReportsData();
      setLoading(false);
    };

    checkAdminRole();
  }, [navigate]);

  const fetchReportsData = async () => {
    setError(null);
    try {
      const { data: topProductsData, error: topProductsError } = await supabase
        .from('order_items')
        .select('product_name, quantity')
        .order('quantity', { ascending: false });

      if (topProductsError || !topProductsData) {
        setError('Error al cargar productos más vendidos.');
        return;
      }

      const productQuantities: { [key: string]: number } = {};
      topProductsData.forEach(item => {
        productQuantities[item.product_name] = (productQuantities[item.product_name] || 0) + item.quantity;
      });

      const sortedTopProducts = Object.entries(productQuantities)
        .map(([product_name, total_quantity_sold]) => ({ product_name, total_quantity_sold }))
        .sort((a, b) => b.total_quantity_sold - a.total_quantity_sold)
        .slice(0, 5);

      setTopProducts(sortedTopProducts);

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (ordersError || !ordersData) {
        setError('Error al cargar órdenes por fecha.');
        return;
      }

      const dailyOrderCounts: { [key: string]: number } = {};
      ordersData.forEach(order => {
        const date = new Date(order.created_at).toISOString().split('T')[0];
        dailyOrderCounts[date] = (dailyOrderCounts[date] || 0) + 1;
      });

      const sortedOrdersByDate = Object.entries(dailyOrderCounts)
        .map(([order_date, order_count]) => ({ order_date, order_count }))
        .sort((a, b) => a.order_date.localeCompare(b.order_date));

      setOrdersByDate(sortedOrdersByDate);

      const hasTopProducts = sortedTopProducts.length > 0;
      const hasOrdersData = sortedOrdersByDate.length > 0;

      if (hasTopProducts || hasOrdersData) {
        setDataReady(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error general al cargar reportes:', err.message);
      } else {
        console.error('Error general al cargar reportes:', err);
      }
      setError('Error inesperado al cargar los reportes.');
    }
  };

  if (loading) {
    return <p className="text-center py-20 text-xl text-gray-600">Cargando reportes...</p>;
  }

  if (error) {
    return <p className="text-center py-20 text-xl text-red-600">{error}</p>;
  }

  if (!dataReady) {
    return (
      <p className="text-center py-20 text-xl text-gray-500">
        No hay suficientes datos para mostrar los reportes.
      </p>
    );
  }

  const topProductsChartData = {
    labels: topProducts.map(p => p.product_name),
    datasets: [{
      label: 'Cantidad Vendida',
      data: topProducts.map(p => p.total_quantity_sold),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  const topProductsChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Top 5 Productos Más Vendidos' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Cantidad' } },
      x: { title: { display: true, text: 'Producto' } },
    },
  };

  const ordersByDateChartData = {
    labels: ordersByDate.map(o => o.order_date),
    datasets: [{
      label: 'Número de Órdenes',
      data: ordersByDate.map(o => o.order_count),
      fill: false,
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      tension: 0.1,
    }],
  };

  const ordersByDateChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Órdenes por Día' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Órdenes' } },
      x: { title: { display: true, text: 'Fecha' } },
    },
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Reportes de Ventas</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {topProducts.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Manejo de instancia con ref */}
            <Bar ref={barChartRef} data={topProductsChartData} options={topProductsChartOptions} />
          </div>
        )}
        {ordersByDate.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* Manejo de instancia con ref */}
            <Line ref={lineChartRef} data={ordersByDateChartData} options={ordersByDateChartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;