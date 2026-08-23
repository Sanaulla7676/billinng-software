# Remaining Build Execution Plan

This is the implementation contract for completing the ERP/billing application without claiming untested feature parity.

## Build order

1. SQLite persistence and migrations
2. Company, customer, supplier and item masters
3. Sales and purchase transaction UI
4. Accounting posting and reversals
5. Inventory posting, godowns, transfers, batches and valuation
6. Receivables/payables and bill-wise settlement
7. GST configuration and reports
8. Banking and reconciliation
9. Financial, inventory and management reports
10. Users, roles, audit log, backup and restore
11. Import/export
12. Payroll
13. Manufacturing, BOM and job work
14. Integrations including email/WhatsApp/payment services
15. Parcel-Perfect print/PDF validation
16. Automated integration tests
17. Production packaging and release verification

## Non-negotiable transaction rule

A posted transaction must be persisted atomically with its accounting, inventory, tax and outstanding effects. Failed validation must leave no partial posting.

## Quality gate

No module is considered complete until its UI, persistence, validation, error handling and automated tests work together. Regulatory integrations require real credentials and sandbox/production verification before being represented as live capabilities.
