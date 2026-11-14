import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Generate and download a Monthly Expense Report PDF
 *
 * @param {Object} options
 * @param {Array} options.expenses - All expenses in app
 * @param {number} options.year - Selected year (e.g. 2026)
 * @param {number} options.month - Selected month (1-12)
 * @param {number} options.monthlyBudget - Monthly budget limit
 * @param {string} options.userName - User full or display name
 * @param {string} options.userEmail - User email address
 * @param {string} options.currency - Currency code (e.g. 'INR')
 */
export const generateMonthlyExpensePDF = ({
  expenses = [],
  year = new Date().getFullYear(),
  month = new Date().getMonth() + 1,
  monthlyBudget = 0,
  userName = 'CampusFlow User',
  userEmail = '',
  currency = 'INR',
}) => {
  const monthStr = String(month).padStart(2, '0');
  const monthKey = `${year}-${monthStr}`;
  const monthName = MONTH_NAMES[month - 1] || `Month ${month}`;

  // Filter expenses for selected month
  const monthExpenses = expenses.filter(e => e.date && e.date.startsWith(monthKey));

  if (monthExpenses.length === 0) {
    throw new Error(`No expense records found for ${monthName} ${year}.`);
  }

  // Calculate statistics
  const totalSpent = monthExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const transactionCount = monthExpenses.length;
  const remainingBudget = monthlyBudget > 0 ? (monthlyBudget - totalSpent) : 0;
  const budgetUtilization = monthlyBudget > 0 ? Math.round((totalSpent / monthlyBudget) * 100) : null;

  // Category breakdown
  const categoryMap = {};
  monthExpenses.forEach(e => {
    const cat = e.category || 'Other';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { count: 0, total: 0 };
    }
    categoryMap[cat].count += 1;
    categoryMap[cat].total += Number(e.amount || 0);
  });

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([cat, data]) => ({
      category: cat,
      count: data.count,
      total: data.total,
      percentage: totalSpent > 0 ? ((data.total / totalSpent) * 100).toFixed(1) : '0.0',
    }))
    .sort((a, b) => b.total - a.total);

  const highestCategory = categoryBreakdown[0] || { category: 'None', total: 0 };

  // Weekly spending summary
  const weeklyMap = { 'Week 1 (1-7)': 0, 'Week 2 (8-14)': 0, 'Week 3 (15-21)': 0, 'Week 4 (22-28)': 0, 'Week 5 (29-31)': 0 };
  monthExpenses.forEach(e => {
    const day = parseInt(e.date.split('-')[2], 10);
    const amt = Number(e.amount || 0);
    if (day <= 7) weeklyMap['Week 1 (1-7)'] += amt;
    else if (day <= 14) weeklyMap['Week 2 (8-14)'] += amt;
    else if (day <= 21) weeklyMap['Week 3 (15-21)'] += amt;
    else if (day <= 28) weeklyMap['Week 4 (22-28)'] += amt;
    else weeklyMap['Week 5 (29-31)'] += amt;
  });

  // Sort transactions by date descending
  const sortedTransactions = [...monthExpenses].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  // Initialize jsPDF document (Portrait, A4)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const currencyPrefix = currency === 'INR' ? 'Rs. ' : `${currency} `;
  const formatAmount = (amt) => `${currencyPrefix}${Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const primaryGreen = [31, 77, 58]; // #1F4D3A
  const darkText = [28, 27, 24];     // #1C1B18
  const mutedText = [95, 91, 82];    // #5F5B52
  const bgLight = [247, 245, 240];   // #F7F5F0
  const borderLight = [228, 224, 214]; // #E4E0D6

  let currentY = 18;

  // ── Header & Branding ──
  doc.setFillColor(...primaryGreen);
  doc.rect(14, currentY, 182, 3, 'F');
  currentY += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...primaryGreen);
  doc.text('CAMPUSFLOW', 14, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedText);
  const genDateStr = `Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  doc.text(genDateStr, 196, currentY, { align: 'right' });
  currentY += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...darkText);
  doc.text(`Monthly Financial Statement — ${monthName} ${year}`, 14, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mutedText);
  doc.text(`Account: ${userName} ${userEmail ? `(${userEmail})` : ''}`, 14, currentY);
  currentY += 8;

  // Divider
  doc.setDrawColor(...borderLight);
  doc.line(14, currentY, 196, currentY);
  currentY += 7;

  // ── Summary Cards (Grid of 4 Metric Boxes) ──
  const cardWidth = 43;
  const cardHeight = 22;
  const cardGap = 3.3;

  const summaryCards = [
    { label: 'TOTAL SPENT', value: formatAmount(totalSpent), sub: `${transactionCount} transactions` },
    { label: 'MONTHLY BUDGET', value: monthlyBudget > 0 ? formatAmount(monthlyBudget) : 'Not Set', sub: budgetUtilization !== null ? `${budgetUtilization}% utilized` : 'No limit set' },
    { label: 'REMAINING BUDGET', value: monthlyBudget > 0 ? formatAmount(remainingBudget) : 'N/A', sub: remainingBudget < 0 ? 'Exceeded budget' : 'Within budget' },
    { label: 'TOP CATEGORY', value: highestCategory.category, sub: formatAmount(highestCategory.total) },
  ];

  summaryCards.forEach((c, idx) => {
    const x = 14 + idx * (cardWidth + cardGap);
    doc.setFillColor(...bgLight);
    doc.setDrawColor(...borderLight);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...mutedText);
    doc.text(c.label, x + 3.5, currentY + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...primaryGreen);
    doc.text(c.value, x + 3.5, currentY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...mutedText);
    doc.text(c.sub, x + 3.5, currentY + 17.5);
  });

  currentY += cardHeight + 8;

  // ── Category Breakdown & Weekly Summary (Side-by-Side AutoTables) ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...darkText);
  doc.text('Expense Breakdown by Category', 14, currentY);
  currentY += 4;

  const categoryTableData = categoryBreakdown.map(c => [
    c.category,
    String(c.count),
    formatAmount(c.total),
    `${c.percentage}%`,
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Category', 'Count', 'Total Amount', 'Share']],
    body: categoryTableData,
    margin: { left: 14, right: 14 },
    theme: 'plain',
    headStyles: {
      fillColor: primaryGreen,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 2.5,
    },
    bodyStyles: {
      textColor: darkText,
      fontSize: 7.8,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 50, halign: 'right' },
      3: { cellWidth: 37, halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [250, 249, 246],
    },
  });

  currentY = doc.lastAutoTable.finalY + 7;

  // Weekly Summary Table
  const weeklyTableData = Object.entries(weeklyMap).map(([week, amt]) => [
    week,
    formatAmount(amt),
    totalSpent > 0 ? `${((amt / totalSpent) * 100).toFixed(1)}%` : '0.0%',
  ]);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...darkText);
  doc.text('Weekly Spending Summary', 14, currentY);
  currentY += 4;

  autoTable(doc, {
    startY: currentY,
    head: [['Period', 'Amount Spent', 'Share of Total']],
    body: weeklyTableData,
    margin: { left: 14, right: 14 },
    theme: 'plain',
    headStyles: {
      fillColor: primaryGreen,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 2.5,
    },
    bodyStyles: {
      textColor: darkText,
      fontSize: 7.8,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 60, halign: 'right' },
      2: { cellWidth: 52, halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [250, 249, 246],
    },
  });

  currentY = doc.lastAutoTable.finalY + 8;

  // ── Complete Transaction List ──
  if (currentY > 230) {
    doc.addPage();
    currentY = 18;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...darkText);
  doc.text('Complete Transaction Itemization', 14, currentY);
  currentY += 4;

  const transactionRows = sortedTransactions.map((t, idx) => [
    String(idx + 1),
    t.date || 'N/A',
    t.title || 'Untitled',
    t.category || 'Other',
    t.paymentMethod || 'UPI',
    formatAmount(t.amount),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['#', 'Date', 'Description', 'Category', 'Payment Method', 'Amount']],
    body: transactionRows,
    margin: { left: 14, right: 14, bottom: 18 },
    theme: 'plain',
    headStyles: {
      fillColor: primaryGreen,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 2.5,
    },
    bodyStyles: {
      textColor: darkText,
      fontSize: 7.5,
      cellPadding: 2,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 24 },
      2: { cellWidth: 62 },
      3: { cellWidth: 38 },
      4: { cellWidth: 24 },
      5: { cellWidth: 24, halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [250, 249, 246],
    },
    didDrawPage: (data) => {
      // Header band on secondary pages
      if (data.pageNumber > 1) {
        doc.setFillColor(...primaryGreen);
        doc.rect(14, 10, 182, 1.5, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...mutedText);
        doc.text(`CampusFlow — ${monthName} ${year} Expense Report`, 14, 8);
      }
    },
  });

  // ── Page Numbers & Footer on Every Page ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedText);
    doc.line(14, 287, 196, 287);
    doc.text('CampusFlow 2.1 — Confidential Personal Financial Statement', 14, 291);
    doc.text(`Page ${i} of ${totalPages}`, 196, 291, { align: 'right' });
  }

  // Trigger download
  const filename = `CampusFlow_Report_${year}_${monthStr}.pdf`;
  doc.save(filename);

  return {
    success: true,
    filename,
    totalSpent,
    transactionCount,
    totalPages,
  };
};

