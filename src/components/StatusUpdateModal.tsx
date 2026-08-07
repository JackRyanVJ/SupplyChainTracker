'use client';

import React, { useState } from 'react';
import { InventoryItem, InventoryStatus, STATUS_METADATA } from '@/types/database';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Truck, 
  Building2, 
  Warehouse, 
  PackageCheck, 
  RotateCcw, 
  MapPin, 
  Loader2 
} from 'lucide-react';

interface StatusUpdateModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveStatus: (itemId: string, newStatus: InventoryStatus, newLocation?: string) => Promise<void>;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  item,
  isOpen,
  onClose,
  onSaveStatus,
}) => {
  if (!isOpen || !item) return null;

  const [selectedStatus, setSelectedStatus] = useState<InventoryStatus>(item.status);
  const [customLocation, setCustomLocation] = useState(item.location);
  const [isSaving, setIsSaving] = useState(false);

  const standardStatuses: InventoryStatus[] = [
    'in_warehouse',
    'in_transit',
    'at_distributor',
    'delivered',
  ];

  const exceptionStatuses: InventoryStatus[] = [
    'damaged_in_storage',
    'damaged_in_transit',
    'lost_in_transit',
    'returned_to_manufacturer',
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveStatus(item.id, selectedStatus, customLocation);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusIcon = (status: InventoryStatus) => {
    switch (status) {
      case 'in_warehouse':
        return <Warehouse className="w-4 h-4 text-blue-600" />;
      case 'in_transit':
        return <Truck className="w-4 h-4 text-amber-600" />;
      case 'at_distributor':
        return <Building2 className="w-4 h-4 text-indigo-600" />;
      case 'delivered':
        return <PackageCheck className="w-4 h-4 text-emerald-600" />;
      case 'damaged_in_storage':
      case 'damaged_in_transit':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'lost_in_transit':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'returned_to_manufacturer':
        return <RotateCcw className="w-4 h-4 text-rose-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Update Inventory Status & Location
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Barcode: {item.barcode_id} • {item.product?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Standard Progression */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Standard Supply Chain Progression
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {standardStatuses.map((st) => {
                const meta = STATUS_METADATA[st];
                const isSelected = selectedStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={`p-3 rounded-xl text-left border transition-all duration-150 flex items-start gap-3 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">{getStatusIcon(st)}</div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900">{meta.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                        {meta.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Exception Statuses */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-rose-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Flag Status Exception
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {exceptionStatuses.map((st) => {
                const meta = STATUS_METADATA[st];
                const isSelected = selectedStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    className={`p-3 rounded-xl text-left border transition-all duration-150 flex items-start gap-3 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/20'
                        : 'border-rose-100/80 bg-rose-50/30 hover:border-rose-300 hover:bg-rose-50'
                    }`}
                  >
                    <div className="mt-0.5">{getStatusIcon(st)}</div>
                    <div>
                      <div className="text-xs font-bold text-rose-900">{meta.label}</div>
                      <div className="text-[10px] text-rose-600/80 mt-0.5 line-clamp-1">
                        {meta.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Current Location Field */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Update Current Tracking Location
            </label>
            <input
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="e.g. Warehouse Dock B, Bay 4 (Los Angeles, CA)"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-800"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 text-xs font-semibold text-white bg-brand-orange hover:bg-brand-orangeHover rounded-lg shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Save Status Change</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
