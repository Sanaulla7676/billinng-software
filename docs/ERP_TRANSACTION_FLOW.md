# ERP Transaction Flow

## Sales

1. Select company and financial year.
2. Select or create customer.
3. Select or create item.
4. Enter quantity, rate, discount and tax.
5. Calculate taxable value and GST.
6. Validate the invoice.
7. Post the accounting voucher.
8. Post inventory movement.
9. Update customer receivable.
10. Persist the invoice and audit metadata.
11. Generate the selected print/PDF template.

## Purchase

1. Select supplier.
2. Select items and quantities.
3. Calculate taxable value and GST.
4. Post purchase accounting entries.
5. Increase inventory.
6. Update supplier payable.
7. Persist voucher.

## Returns

Sales returns reverse the relevant sales, receivable, tax and stock effects. Purchase returns reverse purchase, payable, tax and stock effects.

## Invariants

- Every posted accounting voucher must balance: total debits = total credits.
- Inventory quantities must reconcile with posted stock movements.
- Tax amounts must reconcile with invoice taxable values and rates.
- A finalized invoice number must be unique within its company/series.
- Posted transactions must not be silently mutated; corrections should use reversal/adjustment transactions.
