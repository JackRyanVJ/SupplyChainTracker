'use client';

import React, { useState, useRef } from 'react';
import { Product, APPROVED_HOT_WHEELS_MODELS, ApprovedHotWheelsModel } from '@/types/database';
import { 
  UploadCloud, 
  CheckCircle2, 
  ShieldAlert, 
  Plus, 
  Tag, 
  DollarSign, 
  Barcode, 
  FileText, 
  Loader2,
  ScanEye,
  Hash
} from 'lucide-react';

interface AIVisionDropzoneProps {
  onAddProduct: (product: Omit<Product, 'id' | 'created_at'>, quantity: number) => Promise<void>;
}

export const AIVisionDropzone: React.FC<AIVisionDropzoneProps> = ({ onAddProduct }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchedModel, setMatchedModel] = useState<ApprovedHotWheelsModel | null>(null);
  const [isUnrecognized, setIsUnrecognized] = useState(false);
  
  // Damage QC Modal State
  const [showDamageWarning, setShowDamageWarning] = useState(false);
  const [pendingDamagedModel, setPendingDamagedModel] = useState<ApprovedHotWheelsModel | null>(null);

  // Form Fields
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Simulation damage flag
  const [simulateDamage, setSimulateDamage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const matchFilename = (filenameStr: string): ApprovedHotWheelsModel | null => {
    const fn = filenameStr.toLowerCase();

    if (fn.includes('clk') || fn.includes('amg') || fn.includes('black series') || fn.includes('1786121897142')) {
      return APPROVED_HOT_WHEELS_MODELS[0];
    }
    if (fn.includes('toyota') || fn.includes('celica') || fn.includes('1977') || fn.includes('1786116993418')) {
      return APPROVED_HOT_WHEELS_MODELS[1];
    }
    if (fn.includes('formula') || fn.includes('f1') || fn.includes('petronas') || fn.includes('1786116993435')) {
      return APPROVED_HOT_WHEELS_MODELS[2];
    }
    if (fn.includes('jaguar') || fn.includes('etype') || fn.includes('e-type') || fn.includes('moma') || fn.includes('1786116993519')) {
      return APPROVED_HOT_WHEELS_MODELS[3];
    }
    if (fn.includes('stagea') || fn.includes('nissan') || fn.includes('elite') || fn.includes('1786118162108')) {
      return APPROVED_HOT_WHEELS_MODELS[4];
    }
    if (fn.includes('300sl') || fn.includes('300 sl') || fn.includes('300') || fn.includes('gullwing') || fn.includes('benz') || fn.includes('1786117226108')) {
      return APPROVED_HOT_WHEELS_MODELS[5];
    }
    if (fn.includes('audi') || fn.includes('quattro') || fn.includes('84 audi') || fn.includes('1786117226076')) {
      return APPROVED_HOT_WHEELS_MODELS[6];
    }
    if (fn.includes('bone') || fn.includes('boneshaker') || fn.includes('skull') || fn.includes('1786119562568')) {
      return APPROVED_HOT_WHEELS_MODELS[7];
    }

    return null;
  };

  const processUploadedFile = (uploadedFile: File, isDamagedOverride: boolean = false) => {
    setIsAnalyzing(true);
    setIsUnrecognized(false);
    setMatchedModel(null);
    setSuccessMsg('');

    const objectUrl = URL.createObjectURL(uploadedFile);
    setFile(uploadedFile);
    setPreviewUrl(objectUrl);

    setTimeout(() => {
      const match = matchFilename(uploadedFile.name);

      if (!match) {
        setIsUnrecognized(true);
        setMatchedModel(null);
        setIsAnalyzing(false);
        return;
      }

      const isDamaged = isDamagedOverride || simulateDamage || uploadedFile.name.toLowerCase().includes('damage');
      if (isDamaged) {
        setPendingDamagedModel(match);
        setShowDamageWarning(true);
        setIsAnalyzing(false);
        return;
      }

      applyModelAutoFill(match);
      setIsAnalyzing(false);
    }, 200);
  };

  const applyModelAutoFill = (model: ApprovedHotWheelsModel) => {
    setMatchedModel(model);
    setSku(model.sku);
    setName(model.name);
    setDescription(model.description);
    setPrice(model.price.toString());
    setIsUnrecognized(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (model: ApprovedHotWheelsModel, damaged: boolean = false) => {
    const fakeFile = new File(['hotwheels-binary-data'], `${model.sku.toLowerCase()}${damaged ? '_damaged' : ''}.png`, { type: 'image/png' });
    setPreviewUrl(model.referenceImage);
    processUploadedFile(fakeFile, damaged);
  };

  const handleTriggerUnrecognized = () => {
    const fakeFile = new File(['random-data'], 'unrecognized_diecast.jpg', { type: 'image/jpeg' });
    setPreviewUrl('/reference_images/media_1786116993418.png');
    processUploadedFile(fakeFile);
  };

  const handleConfirmDamaged = () => {
    if (pendingDamagedModel) {
      applyModelAutoFill(pendingDamagedModel);
    }
    setShowDamageWarning(false);
    setPendingDamagedModel(null);
  };

  const handleCancelDamaged = () => {
    setShowDamageWarning(false);
    setPendingDamagedModel(null);
    setFile(null);
    setPreviewUrl(null);
    setMatchedModel(null);
    setIsUnrecognized(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim() || !name.trim() || !price.trim()) {
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) return;

    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      await onAddProduct(
        {
          sku: sku.trim().toUpperCase(),
          name: name.trim(),
          description: description.trim(),
          price: numericPrice,
          image_url: matchedModel?.referenceImage || previewUrl || '/reference_images/media_1786116993418.png',
        },
        quantity
      );

      setSuccessMsg(`Successfully registered "${name}" and generated ${quantity} unique QR barcode rows!`);
      setSku('');
      setName('');
      setDescription('');
      setPrice('');
      setMatchedModel(null);
      setFile(null);
      setPreviewUrl(null);
      setIsUnrecognized(false);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg border border-orange-100">
              <ScanEye className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              AI Auto-Fill Form & Filename Recognition
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload a die-cast photo. The system checks the file name against the 8 whitelisted models to auto-fill details, or prompts for manual entry.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mr-1">
            Presets:
          </span>
          {APPROVED_HOT_WHEELS_MODELS.slice(0, 4).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleSelectPreset(m)}
              className="text-[11px] px-2.5 py-1 bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-600 rounded-md border border-slate-200 transition-colors font-medium"
            >
              {m.name.split(' ')[2] || m.name.slice(0, 14)}
            </button>
          ))}
          <button
            type="button"
            onClick={handleTriggerUnrecognized}
            className="text-[11px] px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-md border border-rose-200 transition-colors font-semibold"
          >
            Test Unrecognized
          </button>
        </div>
      </div>

      {/* Quality Control Damage Warning Dialog Box */}
      {showDamageWarning && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-rose-200 shadow-modal p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Quality Control Flag
              </h3>
              <p className="text-sm font-bold text-rose-600">
                The product is damaged. Do you still want to add it?
              </p>
              <p className="text-xs text-slate-500 pt-1">
                Visual inspection flagged physical anomalies on <strong>{pendingDamagedModel?.name}</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelDamaged}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                No
              </button>
              <button
                type="button"
                onClick={handleConfirmDamaged}
                className="py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Upload Dropzone & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Upload Dropzone with Immediate Exact Preview */}
        <div className="lg:col-span-5 space-y-3">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] ${
              isAnalyzing
                ? 'border-orange-400 bg-orange-50/40 animate-pulse'
                : previewUrl
                ? 'border-slate-300 bg-slate-50'
                : 'border-slate-300 bg-slate-50/50 hover:bg-orange-50/30 hover:border-orange-400'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {previewUrl ? (
              <div className="space-y-2 w-full flex flex-col items-center">
                <div className="relative w-52 h-36 rounded-xl overflow-hidden border border-slate-200 shadow-2xs bg-white flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Exact Uploaded Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  {file?.name || 'Uploaded Die-Cast Photo'} (Click to change)
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 border border-orange-200 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Drop car photo here or <span className="text-orange-600 underline">browse</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Checks filename against 8 whitelisted models
                  </p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-7 h-7 text-orange-500 animate-spin" />
                <span className="text-xs font-bold text-slate-800">Matching filename...</span>
              </div>
            )}
          </div>

          {/* Explicit Error State directly below image preview */}
          {isUnrecognized && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center animate-in fade-in">
              <span className="text-sm font-bold text-rose-700 block">
                Not recognized
              </span>
              <span className="text-[11px] text-rose-600">
                Please enter the SKU, Name, and Price manually below.
              </span>
            </div>
          )}

          {/* Matched Model Banner */}
          {matchedModel && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-950">{matchedModel.name}</p>
                  <p className="text-emerald-700 text-[11px]">Auto-filled Verified Price: ₹{matchedModel.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Damage Test Checkbox */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="damageTest"
                checked={simulateDamage}
                onChange={(e) => setSimulateDamage(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
              />
              <label htmlFor="damageTest" className="font-semibold text-slate-700 cursor-pointer text-[11px]">
                Simulate Damage Detection Warning
              </label>
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">QC Tool</span>
          </div>
        </div>

        {/* Right Col: Product Entry Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product SKU */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Barcode className="w-3.5 h-3.5 text-slate-400" />
                  Product SKU <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. HW-CLK-63-BLK"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                />
              </div>

              {/* Verified Price in INR */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  Unit Price (₹ INR) <span className="text-orange-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="1659"
                    required
                    className="w-full pl-8 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Product Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Product Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hot Wheels Die-Cast 2008 Mercedes-Benz Clk 63 Amg Black Series"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Product Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Die-cast 1:64 precision model with aerodynamic widebody"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* Quantity Input */}
            <div className="p-3.5 bg-orange-50/50 rounded-xl border border-orange-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-orange-600" />
                  Initial Inventory Batch Quantity
                </label>
                <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-100/80 px-2 py-0.5 rounded">
                  {quantity} Distinct QR Rows
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 px-3 py-2 text-xs bg-white border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono font-bold text-slate-900"
                />
                <p className="text-[11px] text-slate-600">
                  Loops and generates <strong>{quantity} unique UUID barcodes</strong> and individual QR code rows.
                </p>
              </div>
            </div>

            {/* Notification */}
            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orangeHover text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating {quantity} Rows...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Insert Product & Generate {quantity} QR Records</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
