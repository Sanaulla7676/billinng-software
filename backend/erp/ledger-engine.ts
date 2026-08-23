export type LedgerEntry = {
  accountId: string;
  debit: number;
  credit: number;
  narration?: string;
};

export function validateLedgerEntries(entries: LedgerEntry[]): void {
  if (entries.length === 0) throw new Error('A transaction must contain ledger entries');

  const debit = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const credit = entries.reduce((sum, entry) => sum + entry.credit, 0);

  if (!entries.every((entry) => Number.isFinite(entry.debit) && Number.isFinite(entry.credit))) {
    throw new Error('Ledger entries must contain finite amounts');
  }
  if (entries.some((entry) => entry.debit < 0 || entry.credit < 0)) {
    throw new Error('Ledger debit/credit amounts cannot be negative');
  }
  if (Math.abs(debit - credit) > 0.005) {
    throw new Error(`Unbalanced transaction: debit ${debit.toFixed(2)} != credit ${credit.toFixed(2)}`);
  }
}

export function accountBalances(entries: LedgerEntry[]): Map<string, number> {
  validateLedgerEntries(entries);
  const balances = new Map<string, number>();

  for (const entry of entries) {
    const current = balances.get(entry.accountId) ?? 0;
    balances.set(entry.accountId, Number((current + entry.debit - entry.credit).toFixed(2)));
  }

  return balances;
}

export function createSaleLedger(input: {
  customerAccountId: string;
  salesAccountId: string;
  outputTaxAccountIds: string[];
  grandTotal: number;
  taxableAmount: number;
  taxAmounts: number[];
  narration?: string;
}): LedgerEntry[] {
  if (input.grandTotal < 0 || input.taxableAmount < 0) throw new Error('Sale amounts cannot be negative');

  const entries: LedgerEntry[] = [
    {
      accountId: input.customerAccountId,
      debit: Number(input.grandTotal.toFixed(2)),
      credit: 0,
      narration: input.narration,
    },
    {
      accountId: input.salesAccountId,
      debit: 0,
      credit: Number(input.taxableAmount.toFixed(2)),
      narration: input.narration,
    },
  ];

  input.outputTaxAccountIds.forEach((accountId, index) => {
    const amount = Number((input.taxAmounts[index] ?? 0).toFixed(2));
    if (amount > 0) entries.push({ accountId, debit: 0, credit: amount, narration: input.narration });
  });

  validateLedgerEntries(entries);
  return entries;
}
