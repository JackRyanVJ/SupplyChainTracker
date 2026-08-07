export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number; // in INR (₹)
  image_url?: string;
  created_at?: string;
}

export type InventoryStatus =
  | 'in_warehouse'
  | 'in_transit'
  | 'at_distributor'
  | 'delivered'
  | 'damaged_in_storage'
  | 'damaged_in_transit'
  | 'lost_in_transit'
  | 'returned_to_manufacturer';

export interface InventoryItem {
  id: string;
  product_id: string;
  barcode_id: string; // Unique RFC4122 v4 UUID
  status: InventoryStatus;
  location: string;
  batch_number?: string;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface StatusOption {
  value: InventoryStatus;
  label: string;
  type: 'standard' | 'exception';
  stepIndex: number;
  description: string;
}

export const STATUS_METADATA: Record<InventoryStatus, StatusOption> = {
  in_warehouse: {
    value: 'in_warehouse',
    label: 'In Warehouse',
    type: 'standard',
    stepIndex: 0,
    description: 'Item stored safely in primary distribution center.',
  },
  in_transit: {
    value: 'in_transit',
    label: 'In Transit',
    type: 'standard',
    stepIndex: 1,
    description: 'Item onboard express transport vehicle.',
  },
  at_distributor: {
    value: 'at_distributor',
    label: 'At Distributor',
    type: 'standard',
    stepIndex: 2,
    description: 'Item checked in at regional logistics distributor.',
  },
  delivered: {
    value: 'delivered',
    label: 'Delivered',
    type: 'standard',
    stepIndex: 3,
    description: 'Item successfully delivered to final destination.',
  },
  damaged_in_storage: {
    value: 'damaged_in_storage',
    label: 'Damaged in Storage',
    type: 'exception',
    stepIndex: 0,
    description: 'Physical casting damage sustained during warehouse handling.',
  },
  damaged_in_transit: {
    value: 'damaged_in_transit',
    label: 'Damaged in Transit',
    type: 'exception',
    stepIndex: 1,
    description: 'Packaging or casting damage incurred during transport.',
  },
  lost_in_transit: {
    value: 'lost_in_transit',
    label: 'Lost in Transit',
    type: 'exception',
    stepIndex: 1,
    description: 'Package signal unlocatable during freight scan.',
  },
  returned_to_manufacturer: {
    value: 'returned_to_manufacturer',
    label: 'Returned to Manufacturer',
    type: 'exception',
    stepIndex: 0,
    description: 'Item recalled or flagged for factory inspection and replacement.',
  },
};

export interface ApprovedHotWheelsModel {
  id: string;
  sku: string;
  name: string;
  price: number; // INR (₹)
  description: string;
  referenceImage: string;
  keywords: string[];
}

// 6 Authorized Models (5th and 8th rows removed)
export const APPROVED_HOT_WHEELS_MODELS: ApprovedHotWheelsModel[] = [
  {
    id: 'hw-clk-63',
    sku: 'HW-CLK-63-BLK',
    name: 'Hot Wheels Die-Cast 2008 Mercedes-Benz Clk 63 Amg Black Series',
    price: 1659,
    description: 'German performance coupe in pure white finish with AMG styling and widebody arches.',
    referenceImage: '/reference_images/media_1786124239617.png',
    keywords: ['clk', 'clk63', 'clk-63', 'amg', 'black series', '1786124239617', '1786121897142'],
  },
  {
    id: 'hw-celica-77',
    sku: 'HW-CELICA-1977',
    name: 'Hot Wheels Die-Cast 1977 Toyota Celica Premium',
    price: 1249,
    description: 'Classic Japanese fastback muscle silhouette in obsidian finish with chrome bumpers.',
    referenceImage: '/reference_images/media_1786116993418.png',
    keywords: ['toyota', 'celica', '1977', '1786116993418'],
  },
  {
    id: 'hw-f1-premium',
    sku: 'HW-F1-PREM-44',
    name: 'Hot Wheels Premium Die-Cast Formula 1',
    price: 2079,
    description: 'Grand Prix open-wheel racer with Petronas teal livery and slick aerodynamic wings.',
    referenceImage: '/reference_images/media_1786116993435.png',
    keywords: ['formula', 'f1', 'petronas', '1786116993435'],
  },
  {
    id: 'hw-jaguar-etype',
    sku: 'HW-MOMA-JAG-ETYPE',
    name: 'Hot Wheels x MoMA Jaguar E-Type Roadster',
    price: 3499,
    description: 'Curated museum edition Jaguar convertible in dark navy blue with classic spoke wheels.',
    referenceImage: '/reference_images/media_1786116993519.jpg',
    keywords: ['jaguar', 'etype', 'e-type', 'moma', '1786116993519'],
  },
  {
    id: 'hw-mercedes-300sl',
    sku: 'HW-MERC-300SL',
    name: 'Hot Wheels Mercedes-Benz 300 SL',
    price: 2499,
    description: 'Classic vintage Gullwing coupe in metallic sapphire blue with chrome side trim.',
    referenceImage: '/reference_images/media_1786117226108.png',
    keywords: ['300sl', '300 sl', '300', 'gullwing', 'benz', '1786117226108'],
  },
  {
    id: 'hw-audi-quattro-84',
    sku: 'HW-AUDI-QUATTRO-84',
    name: 'Hot Wheels ’84 Audi Sport Quattro',
    price: 2899,
    description: 'Group B rally icon in signal red with aggressive box flared arches and white rally wheels.',
    referenceImage: '/reference_images/media_1786117226076.png',
    keywords: ['audi', 'quattro', '84 audi', '1786117226076'],
  },
];
