# Build Status

## Billing System Upgrade

This repository is being upgraded from a basic billing/accounting application toward a full small-business ERP workflow inspired by the functional scope of TallyPrime, with original implementation and UI.

### Current implementation target
- Company setup and business profile
- Customer and supplier masters
- Product/item masters
- Sales invoices
- Purchase invoices
- Receipts and payments
- Double-entry accounting
- Customer/supplier outstanding balances
- Inventory stock movements
- GST calculation and invoice presentation
- Parcel-Perfect print layout
- Reports and dashboards
- Backup/restore and data import/export

### Build order
1. Core masters and company configuration
2. Sales/purchase transaction engine
3. Accounting postings and balances
4. Inventory engine
5. GST and compliance layer
6. Printing/PDF engine
7. Reports
8. Security, backup and administration
9. Advanced inventory, banking, payroll and manufacturing modules

### Important
Feature parity is being implemented incrementally and must be validated with automated tests and real transaction scenarios. This file is a status document, not a claim that all TallyPrime features are already implemented.
