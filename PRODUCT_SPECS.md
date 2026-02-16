### **High-Level Workflows**

**Workflow 1: Creating a Bill (Petty Cash/Urgent Buy)**
1.  User navigates to the **Purchasing > Bills** page.
2.  User sees a form to enter new bill details (Date, Supplier, Category, etc.).
3.  User clicks "Add item" to search and select an inventory item.
4.  User adjusts the Quantity and Unit Price for the added item.
    *   **System Action:** The system automatically calculates the line total.
    *   **System Action:** The system updates the bill Subtotal, GST, and Total in real-time.
5.  User repeats steps 3-4 for additional items.
6.  User clicks the "Add Bill" button.
7.  **Success Path:** The bill is added to the "Bills Register" list below, and the form resets.
8.  User can export the list of bills to CSV by clicking "Export CSV".

**Workflow 2: Vendor Management**
*   **Creating a Vendor:**
    1.  User navigates to **Purchasing > Vendors**.
    2.  User clicks "New Vendor".
    3.  **System Action:** Redirects to the Vendor Detail page (`/purchasing/vendors/new`).
    4.  User enters vendor information (Company Details, Contact Info) across multiple tabs.
    5.  User clicks "Save Vendor".
    6.  **Success Path:** The vendor is saved, and the user is redirected to the vendor list.
*   **Updating a Vendor:**
    1.  User navigates to **Purchasing > Vendors**.
    2.  User clicks on a vendor row in the list.
    3.  **System Action:** Redirects to the Vendor Detail page for that vendor.
    4.  User edits the details in the Profile, Ordering, or Catalog tabs.
    5.  User clicks "Save Vendor".
*   **Deactivating a Vendor:**
    1.  User navigates to **Purchasing > Vendors**.
    2.  User clicks the "..." (more actions) menu on a vendor row.
    3.  User selects "Deactivate".

**Workflow 3: Purchase Order (PO) Management**
*   **Creating a PO:**
    1.  User navigates to **Purchasing > Orders**.
    2.  User clicks "New PO".
    3.  **System Action:** Opens the PO Detail page.
    4.  User selects a Vendor.
    5.  User adds items from the vendor's catalog, specifying quantities.
    6.  User clicks "Create Order" (or "Send Order").
*   **Viewing/Updating a PO:**
    1.  User navigates to **Purchasing > Orders**.
    2.  User clicks on a PO row.
    3.  **System Action:** Opens the PO Detail page.
    4.  User can view status or modify details (if still in Draft).

**Workflow 4: Invoice Management**
*   **Creating an Invoice:**
    1.  User navigates to **Purchasing > Invoices**.
    2.  User clicks "New Invoice".
    3.  **System Action:** Opens the Invoice Detail page.
    4.  User selects a Purchase Order (PO) to link.
        *   **System Action:** The system populates the line items from the selected PO.
    5.  User enters the Invoice Number, Invoice Date, and Due Date.
    6.  User verifies quantities and costs against the physical paper invoice.
    7.  User clicks "Create Invoice" (to save as Draft) or "Finalize".
*   **Finalizing an Invoice:**
    1.  User navigates to **Purchasing > Invoices**.
    2.  User clicks on a Draft/Pending invoice row.
    3.  User reviews all details.
    4.  User clicks "Finalize".
        *   **System Action:** The invoice status updates to Finalized.

**Workflow 5: Menu Item Management**
*   **Creating a Menu Item (Quick Builder):**
    1.  User navigates to **Recipes > Menu Items**.
    2.  User clicks "New Menu Item".
    3.  **System Action:** Redirects to the "Build Menu Item" page.
    4.  User enters Name and Category.
    5.  User adds ingredients (Raw or Prep items) from the search picker.
    6.  User sets quantities and units for each ingredient.
        *   **System Action:** The system calculates the "Material Cost" live.
    7.  User sets the **Selling Price**.
        *   **System Action:** The system calculates and displays the **Food Cost %** (Material Cost / Selling Price).
        *   **System Action:** The system displays cost percentage of selling price with color coding (Green < 28%, Amber < 35%, Red > 35%).
    8.  User clicks "Save".
