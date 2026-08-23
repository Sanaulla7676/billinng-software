# ERP Module

This module is the functional parity layer for the billing application. It is an original implementation and is not Tally source code.

## Transaction flow

Company -> Party -> Item -> Voucher -> Accounting -> Inventory -> Tax -> Reports -> Print/Export

## Implemented foundation

- Company, customer/supplier and item domain types
- Sales invoice calculation
- Discount handling
- Intra-state CGST/SGST calculation
- Inter-state IGST calculation
- Round-off
- Balanced journal validation
- Sales journal generation
- Stock movement domain

## Build sequence

1. Persist masters in SQLite
2. Sales and purchase voucher persistence
3. Automatic ledger posting
4. Inventory posting and stock ledger
5. Receivables/payables and bill-wise allocation
6. GST registers and statutory exports
7. Bank and cash reconciliation
8. Reporting engine
9. User roles, audit log and backup/restore
10. Payroll
11. Manufacturing/BOM/job work
12. Integrations and remote services

## Accounting invariant

Every posted accounting voucher must have total debits equal to total credits. Inventory-changing vouchers must have corresponding stock movements. Tax-bearing sales and purchase vouchers must produce tax ledger entries.
