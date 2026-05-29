import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (transactions, summary) => {
  const doc = new jsPDF();

  // Header
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FinTrack Pro', 14, 15);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Transaction Report', 14, 25);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 140, 25);

  // Summary Cards
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', 14, 50);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Total Income: $${summary?.totalIncome?.toFixed(2) || '0.00'}`, 14, 60);
  doc.text(`Total Expense: $${summary?.totalExpense?.toFixed(2) || '0.00'}`, 80, 60);
  doc.text(`Balance: $${summary?.balance?.toFixed(2) || '0.00'}`, 150, 60);

  // Table
  autoTable(doc, {
    startY: 70,
    head: [['Title', 'Amount', 'Type', 'Category', 'Date']],
    body: transactions.map(t => [
      t.title,
      `$${t.amount.toFixed(2)}`,
      t.type.toUpperCase(),
      t.category,
      new Date(t.date).toLocaleDateString()
    ]),
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    styles: {
      fontSize: 9,
      cellPadding: 4
    }
  });

  doc.save(`fintrack_report_${new Date().toISOString().split('T')[0]}.pdf`);
};