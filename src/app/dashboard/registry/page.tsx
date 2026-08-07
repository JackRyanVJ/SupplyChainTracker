'use client';

import React, { useState, useEffect } from 'react';
import { DataService } from '@/lib/supabase';
import { Product, APPROVED_HOT_WHEELS_MODELS } from '@/types/database';
import { AIVisionDropzone } from '@/components/AIVisionDropzone';
import { Package, ShieldCheck, Sparkles } from 'lucide-react';

export default function ProductRegistryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await DataService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'created_at'>, quantity: number) => {
    await DataService.addProductWithQuantity(productData, quantity);
    await loadProducts();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            AI Product Registry & Vision Intake
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Intelligent vision intake restricted to the 8 official Hot Wheels models with verified INR pricing.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>8 Registered Models Active</span>
        </div>
      </div>

      {/* AI Vision Dropzone & Form */}
      <AIVisionDropzone onAddProduct={handleAddProduct} />

      {/* Whitelist Catalog Showcase (8 Models) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Approved 8-Model Catalog Database
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Only images corresponding to these 8 official models will auto-fill with verified catalog prices.
            </p>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            8 Registered Castings
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {APPROVED_HOT_WHEELS_MODELS.map((model) => (
            <div
              key={model.id}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-orange-200 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div style={{ width: '100%', height: '80px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <img
                    src={model.referenceImage}
                    alt={model.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '4px' }}
                  />
                </div>
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {model.sku}
                </span>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                  {model.name}
                </h4>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">
                  ₹{model.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Verified Price</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
