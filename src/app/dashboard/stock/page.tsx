'use client';

import React, { useState, useEffect } from 'react';
import { DataService } from '@/lib/supabase';
import { InventoryItem, APPROVED_HOT_WHEELS_MODELS } from '@/types/database';
import { 
  Boxes, 
  AlertTriangle, 
  IndianRupee, 
  CheckCircle2, 
  Package, 
  Layers
} from 'lucide-react';
import Link from 'next/link';

export default function StockPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const items = await DataService.getInventoryItems();
        setInventoryItems(items);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const damageStatuses = [
    'damaged_in_storage',
    'damaged_in_transit',
    'lost_in_transit',
    'returned_to_manufacturer',
  ];

  // 8 Authorized Hot Wheels Models
  const stockRows = APPROVED_HOT_WHEELS_MODELS.map((model) => {
    const matchingItems = inventoryItems.filter(
      (item) =>
        item.product_id === model.id ||
        item.product?.sku === model.sku ||
        item.product?.name.toLowerCase().includes(model.sku.toLowerCase()) ||
        item.product?.name.toLowerCase().includes(model.name.toLowerCase().slice(10, 25))
    );

    // Quantity in Stock: items NOT 'delivered' and NOT damaged
    const quantityInStock = matchingItems.filter(
      (item) => item.status !== 'delivered' && !damageStatuses.includes(item.status)
    ).length;

    // Quantity Damaged
    const quantityDamaged = matchingItems.filter((item) =>
      damageStatuses.includes(item.status)
    ).length;

    // Total Cost: Unit Price * Quantity in Stock
    const totalCost = model.price * quantityInStock;

    return {
      model,
      quantityInStock,
      quantityDamaged,
      totalCost,
    };
  });

  const grandTotalStock = stockRows.reduce((acc, r) => acc + r.quantityInStock, 0);
  const grandTotalDamaged = stockRows.reduce((acc, r) => acc + r.quantityDamaged, 0);
  const grandTotalCost = stockRows.reduce((acc, r) => acc + r.totalCost, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-500" />
            Inventory Stock Breakdown
          </h1>
          <p className="text-xs text-slate-500">
            Consolidated stock levels, quarantined damage counts, and active asset valuation across authorized models.
          </p>
        </div>

        <Link
          href="/dashboard/registry"
          className="px-3 py-1.5 text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
        >
          <Package className="w-3.5 h-3.5" />
          <span>Intake New Batch</span>
        </Link>
      </div>

      {/* 4. Header KPI Summary Cards: 3 clean, horizontal summary cards in grid-cols-3 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Units in Stock</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              {grandTotalStock.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Excludes delivered & damaged</span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
            <Boxes className="w-4 h-4" />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Quarantined Damaged Units</span>
            <div className="text-xl font-bold text-rose-600 mt-0.5">
              {grandTotalDamaged.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-rose-500 font-medium">Under QC quarantine</span>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Active Stock Valuation</span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">
              ₹{grandTotalCost.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Unit Price × Stock Units</span>
          </div>
          <div className="p-2.5 bg-orange-50 text-orange-600 rounded-lg border border-orange-100">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 1, 2 & 3. Strict Compact Table Layout with Fixed Thumbnail Box */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
              <th className="py-2.5 px-4 text-left">Model (Image + Name)</th>
              <th className="py-2.5 px-4 text-left">SKU</th>
              <th className="py-2.5 px-4 text-right">Unit Price (₹)</th>
              <th className="py-2.5 px-4 text-right">In Stock</th>
              <th className="py-2.5 px-4 text-right">Damaged</th>
              <th className="py-2.5 px-4 text-right">Total Cost (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {stockRows.map((row) => (
              <tr key={row.model.id} className="hover:bg-slate-50/60 transition-colors">
                {/* Model (Image + Name) */}
                <td className="py-2 px-4 border-b border-slate-100 text-sm text-left">
                  <div className="flex items-center gap-3">
                    {/* Fixed-Size Thumbnail Box */}
                    <div style={{ width: '64px', height: '48px', overflow: 'hidden', display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: '4px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <img
                        src={row.model.referenceImage}
                        alt={row.model.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px', display: 'block', maxWidth: '64px', maxHeight: '48px' }}
                      />
                    </div>
                    <span className="font-medium text-slate-900 text-xs sm:text-sm line-clamp-1 max-w-xs">
                      {row.model.name}
                    </span>
                  </div>
                </td>

                {/* SKU */}
                <td className="py-2 px-4 border-b border-slate-100 text-sm text-left font-mono text-xs text-slate-600">
                  {row.model.sku}
                </td>

                {/* Unit Price (INR) */}
                <td className="py-2 px-4 border-b border-slate-100 text-sm text-right font-medium text-slate-900">
                  ₹{row.model.price.toLocaleString('en-IN')}
                </td>

                {/* In Stock */}
                <td className="py-2 px-4 border-b border-slate-100 text-sm text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                    {row.quantityInStock.toLocaleString('en-IN')}
                  </span>
                </td>

                {/* Damaged */}
                <td className="py-2 px-4 border-b border-slate-100 text-sm text-right">
                  {row.quantityDamaged > 0 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700">
                      {row.quantityDamaged.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">0</span>
                  )}
                </td>

                {/* Total Cost (INR) */}
                <td className="py-2 px-4 border-b border-slate-100 text-sm text-right font-bold text-slate-900">
                  ₹{row.totalCost.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#f8fafc', borderTop: '2px solid #e2e8f0', fontWeight: 'bold', fontSize: '12px', color: '#0f172a' }}>
              <td colSpan={3} style={{ padding: '12px 16px', textAlign: 'left' }}>
                Total Consolidated Portfolio (6 Models)
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', color: '#15803d', fontSize: '13px', fontWeight: '800' }}>
                {grandTotalStock.toLocaleString('en-IN')}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', color: '#b91c1c', fontSize: '13px', fontWeight: '800' }}>
                {grandTotalDamaged.toLocaleString('en-IN')}
              </td>
              <td style={{ padding: '12px 16px', textAlign: 'right', color: '#0f172a', fontSize: '14px', fontWeight: '800' }}>
                ₹{grandTotalCost.toLocaleString('en-IN')}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
