'use client';

import React, { useEffect, useState } from 'react';
import { DataService } from '@/lib/supabase';
import { InventoryItem, InventoryStatus } from '@/types/database';
import { InventoryTable } from '@/components/InventoryTable';
import { StatusUpdateModal } from '@/components/StatusUpdateModal';
import { MilestoneProgressBar } from '@/components/MilestoneProgressBar';
import { MetricsCards } from '@/components/MetricsCards';
import { Loader2 } from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [statusModalItem, setStatusModalItem] = useState<InventoryItem | null>(null);
  const [milestoneModalItem, setMilestoneModalItem] = useState<InventoryItem | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await DataService.getInventoryItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to load inventory', err);
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Overview Metrics */}
      <MetricsCards items={items} />

      {/* Main Inventory & QR Data Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-500 mb-2" />
          <p className="text-xs font-semibold text-slate-600">Loading live inventory database...</p>
        </div>
      ) : (
        <InventoryTable
          items={items}
          onOpenStatusModal={(item) => setStatusModalItem(item)}
          onOpenMilestoneModal={(item) => setMilestoneModalItem(item)}
        />
      )}

      {/* Status Update Modal */}
      <StatusUpdateModal
        item={statusModalItem}
        isOpen={!!statusModalItem}
        onClose={() => setStatusModalItem(null)}
        onSaveStatus={handleSaveStatus}
      />

      {/* Visual Milestone Progress Tracker */}
      <MilestoneProgressBar
        item={milestoneModalItem}
        isOpen={!!milestoneModalItem}
        onClose={() => setMilestoneModalItem(null)}
      />
    </div>
  );
}
