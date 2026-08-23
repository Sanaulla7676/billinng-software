export type TaxMode = 'intraState' | 'interState' | 'none';

export interface SaleLineInput {
  itemId: string;
  description: string;
  hsnCode?: string;
  qty: number;
  rate: number;
  discount?: number;
  gstRate?: number;
}

export interface CalculatedLine extends SaleLineInput {
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  lineTotal: number;
}

export interface SaleTotals {
  subtotal: number;
  discount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  roundOff: number;
  grandTotal: number;
}

export interface SaleCalculation {
  lines: CalculatedLine[];
  totals: SaleTotals;
}

const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function calculateSale(lines: SaleLineInput[], taxMode: TaxMode): SaleCalculation {
  const calculated = lines.map((line) => {
    if (!Number.isFinite(line.qty) || line.qty <= 0) throw new Error(`Invalid quantity for ${line.description}`);
    if (!Number.isFinite(line.rate) || line.rate < 0) throw new Error(`Invalid rate for ${line.description}`);

    const gross = money(line.qty * line.rate);
    const discountAmount = money(Math.min(gross, line.discount ?? 0));
    const taxableAmount = money(gross - discountAmount);
    const rate = Math.max(0, line.gstRate ?? 0);
    const taxAmount = money((taxableAmount * rate) / 100);

    return {
      ...line,
      discountAmount,
      taxableAmount,
      taxAmount,
      lineTotal: money(taxableAmount + taxAmount),
    };
  });

  const subtotal = money(calculated.reduce((sum, line) => sum + line.qty * line.rate, 0));
  const discount = money(calculated.reduce((sum, line) => sum + line.discountAmount, 0));
  const taxableAmount = money(calculated.reduce((sum, line) => sum + line.taxableAmount, 0));
  const totalTax = money(calculated.reduce((sum, line) => sum + line.taxAmount, 0));

  const cgst = taxMode === 'intraState' ? money(totalTax / 2) : 0;
  const sgst = taxMode === 'intraState' ? money(totalTax - cgst) : 0;
  const igst = taxMode === 'interState' ? totalTax : 0;
  const beforeRound = money(taxableAmount + cgst + sgst + igst);
  const rounded = Math.round(beforeRound);
  const roundOff = money(rounded - beforeRound);

  return {
    lines: calculated,
    totals: {
      subtotal,
      discount,
      taxableAmount,
      cgst,
      sgst,
      igst,
      roundOff,
      grandTotal: money(beforeRound + roundOff),
    },
  };
}

export interface JournalLine {
  accountId: string;
  debit: number;
  credit: number;
}

export function validateBalancedEntry(lines: JournalLine[]): boolean {
  const debit = money(lines.reduce((sum, line) => sum + line.debit, 0));
  const credit = money(lines.reduce((sum, line) => sum + line.credit, 0));
  return debit === credit;
}
