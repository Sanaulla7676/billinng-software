export type GSTRegistrationType = 'regular' | 'composition' | 'unregistered' | 'consumer';

export interface CompanyMaster {
  id: string;
  name: string;
  legalName?: string;
  address: string;
  state: string;
  stateCode: string;
  gstin?: string;
  phone?: string;
  email?: string;
  bank?: {
    name: string;
    accountNumber: string;
    ifsc: string;
    branch?: string;
  };
}

export interface PartyMaster {
  id: string;
  name: string;
  type: 'customer' | 'supplier';
  phone?: string;
  email?: string;
  address?: string;
  state?: string;
  stateCode?: string;
  gstin?: string;
  registrationType?: GSTRegistrationType;
  creditDays?: number;
  creditLimit?: number;
  openingBalance?: number;
}

export interface ItemMaster {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  hsnSac?: string;
  unit: string;
  purchaseRate?: number;
  sellingRate: number;
  gstRate: number;
  openingStock?: number;
  reorderLevel?: number;
  trackBatch?: boolean;
  trackExpiry?: boolean;
}

const GSTIN_PATTERN = /^[0-9A-Z]{15}$/;

export function validateCompany(company: CompanyMaster): string[] {
  const errors: string[] = [];
  if (!company.id.trim()) errors.push('Company id is required');
  if (!company.name.trim()) errors.push('Company name is required');
  if (!company.address.trim()) errors.push('Company address is required');
  if (!company.state.trim()) errors.push('Company state is required');
  if (!company.stateCode.trim()) errors.push('Company state code is required');
  if (company.gstin && !GSTIN_PATTERN.test(company.gstin.toUpperCase())) {
    errors.push('GSTIN must contain exactly 15 alphanumeric characters');
  }
  return errors;
}

export function validateParty(party: PartyMaster): string[] {
  const errors: string[] = [];
  if (!party.id.trim()) errors.push('Party id is required');
  if (!party.name.trim()) errors.push('Party name is required');
  if (party.gstin && !GSTIN_PATTERN.test(party.gstin.toUpperCase())) {
    errors.push('GSTIN must contain exactly 15 alphanumeric characters');
  }
  if (party.creditDays !== undefined && party.creditDays < 0) errors.push('Credit days cannot be negative');
  if (party.creditLimit !== undefined && party.creditLimit < 0) errors.push('Credit limit cannot be negative');
  return errors;
}

export function validateItem(item: ItemMaster): string[] {
  const errors: string[] = [];
  if (!item.id.trim()) errors.push('Item id is required');
  if (!item.name.trim()) errors.push('Item name is required');
  if (!item.unit.trim()) errors.push('Item unit is required');
  if (item.sellingRate < 0) errors.push('Selling rate cannot be negative');
  if (item.purchaseRate !== undefined && item.purchaseRate < 0) errors.push('Purchase rate cannot be negative');
  if (item.gstRate < 0 || item.gstRate > 100) errors.push('GST rate must be between 0 and 100');
  if (item.openingStock !== undefined && item.openingStock < 0) errors.push('Opening stock cannot be negative');
  if (item.reorderLevel !== undefined && item.reorderLevel < 0) errors.push('Reorder level cannot be negative');
  return errors;
}
