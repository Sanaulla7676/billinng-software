import assert from 'assert';
import test from 'tape';
import { validateCompany, validateItem, validateParty } from './masterData';

test('company master validation accepts a valid company', (t) => {
  t.deepEqual(
    validateCompany({
      id: 'company-1',
      name: 'Demo Traders',
      address: 'Bengaluru',
      state: 'Karnataka',
      stateCode: '29',
      gstin: '29ABCDE1234F1Z5',
    }),
    [],
  );
  t.end();
});

test('party master validation rejects invalid GSTIN and negative credit', (t) => {
  const errors = validateParty({
    id: 'customer-1',
    name: 'Customer',
    type: 'customer',
    gstin: 'INVALID',
    creditDays: -1,
  });
  t.ok(errors.includes('GSTIN must contain exactly 15 alphanumeric characters'));
  t.ok(errors.includes('Credit days cannot be negative'));
  t.end();
});

test('item master validation protects pricing and GST boundaries', (t) => {
  const errors = validateItem({
    id: 'item-1',
    name: 'Widget',
    unit: 'Nos',
    sellingRate: -10,
    gstRate: 101,
  });
  assert.ok(errors.includes('Selling rate cannot be negative'));
  assert.ok(errors.includes('GST rate must be between 0 and 100'));
  t.end();
});
