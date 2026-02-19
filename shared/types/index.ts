export interface Order {
  id: string
  vendorId: string
  vendorName: string
  orderDate: string
  deliveryDate: string
  status: 'Draft' | 'Open' | 'Sent' | 'Needs Receiving' | 'Partially Received' | 'Received' | 'Closed'
  total: number
  itemCount: number
  memo?: string
}

export interface Invoice {
  id: string
  vendorId: string
  vendorName: string
  poNumber: string
  invoiceDate: string
  dueDate?: string
  deliveryDate: string
  status: 'Draft' | 'Pending' | 'Finalized' | 'Rejected'
  subtotal: number
  gst: number
  total: number
  updatedAt: string
}

export interface OrderItem {
  id: number
  name: string
  sku: string
  quantity: number
  unit: string
  cost: number
}

export interface VendorProduct {
  id: string
  name: string
  sku: string
  price: number
  unit: string
}

export interface Vendor {
  id: string
  name: string
  status: 'Active' | 'Excluded'
  lastOrder: string
  contactName: string
  email: string
  catalogItems: number
  products: VendorProduct[]
}

export interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  type: 'Raw' | 'Prep' | 'Menu'
  onHand: number
  unit: string
  cost: number
  par: number
  lastCount: string
  locations: string[]
}

export interface Recipe {
  id: string
  name: string
  category: string
  yield: number
  yieldUnit: string
  cost: number
  price: number
  foodCostPercent: number
  ingredients: number
}

export interface Table {
  id: string
  name: string
  capacity: number
  status: 'Available' | 'Occupied' | 'Dirty' | 'Reserved'
  server?: string
  guests?: number
  checkTotal?: number
  timeSeated?: string
}

export interface InventoryPosting {
  id: string
  date: string
  location: string
  status: 'Draft' | 'Posted'
  itemsCounted: number
  totalItems: number
  createdBy: string
}
