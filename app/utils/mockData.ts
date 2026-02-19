import type { Order, Invoice, OrderItem, Vendor, InventoryItem, Recipe, Table, InventoryPosting } from '~~/shared/types'

export const MOCK_ORDER_ITEMS: Record<string, OrderItem[]> = {
  'PO-8291': [
    { id: 1, name: 'Whole Milk', sku: 'DAIRY-001', quantity: 10, unit: 'GAL', cost: 4.50 },
    { id: 2, name: 'Eggs, Large', sku: 'DAIRY-002', quantity: 5, unit: 'CS', cost: 45.00 },
    { id: 3, name: 'Cheddar Cheese', sku: 'DAIRY-201', quantity: 20, unit: 'LB', cost: 18.50 },
  ],
  'PO-8292': [
    { id: 1, name: 'Organic Arugula', sku: 'PROD-001', quantity: 5, unit: 'CS', cost: 12.50 },
    { id: 2, name: 'Heirloom Tomatoes', sku: 'PROD-002', quantity: 10, unit: 'CS', cost: 24.00 },
  ],
  'PO-8290': [
    { id: 1, name: 'Ground Beef 80/20', sku: 'MEAT-001', quantity: 100, unit: 'LB', cost: 4.25 },
    { id: 2, name: 'Ribeye Steaks', sku: 'MEAT-002', quantity: 50, unit: 'LB', cost: 16.50 },
  ],
}

export const MOCK_POSTINGS: InventoryPosting[] = [
  { id: 'CNT-2024-001', date: '2024-05-21', location: 'Downtown Location', status: 'Posted', itemsCounted: 45, totalItems: 45, createdBy: 'Sarah Jones' },
  { id: 'CNT-2024-002', date: '2024-05-14', location: 'Downtown Location', status: 'Posted', itemsCounted: 42, totalItems: 45, createdBy: 'Mike Smith' },
  { id: 'CNT-2024-003', date: '2024-05-07', location: 'Downtown Location', status: 'Posted', itemsCounted: 45, totalItems: 45, createdBy: 'Sarah Jones' },
]

export const MOCK_ORDERS: Order[] = [
  { id: 'PO-8291', vendorId: 'V-001', vendorName: 'Sysco Foods', orderDate: '2024-05-20', deliveryDate: '2024-05-22', status: 'Sent', total: 1245.50, itemCount: 14, memo: 'Weekly staples restock' },
  { id: 'PO-8292', vendorId: 'V-002', vendorName: 'Baldor Specialty', orderDate: '2024-05-21', deliveryDate: '2024-05-22', status: 'Open', total: 450.00, itemCount: 5, memo: 'Urgent produce' },
  { id: 'PO-8290', vendorId: 'V-003', vendorName: 'Meat Packers Inc', orderDate: '2024-05-19', deliveryDate: '2024-05-21', status: 'Needs Receiving', total: 2300.75, itemCount: 8, memo: 'Special event meats' },
  { id: 'PO-8289', vendorId: 'V-001', vendorName: 'Sysco Foods', orderDate: '2024-05-18', deliveryDate: '2024-05-20', status: 'Closed', total: 980.20, itemCount: 12 },
]

export const addMockOrder = (order: Order) => {
  MOCK_ORDERS.unshift(order)
}

export const updateMockOrderStatus = (id: string, status: Order['status']) => {
  const order = MOCK_ORDERS.find((o) => o.id === id)
  if (order) order.status = status
}

export const updateMockOrder = (id: string, updates: Partial<Order>, items?: OrderItem[]) => {
  const idx = MOCK_ORDERS.findIndex((o) => o.id === id)
  if (idx !== -1) Object.assign(MOCK_ORDERS[idx]!, updates)
  if (items) MOCK_ORDER_ITEMS[id] = items
}

export const MOCK_RECEIVED_ITEMS: Record<string, OrderItem[]> = {}

export const MOCK_INVOICE_ITEMS: Record<string, OrderItem[]> = {}

export const addMockReceiving = (poId: string, items: OrderItem[], allReceived: boolean) => {
  MOCK_RECEIVED_ITEMS[poId] = items
  updateMockOrderStatus(poId, allReceived ? 'Received' : 'Partially Received')
}

export const addMockInvoice = (invoice: Invoice) => MOCK_INVOICES.unshift(invoice)

export const addMockInvoiceItems = (invoiceId: string, items: OrderItem[]) => {
  MOCK_INVOICE_ITEMS[invoiceId] = items
}

