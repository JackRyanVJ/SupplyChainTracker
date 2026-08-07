'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  Boxes, 
  AlertTriangle, 
  BarChart3, 
  LogOut, 
  QrCode, 
  Layers 
} from 'lucide-react';

interface SidebarProps {
  inventoryCount: number;
  exceptionCount: number;
  onLogout: () => void;
}

interface NavLinkItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  inventoryCount,
  exceptionCount,
  onLogout,
}) => {
  const pathname = usePathname();

  const navItems: NavLinkItem[] = [
    { href: '/dashboard/inventory', label: 'Inventory & QR Codes', icon: Boxes, badge: inventoryCount },
    { href: '/dashboard/stock', label: 'Stock', icon: Layers },
    { href: '/dashboard/registry', label: 'AI Product Registry', icon: Package },
    { href: '/dashboard/exceptions', label: 'Status Exceptions', icon: AlertTriangle, badge: exceptionCount, badgeColor: 'bg-rose-100 text-rose-700 font-semibold' },
    { href: '/dashboard/logistics', label: 'Logistics Overview', icon: BarChart3 },
    { href: '/scanner', label: 'Mobile Barcode Scanner', icon: QrCode, badgeColor: 'bg-orange-100 text-orange-700 font-bold' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Top Header & Official Hot Wheels Logo from hw-logo-official.png */}
      <div>
        <div className="h-20 px-4 flex items-center border-b border-slate-100">
          <Link href="/dashboard/inventory" className="flex items-center gap-2">
            <img
              src="/hw-logo-official.png"
              alt="Hot Wheels Official Logo"
              className="h-10 w-auto max-w-[130px] object-contain drop-shadow-xs"
            />
            <div className="pl-1 border-l border-slate-200">
              <span className="text-[9px] uppercase tracking-wider font-extrabold bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100">
                PRO
              </span>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">Supply Portal</p>
            </div>
          </Link>
        </div>

        {/* Database Connected Status Pill */}
        <div className="mx-4 my-4 p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-700 font-semibold text-[11px]">Database Connected</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold">Live Syncing</span>
        </div>

        {/* Navigation Items (Distinct Routes) */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/dashboard/inventory' && pathname === '/dashboard');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 font-bold shadow-2xs border border-orange-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
              AD
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 leading-tight">Logistics Admin</p>
              <p className="text-[10px] text-slate-400">admin@hotwheels.supply</p>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
