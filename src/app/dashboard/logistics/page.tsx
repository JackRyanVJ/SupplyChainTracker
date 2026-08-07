'use client';

import React, { useEffect, useState } from 'react';
import { DataService } from '@/lib/supabase';
import { InventoryItem } from '@/types/database';
import { MetricsCards } from '@/components/MetricsCards';
import { BarChart3, Truck, Warehouse, Building2, PackageCheck, AlertCircle, ShieldCheck, MapPin } from 'lucide-react';

export default function LogisticsOverviewPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await DataService.getInventoryItems();
        setItems(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalValue = items.reduce((acc, i) => acc + (i.product?.price || 0), 0);
  const warehouseCount = items.filter((i) => i.status === 'in_warehouse').length;
  const transitCount = items.filter((i) => i.status === 'in_transit').length;
  const distributorCount = items.filter((i) => i.status === 'at_distributor').length;
  const deliveredCount = items.filter((i) => i.status === 'delivered').length;
  const exceptionsCount = items.filter((i) =>
    ['damaged_in_storage', 'damaged_in_transit', 'lost_in_transit', 'returned_to_manufacturer'].includes(i.status)
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            Supply Chain & Freight Logistics Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry, INR gross inventory valuation, and distribution throughput metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live Telemetry Engine Active</span>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <MetricsCards items={items} />

      {/* Logistics Infographic Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hub Capacity Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Warehouse className="w-4 h-4 text-orange-500" />
            Milestone Hub Inventory Breakdown
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Warehouse className="w-3.5 h-3.5 text-blue-500" />
                  Primary Warehouse Intake
                </span>
                <span>{warehouseCount} units ({items.length ? Math.round((warehouseCount / items.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${items.length ? (warehouseCount / items.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-500" />
                  Active Freight Express Transit
                </span>
                <span>{transitCount} units ({items.length ? Math.round((transitCount / items.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${items.length ? (transitCount / items.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  Regional Logistics Distributors
                </span>
                <span>{distributorCount} units ({items.length ? Math.round((distributorCount / items.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${items.length ? (distributorCount / items.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Final Delivered Destination
                </span>
                <span>{deliveredCount} units ({items.length ? Math.round((deliveredCount / items.length) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${items.length ? (deliveredCount / items.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quality Health & Valuation Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Health Metric & Capital Valuation
            </h3>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Total Gross INR Asset Value:</span>
                <span className="text-base font-extrabold text-emerald-600">
                  ₹{totalValue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Healthy Transit Efficiency:</span>
                <span className="text-xs font-bold text-slate-800">
                  {items.length ? Math.round(((items.length - exceptionsCount) / items.length) * 100) : 100}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Quarantined Loss Valuation:</span>
                <span className="text-xs font-bold text-rose-600">
                  ₹{items.filter((i) => ['damaged_in_storage', 'damaged_in_transit', 'lost_in_transit', 'returned_to_manufacturer'].includes(i.status)).reduce((s, i) => s + (i.product?.price || 0), 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-xl text-[11px] text-orange-950 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
            <span>Automated ISO-18004 QR scanning optimizes turn-around speed by 48%.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
