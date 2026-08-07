'use client';

import React, { useState, useEffect } from 'react';
import { DataService } from '@/lib/supabase';
import { InventoryItem, InventoryStatus, STATUS_METADATA } from '@/types/database';
import { StatusUpdateModal } from '@/components/StatusUpdateModal';
import { MilestoneProgressBar } from '@/components/MilestoneProgressBar';
import { QRCodeSVG } from 'qrcode.react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  RotateCcw, 
  MapPin, 
  CheckCircle2, 
  RefreshCw, 
  Search,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export default function ExceptionsPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusModalItem, setStatusModalItem] = useState<InventoryItem | null>(null);
  const [milestoneModalItem, setMilestoneModalItem] = useState<InventoryItem | null>(null);
  const [filterType, setFilterType] = useState<string>('all_exceptions');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await DataService.getInventoryItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSaveStatus = async (itemId: string, newStatus: InventoryStatus, newLocation?: string) => {
    await DataService.updateItemStatus(itemId, newStatus, newLocation);
    await fetchItems();
  };

  // Filter only exceptions
  const exceptionItems = items.filter((item) =>
    ['damaged_in_storage', 'damaged_in_transit', 'lost_in_transit', 'returned_to_manufacturer'].includes(item.status)
  );

  const displayedItems = exceptionItems.filter((item) => {
    if (filterType === 'all_exceptions') return true;
    return item.status === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Logistics Status Exceptions & QC Quarantine Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management for flagged units (Damaged in storage, damaged in transit, lost freight, manufacturer recalls).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-200">
            {exceptionItems.length} Total Flagged Units
          </span>
        </div>
      </div>

      {/* Exception Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-rose-50/60 border border-rose-200/80 rounded-2xl">
          <span className="text-xs font-bold text-rose-800">Damaged in Storage</span>
          <div className="text-2xl font-extrabold text-rose-900 mt-1">
            {items.filter((i) => i.status === 'damaged_in_storage').length}
          </div>
          <p className="text-[11px] text-rose-600 mt-0.5">Warehouse handling anomalies</p>
        </div>

        <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
          <span className="text-xs font-bold text-amber-800">Damaged in Transit</span>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">
            {items.filter((i) => i.status === 'damaged_in_transit').length}
          </div>
          <p className="text-[11px] text-amber-600 mt-0.5">Freight transport cargo impact</p>
        </div>

        <div className="p-4 bg-rose-50/60 border border-rose-200/80 rounded-2xl">
          <span className="text-xs font-bold text-rose-800">Lost in Transit</span>
          <div className="text-2xl font-extrabold text-rose-900 mt-1">
            {items.filter((i) => i.status === 'lost_in_transit').length}
          </div>
          <p className="text-[11px] text-rose-600 mt-0.5">Missing RFID / barcode scan signals</p>
        </div>

        <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-2xl">
          <span className="text-xs font-bold text-purple-800">Returned to Manufacturer</span>
          <div className="text-2xl font-extrabold text-purple-900 mt-1">
            {items.filter((i) => i.status === 'returned_to_manufacturer').length}
          </div>
          <p className="text-[11px] text-purple-600 mt-0.5">Factory recall & replacement</p>
        </div>
      </div>

      {/* Exception Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Flagged Item Exception Resolution Queue</h3>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
          >
            <option value="all_exceptions">All Flagged Exceptions ({exceptionItems.length})</option>
            <option value="damaged_in_storage">Damaged in Storage</option>
            <option value="damaged_in_transit">Damaged in Transit</option>
            <option value="lost_in_transit">Lost in Transit</option>
            <option value="returned_to_manufacturer">Returned to Manufacturer</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-20">QR Label</th>
                <th className="py-3.5 px-4">Barcode UUID</th>
                <th className="py-3.5 px-4">Die-Cast Product</th>
                <th className="py-3.5 px-4">Current Hub</th>
                <th className="py-3.5 px-4">Exception Reason</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                      <p className="font-bold text-slate-700">No active exceptions in this category.</p>
                      <p className="text-[11px]">All items are progressing through healthy transit milestones.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedItems.map((item) => {
                  const meta = STATUS_METADATA[item.status];
                  return (
                    <tr key={item.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="p-1 bg-white border border-slate-200 rounded-lg inline-block">
                          <QRCodeSVG value={item.barcode_id} size={40} />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {item.barcode_id.slice(0, 16)}...
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {item.product?.name}
                        <div className="text-[11px] font-normal text-emerald-600 font-bold">
                          ₹{(item.product?.price || 0).toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-500" />
                          {item.location}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full font-bold border border-rose-200 inline-flex items-center gap-1 text-[11px]">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          {meta.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setStatusModalItem(item)}
                            className="px-2.5 py-1.5 text-[11px] font-bold bg-white hover:bg-slate-50 text-slate-700 hover:text-orange-600 border border-slate-200 rounded-lg shadow-2xs transition-all flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Re-route</span>
                          </button>
                          <button
                            onClick={() => setMilestoneModalItem(item)}
                            className="px-2.5 py-1.5 text-[11px] font-bold bg-slate-900 text-white rounded-lg shadow-2xs hover:bg-slate-800 transition-all flex items-center gap-1"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <StatusUpdateModal
        item={statusModalItem}
        isOpen={!!statusModalItem}
        onClose={() => setStatusModalItem(null)}
        onSaveStatus={handleSaveStatus}
      />

      <MilestoneProgressBar
        item={milestoneModalItem}
        isOpen={!!milestoneModalItem}
        onClose={() => setMilestoneModalItem(null)}
      />
    </div>
  );
}
