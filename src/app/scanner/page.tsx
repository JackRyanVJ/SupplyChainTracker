'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/supabase';
import { InventoryItem, InventoryStatus, STATUS_METADATA } from '@/types/database';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ScanLine, 
  ArrowLeft, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Sparkles, 
  RefreshCw, 
  Zap,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  Package
} from 'lucide-react';

export default function MobileBarcodeScannerPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [activeItem, setActiveItem] = useState<InventoryItem | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      const data = await DataService.getInventoryItems();
      setItems(data);
      if (data.length > 0) {
        // default select first item for instant testing
        setActiveItem(data[0]);
        setScannedBarcode(data[0].barcode_id);
      }
    };
    load();
  }, []);

  const playBeep = () => {
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch {
      // AudioContext not allowed before user interaction
    }
  };

  const handleTriggerScan = async (barcodeToScan: string) => {
    setIsScanning(true);
    setScanSuccess(false);
    setFeedbackMsg('');

    setTimeout(async () => {
      const found = await DataService.getItemByBarcode(barcodeToScan);
      setIsScanning(false);

      if (found) {
        setActiveItem(found);
        setScannedBarcode(found.barcode_id);
        setScanSuccess(true);
        playBeep();
        setFeedbackMsg(`UUID Barcode Recognized: ${found.product?.name}`);
      } else {
        setFeedbackMsg('Barcode not found in live registry.');
      }
    }, 600);
  };

  const handleAdvanceStatus = async (nextStatus: InventoryStatus, nextLocation: string) => {
    if (!activeItem) return;
    const updated = await DataService.updateItemStatus(activeItem.id, nextStatus, nextLocation);
    if (updated) {
      setActiveItem(updated);
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      playBeep();
      setFeedbackMsg(`Status updated to: ${STATUS_METADATA[nextStatus]?.label}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 select-none">
      {/* Top Header Navigation */}
      <div className="max-w-md w-full mb-4 flex items-center justify-between">
        <Link
          href="/dashboard/inventory"
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-600 shadow-2xs transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-700">Laser Scanner v2.4</span>
        </div>
      </div>

      {/* Mobile Device Frame */}
      <div className="max-w-md w-full bg-slate-900 rounded-[36px] p-4 shadow-2xl border-4 border-slate-800 relative overflow-hidden">
        {/* Smartphone Speaker & Camera Notch */}
        <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
        </div>

        {/* Viewport Screen */}
        <div className="bg-slate-950 rounded-[28px] p-5 text-white space-y-4 relative overflow-hidden border border-slate-800">
          {/* Top In-App Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Smartphone className="w-4 h-4 text-orange-500" />
              <span>Die-Cast Field Scanner</span>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400">
              ISO-18004
            </span>
          </div>

          {/* Camera Viewfinder Box with Laser Scan Animation */}
          <div className="relative w-full h-56 bg-slate-900 rounded-2xl border-2 border-dashed border-orange-500/60 overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Viewfinder Corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange-500"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-orange-500"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-orange-500"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-orange-500"></div>

            {/* Red / Orange Laser Scanning Line Animation */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_12px_#ff5500] animate-[bounce_2s_infinite] opacity-90 z-20"></div>

            {/* Target QR in Viewport */}
            {activeItem && (
              <div className="p-3 bg-white rounded-xl shadow-lg relative z-10">
                <QRCodeSVG value={activeItem.barcode_id} size={120} level="H" />
              </div>
            )}

            <div className="absolute bottom-2 text-[10px] text-slate-400 font-mono tracking-wider z-20 bg-slate-950/80 px-2 py-0.5 rounded">
              {isScanning ? 'DECODING OPTICAL SIGNAL...' : 'POINT CAMERA AT DIE-CAST QR'}
            </div>
          </div>

          {/* Quick Barcode Selector Buttons */}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
              Simulate Instant Barcode Scan:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {items.slice(0, 4).map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => handleTriggerScan(it.barcode_id)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                    activeItem?.id === it.id
                      ? 'bg-orange-500/20 border-orange-500 text-orange-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold truncate text-[11px]">{it.product?.name}</span>
                  <span className="font-mono text-[9px] text-slate-400 truncate">{it.barcode_id.slice(0, 14)}...</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scanned Vehicle Card */}
          {activeItem && (
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                {activeItem.product?.image_url && (
                  <div className="w-12 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center p-1 overflow-hidden shrink-0">
                    <img
                      src={activeItem.product.image_url}
                      alt={activeItem.product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{activeItem.product?.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-slate-400">{activeItem.product?.sku}</span>
                    <span className="text-xs font-bold text-emerald-400">
                      ₹{(activeItem.product?.price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div className="flex items-center justify-between text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[11px]">Current Milestone:</span>
                <span className="font-bold text-orange-400">
                  {STATUS_METADATA[activeItem.status]?.label}
                </span>
              </div>

              {/* Automatic Status Advance Actions */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  1-Tap Status Advancement:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus('in_transit', 'National Express Truck #402')}
                    className="p-2 bg-slate-800 hover:bg-amber-600 hover:text-white rounded-xl text-[11px] font-bold text-amber-300 transition-colors text-center"
                  >
                    ➔ Freight Transit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus('at_distributor', 'Regional Hub Bengaluru')}
                    className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl text-[11px] font-bold text-indigo-300 transition-colors text-center"
                  >
                    ➔ Regional Hub
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus('delivered', 'Final Customer Delivery Point')}
                    className="p-2 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-xl text-[11px] font-bold text-emerald-300 transition-colors text-center"
                  >
                    ✓ Mark Delivered
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdvanceStatus('damaged_in_transit', 'Quarantine Inspection Bay')}
                    className="p-2 bg-slate-800 hover:bg-rose-600 hover:text-white rounded-xl text-[11px] font-bold text-rose-300 transition-colors text-center"
                  >
                    ⚠ Flag Exception
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feedback message banner */}
          {feedbackMsg && (
            <div className="p-2.5 bg-orange-950/80 border border-orange-700/80 text-orange-200 text-xs rounded-xl text-center font-medium animate-in fade-in">
              {feedbackMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
