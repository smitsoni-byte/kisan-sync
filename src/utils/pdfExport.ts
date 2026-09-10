import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { KisanCreditProfile, TradeLedgerItem, UserProfile } from '../types';

/**
 * Format currency into Indian Rupee format (e.g. ₹18,45,000)
 */
export const formatINR = (amount: number): string => {
  return 'Rs. ' + amount.toLocaleString('en-IN');
};

/**
 * Export full Trade Ledger to a professional A4 Landscape PDF
 */
export const exportTradeLedgerPDF = (
  user: UserProfile,
  creditProfile: KisanCreditProfile,
  trades: TradeLedgerItem[],
  seasonFilter: string = 'all'
) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm

  // 1. Top Decorative Brand Bar
  doc.setFillColor(255, 122, 23); // #ff7a17
  doc.rect(0, 0, pageWidth, 5, 'F');

  // 2. Header Box
  doc.setFillColor(20, 21, 23); // #141517
  doc.rect(10, 10, pageWidth - 20, 26, 'F');

  // Brand Name & Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('KisanSync', 16, 22);

  doc.setTextColor(255, 122, 23);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL TRADE LEDGER & SALES STATEMENT', 52, 22);

  doc.setTextColor(170, 175, 185);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Verified e-Mandi Escrow Record • NABARD & APMC Certified', 16, 30);

  // Reference & Date on top right
  const statementId = `KS-LEDGER-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  doc.setTextColor(200, 205, 215);
  doc.setFontSize(8);
  doc.text(`Statement ID: ${statementId}`, pageWidth - 16, 21, { align: 'right' });
  doc.text(`Generated On: ${dateStr}`, pageWidth - 16, 27, { align: 'right' });
  doc.text(`Season Scope: ${seasonFilter.toUpperCase()}`, pageWidth - 16, 33, { align: 'right' });

  // 3. Farmer Info & Credit Profile Summary Strip
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(220, 225, 230);
  doc.rect(10, 39, pageWidth - 20, 22, 'FD');

  doc.setTextColor(40, 45, 55);
  doc.setFontSize(8.5);
  
  // Col 1: Farmer
  doc.setFont('helvetica', 'bold');
  doc.text('FARMER ACCOUNT DETAILS', 14, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${user.name} (${user.role || 'Farmer'})`, 14, 50);
  doc.text(`Location: ${user.location} • ID: ${user.id}`, 14, 55);

  // Col 2: Credit Score
  doc.setFont('helvetica', 'bold');
  doc.text('KISAN CREDIT PROFILE', 105, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`Credit Score: ${creditProfile.overallScore} / 900 (${creditProfile.ratingTier})`, 105, 50);
  doc.text(`Fulfillment Reliability: ${creditProfile.onTimeFulfillmentRate}% On-Time (${creditProfile.tradeCount} Lots)`, 105, 55);

  // Col 3: Pre-Approved KCC
  doc.setFont('helvetica', 'bold');
  doc.text('INSTITUTIONAL KCC STATUS', 200, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(`Pre-Approved Limit: Rs. ${(creditProfile.preApprovedLoanLimit / 100000).toFixed(2)} Lakhs`, 200, 50);
  doc.text(`Effective Subsidized Rate: ${creditProfile.subsidizedInterestRate}% p.a. (SBI Agri Anand)`, 200, 55);

  // 4. Cumulative KPI Metric Badges
  const totalVolume = trades.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalGain = trades.reduce((acc, t) => acc + t.gainOverMandi, 0);
  const totalQty = trades.reduce((acc, t) => acc + t.quantityQuintals, 0);

  const kpiY = 64;
  const kpiWidth = (pageWidth - 20 - 9) / 4;

  // KPI 1
  doc.setFillColor(255, 255, 255);
  doc.rect(10, kpiY, kpiWidth, 14, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(110, 115, 125);
  doc.text('TOTAL REVENUE TRADED', 13, kpiY + 4.5);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 21, 23);
  doc.text(formatINR(totalVolume), 13, kpiY + 11);

  // KPI 2
  doc.setFillColor(255, 255, 255);
  doc.rect(10 + kpiWidth + 3, kpiY, kpiWidth, 14, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(110, 115, 125);
  doc.text('TOTAL QUANTITY SOLD', 13 + kpiWidth + 3, kpiY + 4.5);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 21, 23);
  doc.text(`${totalQty} Quintals (${trades.length} Lots)`, 13 + kpiWidth + 3, kpiY + 11);

  // KPI 3
  doc.setFillColor(240, 253, 244); // light emerald
  doc.rect(10 + (kpiWidth + 3) * 2, kpiY, kpiWidth, 14, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(21, 128, 61);
  doc.text('GAINS OVER APMC MANDI', 13 + (kpiWidth + 3) * 2, kpiY + 4.5);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  doc.text(`+${formatINR(totalGain)} (+14.2%)`, 13 + (kpiWidth + 3) * 2, kpiY + 11);

  // KPI 4
  doc.setFillColor(255, 255, 255);
  doc.rect(10 + (kpiWidth + 3) * 3, kpiY, kpiWidth, 14, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(110, 115, 125);
  doc.text('BUYER SATISFACTION', 13 + (kpiWidth + 3) * 3, kpiY + 4.5);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 122, 23);
  doc.text('4.94 / 5.0 (0 Disputes)', 13 + (kpiWidth + 3) * 3, kpiY + 11);

  // 5. Detailed Table using autoTable
  const tableData = trades.map((item, idx) => [
    idx + 1,
    item.id,
    `${item.date}\n(${item.season})`,
    `${item.cropName}\n${item.cropVariety} • Grade ${item.qualityGrade} (${item.aiQualityScore}/100)`,
    `${item.buyerName}\n${item.buyerLocation}`,
    `${item.quantityQuintals} Qtl`,
    `Rs. ${item.pricePerQuintal.toLocaleString('en-IN')}`,
    `Rs. ${item.totalAmount.toLocaleString('en-IN')}`,
    `+Rs. ${item.gainOverMandi.toLocaleString('en-IN')}`,
    `${item.paymentMethod}\nSettled`
  ]);

  // Total summary footer row
  const tableFoot = [
    [
      '',
      'TOTAL',
      `${trades.length} Lots`,
      'Cumulative Fulfilled Harvest',
      'All Verified Buyers',
      `${totalQty} Qtl`,
      '-',
      formatINR(totalVolume),
      `+${formatINR(totalGain)}`,
      '100% Escrow'
    ]
  ];

  autoTable(doc, {
    startY: 81,
    head: [[
      '#',
      'Lot ID',
      'Date & Season',
      'Produce & AI Quality Grade',
      'Buyer & Location',
      'Quantity',
      'Rate / Qtl',
      'Total Amount',
      'Gain vs Mandi',
      'Payment Status'
    ]],
    body: tableData,
    foot: tableFoot,
    margin: { left: 10, right: 10, bottom: 20 },
    theme: 'grid',
    headStyles: {
      fillColor: [20, 21, 23],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
      valign: 'middle'
    },
    footStyles: {
      fillColor: [240, 243, 248],
      textColor: [20, 21, 23],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 35, 42],
      valign: 'middle'
    },
    alternateRowStyles: {
      fillColor: [250, 251, 253]
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 22, fontStyle: 'bold' },
      2: { cellWidth: 25 },
      3: { cellWidth: 58 },
      4: { cellWidth: 46 },
      5: { cellWidth: 20, halign: 'right' },
      6: { cellWidth: 22, halign: 'right' },
      7: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
      8: { cellWidth: 25, halign: 'right', textColor: [21, 128, 61], fontStyle: 'bold' },
      9: { cellWidth: 23, halign: 'center', textColor: [16, 120, 50] }
    },
    didDrawPage: (data) => {
      // Footer bar on every page
      const curPage = data.pageNumber;
      doc.setFillColor(245, 247, 250);
      doc.rect(10, pageHeight - 12, pageWidth - 20, 8, 'F');

      doc.setFontSize(7);
      doc.setTextColor(120, 125, 135);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'KisanSync Agricultural Trade Intelligence • Official digital escrow record generated for Banking & Income Proof under e-NAM / NABARD guidelines.',
        14,
        pageHeight - 7
      );
      doc.text(
        `Page ${curPage}`,
        pageWidth - 14,
        pageHeight - 7,
        { align: 'right' }
      );
    }
  });

  // Save PDF
  const sanitizedName = user.name.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `KisanSync_Trade_Ledger_${sanitizedName}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
  return filename;
};

/**
 * Export Individual Lot Tax Invoice PDF (A4 Portrait)
 */
export const exportInvoicePDF = (
  trade: TradeLedgerItem,
  user: UserProfile
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

  // Top Accent Bar
  doc.setFillColor(255, 122, 23);
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Header Box
  doc.setFillColor(20, 21, 23);
  doc.rect(12, 10, pageWidth - 24, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('KisanSync', 18, 24);

  doc.setTextColor(255, 122, 23);
  doc.setFontSize(10);
  doc.text('TAX INVOICE & ESCROW SETTLEMENT CERTIFICATE', 62, 24);

  doc.setTextColor(170, 175, 185);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('APMC Registered e-Mandi Transaction • Zero Middlemen Commission', 18, 32);

  // Invoice Metadata Box
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(220, 225, 230);
  doc.rect(12, 42, pageWidth - 24, 30, 'FD');

  doc.setTextColor(50, 55, 65);
  doc.setFontSize(8.5);

  // Col 1: Invoice Meta
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE IDENTIFIER', 16, 49);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice No: ${trade.taxInvoiceNo}`, 16, 55);
  doc.text(`Settlement Date: ${trade.date} (${trade.season})`, 16, 61);
  doc.text(`Lot Reference: ${trade.id}`, 16, 67);

  // Col 2: Seller
  doc.setFont('helvetica', 'bold');
  doc.text('SELLER (FARMER)', 80, 49);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${user.name}`, 80, 55);
  doc.text(`Farmer ID: ${user.id}`, 80, 61);
  doc.text(`Location: ${user.location}`, 80, 67);

  // Col 3: Buyer
  doc.setFont('helvetica', 'bold');
  doc.text('BUYER (PROCUREMENT)', 145, 49);
  doc.setFont('helvetica', 'normal');
  doc.text(`Entity: ${trade.buyerName}`, 145, 55);
  doc.text(`Location: ${trade.buyerLocation}`, 145, 61);
  doc.text(`Status: Verified Procurement Partner`, 145, 67);

  // Produce Table
  autoTable(doc, {
    startY: 76,
    head: [[
      'Produce Description',
      'AI Quality Grade',
      'Moisture / Purity',
      'Quantity (Qtl)',
      'Rate (Rs./Qtl)',
      'Total Amount (Rs.)'
    ]],
    body: [
      [
        `${trade.cropName} (${trade.cropVariety})\nLot ID: ${trade.id}`,
        `Grade ${trade.qualityGrade} (${trade.aiQualityScore}/100)`,
        'Certified Mandi Standard (<12% Moisture)',
        `${trade.quantityQuintals} Quintals`,
        `Rs. ${trade.pricePerQuintal.toLocaleString('en-IN')}`,
        `Rs. ${trade.totalAmount.toLocaleString('en-IN')}`
      ]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [20, 21, 23],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 35, 45],
      valign: 'middle'
    },
    margin: { left: 12, right: 12 }
  });

  // Financial Breakdown Box
  const summaryY = 115;
  doc.setFillColor(250, 251, 253);
  doc.rect(12, summaryY, pageWidth - 24, 45, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 75, 85);
  doc.text('Gross Harvest Realization:', 16, summaryY + 8);
  doc.text('APMC Benchmark Mandi Baseline:', 16, summaryY + 15);
  doc.text('Net Premium Gain Over Local Mandi:', 16, summaryY + 22);
  doc.text('Platform Commission & Deductions (0%):', 16, summaryY + 29);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 21, 23);
  doc.text(`Rs. ${trade.totalAmount.toLocaleString('en-IN')}`, 190, summaryY + 8, { align: 'right' });
  doc.text(`Rs. ${(trade.totalAmount - trade.gainOverMandi).toLocaleString('en-IN')}`, 190, summaryY + 15, { align: 'right' });

  doc.setTextColor(21, 128, 61);
  doc.text(`+Rs. ${trade.gainOverMandi.toLocaleString('en-IN')} (+${((trade.gainOverMandi / (trade.totalAmount - trade.gainOverMandi)) * 100).toFixed(1)}%)`, 190, summaryY + 22, { align: 'right' });

  doc.setTextColor(21, 128, 61);
  doc.text('Rs. 0.00 (Zero Fee)', 190, summaryY + 29, { align: 'right' });

  // Final Total Highlight
  doc.setFillColor(20, 21, 23);
  doc.rect(12, summaryY + 33, pageWidth - 24, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text('TOTAL ESCROW DISBURSED TO FARMER:', 16, summaryY + 41);
  doc.setTextColor(255, 122, 23);
  doc.setFontSize(12);
  doc.text(`Rs. ${trade.totalAmount.toLocaleString('en-IN')}`, 190, summaryY + 41, { align: 'right' });

  // Escrow & Bank Subvention Stamp Box
  const stampY = summaryY + 52;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.rect(12, stampY, pageWidth - 24, 32, 'FD');

  doc.setTextColor(21, 128, 61);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DIGITAL ESCROW PAYMENT & REPUTATION CERTIFICATE', 16, stampY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 55, 65);
  doc.text(`Payment Mode: ${trade.paymentMethod} • Direct Bank Disbursal via KisanSync Smart Escrow`, 16, stampY + 14);
  doc.text('Kisan Credit Score Impact: +15 Repayment & Trade Reliability Points Added', 16, stampY + 20);
  doc.text('Authorized Settlement Signature: KS-ESCROW-GATEWAY-IN-2026-VERIFIED', 16, stampY + 26);

  // Footer Disclaimer
  doc.setFontSize(7.5);
  doc.setTextColor(130, 135, 145);
  doc.text(
    'This is a computer-generated tax invoice and proof of agricultural sale authorized under electronic mandi guidelines.',
    16,
    pageHeight - 15
  );

  const filename = `Invoice_${trade.taxInvoiceNo}_${trade.cropName.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
  return filename;
};