*   **Viewing/Editing a Menu Item:**
    1.  User navigates to **Recipes > Menu Items**.
    2.  User clicks on any menu item row.
    3.  **System Action:** Redirects to the **Edit Menu Item** page (same layout as Build).
    4.  User sees existing details, ingredients, and pricing populated.
    5.  User can modify any field (Ingredients, Name, Category, Selling Price).
    6.  User clicks "Save".
*   **Deleting a Menu Item:**
    1.  User navigates to **Recipes > Menu Items**.
    2.  User hovers over a menu item row.
    3.  User clicks the Trash/Delete icon on the right side of the row.
    4.  **System Action:** User confirms the deletion.
    5.  **Success Path:** The item is removed from the list.

**Workflow 6: Prep Item Management**
*   **Creating a Prep Item:**
    1.  User navigates to **Recipes > Prep Items**.
    2.  User clicks "New Prep Recipe".
    3.  **System Action:** Redirects to the Recipe Detail page (in new mode).
    4.  User enters Name, Category, and Ingredients.
    5.  User clicks "Save Draft".
*   **Viewing/Updating a Prep Item:**
    1.  User navigates to **Recipes > Prep Items**.
    2.  User clicks on a prep item row.
    3.  **System Action:** Redirects to the Recipe Detail page.
    4.  User edits recipe details.

**Workflow 7: Inventory Management**
*   **Creating an Inventory Posting (Stock Count):**
    1.  User navigates to **Inventory > Postings**.
    2.  User clicks "New Posting".
    3.  **System Action:** Opens the setup screen.
    4.  User configures Frequency (e.g., Weekly), Session Type, and Date.
    5.  User clicks "Continue to Worksheet".
    6.  **System Action:** Displays the counting worksheet with all inventory items.
    7.  User enters the "On Hand" quantity for items counted.
    8.  User clicks "Post Count".
    9.  **Success Path:** The count is saved to history.
*   **Viewing Past Postings:**
    1.  User navigates to **Inventory > Postings**.
    2.  User filters by date or searches for a specific posting.
    3.  User clicks on a posting ID.
    4.  **System Action:** Displays the details of what was counted.

**Workflow 8: Recording Daily Waste**
1.  User navigates to **Inventory > Waste**.
2.  User fills out the Waste Entry form (Date, Item, Quantity, Reason).
3.  **System Action:** The system previews the estimated cost of the waste.
4.  User clicks "Add Waste Entry".
5.  **Success Path:** The entry is logged to the daily summary.

---

### **Implied User Stories**

**Purchasing Manager / Buyer**
*   As a Purchasing Manager, I want to manage a list of approved vendors, so that my team only orders from authorized suppliers.
*   As a Purchasing Manager, I want to capture invoices and link them to POs, so I can verify that we are being billed for what we actually ordered.
*   As a Purchasing Manager, I want to track petty cash expenses (Bills) separately from major supplier invoices, so that small cash purchases are accounted for.
*   As a Purchasing Manager, I want to see the status of all invoices (Draft, Pending, Finalized) to manage cash flow and approvals.

**Executive Chef / Menu Planner**
*   As a Chef, I want to create complex recipes where "Menu Items" are made of "Prep Items" (sub-recipes) and "Raw Ingredients", so I can accurately model the real kitchen workflow.
*   As a Chef, I want to see a live "Food Cost %" calculation as I build a recipe, so I can adjust portion sizes or ingredients to stay profitable.
*   As a Chef, I want to view my list of Prep Items separately from Menu Items, so I can manage the "mise en place" production list distinct from the customer menu.
*   As a Chef, I want to record waste with specific reasons, so I can identify if we have a spoilage problem vs. a training problem (e.g., "Preparation Mistake").

**Storeman / Inventory Controller**
*   As a Storeman, I want to perform regular stock counts (Postings) to correct the system's "On Hand" levels.
*   As a Storeman, I want a digital worksheet to enter counts directly, so I don't have to transcribe from paper later.
*   As a Storeman, I want to see a history of all stock adjustments, so I can audit who changed stock levels and when.