export const generateInvoiceNumber = (): string => {
  const existingNumbers = MOCK_INVOICES.map((inv) => {
    const parts = inv.id.split('-')
    const num = parseInt(parts[parts.length - 1] ?? '0', 10)
    return isNaN(num) ? 0 : num
  })
  const maxNum = Math.max(0, ...existingNumbers)
  const year = new Date().getFullYear()
  return `INV-${year}-${String(maxNum + 1).padStart(3, '0')}`
}

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2024-001', vendorId: 'V-001', vendorName: 'Sysco Foods', poNumber: 'PO-8291', invoiceDate: '2024-05-20', deliveryDate: '2024-05-20', status: 'Finalized', subtotal: 1175.00, gst: 70.50, total: 1245.50, updatedAt: '2024-05-20 14:30' },
  { id: 'INV-2024-002', vendorId: 'V-002', vendorName: 'Baldor Specialty', poNumber: 'PO-8292', invoiceDate: '2024-05-21', deliveryDate: '2024-05-21', status: 'Pending', subtotal: 424.53, gst: 25.47, total: 450.00, updatedAt: '2024-05-21 09:15' },
  { id: 'INV-2024-003', vendorId: 'V-003', vendorName: 'Meat Packers Inc', poNumber: 'PO-8290', invoiceDate: '2024-05-22', deliveryDate: '2024-05-22', status: 'Draft', subtotal: 2170.52, gst: 130.23, total: 2300.75, updatedAt: '2024-05-22 10:00' },
]

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'V-001',
    name: 'Sysco Foods',
    status: 'Active',
    lastOrder: '2024-05-20',
    contactName: 'Mike Smith',
    email: 'orders@sysco.com',
    catalogItems: 450,
    products: [
      { id: 'P-001', name: 'Whole Milk', sku: 'DAIRY-001', price: 4.50, unit: 'GAL' },
      { id: 'P-002', name: 'Heavy Cream', sku: 'DAIRY-005', price: 6.25, unit: 'QT' },
      { id: 'P-003', name: 'Butter, Unsalted', sku: 'DAIRY-102', price: 85.00, unit: 'CS' },
      { id: 'P-004', name: 'Cheddar Cheese', sku: 'DAIRY-201', price: 18.50, unit: 'LB' },
    ],
  },
  {
    id: 'V-002',
    name: 'Baldor Specialty',
    status: 'Active',
    lastOrder: '2024-05-21',
    contactName: 'Sarah Jones',
    email: 'sales@baldor.com',
    catalogItems: 120,
    products: [
      { id: 'P-101', name: 'Organic Arugula', sku: 'PROD-001', price: 12.50, unit: 'CS' },
      { id: 'P-102', name: 'Heirloom Tomatoes', sku: 'PROD-002', price: 24.00, unit: 'CS' },
      { id: 'P-103', name: 'Avocados', sku: 'PROD-003', price: 45.00, unit: 'CS' },
      { id: 'P-104', name: 'Fresh Basil', sku: 'HERB-001', price: 8.00, unit: 'LB' },
    ],
  },
  {
    id: 'V-003',
    name: 'Meat Packers Inc',
    status: 'Active',
    lastOrder: '2024-05-19',
    contactName: 'Bob Wilson',
    email: 'orders@meatpackers.com',
    catalogItems: 85,
    products: [
      { id: 'P-201', name: 'Ground Beef 80/20', sku: 'MEAT-001', price: 4.25, unit: 'LB' },
      { id: 'P-202', name: 'Ribeye Steaks', sku: 'MEAT-002', price: 16.50, unit: 'LB' },
      { id: 'P-203', name: 'Chicken Breast', sku: 'POUL-001', price: 3.80, unit: 'LB' },
      { id: 'P-204', name: 'Bacon, Thick Cut', sku: 'PORK-001', price: 6.50, unit: 'LB' },
    ],
  },
]

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'ITM-001', name: 'Whole Milk', sku: 'DAIRY-001', category: 'Dairy', type: 'Raw', onHand: 12, unit: 'GAL', cost: 4.50, par: 15, lastCount: '2024-05-20', locations: ['Walk-in Fridge'] },
  { id: 'ITM-002', name: 'Eggs, Large', sku: 'DAIRY-002', category: 'Dairy', type: 'Raw', onHand: 144, unit: 'EA', cost: 0.25, par: 200, lastCount: '2024-05-20', locations: ['Walk-in Fridge'] },
  { id: 'ITM-003', name: 'Burger Patty (Prep)', sku: 'PREP-001', category: 'Meat', type: 'Prep', onHand: 45, unit: 'EA', cost: 1.85, par: 50, lastCount: '2024-05-21', locations: ['Line Fridge'] },
  { id: 'ITM-004', name: 'House Mayo', sku: 'PREP-002', category: 'Sauces', type: 'Prep', onHand: 2.5, unit: 'QT', cost: 3.00, par: 4, lastCount: '2024-05-21', locations: ['Line Fridge', 'Walk-in Fridge'] },
  { id: 'ITM-005', name: 'Ground Beef 80/20', sku: 'MEAT-001', category: 'Meat', type: 'Raw', onHand: 20, unit: 'LB', cost: 4.25, par: 30, lastCount: '2024-05-19', locations: ['Walk-in Fridge'] },
  { id: 'ITM-006', name: 'Romaine Lettuce', sku: 'PROD-005', category: 'Produce', type: 'Raw', onHand: 10, unit: 'HD', cost: 1.50, par: 12, lastCount: '2024-05-21', locations: ['Walk-in Fridge'] },
]

export const MOCK_RECIPES: Recipe[] = [
  { id: 'RCP-001', name: 'Cheeseburger', category: 'Mains', yield: 1, yieldUnit: 'EA', cost: 4.50, price: 16.00, foodCostPercent: 28.1, ingredients: 6 },
  { id: 'RCP-002', name: 'Caesar Salad', category: 'Salads', yield: 1, yieldUnit: 'EA', cost: 3.20, price: 14.00, foodCostPercent: 22.8, ingredients: 5 },
  { id: 'RCP-003', name: 'House Mayo (Batch)', category: 'Sauces', yield: 4, yieldUnit: 'QT', cost: 12.00, price: 0, foodCostPercent: 0, ingredients: 4 },
]

export const MOCK_TABLES: Table[] = [
  { id: 'T-1', name: '1', capacity: 2, status: 'Occupied', server: 'Sarah', guests: 2, checkTotal: 45.00, timeSeated: '12m' },
  { id: 'T-2', name: '2', capacity: 2, status: 'Available' },
  { id: 'T-3', name: '3', capacity: 4, status: 'Occupied', server: 'Mike', guests: 4, checkTotal: 120.50, timeSeated: '45m' },
  { id: 'T-4', name: '4', capacity: 4, status: 'Dirty' },
  { id: 'T-5', name: '5', capacity: 6, status: 'Reserved' },
  { id: 'T-6', name: '6', capacity: 4, status: 'Available' },
]
