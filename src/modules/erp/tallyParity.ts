export type TaxMode = 'intra-state' | 'inter-state' | 'exempt';

export interface CompanyProfile {
  id: string;
  name: string;
  legalName?: string;
  address?: string;
  phone?: string;
  email?: string;
  gstin?: string;
  state?: string;
  stateCode?: string;
  financialYearStart: string;
  currency: string;
}

export interface Party {
  id: string;
  name: string;
  type: 'customer' | 'supplier';
  phone?: string;
  email?: string;
  address?: string;
  gstin?: string;
  state?: string;
  stateCode?: string;
  creditDays?: number;
  creditLimit?: number;
  openingBalance?: number;
}

export interface ItemMaster {
  id: string;
  name: string;
  sku?: string;
  hsnSac?: string;
  unit: string;
  category?: string;
  purchaseRate: number;
  salesRate: number;
  gstRate: number;
  openingStock: number;
  reorderLevel?: number;
  trackBatch?: boolean;
  trackExpiry?: boolean;
}

export interface InvoiceLine {
  itemId: string;
  description: string;
  hsnSac?: string;
  qty: number;
  rate: number;
  discountPercent: number;
  taxableAmount: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export interface SalesInvoice {
  id: string;
  number: string;
  date: string;
  customerId: string;
  taxMode: TaxMode;
  lines: InvoiceLine[];
  subtotal: number;
  discount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  roundOff: number;
  grandTotal: number;
  status: 'draft' | 'saved' | 'cancelled';
}

export interface JournalLine {
  accountId: string;
  debit: number;
  credit: number;
  narration?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  voucherType: string;
  voucherId: string;
  lines: JournalLine[];
}

export interface StockMovement {
  itemId: string;
  date: string;
  quantity: number;
  direction: 'in' | 'out';
  referenceType: string;
  referenceId: string;
  rate: number;
}

export interface SaleInputLine {
  itemId: string;
  description: string;
  hsnSac?: string;
  qty: number;
  rate: number;
  discountPercent?: number;
  gstRate: number;
}

const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateInvoice(
  lines: SaleInputLine[],
  taxMode: TaxMode,
  round = true,
): Omit<SalesInvoice, 'id' | 'number' | 'date' | 'customerId' | 'status'> {
  const calculated = lines.map((line) => {
    if (line.qty < 0 || line.rate < 0 || line.gstRate < 0) {
      throw new Error('Quantity, rate and GST rate cannot be negative');
    }
    const discountPercent = line.discountPercent ?? 0;
    if (discountPercent < 0 || discountPercent > 100) {
      throw new Error('Discount must be between 0 and 100 percent');
    }
    const gross = money(line.qty * line.rate);
    const discount = money((gross * discountPercent) / 100);
    const taxableAmount = money(gross - discount);
    const tax = money((taxableAmount * line.gstRate) / 100);
    const cgst = taxMode === 'intra-state' ? money(tax / 2) : 0;
    const sgst = taxMode === 'intra-state' ? money(tax - cgst) : 0;
    const igst = taxMode === 'inter-state' ? tax : 0;
    const total = money(taxableAmount + cgst + sgst + igst);
    return {
      ...line,
      discountPercent,
      taxableAmount,
      cgst,
      sgst,
      igst,
      total,
    };
  });

  const subtotal = money(calculated.reduce((sum, line) => sum + line.qty * line.rate, 0));
  const discount = money(calculated.reduce((sum, line) => sum + line.qty * line.rate * line.discountPercent / 100, 0));
  const taxableAmount = money(calculated.reduce((sum, line) => sum + line.taxableAmount, 0));
  const cgst = money(calculated.reduce((sum, line) => sum + line.cgst, 0));
  const sgst = money(calculated.reduce((sum, line) => sum + line.sgst, 0));
  const igst = money(calculated.reduce((sum, line) => sum + line.igst, 0));
  const beforeRound = money(taxableAmount + cgst + sgst + igst);
  const grandTotal = round ? money(Math.round(beforeRound)) : beforeRound;
  const roundOff = money(grandTotal - beforeRound);

  return { lines: calculated, subtotal, discount, taxableAmount, cgst, sgst, igst, roundOff, grandTotal, taxMode };
}

export function validateJournal(entry: JournalEntry): void {
  const debit = money(entry.lines.reduce((sum, line) => sum + line.debit, 0));
  const credit = money(entry.lines.reduce((sum, line) => sum + line.credit, 0));
  if (entry.lines.length === 0 || debit !== credit) {
    throw new Error(`Unbalanced journal: debit ${debit}, credit ${credit}`);
  }
}

export function createSaleJournal(invoice: SalesInvoice, customerAccountId: string, salesAccountId: string, taxAccountIds: { cgst: string; sgst: string; igst: string }): JournalEntry {
  const lines: JournalLine[] = [{ accountId: customerAccountId, debit: invoice.grandTotal, credit: 0 }];
  lines.push({ accountId: salesAccountId, debit: 0, credit: invoice.taxableAmount });
  if (invoice.cgst) lines.push({ accountId: taxAccountIds.cgst, debit: 0, credit: invoice.cgst });
  if (invoice.sgst) lines.push({ accountId: taxAccountIds.sgst, debit: 0, credit: invoice.sgst });
  if (invoice.igst) lines.push({ accountId: taxAccountIds.igst, debit: 0, credit: invoice.igst });
  if (invoice.roundOff !== 0) {
    lines.push(invoice.roundOff > 0
      ? { accountId: 'round-off', debit: 0, credit: invoice.roundOff }
      : { accountId: 'round-off', debit: Math.abs(invoice.roundOff), credit: 0 });
  }
  const entry: JournalEntry = { id: crypto.randomUUID(), date: invoice.date, voucherType: 'Sales', voucherId: invoice.id, lines };
  validateJournal(entry);
  return entry;
}
