'use client';

import React from 'react';
import { InventoryItem } from '@/types/database';
import { Package, Truck, AlertCircle, IndianRupee } from 'lucide-react';

interface MetricsCardsProps {
  items: InventoryItem[];
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ items }) => {
  const totalItems = items.length;
  const inTransit = items.filter((i) => i.status === 'in_transit').length;
  const exceptions = items.filter((i) =>
    ['damaged_in_storage', 'damaged_in_transit', 'lost_in_transit', 'returned_to_manufacturer'].includes(i.status)
  ).length;

  // Logic Fix: Exclude items that are 'delivered' so Gross Inventory Value dynamically reduces upon delivery
  const activeStockItems = items.filter((i) => i.status !== 'delivered');
  const grossInventoryValue = activeStockItems.reduce((sum, item) => sum + (item.product?.price || 0), 0);

  const metrics = [
    {
      title: 'Total Tracked Stock',
      value: totalItems,
      unit: `${activeStockItems.length} active in network`,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100',
    },
    {
      title: 'Active Freight Transit',
      value: inTransit,
      unit: 'vehicles on route',
      icon: Truck,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-100',
    },
    {
      title: 'Status Exceptions',
      value: exceptions,
      unit: exceptions === 1 ? 'flagged unit' : 'flagged units',
      icon: AlertCircle,
      color: exceptions > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600',
      borderColor: exceptions > 0 ? 'border-rose-100' : 'border-emerald-100',
    },
    {
      title: 'Gross Inventory Value',
      value: `₹${grossInventoryValue.toLocaleString('en-IN')}`,
      unit: 'INR (excl. delivered)',
      icon: IndianRupee,
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">{m.title}</span>
              <div className={`p-2 rounded-lg ${m.color} border ${m.borderColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">{m.value}</div>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400 font-medium">
                <span>{m.unit}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
