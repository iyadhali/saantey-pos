**Saantey POS**

*Technical Specification Document*

Version 1.0 | January 2026

# 1. System Overview

Saantey POS is a cloud-native, multi-tenant restaurant management platform designed for resorts, hotels, and F&B chains in the Maldives market. The system combines point-of-sale operations with comprehensive back-office inventory management.

## 1.1 Key Differentiators

- Cloud-native architecture with offline capability for island connectivity
- Mobile-first inventory counting and receiving
- Real-time analytics and dashboards
- Automated supplier integration (no more PDF emails)
- Multi-property, multi-outlet support
- GST compliance for Maldives
- Recipe costing tied to actual purchase prices
## 1.2 Target Market

- Resort properties with multiple F&B outlets
- Hotel restaurants and room service operations
- Multi-site F&B chains
- Central commissary with satellite outlets

# 2. Multi-Tenant Architecture

## 2.1 Tenant Isolation Strategy

The system uses a shared database with schema-based isolation. Each tenant (property/company) has their data isolated through a tenant_id foreign key on all tables.

### Tenant Hierarchy

- Organization (top level - hotel chain or company)
- Property (individual resort/hotel)
- Outlet (restaurant, bar, room service)
- Location (storage areas within outlet)
## 2.2 Data Isolation Pattern

All queries automatically filter by tenant using Prisma middleware or Row Level Security (RLS) in PostgreSQL:

```
SELECT * FROM items WHERE tenant_id = $current_tenant
```

# 3. Module Specifications

## 3.1 Purchasing Module

Manages the complete procurement lifecycle from vendor management to invoice processing.

### 3.1.1 Purchase Orders

| Feature | Description |
| --- | --- |
| Order by Vendor | Create PO with suggested ordering based on par levels and usage history |
| Order Management | Create, modify, delete, and combine multiple orders |
| Convert to Invoice | Receive goods and convert PO to invoice (partial receiving supported) |
| Copy Orders | Duplicate existing orders as templates |
| Usage Calculation | Recalculate usage per factor for inventory items |

### 3.1.2 Invoices

| Feature | Description |
| --- | --- |
| Invoice List | View all invoices with filter by date, vendor, status (finalized/unfinalized) |
| Invoice Entry | Manual invoice creation with line items, prices, quantities |
| Import | Bulk import invoices from CSV/Excel |
| Credit Memos | Handle returns and adjustments |
| Finalization | Lock invoices after review to prevent edits |

### 3.1.3 Vendors

| Feature | Description |
| --- | --- |
| General Info | Name, address, contact, phone, email, tax ID |
| Order & Delivery | Delivery schedule, order cutoff times, delivery days |
| Electronic Ordering | EDI/XML integration settings for automated ordering |
| Order Restrictions | Control what items can be ordered, price locking, item restrictions |
| Catalog Viewer | View vendor product catalog with prices |

## 3.2 Inventory Module

Comprehensive inventory tracking across multiple locations with support for raw ingredients and prep items.

### 3.2.1 Item Lookup

| Feature | Description |
| --- | --- |
| Item Master | Complete list of all inventory items with categories |
| Item Types | Raw ingredients vs Prep items distinction |
| Par Levels | Minimum/maximum stock levels per location |
| Units of Measure | Multiple UOMs per item (case, each, kg, etc.) |
| Vendor Items | Link items to vendor catalogs with vendor-specific codes |

### 3.2.2 Inventory Posting

| Feature | Description |
| --- | --- |
| Count Frequencies | Daily, Weekly, Monthly inventory counts |
| Location-based | Count by storage location (walk-in, dry store, bar) |
| Fiscal Periods | Align counts with reporting periods and weeks |
| Suggested Prep | Calculate prep quantities based on forecasts |
| Mobile Counting | Scan and count via mobile device (enhancement) |

### 3.2.3 Transfers & Waste

| Feature | Description |
| --- | --- |
| Inter-location | Transfer stock between outlets/locations |
| Waste Tracking | Record waste with reason codes (spoilage, overproduction, etc.) |
| Cost Impact | Automatic cost calculation for waste items |
| Approval Workflow | Manager approval for high-value waste (enhancement) |

## 3.3 Recipe Management

| Feature | Description |
| --- | --- |
| Recipe Builder | Create recipes with ingredients, quantities, and instructions |
| Sub-recipes | Nested recipes (sauce within a dish) |
| Cost Calculation | Real-time cost based on actual purchase prices |
| Yield Management | Track portion sizes and yield percentages |
| Menu Costing | Roll up recipe costs to menu items |
| Price Suggestions | Suggest menu price based on target food cost % |

## 3.4 Point of Sale (POS)

| Feature | Description |
| --- | --- |
| Order Entry | Touch-friendly interface for order taking |
| Table Management | Floor plan, table status, covers tracking |
| Split/Merge | Split checks, merge tables, move items |
| Modifiers | Item customizations and special requests |
| Kitchen Display | KDS integration for order routing |
| Payment Processing | Cash, card, room charge, split payments |
| Receipt Printing | Thermal printer support (customer, kitchen) |
| Offline Mode | Continue operations without internet (sync later) |

## 3.5 Reports & Analytics

| Report | Description |
| --- | --- |
| Sales Summary | Revenue by outlet, category, time period |
| Product Mix | Best/worst sellers, item performance |
| Food Cost | Actual vs theoretical food cost analysis |
| Inventory Valuation | Current stock value by location |
| Variance Report | Discrepancies between expected and actual |
| Vendor Analysis | Spend by vendor, price trends |
| Waste Report | Waste by reason, item, location |
| Labor Cost | Staff hours, labor % of revenue |

# 4. Database Schema

Core entities and their relationships. All tables include tenant_id for multi-tenant isolation.

