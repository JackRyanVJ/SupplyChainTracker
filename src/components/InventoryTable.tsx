'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { InventoryItem, InventoryStatus, STATUS_METADATA } from '@/types/database';
import { 
  QrCode, 
  RefreshCw, 
  MapPin, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronRight,
  Maximize2,
  ScanLine
} from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  onOpenStatusModal: (item: InventoryItem) => void;
  onOpenMilestoneModal: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onOpenStatusModal,
  onOpenMilestoneModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQrItem, setSelectedQrItem] = useState<InventoryItem | null>(null);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.barcode_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product?.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'exceptions') {
      return (
        matchesSearch &&
        ['damaged_in_storage', 'damaged_in_transit', 'lost_in_transit', 'returned_to_manufacturer'].includes(item.status)
      );
    }
    return matchesSearch && item.status === statusFilter;
  });

  const getStatusBadgeClass = (status: InventoryStatus) => {
    switch (status) {
      case 'in_warehouse':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in_transit':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'at_distributor':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'damaged_in_storage':
      case 'damaged_in_transit':
      case 'lost_in_transit':
      case 'returned_to_manufacturer':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
      {/* Table Top Controls */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <QrCode style={{ width: '16px', height: '16px', color: '#f97316' }} />
            <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>
              Live Serialized Inventory Records & Scannable QR Codes
            </h2>
          </div>
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            Displaying live database records. Every die-cast unit is serialized with a unique UUID barcode.
          </p>
        </div>

        {/* Filter Controls & Scanner Link */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/scanner"
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: '#f97316',
              color: '#ffffff',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ScanLine style={{ width: '14px', height: '14px' }} />
            <span>Mobile Scanner</span>
          </Link>

          <div style={{ position: 'relative', minWidth: '200px' }}>
            <Search style={{ width: '14px', height: '14px', color: '#94a3b8', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search UUID, SKU, Model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '32px', paddingRight: '10px', paddingTop: '4px', paddingBottom: '4px', fontSize: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <SlidersHorizontal style={{ width: '12px', height: '12px', color: '#94a3b8' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '4px 8px', fontSize: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', color: '#334155', outline: 'none' }}
            >
              <option value="all">All Statuses ({items.length})</option>
              <option value="exceptions">Exceptions Only</option>
              <option value="in_warehouse">In Warehouse</option>
              <option value="in_transit">In Transit</option>
              <option value="at_distributor">At Distributor</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dense, Compact HTML Table */}
      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '8px 16px', width: '80px' }}>QR Label</th>
              <th style={{ padding: '8px 16px' }}>Unique Barcode UUID</th>
              <th style={{ padding: '8px 16px' }}>Model Details</th>
              <th style={{ padding: '8px 16px' }}>Location</th>
              <th style={{ padding: '8px 16px' }}>Status</th>
              <th style={{ padding: '8px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '12px' }}>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <QrCode style={{ width: '24px', height: '24px', color: '#cbd5e1' }} />
                    <p style={{ fontWeight: '600', color: '#475569', fontSize: '12px' }}>No inventory units found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const statusMeta = STATUS_METADATA[item.status] || { label: item.status, type: 'standard' };
                const isException = statusMeta.type === 'exception';

                return (
                  <tr
                    key={item.id}
                    style={{ borderBottom: '1px solid #f1f5f9' }}
                  >
                    {/* QR Code Column */}
                    <td style={{ padding: '8px 16px', verticalAlign: 'middle' }}>
                      <div 
                        onClick={() => setSelectedQrItem(item)}
                        style={{ width: '40px', height: '40px', padding: '2px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Click to expand QR"
                      >
                        <QRCodeSVG
                          value={item.barcode_id}
                          size={36}
                          level="M"
                          includeMargin={false}
                        />
                      </div>
                    </td>

                    {/* Barcode UUID */}
                    <td style={{ padding: '8px 16px', verticalAlign: 'middle' }}>
                      <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#0f172a', fontSize: '12px', letterSpacing: '-0.02em' }}>
                        {item.barcode_id.slice(0, 20)}...
                      </div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                        {item.batch_number || 'BATCH-2026-A1'}
                      </div>
                    </td>

                    {/* Model Details with Nuclear Inline Thumbnail Box */}
                    <td style={{ padding: '8px 16px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {item.product?.image_url && (
                          <div style={{ width: '64px', height: '48px', overflow: 'hidden', display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', borderRadius: '4px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                            <img
                              src={item.product.image_url}
                              alt={item.product.name}
                              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '2px', display: 'block', maxWidth: '64px', maxHeight: '48px' }}
                            />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '12px', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.product?.name || 'Hot Wheels Unit'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '10px', backgroundColor: '#f1f5f9', color: '#475569', padding: '1px 4px', borderRadius: '2px', border: '1px solid #e2e8f0' }}>
                              {item.product?.sku || 'HW-SKU'}
                            </span>
                            <span style={{ fontWeight: 'bold', color: '#16a34a', fontSize: '11px' }}>
                              ₹{(item.product?.price || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td style={{ padding: '8px 16px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#475569', fontSize: '11px' }}>
                        <MapPin style={{ width: '12px', height: '12px', color: '#94a3b8', flexShrink: 0 }} />
                        <span style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.location}</span>
                      </div>
                    </td>

                    {/* Status Pill Badge */}
                    <td style={{ padding: '8px 16px', verticalAlign: 'middle' }}>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadgeClass(
                          item.status
                        )}`}
                      >
                        {isException ? (
                          <AlertTriangle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                        )}
                        <span>{statusMeta.label}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '8px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => onOpenStatusModal(item)}
                          style={{ padding: '4px 8px', fontSize: '10px', fontWeight: 'bold', backgroundColor: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <RefreshCw style={{ width: '10px', height: '10px' }} />
                          <span>Update</span>
                        </button>
                        <button
                          onClick={() => onOpenMilestoneModal(item)}
                          style={{ padding: '4px 8px', fontSize: '10px', fontWeight: 'bold', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                        >
                          <span>Milestone</span>
                          <ChevronRight style={{ width: '10px', height: '10px' }} />
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

      {/* Footer Info */}
      <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
        <div>
          Showing <strong>{filteredItems.length}</strong> of <strong>{items.length}</strong> inventory records
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'monospace', fontSize: '10px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
          <span>RFC4122 v4 UUID Compliant</span>
        </div>
      </div>
    </div>
  );
};
