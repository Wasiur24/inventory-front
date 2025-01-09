import React from 'react';
import { Package, DollarSign, AlertTriangle, Clock } from 'lucide-react';
import StatCard from './StatCard';

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Products"
        value="2,451"
        icon={Package}
      />
      <StatCard
        title="Total Sales"
        value="₹34,545"
        icon={DollarSign}
        trend={{ value: 15, isPositive: true }}
      />
      <StatCard
        title="Low Stock"
        value="45"
        icon={AlertTriangle}
      />
      <StatCard
        title="Expired Items"
        value="12"
        icon={Clock}
      />
    </div>
  );
}