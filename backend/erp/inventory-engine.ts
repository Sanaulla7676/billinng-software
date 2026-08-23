export type StockMovementType = 'OPENING' | 'PURCHASE' | 'SALE' | 'PURCHASE_RETURN' | 'SALES_RETURN' | 'ADJUSTMENT' | 'TRANSFER_IN' | 'TRANSFER_OUT';

export interface StockMovement {
  itemId: string;
  warehouseId?: string;
  type: StockMovementType;
  quantity: number;
  unitCost: number;
  referenceId: string;
  date: string;
}

export interface StockBalance {
  itemId: string;
  warehouseId?: string;
  quantity: number;
  value: number;
}

const signedQuantity: Record<StockMovementType, number> = {
  OPENING: 1,
  PURCHASE: 1,
  SALE: -1,
  PURCHASE_RETURN: -1,
  SALES_RETURN: 1,
  ADJUSTMENT: 1,
  TRANSFER_IN: 1,
  TRANSFER_OUT: -1,
};

export function calculateStockBalance(movements: StockMovement[]): StockBalance[] {
  const balances = new Map<string, StockBalance>();

  for (const movement of movements) {
    if (!Number.isFinite(movement.quantity) || movement.quantity < 0) {
      throw new Error(`Invalid stock quantity for ${movement.referenceId}`);
    }
    if (!Number.isFinite(movement.unitCost) || movement.unitCost < 0) {
      throw new Error(`Invalid stock cost for ${movement.referenceId}`);
    }

    const key = `${movement.itemId}::${movement.warehouseId ?? 'DEFAULT'}`;
    const current = balances.get(key) ?? {
      itemId: movement.itemId,
      warehouseId: movement.warehouseId,
      quantity: 0,
      value: 0,
    };

    const direction = signedQuantity[movement.type];
    current.quantity += movement.quantity * direction;
    current.value += movement.quantity * movement.unitCost * direction;
    balances.set(key, current);
  }

  return [...balances.values()].map((balance) => ({
    ...balance,
    quantity: Number(balance.quantity.toFixed(3)),
    value: Number(balance.value.toFixed(2)),
  }));
}

export function assertNoNegativeStock(balances: StockBalance[]): void {
  const negative = balances.find((balance) => balance.quantity < -0.000001);
  if (negative) {
    throw new Error(`Insufficient stock for item ${negative.itemId}`);
  }
}
