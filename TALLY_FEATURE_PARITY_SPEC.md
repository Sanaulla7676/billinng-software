# Tally-Style Billing Software Feature Parity Specification

This document defines the target product scope for `billinng-software` based on the requested Tally-style end-to-end workflow.

## 1. Installation and Company Setup
- Installer / first-run experience
- Create company
- Open company
- Alter company
- Close company
- Company name
- Address
- Contact details
- Email / website
- Financial year
- Books beginning from
- Base currency
- Formal name / currency symbol
- GST registration details
- State / state code
- Tax configuration
- Invoice numbering configuration
- Print configuration
- Bank details
- Terms and conditions

## 2. Company Administration
- Company selector
- Multiple companies
- Company switching
- Company backup
- Company restore
- Company data export/import
- User accounts
- Roles and permissions
- Access control
- Audit trail
- Configuration settings

## 3. Masters
### Customers / Parties
- Create / edit / view / deactivate customer
- Customer name
- Address
- Phone
- Email
- GSTIN
- Registration type
- State / place of supply
- Credit limit
- Credit period
- Opening balance
- Ledger view

### Suppliers
- Same core party-management capabilities as customers

### Items / Stock
- Stock item CRUD
- Category / group
- Brand
- Unit
- HSN/SAC
- GST rate
- MRP
- Purchase rate
- Sales rate
- Opening stock
- Reorder level
- Minimum / maximum stock
- Batch / serial support where applicable
- Godown / location

### Accounting Masters
- Ledger
- Ledger groups
- Cash
- Bank
- Sales
- Purchase
- Expenses
- Income
- Tax ledgers
- Receivable / payable ledgers

### Other Masters
- Units
- Godowns / branches
- Cost centres
- Price levels / price lists
- Voucher types

## 4. Sales Workflow
1. New sales invoice
2. Select customer
3. Auto-fill customer details
4. Select sales ledger
5. Add stock item(s)
6. Enter quantity
7. Enter / select rate
8. Apply discount
9. Calculate taxable value
10. Calculate CGST/SGST/IGST as applicable
11. Round-off
12. Grand total
13. Amount in words
14. Save voucher
15. Post accounting entries
16. Update stock
17. Update customer receivable
18. Update tax registers

## 5. Purchase Workflow
- Purchase invoice
- Supplier selection
- Item entry
- Quantity / rate
- Discount
- GST
- Total
- Stock inward
- Supplier payable
- Purchase register

## 6. Other Transactions
- Receipt
- Payment
- Contra
- Journal
- Debit note
- Credit note
- Sales return
- Purchase return
- Expense voucher
- Stock journal
- Physical stock adjustment
- Delivery note / dispatch documentation
- Receipt note / inward documentation

## 7. Inventory
- Real-time stock balance
- Stock movement
- Stock valuation
- Godown-wise stock
- Batch-wise stock where applicable
- Serial-number support where applicable
- Reorder level / low-stock alerts
- Opening stock
- Stock transfers
- Stock adjustments
- Inventory reports

## 8. GST / Tax
- GST registration settings
- Tax rates
- HSN/SAC
- CGST
- SGST
- IGST
- GST calculation
- Place of supply
- Customer GSTIN validation/storage
- Tax invoice
- Credit/debit notes
- GST registers
- GST summaries
- Taxable value / tax amount reporting
- Exportable GST data
- Version/edition-specific government filing integrations must be treated as configurable capabilities, not hard-coded assumptions

## 9. Billing / Invoice Engine
- Configurable invoice numbering
- Invoice prefix / sequence
- Draft invoice
- Saved invoice
- Duplicate / copy invoice
- Edit invoice
- Cancel / void invoice
- Search invoices
- Filter by date/customer/status
- Payment status
- Outstanding amount
- Customer balance
- Multiple print templates
- A4 invoice
- Thermal/POS invoice
- Parcel-Perfect-style tax invoice
- Logo
- Signature
- Bank details
- Terms and conditions
- Custom fields
- Amount in words

## 10. Printing / PDF
- Print preview
- Printer selection
- Direct print
- PDF export
- PDF download
- Share/export
- Email invoice
- A4 print CSS
- Thermal widths
- Multi-page invoice handling
- Repeat table headers on page breaks
- No clipping / overflow
- Exact variable rendering
- Company settings driven permanent values
- Transaction driven variable values

## 11. Accounts Receivable / Payable
- Customer ledger
- Supplier ledger
- Outstanding invoices
- Receivables ageing
- Payables ageing
- Receipt allocation
- Payment allocation
- Partial payments
- Advance payments
- Credit notes
- Balance tracking
- Due dates
- Credit-limit monitoring

## 12. Banking
- Bank masters
- Cash accounts
- Receipts
- Payments
- Contra
- Bank ledger
- Payment references
- Bank reconciliation capability

## 13. Reports
- Day book
- Sales register
- Purchase register
- Receipt register
- Payment register
- Journal register
- Customer ledger
- Supplier ledger
- Stock summary
- Stock movement
- Trial balance
- Profit and loss
- Balance sheet
- Cash flow
- Outstanding receivables
- Outstanding payables
- GST reports / summaries
- Tax registers
- Sales analysis
- Purchase analysis

## 14. Dashboard
- Today's sales
- Total sales
- Total purchases
- Receivables
- Payables
- Cash balance
- Bank balance
- Low-stock items
- Recent invoices
- Pending payments
- GST summary
- Quick actions

## 15. Search and Navigation
- Global search
- Customer search
- Item search
- Invoice search
- Voucher search
- Date filters
- Status filters
- Keyboard-friendly workflow
- Quick-create actions
- Recent documents

## 16. Security / Audit
- Login
- User roles
- Permission matrix
- Company-level access
- Create/edit/delete permissions
- Audit trail
- Change history
- Session controls
- Backup / restore

## 17. Import / Export
- Customer import
- Supplier import
- Item import
- Opening balance import
- Opening stock import
- Sales import where supported
- CSV/Excel export
- PDF export
- Reporting export

## 18. Product Quality Requirements
- Financial calculations must be deterministic and auditable
- GST calculations must be configurable and jurisdiction aware
- No fake defaults for tax rates or HSN/SAC
- Empty optional fields must remain empty
- Permanent company data must come from company settings
- Bill variables must come from transaction/customer/item data
- Invoice rendering must be stable on A4 and supported thermal widths
- Print output must match the selected template exactly
- Every save must update the appropriate accounting/inventory state atomically
- Backup and restore must be testable
- All major operations should have validation and error handling

## 19. End-to-End User Flow
DOWNLOAD/INSTALL
  -> CREATE COMPANY
  -> COMPANY SETTINGS
  -> CREATE CUSTOMERS
  -> CREATE SUPPLIERS
  -> CREATE ITEMS
  -> CREATE UNITS/CATEGORIES/GODOWNS
  -> OPEN SALES
  -> SELECT CUSTOMER
  -> ADD ITEMS
  -> APPLY DISCOUNT/TAX
  -> CALCULATE TOTAL
  -> SAVE INVOICE
  -> UPDATE STOCK
  -> UPDATE CUSTOMER BALANCE
  -> POST GST DATA
  -> PREVIEW
  -> PRINT / PDF / SHARE
  -> REPORTS
  -> BACKUP

## 20. Implementation Rule
Do not copy proprietary code or branding from third-party software. Implement equivalent workflows and capabilities using original code, while preserving the requested billing behavior and the Parcel-Perfect-style invoice layout already established in this repository.
