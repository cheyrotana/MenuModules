Module Spec: Menu & Category Management (Phase 1) 
Purpose & Scope 
Provide admins (and branch managers with limited rights) a way to define, organize, and 
maintain the café’s catalog—categories, items, and modifiers—with per-branch 
availability and (optional) price overrides. Must be fast, offline-ready, and enforce quotas 
to prevent resource exhaustion. Outputs a consistent, cached menu for the Sale Module.
Actors & Permissions 
• Admin (tenant): Full CRUD on categories, items, modifier groups/options; assign 
items to branches; set availability; set (optional) branch price overrides; reorder 
display; upload images; archive/deactivate; manage limits. 
• Manager (branch): Update branch-level availability and branch display order; 
optional privilege to tweak branch custom price if enabled by Admin; cannot 
create/delete items/categories; cannot upload images. 
• Cashier (branch): View-only (menu used in sales); no edit rights. 
• System: Syncs menu snapshots to device (IndexedDB), enforces quotas server
side, logs audit events. 
User Stories (with acceptance criteria) 
1. Create Category (Admin) 
• I can create a category and control its display order. 
•    AC: Fields: name, optional description, display_order, active flag; category 
appears only in assigned branches; unique name per tenant; reorder persists. 
2. Add Menu Item (Admin) 
• I can add an item under a category and assign it to branches. 
•    AC: Fields: name, description, base price (USD), image (JPEG/WEBP ≤ 300 KB), 
active flag, category_id, assigned_branches[]; item visible to branch cashiers after 
sync. 
3. Define Modifiers (Admin) 
• I can attach reusable modifier groups to items (e.g., Size, Milk, Toppings). 
•    AC: Group selection type single/multi; each option has name and ±price 
adjustment; limits enforced (≤5 groups/item, ≤12 options/group, ≤30 options total 
across groups). 
4. Branch Availability & Pricing (Manager/Admin) 
• I can mark items unavailable for my branch; if allowed, set a branch custom price. 
•    AC: Toggling availability instantly hides/shows the item in that branch; branch 
price override (if enabled) is used at sale time; audit logged. 
5. Reorder Categories/Items (Admin/Manager) 
• I can reorder categories and items for how they display on POS. 
•    AC: Drag-drop order persists per branch; reflected after cache refresh; cashier 
sees new order on reload (or soft refresh signal). 
6. Offline Menu Access (Cashier) 
• I can use the menu while offline. 
•    AC: Device uses last synced snapshot from IndexedDB; when online, delta sync 
updates snapshot reliably. 
7. Quota Enforcement (System) 
• Prevent catalog bloat and abuse with soft/hard limits. 
•    AC: At soft limit → warning; at hard cap → reject with helpful error 
codes/messages; all enforced server-side. 
Functional Requirements 
• Category Management: CRUD, active flag, per-branch visibility, order 
management. 
• Item Management: CRUD, base price (USD), description, image upload 
(JPEG/WEBP ≤ 300 KB), category link, active flag, branch assignment. 
• Modifiers: CRUD groups/options; attach/detach to items; selection rules 
(single/multi); price adjustments apply before discount. 
• Branch Overrides: Availability and optional custom price per branch (policy toggle). 
• Display Order: Maintain per-branch ordering for categories and items. 
• Discount Awareness: Items flagged as discounted (policy-driven) show badge in 
POS; calculation handled in Sale Module. 
• Sync & Cache: On login, branch pulls menu snapshot to IndexedDB; background 
delta sync updates cache; version watermark maintained. 
• Quotas & Limits (Phase 1 defaults): 
o Menu items per tenant: soft 75 (warn at 70), hard 120 (reject). 
o Categories per tenant: soft 8 (warn at 7), hard 12 (reject). 
o Modifiers: ≤5 groups/item, ≤12 options/group, ≤30 options total per item. 
o Images: ≤300 KB, JPEG/WEBP; tenant media quota 10 MB. 
o Count items once per tenant (branch assignments don’t multiply counts). 
• Rate Limiting: Menu CRUD writes limited (e.g., 30/min/tenant) to mitigate bursts. 
• Audit Logging: All create/update/delete; limit exceed events; abnormal spikes. 
Non-Functional Requirements 
• Performance: Menu load ≤ 2s for up to ~120 items with pagination/lazy-load; admin 
lists paginate. 
• Offline Continuity: Full read from cache; edits queue until online (admin/manager 
edits typically done online). 
• Security: Role-based authorization on every API; image uploads validated and 
scanned (basic). 
• Data Integrity: Unique item names within a category per tenant (case-insensitive); 
no deletion if referenced in sales—use deactivate. 
• Usability: Clear counters (e.g., Items 72/75); inline limit indicators for modifiers; 
compress images client-side. 
• Reliability: Delta sync idempotent; conflict resolution favors latest admin write 
with audit record. 
Data Model Notes (minimum) 
• categories 
o id, tenant_id, name, description, display_order, is_active, timestamps 
• menu_items 
o id, tenant_id, category_id, name, description, price_usd, image_url, 
is_active, timestamps 
• modifiers 
o id, tenant_id, name, selection_type (single/multi), timestamps 
• modifier_options 
o id, modifier_id, name, price_adjustment_usd, is_active, timestamps 
• item_modifiers (junction) 
o id, menu_item_id, modifier_id 
• branch_menu_items 
o id, branch_id, menu_item_id, custom_price_usd (nullable), is_available 
(bool), display_order, timestamps 
• tenant_limits (config) 
o tenant_id, max_items_soft(75), max_items_hard(120), 
max_categories_soft(8), max_categories_hard(12), 
max_modifier_groups_per_item(5), max_options_per_group(12), 
max_total_options_per_item(30), media_quota_mb(10) 
• audit_log 
o id, `tenant_id 
Usage Scenarios 
Scenario: First-time Menu Setup for a Café 
Context 
• A new tenant “Sunrise Café” just registered. 
• One branch: Main Branch. 
• The Admin wants to set up these drinks: 
o Cold: Iced Latte, Iced Americano 
o Juice: Orange Juice 
o Hot: Hot Latte, Espresso, Hot Green Tea 
• Modifiers: 
o Cold drinks: Sugar Level + Ice Level 
o Hot drinks: Sugar Level only 
o Juice: No modifiers 
1) Create Categories 
Admin → Catalog → Categories → “Create” 
• Coffee (Cold) — active, order #1 
• Coffee (Hot) — active, order #2 
• Juice — active, order #3 
• Assign all three categories to Main Branch. 
Result: Cashier menu will show three tabs/sections in this order. 
2) Define Reusable Modifier Group 
Admin → Catalog → Modifiers → “Create Group” 
A) Sugar Level (single-select) 
• Options (no price change): 
o No Sugar, Less Sugar, Normal Sugar, Extra Sugar 
B) Ice Level (single-select) 
• Options (no price change): 
o No Ice, Less Ice, Normal Ice, Extra Ice 
Tip: Keep both groups reusable; you’ll attach them to multiple items. 
Result: Two reusable groups ready to attach to items. 
3) Add Menu Items with Correct Modifiers 
A) Cold Coffee Items (attach Sugar + Ice) 
• Iced Latte 
o Category: Coffee (Cold) 
o Base Price: $2.50 
o Modifiers: Sugar Level, Ice Level 
o Branch assignment: Main Branch 
o Active    
• Iced Americano 
o Category: Coffee (Cold) 
o Base Price: $2.00 
o Modifiers: Sugar Level, Ice Level 
o Branch assignment: Main Branch 
o Active    
B) Juice (no modifiers) 
• Orange Juice 
o Category: Juice 
o Base Price: $2.25 
o Modifiers: (none) 
o Branch assignment: Main Branch 
o Active    
C) Hot Coffee Items (attach Sugar only) 
• Hot Latte 
o Category: Coffee (Hot) 
o Base Price: $2.50 
o Modifiers: Sugar Level 
o Branch assignment: Main Branch 
o Active    
• Espresso 
o Category: Coffee (Hot) 
o Base Price: $1.75 
o Modifiers: (none or Sugar Level — up to café; here we’ll do none for purity) 
o Branch assignment: Main Branch 
o Active    
• Hot Green Tea 
o Category: Coffee (Hot) (or “Tea (Hot)” if you prefer another category) 
o Base Price: $1.80 
o Modifiers: Sugar Level 
o Branch assignment: Main Branch 
o Active    
Result: Items appear under their categories with the correct modifier sets. Nothing is 
duplicated; modifiers are reused. 
4) Set Display Order (Optional polish) 
Admin → Reorder 
• Coffee (Cold) first, then Coffee (Hot), then Juice. 
• Inside Coffee (Cold): Iced Latte before Iced Americano. 
• Inside Coffee (Hot): Hot Latte → Espresso → Hot Green Tea. 
Result: Cashier sees a neat, predictable layout. 
5) (Optional) Branch-Level Adjustments 
If the Admin wants to hide Espresso temporarily or tweak a branch price: 
• Manager/Admin → Branch Menu 
o Toggle Espresso: unavailable 
o Or set Iced Latte custom price for Main Branch (e.g., $2.60). 
Result: Only Main Branch is affected; global item stays unchanged. 
6) Offline Readiness 
When the Admin saves, the branch menu snapshot (categories, items, modifiers) is 
synced to devices: 
• Cashier terminals cache everything in IndexedDB. 
• If the internet drops, the cashier still sees and sells from this menu. 
Result: Reliable, offline-friendly menu from day one. 
What the Cashier Will Experience 
• On login, the Menu shows: 
o Coffee (Cold): Iced Latte, Iced Americano 
▪ Tapping either opens modifiers: Sugar Level + Ice Level 
o Coffee (Hot): Hot Latte (Sugar Level), Espresso (no modifiers), Hot Green 
Tea (Sugar Level) 
o Juice: Orange Juice (no modifiers) 
• Adding Iced Latte prompts: 
→ Sugar Level (No, Less, Normal, Extra) + Ice Level (No, Less, Normal, Extra) 
• Adding Hot Latte prompts: 
→ Sugar Level only 
• Orange Juice adds straight to cart. 
•  
Everything calculates correctly (modifiers before discount/VAT), and discount badges (if 
any policy later) will appear on the menu automatically. 
Acceptance Checklist (quick) 
• Categories created and assigned to Main Branch. 
• Modifier groups created once and reused. 
• Cold items have Sugar + Ice; Hot items have Sugar only (except Espresso). 
• Juice item has no modifiers. 
• Items are active, assigned to Main Branch, and appear in the cashier menu. 
• Menu cached offline after first sync. 
Scenario: Adding “Bubble Milk Tea” with Toppings 
Context 
• Tenant: Sunrise Café (Admin logged in) 
• Branch: Main Branch 
• Goal: Add Bubble Milk Tea under Milk Tea category with: 
o Sugar Level (single-select) 
o Ice Level (single-select) 
o Toppings (multi-select; each topping adds extra cost) 
1) Create or Verify Category 
Admin → Catalog → Categories 
• If not present, click Create Category: 
o Name: Milk Tea 
o Active: Yes 
o Display order: After Coffee categories 
o Assigned branches: Main Branch 
Result: “Milk Tea” appears for this branch. 
2) Define/Reuse Modifier Groups 
Admin → Catalog → Modifiers 
A) Sugar Level (single-select; reuse if already created) 
• Options (no price change): No, Less, Normal, Extra 
B) Ice Level (single-select; reuse if already created) 
• Options (no price change): No, Less, Normal, Extra 
C) Toppings (new group; multi-select) 
• Selection type: Multiple 
• Options (+ price adj.): 
o Boba (+$0.30) 
o Aloe Vera Jelly (+$0.40) 
o Grass Jelly (+$0.35) 
o Red Bean (+$0.30) 
• (Stay within limits: ≤12 options/group, ≤5 groups/item total.) 
Result: Three reusable groups ready; Toppings supports multiple selections with price 
add-ons. 
3) Add the Menu Item 
Admin → Catalog → Items → Create Item 
• Name: Bubble Milk Tea 
• Category: Milk Tea 
• Base Price (USD): $2.80 
• Modifiers attached: Sugar Level (single), Ice Level (single), Toppings (multi) 
• Assigned branches: Main Branch 
• Active: Yes 
• (Optional) Image (JPEG/WEBP ≤ 300KB) 
Result: Item saved, linked to modifiers, visible to Main Branch after sync. 
4) Display Order (Optional) 
Admin → Reorder 
• Put Bubble Milk Tea at the top of the Milk Tea list. 
Result: Cashiers see it first in the Milk Tea section. 
5) Offline Sync 
• On save, Modula pushes a menu snapshot to devices. 
• Cashier terminals cache the updated category, item, and modifiers in IndexedDB. 
Result: Even offline, “Bubble Milk Tea” and its options are available for sale. 
What the Cashier Sees During a Sale 
Cashier → Menu → Milk Tea → Bubble Milk Tea 
• Prompts open: 
o Sugar Level: No / Less / Normal / Extra (choose one) 
o Ice Level: No / Less / Normal / Extra (choose one) 
o Toppings (multi-select): Boba (+$0.30), Aloe Vera (+$0.40), Grass Jelly 
(+$0.35), Red Bean (+$0.30) 
Example build: 
• Sugar: Normal 
• Ice: Less 
• Toppings: Boba and Aloe Vera 
Cart math: 
• Base price: $2.80 
o Boba $0.30 
o Aloe Vera $0.40 
• Line total: $3.50 (before any discount/VAT) 
(If a branch or item discount policy exists, the Sale Module applies it automatically after 
modifiers.) 
Acceptance Checklist 
• Milk Tea category exists, active, and assigned to Main Branch. 
• Bubble Milk Tea created with $2.80 base price and attached to the three modifier 
groups. 
• Toppings group is multi-select with correct per-option price adjustments. 
• Item is visible to cashiers under Milk Tea, in the correct display order. 
• Item shows and works offline after the menu snapshot sync. 
• Choosing multiple toppings correctly increases the line price. 
Guardrails (quietly enforced) 
• Modifier limits: ≤5 groups/item, ≤12 options/group, ≤30 total options per item. 
• Image size/type validated (≤300KB, JPEG/WEBP). 
• Item counted once toward tenant quota (not multiplied by branches).
