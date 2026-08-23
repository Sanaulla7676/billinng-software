# Core Billing Architecture

The application uses an offline-first Electron/Vue/TypeScript architecture. New accounting features should be implemented as domain services first and connected to Vue pages through the existing router/state layer.

## Transaction invariants

Every posted sales transaction must:

1. Create a unique invoice number.
2. Calculate line amounts, discounts and GST deterministically.
3. Update customer receivable when the sale is on credit.
4. Update cash/bank when paid immediately.
5. Reduce stock for stock-tracked items.
6. Post balanced accounting entries.
7. Preserve the original transaction after posting; corrections use cancellation/return flows rather than destructive edits.

Every purchase transaction follows the corresponding opposite inventory/accounting flow.
