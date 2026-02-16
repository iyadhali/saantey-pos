# Saantey Inventory & Purchasing System - Product Requirements Document (v2.1)

**Date:** January 28, 2026  
**Status:** Live Prototype  
**Scope:** Purchasing, Inventory, Recipe Management (POS module currently disabled)

---

## 1. Product Overview
Saantey is a specialized inventory and purchasing management platform designed for the hospitality industry. It streamlines the procurement process, provides real-time visibility into stock levels, and helps restaurant operators control food costs through recipe management and waste tracking.

The system focuses on ease of use, data accuracy, and actionable insights, moving away from spreadsheet-based management to a unified digital workflow.

---

## 2. User Personas

### 2.1 The Executive Chef (Chef Marco)
- **Goals:** Maintain high food quality, control food costs, ensure ingredients are always available.
- **Pain Points:** Running out of key ingredients during service, manual counting errors, time-consuming ordering processes.
- **Key Interactions:** Approving purchase orders, checking recipe costs, reviewing waste reports.

### 2.2 The Restaurant Manager (Sarah)
- **Goals:** optimize operational efficiency, manage vendor relationships, ensure invoices match deliveries.
- **Pain Points:** Discrepancies between orders and invoices, tracking varying vendor prices, managing staff for inventory counts.
- **Key Interactions:** Creating purchase orders, finalizing invoices, scheduling inventory counts.

### 2.3 The Purchasing Clerk (Mike)
- **Goals:** Execute orders accurately, receive deliveries, organize storage.
- **Pain Points:** Manual data entry of invoices, unclear delivery schedules, disorganized storage areas.
- **Key Interactions:** Converting orders to POs, receiving goods, entering invoice details.

---

## 3. Functional Requirements, Workflows & Edge Cases

### 3.1 Purchasing Module
A comprehensive suite for managing the full procurement lifecycle.

**A. Dashboard**
- **Requirements:**
  - **KPI Cards:** Display real-time metrics for Weekly Spend, Pending Orders, and Open Invoices.
  - **Quick Actions:** One-click access to "Create Order", "New Invoice", and "Vendor Directory".
  - **Recent Activity:** List recent orders with Status, Vendor, and Total Amount.
  - **Insights:** Show "Suggested Orders" based on low stock levels and "Top Vendors" by total spend.

**B. Purchase Orders (PO)**
- **Requirements:**
  - **Order List:** Sortable/filterable table. Must support Date Range filtering (Start/End Date).
  - **Create Order:**
    - **Header:** Vendor Selection (auto-show Vendor ID), Order Date, Delivery Date, Memo.
    - **Items:** Dropdown selection for items (linked to Vendor Catalog). Auto-fill SKU, Unit, and Unit Cost.
    - **Financials:** Calculate Line Totals and Grand Total (No Tax calculation).
  - **Actions:** View, Duplicate, Delete Order.

- **Workflow: Creating a Purchase Order**
  1.  User navigates to `/purchasing/orders/new`.
  2.  User selects a **Vendor** from the dropdown.
      - *System Action:* Displays Vendor ID (e.g., V-001) next to name. Loads specific product catalog.
  3.  User sets **Delivery Date** and adds a **Memo** (e.g., "Weekend Event").
  4.  User clicks "Add Item" in the Items section.
  5.  User selects a product (e.g., "Whole Milk") from the row dropdown.
      - *System Action:* Auto-fills SKU (DAIRY-001), Unit (GAL), and Price ($4.50).
  6.  User enters **Quantity**.
      - *System Action:* Updates Line Total and Grand Total instantly.
  7.  User clicks **"Create Order"**.
      - *System Action:* Saves PO as "Open", redirects to Order List.

- **Edge Cases:**
  - **Vendor Change:** If user changes Vendor after adding items, system must clear existing items to prevent catalog mismatch (e.g., ordering Sysco milk from a Meat vendor).
  - **Empty Order:** User tries to create an order with 0 items. System should block and show "Please add at least one item."
  - **Zero Quantity:** User adds an item but leaves quantity as 0 or empty. System should validate > 0 before saving.

**C. Invoices**
- **Requirements:**
  - **Invoice List:** Filter by Date Range. Columns: Invoice No, Vendor, **PO Number**, Dates, Status, Total.
  - **Status:** Unfinalized (Draft/Pending) vs. Finalized.
  - **PO Linking:** Field to reference the original PO Number.
  - **Manual Entry:** User manually types the Invoice Number from the physical paper invoice.

- **Workflow: Processing an Invoice**
  1.  User receives goods and physical invoice.
  2.  User navigates to `/purchasing/invoices/new`.
  3.  User enters **Invoice No** (from paper) and selects **Vendor**.
  4.  User selects linked **PO Number** (optional but recommended).
  5.  User enters Total Amount and Date.
  6.  User saves as "Draft" if review is needed, or "Finalize" to lock it.

