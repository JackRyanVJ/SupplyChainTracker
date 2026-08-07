import { createClient } from '@supabase/supabase-js';
import { InventoryItem, InventoryStatus, Product, APPROVED_HOT_WHEELS_MODELS } from '@/types/database';

function cleanEnv(val: string | undefined): string {
  if (!val) return '';
  let cleaned = val.trim();
  if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kkyfwtezolkwfplzpyqt.supabase.co';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtreWZ3dGV6b2xrd2ZwbHpweXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxMDM0MjEsImV4cCI6MjEwMTY3OTQyMX0.eoisNt1SAYA6iqDyyy5h0KfqqhbQFBH1H2PoOBHV5ac';

export const supabaseUrl = cleanEnv(rawUrl);
export const supabaseAnonKey = cleanEnv(rawKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 6 Initial Products matching the 6 models
export const INITIAL_PRODUCTS: Product[] = APPROVED_HOT_WHEELS_MODELS.map((m, idx) => ({
  id: m.id,
  sku: m.sku,
  name: m.name,
  description: m.description,
  price: m.price,
  image_url: m.referenceImage,
  created_at: new Date(Date.now() - 86400000 * (6 - idx)).toISOString(),
}));

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-uuid-1',
    product_id: 'hw-clk-63',
    barcode_id: '7f91a2bc-3891-4e20-9f5a-38190281902a',
    status: 'in_warehouse',
    location: 'Central Storage Hub (Dock A-12, Mumbai, IN)',
    batch_number: 'BATCH-2026-A1',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    product: INITIAL_PRODUCTS[0],
  },
  {
    id: 'inv-uuid-2',
    product_id: 'hw-celica-77',
    barcode_id: 'e490184b-0129-4ab9-8e2b-10293849102c',
    status: 'in_transit',
    location: 'National Highway Express Freight - Container #204',
    batch_number: 'BATCH-2026-A2',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    product: INITIAL_PRODUCTS[1],
  },
  {
    id: 'inv-uuid-3',
    product_id: 'hw-f1-premium',
    barcode_id: 'c8201948-1830-410a-b108-72910481029e',
    status: 'at_distributor',
    location: 'Regional Distribution Hub (Bengaluru Logistics Park)',
    batch_number: 'BATCH-2026-B1',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    product: INITIAL_PRODUCTS[2],
  },
  {
    id: 'inv-uuid-4',
    product_id: 'hw-jaguar-etype',
    barcode_id: 'a9102938-4819-4cb9-910a-38190481028f',
    status: 'in_warehouse',
    location: 'Logistics Vault - Section B, Delhi',
    batch_number: 'BATCH-2026-B2',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    product: INITIAL_PRODUCTS[3],
  },
  {
    id: 'inv-uuid-5',
    product_id: 'hw-mercedes-300sl',
    barcode_id: 'd9102938-1294-4ab9-9910-18293849102b',
    status: 'at_distributor',
    location: 'Chennai Logistics Distribution Hub',
    batch_number: 'BATCH-2026-C2',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    product: INITIAL_PRODUCTS[4],
  },
  {
    id: 'inv-uuid-6',
    product_id: 'hw-audi-quattro-84',
    barcode_id: 'f1029384-9102-4bc9-8819-91029384819c',
    status: 'in_warehouse',
    location: 'Hyderabad Storage Facility - Bay 8',
    batch_number: 'BATCH-2026-D1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product: INITIAL_PRODUCTS[5],
  },
];

const LS_PRODUCTS = 'hw_products_store_v6';
const LS_INVENTORY = 'hw_inventory_store_v6';

export const DataService = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch {
      // Fallback
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LS_PRODUCTS);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) return parsed;
        } catch {
          // parse error
        }
      }
      localStorage.setItem(LS_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    return INITIAL_PRODUCTS;
  },

  async addProductWithQuantity(
    productInput: Omit<Product, 'id' | 'created_at'>,
    quantity: number = 1
  ): Promise<{ product: Product; createdItems: InventoryItem[] }> {
    const id = 'prod-' + Date.now();
    const created_at = new Date().toISOString();
    const count = Math.max(1, Math.min(quantity, 500));

    const product: Product = {
      ...productInput,
      id,
      created_at,
    };

    try {
      await supabase.from('products').insert([product]);
    } catch {
      // local
    }

    const createdItems: InventoryItem[] = [];
    const batch_number = `BATCH-${new Date().getFullYear()}-${String.fromCharCode(65 + Math.floor(Math.random() * 6))}${Math.floor(10 + Math.random() * 90)}`;

    for (let i = 0; i < count; i++) {
      const barcode_id = generateUUID();
      const itemId = `inv-${Date.now()}-${i + 1}`;
      
      const item: InventoryItem = {
        id: itemId,
        product_id: product.id,
        barcode_id,
        status: 'in_warehouse',
        location: `Primary Storage Hub (Sector ${String.fromCharCode(65 + (i % 4))}-${(i % 12) + 1})`,
        batch_number,
        created_at,
        updated_at: created_at,
        product,
      };
      createdItems.push(item);
    }

    try {
      const insertRows = createdItems.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        barcode_id: item.barcode_id,
        status: item.status,
        location: item.location,
        batch_number: item.batch_number,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      await supabase.from('inventory_items').insert(insertRows);
    } catch {
      // local
    }

    if (typeof window !== 'undefined') {
      const existingProducts = await this.getProducts();
      const updatedProducts = [product, ...existingProducts.filter((p) => p.id !== product.id)];
      localStorage.setItem(LS_PRODUCTS, JSON.stringify(updatedProducts));

      const existingInv = await this.getInventoryItems();
      const updatedInv = [...createdItems, ...existingInv];
      localStorage.setItem(LS_INVENTORY, JSON.stringify(updatedInv));
    }

    return { product, createdItems };
  },

  async getInventoryItems(): Promise<InventoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*, product:products(*)')
        .order('updated_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as InventoryItem[];
      }
    } catch {
      // Fallback
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LS_INVENTORY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) return parsed;
        } catch {
          // parse error
        }
      }
      localStorage.setItem(LS_INVENTORY, JSON.stringify(INITIAL_INVENTORY));
    }
    return INITIAL_INVENTORY;
  },

  async getItemByBarcode(barcodeId: string): Promise<InventoryItem | null> {
    const items = await this.getInventoryItems();
    return items.find((i) => i.barcode_id.toLowerCase() === barcodeId.trim().toLowerCase()) || null;
  },

  async updateItemStatus(itemId: string, newStatus: InventoryStatus, newLocation?: string): Promise<InventoryItem | null> {
    const updated_at = new Date().toISOString();

    try {
      const payload: Record<string, any> = { status: newStatus, updated_at };
      if (newLocation) payload.location = newLocation;
      await supabase.from('inventory_items').update(payload).eq('id', itemId);
    } catch {
      // local
    }

    if (typeof window !== 'undefined') {
      const items = await this.getInventoryItems();
      let targetItem: InventoryItem | null = null;
      const updated = items.map((item) => {
        if (item.id === itemId || item.barcode_id === itemId) {
          targetItem = {
            ...item,
            status: newStatus,
            location: newLocation || item.location,
            updated_at,
          };
          return targetItem;
        }
        return item;
      });

      localStorage.setItem(LS_INVENTORY, JSON.stringify(updated));
      return targetItem;
    }

    return null;
  },
};
