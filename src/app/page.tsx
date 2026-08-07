'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/inventory');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
        <span>Loading Hot Wheels Portal...</span>
      </div>
    </div>
  );
}
