import { createApp } from 'vue';

// Kept in sync with templates/Tax-Invoice.template.html for quick visual QA
// in a plain browser (no Electron needed). Not part of the shipped app.
const invoiceTemplate = String.raw`<style>
@page { size: A4; margin: 6mm 6mm; }
.invoice, .invoice * { box-sizing: border-box; }
.invoice {
  font-family: Arial, Helvetica, sans-serif;
  color: #000000;
  background-color: #ffffff;
  font-size: 10px;
  width: 100%;
}

.invoice .invoice-title {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
}

.invoice .outer-border {
  border: 1px solid #000000;
  width: 100%;
}

.invoice table {
  width: 100%;
  border-collapse: collapse;
}

.invoice td {
  padding: 0;
  margin: 0;
  vertical-align: top;
}

.invoice .top-grid {
  border-bottom: 1px solid #000000;
}

.invoice .left-party-pane {
  width: 55%;
  border-right: 1px solid #000000;
}

.invoice .right-meta-pane {
  width: 45%;
}

.invoice .seller-details,
.invoice .consignee-details,
.invoice .buyer-details {
  padding: 4px 6px;
  font-size: 10px;
  line-height: 1.25;
}

.invoice .seller-details {
  border-bottom: 1px solid #000000;
}

.invoice .consignee-details {
  border-bottom: 1px solid #000000;
}

.invoice .party-title {
  font-size: 9px;
  color: #000000;
  margin-bottom: 1px;
  text-decoration: underline;
}

.invoice .party-name {
  font-weight: bold;
  font-size: 11px;
  display: block;
  margin-bottom: 1px;
}

.invoice .meta-table {
  width: 100%;
  border-collapse: collapse;
}

.invoice .meta-table td {
  border-bottom: 1px solid #000000;
  border-right: 1px solid #000000;
  padding: 2.5px 5px;
  font-size: 10px;
  width: 50%;
}

.invoice .meta-table td:last-child {
  border-right: none;
}

.invoice .meta-table tr:last-child td {
  border-bottom: none;
  height: 55px;
}

.invoice .meta-label {
  font-size: 8.5px;
  color: #000000;
  display: block;
}

.invoice .meta-value {
  font-weight: bold;
}

.invoice .items-table {
  border-bottom: 1px solid #000000;
}

.invoice .items-table th {
  border-bottom: 1px solid #000000;
  border-right: 1px solid #000000;
  font-size: 10px;
  font-weight: normal;
  text-align: center;
  padding: 3px 2px;
  vertical-align: middle;
}

.invoice .items-table th:last-child {
  border-right: none;
}

.invoice .items-table td {
  border-right: 1px solid #000000;
  padding: 1.5px 5px;
  font-size: 9.5px;
  line-height: 1.2;
}

.invoice .items-table td:last-child {
  border-right: none;
}

.invoice .col-sl { width: 4%; text-align: center; }
.invoice .col-desc { width: 51%; text-align: left; }
.invoice .col-hsn { width: 11%; text-align: center; }
.invoice .col-qty { width: 11%; text-align: right; font-weight: bold; }
.invoice .col-rate { width: 11%; text-align: right; }
.invoice .col-amount { width: 12%; text-align: right; font-weight: bold; }

.invoice .subtotal-line td {
  padding-top: 3px;
}

.invoice .subtotal-line td:nth-child(n+3) {
  border-top: 1px solid #000000;
}

.invoice .tax-ledger-row td {
  padding-top: 1px;
  padding-bottom: 1px;
}

.invoice .total-row {
  border-top: 1px solid #000000;
  font-weight: bold;
}

.invoice .total-row td {
  height: 20px;
  vertical-align: middle;
}

.invoice .amount-words-container {
  border-bottom: 1px solid #000000;
  padding: 4px 6px;
  font-size: 10px;
}

.invoice .words-title {
  font-size: 8.5px;
  display: block;
}

.invoice .words-value {
  font-weight: bold;
}

.invoice .e-oe {
  float: right;
  font-style: italic;
  font-size: 9px;
}

.invoice .tax-table {
  border-bottom: 1px solid #000000;
  font-size: 9px;
}

.invoice .tax-table th {
  border-bottom: 1px solid #000000;
  border-right: 1px solid #000000;
  font-weight: normal;
  text-align: center;
  padding: 2px;
}

.invoice .tax-table th:last-child {
  border-right: none;
}

.invoice .tax-table td {
  border-right: 1px solid #000000;
  padding: 2px 6px;
}

.invoice .tax-table td:last-child {
  border-right: none;
}

.invoice .tax-table-total {
  border-top: 1px solid #000000;
  font-weight: bold;
}

.invoice .tax-words-container {
  border-bottom: 1px solid #000000;
  padding: 4px 6px;
  font-size: 9px;
}

.invoice .footer-grid {
  width: 100%;
}

.invoice .footer-left {
  width: 50%;
  border-right: 1px solid #000000;
  padding: 5px;
  font-size: 9px;
}

.invoice .footer-right {
  width: 50%;
}

.invoice .bank-details {
  border-bottom: 1px solid #000000;
  padding: 4px 6px;
  font-size: 9px;
}

.invoice .bank-table td {
  padding: 0.5px 0;
}

.invoice .sign-off-box {
  padding: 5px 6px;
  height: 50px;
  position: relative;
}

.invoice .sign-off-title {
  text-align: right;
  font-size: 10px;
  font-weight: bold;
  display: block;
}

.invoice .sign-off-bottom {
  position: absolute;
  bottom: 4px;
  right: 6px;
  font-size: 9px;
}

.invoice .computer-generated {
  text-align: center;
  font-size: 8px;
  margin-top: 2px;
  color: #333333;
}
</style>
<div class="invoice" :style="{ fontFamily: print.font || 'Arial, sans-serif' }">

  <div class="invoice-title">Tax Invoice</div>

  <div class="outer-border">

    <table class="top-grid">
      <tr>
        <td class="left-party-pane">
          <div class="seller-details">
            <span class="party-name">GLOBAL TECHNOLOGIES</span>
            <div style="white-space:pre-line;">4-9-214/4-9-174, 1; MURHARI
NAGAR 509 ; 5TH CROSS ROAD ,
GANGAVATHI, Gangawati, Koppal,
Karnataka, 583227</div>
            GSTIN/UIN &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 29CIYPB6495E1ZK<br>
            State Name &nbsp;&nbsp;&nbsp;&nbsp;: Karnataka, Code : 29
          </div>

          <div class="consignee-details">
            <div class="party-title">Consignee (Ship to)</div>
            <span class="party-name">{{ doc.shippingParty || doc.party }}</span>
            <div v-if="doc.shippingAddress || (doc.links && doc.links.party && doc.links.party.links && doc.links.party.links.address)" style="white-space:pre-line;">{{ doc.shippingAddress || (doc.links && doc.links.party && doc.links.party.links && doc.links.party.links.address && doc.links.party.links.address.addressDisplay) }}</div>
            PHONE : {{ doc.shippingPhone || doc.phone || '' }}<br>
            GST NO. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {{ doc.consigneeGSTIN || doc.partyGSTIN || '' }}
          </div>

          <div class="buyer-details">
            <div class="party-title">Buyer (Bill to)</div>
            <span class="party-name">{{ doc.party }}</span>
            <div v-if="doc.partyAddress || (doc.links && doc.links.party && doc.links.party.links && doc.links.party.links.address)" style="white-space:pre-line;">{{ doc.partyAddress || (doc.links && doc.links.party && doc.links.party.links && doc.links.party.links.address && doc.links.party.links.address.addressDisplay) }}</div>
            PHONE : {{ doc.phone || '' }}<br>
            GST NO. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {{ doc.partyGSTIN || '' }}<br>
            Place of Supply &nbsp;: {{ doc.placeOfSupply || doc.partyState || '' }}, Code : {{ doc.placeOfSupplyCode || doc.partyStateCode || '' }}
          </div>
        </td>

        <td class="right-meta-pane">
          <table class="meta-table">
            <tr>
              <td>
                <span class="meta-label">Invoice No.</span>
                <span class="meta-value">{{ doc.name }}</span>
              </td>
              <td>
                <span class="meta-label">Dated</span>
                <span class="meta-value">{{ doc.date }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="meta-label">Delivery Note</span>
                {{ doc.deliveryNote || '' }}
              </td>
              <td>
                <span class="meta-label">Mode/Terms of Payment</span>
                {{ doc.paymentTerms || doc.terms || '' }}
              </td>
            </tr>
            <tr>
              <td>
                <span class="meta-label">Reference No. & Date.</span>
                {{ doc.referenceNo || '' }}
              </td>
              <td>
                <span class="meta-label">Other References</span>
                {{ doc.otherReferences || '' }}
              </td>
            </tr>
            <tr>
              <td>
                <span class="meta-label">Buyer's Order No.</span>
                {{ doc.poNo || '' }}
              </td>
              <td>
                <span class="meta-label">Dated</span>
                {{ doc.poDate || '' }}
              </td>
            </tr>
            <tr>
              <td>
                <span class="meta-label">Dispatch Doc No.</span>
                {{ doc.dispatchDocNo || '' }}
              </td>
              <td>
                <span class="meta-label">Delivery Note Date</span>
                {{ doc.deliveryNoteDate || '' }}
              </td>
            </tr>
            <tr>
              <td>
                <span class="meta-label">Dispatched through</span>
                {{ doc.dispatchedThrough || '' }}
              </td>
              <td>
                <span class="meta-label">Destination</span>
                {{ doc.destination || '' }}
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <span class="meta-label">Terms of Delivery</span>
                {{ doc.termsOfDelivery || '' }}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <table class="items-table">
      <thead>
        <tr>
          <th class="col-sl">Sl<br>No.</th>
          <th class="col-desc">Description of Goods</th>
          <th class="col-hsn">HSN/SAC</th>
          <th class="col-qty">Quantity</th>
          <th class="col-rate">Rate</th>
          <th class="col-amount">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in doc.items" :key="row.name || idx">
          <td class="col-sl">{{ idx + 1 }}</td>
          <td class="col-desc"><strong>{{ row.item }}</strong><div v-if="doc.description && row.description">{{ row.description }}</div></td>
          <td class="col-hsn">{{ row.hsnCode || '' }}</td>
          <td class="col-qty">{{ row.qty }} {{ row.transferUnit || row.unit || 'Nos' }}</td>
          <td class="col-rate">{{ row.rate }}</td>
          <td class="col-amount">{{ row.amount }}</td>
        </tr>

        <tr class="subtotal-line">
          <td class="col-sl"></td>
          <td class="col-desc"></td>
          <td class="col-hsn"></td>
          <td class="col-qty"></td>
          <td class="col-rate"></td>
          <td class="col-amount">{{ doc.subTotal || doc.netTotal }}</td>
        </tr>
        <tr class="tax-ledger-row" v-for="tax in doc.taxes" :key="tax.name">
          <td class="col-sl"></td>
          <td class="col-desc" style="padding-left: 30px;">{{ tax.account }} Output-{{ tax.rate }}%</td>
          <td class="col-hsn"></td>
          <td class="col-qty"></td>
          <td class="col-rate"></td>
          <td class="col-amount">{{ tax.amount }}</td>
        </tr>

        <tr class="total-row">
          <td colspan="2" style="text-align: right; padding-right: 30px;">Total</td>
          <td class="col-hsn" style="border-top: 1px solid #000000;"></td>
          <td class="col-qty" style="border-top: 1px solid #000000; text-align: right;">{{ doc.totalQty || '' }} Nos</td>
          <td class="col-rate" style="border-top: 1px solid #000000;"></td>
          <td class="col-amount" style="border-top: 1px solid #000000; text-align: right;">₹ {{ doc.grandTotal }}</td>
        </tr>
      </tbody>
    </table>

    <div class="amount-words-container">
      <span class="e-oe">E. & O.E</span>
      <span class="words-title">Amount Chargeable (in words)</span>
      <span class="words-value">INR {{ doc.grandTotalInWords }}</span>
    </div>

    <table class="tax-table" v-if="doc.hasIGST">
      <thead>
        <tr>
          <th rowspan="2" style="width: 33%;">HSN/SAC</th>
          <th rowspan="2" style="width: 25%;">Taxable<br>Value</th>
          <th colspan="2" style="width: 25%;">Integrated Tax</th>
          <th rowspan="2" style="width: 17%;">Total<br>Tax Amount</th>
        </tr>
        <tr>
          <th style="width: 10%;">Rate</th>
          <th style="width: 15%;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td style="text-align: right;">{{ doc.subTotal || doc.netTotal }}</td>
          <td style="text-align: center;">{{ doc.igstTax ? doc.igstTax.rate + '%' : '' }}</td>
          <td style="text-align: right;">{{ doc.igstTax ? doc.igstTax.amount : '' }}</td>
          <td style="text-align: right;">{{ doc.totalTax || '' }}</td>
        </tr>
        <tr class="tax-table-total">
          <td style="text-align: right; padding-right: 10px;">Total:</td>
          <td style="text-align: right;">{{ doc.subTotal || doc.netTotal }}</td>
          <td></td>
          <td style="text-align: right;">{{ doc.totalTax || '' }}</td>
          <td style="text-align: right;">{{ doc.totalTax || '' }}</td>
        </tr>
      </tbody>
    </table>

    <table class="tax-table" v-else>
      <thead>
        <tr>
          <th rowspan="2" style="width: 25%;">HSN/SAC</th>
          <th rowspan="2" style="width: 20%;">Taxable<br>Value</th>
          <th colspan="2" style="width: 20%;">Central Tax</th>
          <th colspan="2" style="width: 20%;">State Tax</th>
          <th rowspan="2" style="width: 15%;">Total<br>Tax Amount</th>
        </tr>
        <tr>
          <th>Rate</th>
          <th>Amount</th>
          <th>Rate</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td style="text-align: right;">{{ doc.subTotal || doc.netTotal }}</td>
          <td style="text-align: center;">{{ doc.cgstTax ? doc.cgstTax.rate + '%' : '' }}</td>
          <td style="text-align: right;">{{ doc.cgstTax ? doc.cgstTax.amount : '' }}</td>
          <td style="text-align: center;">{{ doc.sgstTax ? doc.sgstTax.rate + '%' : '' }}</td>
          <td style="text-align: right;">{{ doc.sgstTax ? doc.sgstTax.amount : '' }}</td>
          <td style="text-align: right;">{{ doc.totalTax || '' }}</td>
        </tr>
        <tr class="tax-table-total">
          <td style="text-align: right; padding-right: 10px;">Total:</td>
          <td style="text-align: right;">{{ doc.subTotal || doc.netTotal }}</td>
          <td></td>
          <td style="text-align: right;">{{ doc.cgstTax ? doc.cgstTax.amount : '' }}</td>
          <td></td>
          <td style="text-align: right;">{{ doc.sgstTax ? doc.sgstTax.amount : '' }}</td>
          <td style="text-align: right;">{{ doc.totalTax || '' }}</td>
        </tr>
      </tbody>
    </table>

    <div class="tax-words-container">
      Tax Amount (in words) : &nbsp;&nbsp;<strong>INR {{ doc.taxAmountInWords || '' }}</strong>
    </div>

    <table class="footer-grid">
      <tr>
        <td class="footer-left">
          <span style="text-decoration: underline;">Declaration</span>
          <p style="margin: 3px 0 0 0; line-height: 1.35;">
            We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
          </p>
        </td>
        <td class="footer-right">
          <div class="bank-details">
            <strong style="font-size: 8.5px;">Company's Bank Details</strong>
            <table class="bank-table" style="width: 100%; font-size: 8.5px; margin-top: 2px;">
              <tr>
                <td style="width: 32%;">Bank Name</td>
                <td>: &nbsp;<strong>Federal Bank</strong></td>
              </tr>
              <tr>
                <td>A/c No.</td>
                <td>: &nbsp;<strong>16850200003457</strong></td>
              </tr>
              <tr>
                <td>Branch & IFS Code</td>
                <td>: &nbsp;<strong>Gangavathi & FDRL0001685</strong></td>
              </tr>
            </table>
          </div>
          <div class="sign-off-box">
            <span class="sign-off-title">for GLOBAL TECHNOLOGIES</span>
            <span class="sign-off-bottom">Authorised Signatory</span>
          </div>
        </td>
      </tr>
    </table>

  </div>

  <div class="computer-generated">This is a Computer Generated Invoice</div>

</div>
`;

