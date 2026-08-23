# ERP Build Roadmap

## Implemented foundations
- Sales amount and GST calculation
- Double-entry ledger validation
- Sales ledger posting model
- Inventory stock movement model
- Negative-stock validation

## Build order
1. Company and financial-year setup
2. Customer, supplier, item, unit and tax masters
3. Sales and purchase voucher persistence
4. Automatic ledger posting
5. Automatic stock posting
6. Receivables and payables / bill-wise outstanding
7. Sales and purchase returns
8. Godowns, stock transfers, batches and expiry
9. GST reports and compliance data model
10. Bank accounts and reconciliation
11. Financial reports: Day Book, Ledger, Trial Balance, P&L, Balance Sheet, Cash Flow
12. Advanced controls: cost centres, budgets, audit log, permissions
13. Backup/restore and import/export
14. Payroll
15. Manufacturing, BOM and job work
16. Connected services and integrations

## Transaction invariant
A posted business transaction must be internally consistent across the relevant domains:

`document -> accounting -> inventory -> tax -> outstanding -> reports`

A transaction must not be considered posted until all required domain validations succeed.

## Print layer
The accounting document remains independent from presentation. The Parcel-Perfect tax invoice template consumes the saved document data and must never calculate business totals itself.
