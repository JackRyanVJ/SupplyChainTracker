'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, DataService } from '@/lib/supabase';
import { Sidebar } from '@/components/Sidebar';
import { InventoryItem } from '@/types/database';
import { Bell, RefreshCw } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local or Supabase auth session
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const hasLocalDemo = typeof window !== 'undefined' && localStorage.getItem('hw_authenticated') === 'true';

      if (!data.session && !hasLocalDemo) {
        router.push('/login');
      }
    };
    checkAuth();
    loadInventory();
  }, [router]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const items = await DataService.getInventoryItems();
      setInventory(items);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hw_authenticated');
    }
    router.push('/login');
  };

  const exceptionCount = inventory.filter((i) =>
    ['damaged_in_storage', 'damaged_in_transit', 'lost_in_transit', 'returned_to_manufacturer'].includes(i.status)
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Fixed Sidebar with Official Hot Wheels SVG Logo */}
      <Sidebar
        inventoryCount={inventory.length}
        exceptionCount={exceptionCount}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Hot Wheels Supply Chain & Inventory Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Sync Refresh Button */}
            <button
              onClick={loadInventory}
              title="Refresh live database state"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Notification Indicator */}
            <div className="relative">
              <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200">
                <Bell className="w-4 h-4" />
              </button>
              {exceptionCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </div>

            {/* User Badge */}
            <div className="pl-3 border-l border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-700">Database Connected</span>
              <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                Live Syncing
              </span>
            </div>
          </div>
        </header>

        {/* Page Children Container */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
