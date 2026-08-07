'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/inventory');
  }, [router]);

  return (
    <div className="p-12 text-center text-xs font-semibold text-slate-400">
      <div className="inline-block w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
      <p>Routing to Inventory Registry...</p>
    </div>
  );
}
