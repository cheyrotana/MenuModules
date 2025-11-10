Menu & Category Module (Capstone 1 – Revised) 
Purpose & Scope 
Manage the creation, organization, and configuration of menu items and categories for 
F&B tenants. Each menu item defines its name, price, availability, optional modifiers, and 
now — its inventory linkage to a single stock item for automatic deduction when sales are 
finalized. 
This module connects the front-facing sales experience with back-office inventory 
control, ensuring each sale can optionally adjust stock levels while maintaining flexibility 
for cafés, drink shops, and mixed F&B businesses. 
Actors & Permissions 
• Admin (tenant): 
o Full CRUD on categories and menu items. 
o Assign stock item mappings and quantity-per-sale. 
o Set prices, modifiers, visibility. 
• Manager (branch): 
o View categories and menu items for their branch. 
o Suggest edits or flag unavailable items (future enhancement). 
• Cashier: 
o Read-only; interacts only with visible items during checkout. 
Functional Overview 
1
 ️
 ⃣ Category Management 
• Create, edit, or delete categories (e.g., Coffee, Tea, Juice, Dessert). 
• Define display order for POS menus. 
• Limit: max 8 categories per tenant (Capstone 1 safeguard). 
2
 ️
 ⃣ Menu Item Management 
• Create, edit, or deactivate items under a category. 
• Define: 
o name, price_usd, is_active, category_id 
o Optional description, image_url, tags 
o Modifiers (e.g., sugar/ice level, toppings) 
o Inventory mapping (new): select 1 stock item and define qty_per_sale 
o Discount flag: shows if a discount policy applies 
• Limit: max 75 items per tenant (Capstone 1 safeguard). 
3
 ️
 ⃣ Modifier Management 
• Create reusable modifier groups (sugar level, size, toppings). 
• Each group has multiple options, each with: 
o label, price_delta, is_default 
• Assign modifiers to menu items. 
• Modifiers affect sale price but not stock in Capstone 1. 
Inventory Mapping (Capstone 1 integration) 
Each menu item can optionally be linked to one stock item with a fixed quantity-per-sale 
(supports decimals). 
Example 
Stock Item Qty per Sale Deduction Trigger 
Iced Latte 
Orange Juice Oranges 
Cups 16oz 1 pcs 
1 pcs 
Hot Latte 
— 
— 
Finalize sale 
Finalize sale 
None (no 
mapping) 
• On finalize, if Inventory Policy → Subtract on Finalize is true, the system posts: 
delta = -(qty_per_sale × quantity_sold) 
into the inventory_journal for that branch. 
• Voided or reopened sales post compensating entries. 
Validation: 
• qty_per_sale must be > 0 if stock_item_id is set. 
• Admin can remove mapping without affecting historical sales. 
User Stories & Acceptance Criteria 
US-M01 — Create Category 
• Admin defines a category (e.g., Coffee). 
•    Appears on POS interface for sorting items. 
US-M02 — Add Menu Item 
• Admin creates “Iced Latte” under Coffee. 
•    Fields: name, price, modifiers, optional inventory mapping. 
US-M03 — Configure Modifiers 
• Admin defines “Sugar Level” with options: Normal, Less, None. 
•    Cashier sees options when adding the item to order. 
US-M04 — Link Menu Item to Inventory 
• Admin links “Iced Latte” → “Cups 16oz” with qty_per_sale = 1. 
•    Sale of 3 Iced Lattes deducts 3 cups if policy ON. 
US-M05 — Deactivate Menu Item 
• Admin toggles is_active=false. 
•    Item disappears from POS. 
US-M06 — Enforce Item Limits 
• Tenant cannot exceed 75 items or 8 categories. 
•    API returns error code LIMIT_EXCEEDED. 
Functional Requirements 
• Categories and menu items are tenant-scoped. 
• Modifiers reusable across multiple items. 
• Inventory mapping stored separately (via menu_stock_map table). 
• Sale service references mapping to trigger deduction logic. 
• Discount visibility: read active policies to flag discounted items in the menu. 
Non-Functional Requirements 
• Performance: load ≤300 ms for a full menu. 
• Usability: mobile-first interface; easy search/filter. 
• Scalability: extendable to multi-stock mapping in Phase 2. 
• Offline support: cached menu in IndexedDB (read-only). 
• Security: branch-filtered visibility; admin-only writes. 
Data Model (Capstone 1) 
• categories 
o id, tenant_id, name, display_order, is_active, created_at 
• menu_items 
o id, tenant_id, category_id, name, price_usd, image_url?, description?, 
is_active, created_by, created_at 
• modifiers 
o id, tenant_id, name, type('choice'|'multi'), created_at 
• modifier_options 
o id, modifier_id, label, price_delta_usd, is_default, created_at 
• menu_modifier_map 
o menu_item_id, modifier_id 
• menu_stock_map (links to inventory) 
o menu_item_id (PK), stock_item_id, qty_per_sale 
• audit_log (shared) logs all CRUD operations. 
Example Scenario 
The Sunrise Café owner (Admin) sets up the menu: 
1. Creates categories: Coffee, Milk Tea, Juice. 
2. Adds: 
a. Iced Latte → Coffee → price $2.50 → maps to Cups 16oz (1 pcs). 
b. Orange Juice → Juice → price $2.00 → maps to Oranges (1 pcs). 
c. Hot Latte → Coffee → price $2.30 → no stock link. 
3. Defines modifiers: 
a. Sugar Level: Normal, Less, None. 
b. Topping: Aloe Jelly (+ $0.20), Boba (+ $0.25). 
4. Cashier opens POS → sees menu with categories and modifiers. 
5. When a sale is finalized: 
a. “Iced Latte × 2” posts −2 Cups. 
b. “Orange Juice × 1” posts −1 Orange. 
6. Admin views deduction reflected in the Inventory Journal. 
Out of Scope (Phase 1) 
• Multi-ingredient recipes (BOM). 
• Modifier-driven deductions (e.g., extra topping affects stock). 
• Unit conversions between stock items (e.g., kg ↔ pcs). 
• Price-tier by size (to be handled by modifiers). 
• Scheduled or location-based menu availability. 
Future Extension (Phase 2) 
• Add Recipe/BOM model: multiple stock items per menu item. 
• Ingredient-level deduction based on recipe composition. 
• Modifier-triggered deduction (e.g., “extra shot” adds 0.02 kg coffee beans). 
• Auto-scaling when size modifiers change portion ratio. 
Summary: 
The Menu & Category Module now unifies menu management with basic inventory 
linkage. It stays lightweight for Capstone 1 yet structurally ready for Phase 2 upgrades like 
full recipes and cost analytics. 