const values = {
  print: {
    companyName: 'GLOBAL TECHNOLOGIES',
    address: '4-9-214/4-9-174, 1; MURHARI\nNAGAR 509 ; 5TH CROSS ROAD ,\nGANGAVATHI, Gangawati, Koppal,\nKarnataka, 583227',
    gstin: '29CIYPB6495E1ZK',
    stateName: 'Karnataka',
    stateCode: '29',
    bankName: 'Federal Bank',
    accountNo: '16850200003457',
    ifscCode: 'Gangavathi & FDRL0001685',
    font: 'Arial',
  },
  doc: {
    name: '16',
    date: '05-08-2026',
    party: 'RUDRA TECH SYSTEMS',
    partyAddress: 'Flat No. 902, Ridge Towers, Block E, HMT Road\nAsiatic Oxygen, Quthbullapur State : 36\nHyderabad Telangana 500037 India',
    partyGSTIN: '36HVLPS3793D1ZX',
    partyState: 'TELANGANA',
    partyStateCode: '36',
    placeOfSupply: 'TELANGANA',
    placeOfSupplyCode: '36',
    items: [
      { name: '1', item: 'Junction Box', hsnCode: 8504, qty: '5.00', unit: 'Nos', rate: '350.00', amount: '1,750.00' },
      { name: '2', item: '2 Core Power Cable', hsnCode: 8544, qty: '100.00', unit: 'Nos', rate: '50.00', amount: '5,000.00' },
      { name: '3', item: 'Cat 6 Cabel', hsnCode: 8544, qty: '120.00', unit: 'Nos', rate: '32.00', amount: '3,840.00' },
      { name: '4', item: 'Patch Panel', hsnCode: 8544, qty: '1.00', unit: 'Nos', rate: '1,800.00', amount: '1,800.00' },
      { name: '5', item: '8 Port Unmanaged Network Switch', hsnCode: 85176290, qty: '1.00', unit: 'Nos', rate: '1,700.00', amount: '1,700.00' },
      { name: '6', item: 'Cat 6 Patch Cable 1M', hsnCode: 8544, qty: '8.00', unit: 'Nos', rate: '150.00', amount: '1,200.00' },
      { name: '7', item: 'Keystone', hsnCode: 8544, qty: '8.00', unit: 'Nos', rate: '220.00', amount: '1,760.00' },
      { name: '8', item: '12V Battery', hsnCode: 85311020, qty: '2.00', unit: 'Nos', rate: '1,480.00', amount: '2,960.00' },
      { name: '9', item: 'Wired Magnetic Contact', hsnCode: 90318000, qty: '1.00', unit: 'Nos', rate: '150.00', amount: '150.00' },
      { name: '10', item: 'Grill Gate Magnetic Contact', hsnCode: 90318000, qty: '1.00', unit: 'Nos', rate: '150.00', amount: '150.00' },
      { name: '11', item: 'Shutter Sensor', hsnCode: 8536, qty: '1.00', unit: 'Nos', rate: '650.00', amount: '650.00' },
      { name: '12', item: 'Foot Panic', hsnCode: 83024110, qty: '1.00', unit: 'Nos', rate: '850.00', amount: '850.00' },
      { name: '13', item: 'Wired Panic Switch', hsnCode: 85365090, qty: '5.00', unit: 'Nos', rate: '330.00', amount: '1,650.00' },
      { name: '14', item: 'Smoke Detector', hsnCode: 85311020, qty: '1.00', unit: 'Nos', rate: '2,000.00', amount: '2,000.00' },
      { name: '15', item: '8 Core Cable', hsnCode: 8544, qty: '40.00', unit: 'Nos', rate: '104.00', amount: '4,160.00' },
      { name: '16', item: '4 Core Cable', hsnCode: 8544, qty: '160.00', unit: 'Nos', rate: '54.00', amount: '8,640.00' },
      { name: '17', item: 'PVC Conduit', hsnCode: 3917, qty: '180.00', unit: 'Nos', rate: '42.00', amount: '7,560.00' },
      { name: '18', item: 'Door Buzzer', hsnCode: 85311090, qty: '1.00', unit: 'Nos', rate: '2,650.00', amount: '2,650.00' },
      { name: '19', item: 'Installation and Commissioning', hsnCode: 9987, qty: '1.00', unit: 'Nos', rate: '11,000.00', amount: '11,000.00' },
      { name: '20', item: 'SD Card 128GB Class 10', hsnCode: 85235290, qty: '5.00', unit: 'Nos', rate: '1,900.00', amount: '9,500.00' },
      { name: '21', item: '6U Rack Loaded', hsnCode: 83024200, qty: '1.00', unit: 'Nos', rate: '4,800.00', amount: '4,800.00' },
    ],
    totalQty: '643.00',
    grandTotal: '87,048.60',
    grandTotalInWords: 'Eighty Seven Thousand Forty Eight and Sixty Paise Only',
    subTotal: '73,770.00',
    totalTax: '13,278.60',
    taxAmountInWords: 'Thirteen Thousand Two Hundred Seventy Eight and Sixty Paise Only',
    taxes: [
      { name: 'IGST', account: 'IGST', rate: 18, amount: '13,278.60' },
    ],
    igstTax: { rate: 18, amount: '13,278.60' },
    hasIGST: true,
  },
};

const app = createApp({
  components: {
    Invoice: { template: invoiceTemplate, props: ['doc', 'print'] },
  },
  template: `<Invoice :doc="values.doc" :print="values.print" />`,
  data() {
    return { values };
  },
});
app.mount('#app');