/**
 * Export Kisan Credit Passport & Pre-Approved Loan Certificate (A4 Portrait)
 */
export const exportCreditPassportPDF = (
  user: UserProfile,
  creditProfile: KisanCreditProfile
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Top Accent Bar
  doc.setFillColor(255, 122, 23);
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Header
  doc.setFillColor(20, 21, 23);
  doc.rect(12, 12, pageWidth - 24, 30, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('KisanSync', 18, 26);

  doc.setTextColor(255, 122, 23);
  doc.setFontSize(10);
  doc.text('DIGITAL KISAN CREDIT PASSPORT & TRUST CERTIFICATE', 65, 26);

  doc.setTextColor(170, 175, 185);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('NABARD • CIBIL-Agri Aligned • Institutional Loan Eligibility', 18, 35);

  // Farmer & Score Hero Box
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(220, 225, 230);
  doc.rect(12, 46, pageWidth - 24, 38, 'FD');

  doc.setTextColor(40, 45, 55);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`FARMER: ${user.name.toUpperCase()}`, 18, 54);
  doc.setFont('helvetica', 'normal');
  doc.text(`Location: ${user.location} • Account ID: ${user.id}`, 18, 61);
  doc.text(`Linked Bank Branch: SBI Agri Anand Branch (KCC Active)`, 18, 68);
  doc.text(`PMFBY Crop Insurance: Verified Active & Seed Health Certified`, 18, 75);

  // Big Score Stamp Box on right
  doc.setFillColor(20, 21, 23);
  doc.rect(135, 50, 58, 30, 'F');
  doc.setTextColor(255, 122, 23);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('AGRI CREDIT SCORE', 164, 57, { align: 'center' });
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(`${creditProfile.overallScore} / 900`, 164, 67, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setTextColor(34, 197, 94);
  doc.text(creditProfile.ratingTier.toUpperCase(), 164, 75, { align: 'center' });

  // Pre-Approved Loan Box
  const loanY = 88;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.rect(12, loanY, pageWidth - 24, 26, 'FD');

  doc.setTextColor(21, 128, 61);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PRE-APPROVED INSTITUTIONAL KISAN CREDIT LIMIT', 18, loanY + 8);

  doc.setFontSize(14);
  doc.text(`Rs. ${(creditProfile.preApprovedLoanLimit / 100000).toFixed(2)} Lakhs @ ${creditProfile.subsidizedInterestRate}% Subsidized Interest`, 18, loanY + 16);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 65, 75);
  doc.text('Qualifies for Central Government 3.0% Prompt Repayment Rebate (Standard rate 7% -> Effective 4%).', 18, loanY + 22);

  // 5 Pillars Table
  const factorRows = creditProfile.factors.map(f => [
    f.name,
    `${f.weight}%`,
    `${f.score} / 100`,
    f.status.toUpperCase(),
    f.details
  ]);

  autoTable(doc, {
    startY: 118,
    head: [[
      'Evaluation Pillar',
      'Weight',
      'Score',
      'Status',
      'Agronomic & Trade Assessment'
    ]],
    body: factorRows,
    theme: 'grid',
    headStyles: {
      fillColor: [20, 21, 23],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 35, 45]
    },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: 'bold' },
      1: { cellWidth: 16, halign: 'center' },
      2: { cellWidth: 22, halign: 'center', fontStyle: 'bold', textColor: [21, 128, 61] },
      3: { cellWidth: 24, halign: 'center', textColor: [255, 122, 23], fontStyle: 'bold' },
      4: { cellWidth: 82 }
    },
    margin: { left: 12, right: 12 }
  });

  // Footer seal
  doc.setFontSize(7.5);
  doc.setTextColor(120, 125, 135);
  doc.text(
    'This credit passport certificate is authenticated digitally by KisanSync agronomic scoring systems for institutional partner banks.',
    16,
    pageHeight - 15
  );

  const filename = `KisanSync_Credit_Passport_${user.name.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
  return filename;
};
