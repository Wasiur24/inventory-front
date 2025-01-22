import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

import SalesService from '../services/Sales.service';
import ProductService from '../services/Product.service';
import SupplierService from '../services/Supplier.service';
import { getAllCategories } from '../services/Category.service';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: number;
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  const trendClass = trend >= 0 ? 'text-green-500' : 'text-red-500';
  const bgClass = trend >= 0 ? 'bg-green-100' : 'bg-red-100';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgClass}`}>{icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        {trend >= 0 ? (
          <ArrowUpRight className={`h-4 w-4 ${trendClass}`} />
        ) : (
          <ArrowDownRight className={`h-4 w-4 ${trendClass}`} />
        )}
        <span className={`ml-2 text-sm ${trendClass}`}>
          {Math.abs(trend)}% from last month
        </span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalSuppliers: 0,
    totalCategories: 0,
    recentSales: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sales, products, suppliers, categories] = await Promise.all([
          SalesService.getTotalSales(),
          ProductService.getAllProducts(),
          SupplierService.getAllSuppliers(),
          getAllCategories(),
        ]);

        setStats({
          totalSales: sales.sales.reduce(
            (acc: number, sale: any) => acc + sale.totalSaleAmount,
            0
          ),
          totalProducts: products.length,
          totalSuppliers: suppliers.length,
          totalCategories: categories.length,
          recentSales: sales.sales.slice(0, 5),
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={`₹${stats.totalSales.toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={12.5}
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon={<Package className="h-6 w-6" />}
          trend={5.2}
        />
        <StatCard
          title="Suppliers"
          value={stats.totalSuppliers}
          icon={<Users className="h-6 w-6" />}
          trend={-2.4}
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon={<ShoppingCart className="h-6 w-6" />}
          trend={8.1}
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentSales.map((sale: any) => (
                  <tr key={sale._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{sale.totalSaleAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>



          </div>
        </div>
      </div>
    </div>
  );
}