## 4.1 Core Entities

| Entity | Key Fields |
| --- | --- |
| organizations | id, name, settings, subscription_tier, created_at |
| properties | id, org_id, name, address, timezone, currency |
| outlets | id, property_id, name, type (restaurant/bar/room_service) |
| locations | id, outlet_id, name, type (storage/prep/bar) |
| users | id, org_id, email, role, permissions, pin_code |

## 4.2 Inventory Entities

| Entity | Key Fields |
| --- | --- |
| categories | id, tenant_id, name, parent_id, sort_order |
| items | id, tenant_id, name, category_id, type (raw/prep/menu), item_code |
| item_units | id, item_id, unit_name, conversion_factor, is_default |
| item_locations | id, item_id, location_id, par_min, par_max, on_hand |
| inventory_counts | id, location_id, period_type, period_date, status |
| count_lines | id, count_id, item_id, unit_id, quantity, cost |

## 4.3 Purchasing Entities

| Entity | Key Fields |
| --- | --- |
| vendors | id, tenant_id, name, code, address, contact, email, phone |
| vendor_items | id, vendor_id, item_id, vendor_code, unit_id, price |
| purchase_orders | id, tenant_id, vendor_id, order_date, delivery_date, status, notes |
| po_lines | id, po_id, item_id, unit_id, quantity, price |
| invoices | id, tenant_id, vendor_id, po_id, invoice_number, date, total, status |
| invoice_lines | id, invoice_id, item_id, unit_id, ordered, received, price |

## 4.4 Recipe Entities

| Entity | Key Fields |
| --- | --- |
| recipes | id, tenant_id, name, category_id, yield_qty, yield_unit, instructions |
| recipe_ingredients | id, recipe_id, item_id (or sub_recipe_id), unit_id, quantity |
| menu_items | id, tenant_id, name, recipe_id, price, category_id, active |

## 4.5 POS Entities

| Entity | Key Fields |
| --- | --- |
| tables | id, outlet_id, name, capacity, position_x, position_y, status |
| checks | id, outlet_id, table_id, server_id, opened_at, closed_at, status |
| check_items | id, check_id, menu_item_id, quantity, price, modifiers, voided |
| payments | id, check_id, method, amount, tip, reference, processed_at |
| shifts | id, outlet_id, user_id, started_at, ended_at, cash_start, cash_end |

# 5. API Structure

RESTful API design with JWT authentication. All endpoints prefixed with /api/v1.

## 5.1 Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /auth/login | Login with email/password |
| POST | /auth/pin | Quick login with PIN (POS) |
| POST | /auth/refresh | Refresh access token |
| POST | /auth/logout | Invalidate tokens |

## 5.2 Purchasing Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /vendors | List all vendors |
| POST | /vendors | Create vendor |
| GET | /purchase-orders | List POs with filters |
| POST | /purchase-orders | Create new PO |
| POST | /purchase-orders/:id/convert | Convert PO to invoice |
| GET | /invoices | List invoices |
| POST | /invoices/:id/finalize | Finalize invoice |

## 5.3 Inventory Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /items | List inventory items |
| POST | /items | Create item |
| GET | /inventory-counts | List counts |
| POST | /inventory-counts | Start new count |
| POST | /inventory-counts/:id/lines | Add count entries |
| POST | /transfers | Create transfer |
| POST | /waste | Record waste |

## 5.4 POS Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /tables | Get floor plan |
| POST | /checks | Open new check |
| POST | /checks/:id/items | Add items to check |
| POST | /checks/:id/payments | Process payment |
| POST | /checks/:id/close | Close check |
| GET | /shifts/current | Get current shift |

# 6. Key Workflows

## 6.1 Purchase to Pay

1. Create Purchase Order (select vendor, add items from catalog)
1. Send PO to vendor (email/EDI)
1. Receive goods (mobile scan or manual entry)
1. Convert PO to Invoice (adjust quantities if partial)
1. Review and finalize invoice
1. Inventory automatically updated with new stock and costs
## 6.2 Inventory Count

1. Select count type (Daily/Weekly/Monthly) and period
1. System generates count sheet based on location assignments
1. Staff counts items (mobile app or printout)
1. Enter quantities by unit (supports multiple UOMs)
1. Review variances against expected quantities
1. Post count to update on-hand inventory
## 6.3 Order to Cash (POS)

1. Server opens table/check
1. Add menu items with modifiers
1. Send to kitchen (prints/displays KDS)
1. Kitchen marks items ready
1. Guest requests bill
1. Process payment (split if needed)
1. Close check, print receipt
1. Sales automatically deduct theoretical inventory

# 7. Development Roadmap

## Phase 1: Foundation (Weeks 1-4)

- Project setup (monorepo, Docker, CI/CD)
- Database schema and migrations
- Authentication system
- Multi-tenant middleware
- Basic UI shell with navigation
## Phase 2: Purchasing Module (Weeks 5-8)

- Vendor CRUD
- Purchase Order creation and management
- Invoice entry and conversion
- Basic purchasing reports
## Phase 3: Inventory Module (Weeks 9-12)

- Item master and categories
- Inventory posting (counts)
- Transfers and waste tracking
- Location management
## Phase 4: Recipes & Menu (Weeks 13-16)

- Recipe builder
- Cost calculation engine
- Menu item management
- Food cost reporting
## Phase 5: POS (Weeks 17-24)

- Order entry interface
- Table management
- Payment processing
- Kitchen display integration
- Offline mode (PWA)
## Phase 6: Polish & Launch (Weeks 25-28)

- Comprehensive reporting dashboard
- Mobile optimization
- Performance optimization
- User acceptance testing
- Documentation and training materials

*— End of Document —*