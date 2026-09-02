export const codeStateMap = {
  '01': 'Jammu and Kashmir',
  '02': 'Himachal Pradesh',
  '03': 'Punjab',
  '04': 'Chandigarh',
  '05': 'Uttarakhand',
  '06': 'Haryana',
  '07': 'Delhi',
  '08': 'Rajasthan',
  '09': 'Uttar Pradesh',
  '10': 'Bihar',
  '11': 'Sikkim',
  '12': 'Arunachal Pradesh',
  '13': 'Nagaland',
  '14': 'Manipur',
  '15': 'Mizoram',
  '16': 'Tripura',
  '17': 'Meghalaya',
  '18': 'Assam',
  '19': 'West Bengal',
  '20': 'Jharkhand',
  '21': 'Odisha',
  '22': 'Chattisgarh',
  '23': 'Madhya Pradesh',
  '24': 'Gujarat',
  '26': 'Dadra and Nagar Haveli and Daman and Diu',
  '27': 'Maharashtra',
  '29': 'Karnataka',
  '30': 'Goa',
  '31': 'Lakshadweep',
  '32': 'Kerala',
  '33': 'Tamil Nadu',
  '34': 'Puducherry',
  '35': 'Andaman and Nicobar Islands',
  '36': 'Telangana',
  '37': 'Andhra Pradesh',
  '38': 'Ladakh',
} as Record<string, string>;

/**
 * Returns the 2-digit GST state code embedded in a GSTIN, or undefined
 * if the GSTIN is missing/malformed or the code isn't a known state.
 */
export function getStateCodeFromGSTIN(gstin?: string): string | undefined {
  if (!gstin || typeof gstin !== 'string' || gstin.trim().length < 2) {
    return undefined;
  }

  const code = gstin.trim().substring(0, 2);
  return codeStateMap[code] ? code : undefined;
}

/**
 * Determines whether a sale/purchase between the company and a party is
 * intra-state (CGST + SGST, family 'GST') or inter-state (IGST, family
 * 'IGST'), based on the state codes embedded in their GSTINs.
 *
 * Returns undefined when either GSTIN is missing/unparseable, i.e. when
 * there isn't enough information to decide - callers should leave the
 * existing tax selection untouched in that case rather than guessing.
 */
export function resolveGSTTaxFamily(
  companyGSTIN?: string,
  partyGSTIN?: string
): 'GST' | 'IGST' | undefined {
  const companyCode = getStateCodeFromGSTIN(companyGSTIN);
  const partyCode = getStateCodeFromGSTIN(partyGSTIN);

  if (!companyCode || !partyCode) {
    return undefined;
  }

  return companyCode === partyCode ? 'GST' : 'IGST';
}

/**
 * Rewrites a Tax doc name (e.g. "GST-18", "IGST-18", "Exempt-GST-0") to
 * the equivalent tax in the given family, preserving the percentage.
 * Returns undefined if the name doesn't follow the expected convention
 * (e.g. a custom, non-standard tax template), so callers can fall back
 * to leaving it as-is.
 */
export function remapTaxToFamily(
  taxName: string,
  family: 'GST' | 'IGST'
): string | undefined {
  const exemptMatch = taxName.match(/^Exempt-(?:GST|IGST)-(.+)$/);
  if (exemptMatch) {
    return `Exempt-${family}-${exemptMatch[1]}`;
  }

  const match = taxName.match(/^(?:GST|IGST)-(.+)$/);
  if (!match) {
    return undefined;
  }

  return `${family}-${match[1]}`;
}
