'use client';

import React from 'react';
import { InventoryItem, STATUS_METADATA } from '@/types/database';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Warehouse, 
  Truck, 
  Building2, 
  PackageCheck, 
  AlertOctagon, 
  Check, 
  X, 
  MapPin, 
  ShieldAlert,
  Clock
} from 'lucide-react';

interface MilestoneProgressBarProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MilestoneProgressBar: React.FC<MilestoneProgressBarProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !item) return null;

  const currentMeta = STATUS_METADATA[item.status] || {
    label: item.status,
    type: 'standard',
    stepIndex: 0,
    description: '',
  };

  const isException = currentMeta.type === 'exception';

  const milestones = [
    {
      index: 0,
      title: 'Warehouse Vault',
      subtitle: 'Inventory Intake',
      icon: Warehouse,
    },
    {
      index: 1,
      title: 'Freight Transit',
      subtitle: 'Onboard Cargo Transport',
      icon: Truck,
    },
    {
      index: 2,
      title: 'Regional Hub',
      subtitle: 'Distributor Check-in',
      icon: Building2,
    },
    {
      index: 3,
      title: 'Final Delivery',
      subtitle: 'Handed to Customer',
      icon: PackageCheck,
    },
  ];

  const getStepStatus = (stepIndex: number) => {
    if (isException) {
      if (stepIndex < currentMeta.stepIndex) return 'completed';
      if (stepIndex === currentMeta.stepIndex) return 'exception';
      return 'upcoming';
    }
    if (stepIndex < currentMeta.stepIndex) return 'completed';
    if (stepIndex === currentMeta.stepIndex) return 'current';
    return 'upcoming';
  };

  const carAvatar = item.product?.image_url || '/reference_images/media_1786116993418.png';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-modal overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Infographic Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center">
              <QRCodeSVG value={item.barcode_id} size={48} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {item.barcode_id.slice(0, 18)}...
                </span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                    isException
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {currentMeta.label}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {item.product?.name || 'Hot Wheels Unit'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Infographic Milestone Track Section with Dynamic Car Thumbnail Avatar */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Milestone Tracking Bar
            </h4>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Scan Time: {new Date(item.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Stepper with Car Avatar moving on track */}
          <div className="relative py-6 px-4">
            {/* Connecting Track Line */}
            <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-2 bg-slate-100 rounded-full z-0 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isException ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{
                  width: `${(currentMeta.stepIndex / 3) * 100}%`,
                }}
              />
            </div>

            {/* Step Nodes & Moving Vehicle Icon */}
            <div className="relative z-10 flex items-center justify-between">
              {milestones.map((m) => {
                const status = getStepStatus(m.index);
                const Icon = m.icon;
                const isCarHere = m.index === currentMeta.stepIndex;

                return (
                  <div key={m.index} className="flex flex-col items-center relative group">
                    {/* Floating Car Thumbnail Avatar when active at this milestone */}
                    {isCarHere && (
                      <div className="absolute -top-12 animate-bounce z-20 flex flex-col items-center">
                        <div className="w-14 h-9 p-0.5 bg-white border-2 border-orange-500 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                          <img
                            src={carAvatar}
                            alt="Active Vehicle Location"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-orange-500 -mt-0.5"></div>
                      </div>
                    )}

                    {/* Step Node Circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                        status === 'completed'
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                          : status === 'current'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-600 ring-4 ring-emerald-500/10'
                          : status === 'exception'
                          ? 'bg-rose-500 border-rose-500 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {status === 'completed' ? (
                        <Check className="w-6 h-6 stroke-[2.5]" />
                      ) : status === 'exception' ? (
                        <AlertOctagon className="w-6 h-6 stroke-[2.5]" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Step Labels */}
                    <div className="text-center mt-3 max-w-[110px]">
                      <div
                        className={`text-xs font-bold leading-tight ${
                          status === 'exception'
                            ? 'text-rose-600'
                            : status === 'completed' || status === 'current'
                            ? 'text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {m.title}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {m.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exception Alert Card */}
          {isException && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-xs text-rose-900">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-rose-900">Exception Flagged: {currentMeta.label}</h5>
                <p className="text-rose-700 mt-0.5 leading-relaxed">
                  {currentMeta.description} The die-cast vehicle progress has been flagged. Use the status modal to clear or route for factory replacement.
                </p>
              </div>
            </div>
          )}

          {/* Metadata Card in INR (₹) */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block font-medium">Product SKU</span>
              <span className="font-mono font-bold text-slate-800">{item.product?.sku}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block font-medium">Catalog Price (INR)</span>
              <span className="font-bold text-emerald-600">₹{(item.product?.price || 0).toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block font-medium">Batch Serial</span>
              <span className="font-mono font-medium text-slate-700">{item.batch_number || 'BATCH-2026-A1'}</span>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <span className="text-slate-400 text-[11px] block font-medium">Current Tracked Location</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                {item.location}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-medium">
            Dynamic Die-Cast Visual Progress Engine
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            Close Progress Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