- **Edge Cases:**
  - **Duplicate Invoice No:** User enters an invoice number that already exists for that vendor. System should warn "Invoice number already exists".
  - **Finalized Edit:** User tries to edit a Finalized invoice. System should block changes unless "Reopened" by Manager (permission dependent).

**D. Vendor Management**
- **Requirements:** Directory of suppliers. Detail view must show Product Catalog with current pricing.

### 3.2 Inventory Module
Tools for tracking physical stock and variance.

**A. Item Lookup**
- **Requirements:**
  - Central database view.
  - Search by Name, ID, or Category.
  - Columns: Item ID, Name, Category, Type (Raw/Prep), Unit, Par Level, On Hand.
  - **Visuals:** Highlight items where `On Hand < Par Level` in amber/red.

**B. Inventory Posting (Counts)**
- **Requirements:**
  - Multi-step wizard for recording stock.
  - **Step 1 (Setup):** Select Frequency (Daily/Weekly), Type (New Count/Continue), and Date.
  - **Step 2 (Entry):** Worksheet interface with Item Name, Location, and Quantity Input.

- **Workflow: Performing a Weekly Count**
  1.  User navigates to `/inventory/posting`.
  2.  Selects "Weekly" frequency and "Start New Count".
  3.  Enters Date (defaults to today). Clicks "Continue".
  4.  System generates a worksheet with all active inventory items.
  5.  User walks through storage, entering quantities into the "On Hand" inputs.
  6.  User clicks "Post Count".
  7.  System updates current stock levels and saves the count record.

- **Edge Cases:**
  - **Partial Count:** User counts only "Dairy" but leaves "Meat" blank. System should allow saving as "In Progress" or treat blanks as "No Change" vs "Zero" (needs clear UI distinction). Current prototype assumes active session until posted.
  - **Negative Entry:** User accidentally types "-5". System must block or validate non-negative numbers.

**C. Wastage & Worksheets**
- **Wastage:** Log specific items lost to spoilage/spills to adjust inventory without sales.
- **Worksheet:** Generate printable PDF version of the counting sheet for manual clipboard use.

---

## 4. User Stories

| ID | Persona | Story | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **US-1.1** | Manager | As a Manager, I want to filter purchase orders by date range so I can review spending for a specific week. | Date pickers for "Start" and "End" date are available in the Orders list; list updates instantly. |
| **US-1.2** | Purchasing | As a Clerk, I want to see the Vendor ID immediately when I select a vendor for a new PO so I can confirm I'm ordering from the correct account. | Vendor ID appears next to Vendor Name in the selection dropdown or adjacent text. |
| **US-1.3** | Chef | As a Chef, I want to select items from a dropdown when creating an order so I don't have to manually type SKUs and prices. | Product dropdown is populated based on the selected Vendor; Price/Unit auto-fill. |
| **US-2.1** | Manager | As a Manager, I want to see the PO Number on the Invoice list so I can cross-reference deliveries. | "PO Number" column exists in the Invoices table. |
| **US-3.1** | Chef | As a Chef, I want to quickly look up an item to see if it is a "Raw" ingredient or a "Prep" item. | "Item Lookup" page exists; Type column visually distinguishes Raw vs. Prep. |
| **US-3.2** | Manager | As a Manager, I want to delete a purchase order that was created by mistake. | "Delete" option is available in the Order actions menu. |

---

## 5. Design & UI/UX Guidelines

### 5.1 Visual Style
- **Aesthetic:** Clean, professional, and data-dense but readable.
- **Color Palette:**
  - Primary: Deep Navy/Slate (Professionalism).
  - Accents: Emerald (Financials/Success), Amber (Warnings/Drafts), Destructive Red (Deletions/Errors).
  - Backgrounds: White/Off-white cards on light gray application background.

### 5.2 Layout Patterns
- **Dashboards:** Card-based layouts for high-level metrics and navigation entry points.
- **Lists:** Simple tables with sticky headers, clear column alignment (right-align for currency), and actionable row clicks.
- **Forms:**
  - **Master-Detail:** Header information (Details) stacked vertically above Line Items for logical flow.
  - **Input Density:** Comfortable spacing for touch targets, but compact enough for desktop efficiency.

### 5.3 Navigation
- **Primary:** Top-level navigation.
- **Contextual:** "Back" buttons on all detail pages (e.g., "Back to Purchasing").
- **Breadcrumbs:** Implicit through page titles and back actions.

### 5.4 Interactions
- **Feedback:** Toast notifications for success (Save, Delete, Post).
- **Empty States:** Clear messaging when lists or tables have no data (e.g., "No items added").
- **Modals:** Use dropdown menus for secondary row actions (Edit, Delete) to keep UI clutter-free.
