'use client';

import React, { useState } from 'react';
import { Product } from '@/types/database';
import { Plus, Tag, FileText, DollarSign, Barcode, CheckCircle2, Loader2 } from 'lucide-react';

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim() || !price.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setErrorMsg('Please enter a valid positive price.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await onAddProduct({
        sku: sku.trim().toUpperCase(),
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
      });

      setSuccessMsg(`Product "${name}" registered successfully & barcode assigned!`);
      setSku('');
      setName('');
      setDescription('');
      setPrice('');

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to add product to catalog.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickPreset = (presetSku: string, presetName: string, presetPrice: number, presetDesc: string) => {
    setSku(presetSku);
    setName(presetName);
    setPrice(presetPrice.toString());
    setDescription(presetDesc);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-subtle p-6 mb-8">
      {/* Form Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Plus className="w-4 h-4 text-orange-500" />
            Product Registry Entry
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Insert new die-cast product models into the Supabase database catalog.
          </p>
        </div>
        
        {/* Preset Helper Pills */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Quick Fill:</span>
          <button
            type="button"
            onClick={() => handleQuickPreset('HW-SHARK-05', 'Sharkruiser Special', 5.49, 'Aggressive shark-styled body with moveable jaw')}
            className="text-[11px] px-2.5 py-1 bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 rounded-md border border-slate-200 transition-colors font-medium"
          >
            + Sharkruiser
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('HW-[#BULL]-06', 'Red Bull Racing RB19', 14.99, '1:64 scale precision diecast formula racer')}
            className="text-[11px] px-2.5 py-1 bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 rounded-md border border-slate-200 transition-colors font-medium"
          >
            + RB19 Formula
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SKU Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Barcode className="w-3.5 h-3.5 text-slate-400" />
              Product SKU <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. HW-BONESHAKER-01"
              required
              className="w-full px-3.5 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono placeholder:text-slate-400"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Product Name <span className="text-orange-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hot Wheels Twin Mill III"
              required
              className="w-full px-3.5 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              Unit Price (USD) <span className="text-orange-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 4.99"
              required
              className="w-full px-3.5 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400 font-mono"
            />
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Product Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Die-cast 1:64 vehicle with metallic finish and racing livery"
            className="w-full px-3.5 py-2 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-brand-orange hover:bg-brand-orangeHover text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Insert Product Row</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
