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
 * Returns the 2-digit GST state code matching a state's name (e.g.
 * "Karnataka" -> "29"), or undefined if it isn't a recognised state.
 * Used as a fallback for parties that don't have a GSTIN on file (e.g.
 * unregistered/consumer buyers) but do have a state set on their address.
 */
export function getStateCodeFromName(stateName?: string): string | undefined {
  if (!stateName || typeof stateName !== 'string' || !stateName.trim()) {
    return undefined;
  }

  const normalized = stateName.trim().toLowerCase();
  const match = Object.entries(codeStateMap).find(
    ([, name]) => name.toLowerCase() === normalized
  );

  return match?.[0];
}

/**
 * Determines whether a sale/purchase between the company and a party is
 * intra-state (CGST + SGST, family 'GST') or inter-state (IGST, family
 * 'IGST'), given their 2-digit GST state codes - each resolved from
 * whichever is available: GSTIN first, falling back to a plain address
 * state (see getStateCodeFromGSTIN / getStateCodeFromName).
 *
 * Returns undefined when either code is missing, i.e. when there isn't
 * enough information to decide - callers should leave the existing tax
 * selection untouched in that case rather than guessing.
 */
export function resolveGSTTaxFamily(
  companyStateCode?: string,
  partyStateCode?: string
): 'GST' | 'IGST' | undefined {
  if (!companyStateCode || !partyStateCode) {
    return undefined;
  }

  return companyStateCode === partyStateCode ? 'GST' : 'IGST';
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
