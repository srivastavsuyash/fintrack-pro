import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const exportToPDF = (transactions, summary, user, currency = 'USD') => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const now = new Date()
  const exportDate = now.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  const formatAmt = (amount) => {
    const prefixes = { USD: 'USD ', EUR: 'EUR ', INR: 'INR ' }
    const prefix = prefixes[currency] || 'USD '
    return `${prefix}${Number(amount).toFixed(2)}`
  }

  // ── Header ──
  doc.setFillColor(99, 102, 241)
  doc.rect(0, 0, pageWidth, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('FinTrack Pro', 14, 16)

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Transaction History Report', 14, 26)

  doc.setFontSize(9)
  doc.text(`Exported: ${exportDate}`, pageWidth - 14, 16, { align: 'right' })
  if (user) {
    doc.text(`${user.name || ''}`, pageWidth - 14, 24, { align: 'right' })
    doc.text(`${user.email || ''}`, pageWidth - 14, 31, { align: 'right' })
  }

  // ── Summary ──
  doc.setTextColor(30, 41, 59)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Financial Summary', 14, 52)

  const boxY = 56
  const boxW = 56
  const boxH = 18
  const gap = 8

  doc.setFillColor(240, 253, 244)
  doc.roundedRect(14, boxY, boxW, boxH, 3, 3, 'F')
  doc.setTextColor(22, 163, 74)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Total Income', 14 + boxW / 2, boxY + 6, { align: 'center' })
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(formatAmt(summary?.totalIncome || 0), 14 + boxW / 2, boxY + 14, { align: 'center' })

  const box2X = 14 + boxW + gap
  doc.setFillColor(254, 242, 242)
  doc.roundedRect(box2X, boxY, boxW, boxH, 3, 3, 'F')
  doc.setTextColor(220, 38, 38)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Total Expense', box2X + boxW / 2, boxY + 6, { align: 'center' })
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(formatAmt(summary?.totalExpense || 0), box2X + boxW / 2, boxY + 14, { align: 'center' })

  const box3X = box2X + boxW + gap
  const net = (summary?.totalIncome || 0) - (summary?.totalExpense || 0)
  doc.setFillColor(239, 246, 255)
  doc.roundedRect(box3X, boxY, boxW, boxH, 3, 3, 'F')
  doc.setTextColor(37, 99, 235)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Net Balance', box3X + boxW / 2, boxY + 6, { align: 'center' })
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(formatAmt(net), box3X + boxW / 2, boxY + 14, { align: 'center' })

  // ── Table ──
  doc.setTextColor(30, 41, 59)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Transactions', 14, 86)

  const rows = transactions.map(t => [
    t.title || '',
    formatAmt(t.amount),
    t.type?.toUpperCase() || '',
    t.category || '',
    new Date(t.date).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    }),
  ])

  autoTable(doc, {
    startY: 90,
    head: [['Title', 'Amount', 'Type', 'Category', 'Date']],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      fontStyle: 'normal',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 38 },
      2: { cellWidth: 28 },
      3: { cellWidth: 34 },
      4: { cellWidth: 36 },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        const val = data.cell.raw
        if (val === 'INCOME') {
          data.cell.styles.textColor = [22, 163, 74]
          data.cell.styles.fontStyle = 'normal'
        } else if (val === 'EXPENSE') {
          data.cell.styles.textColor = [220, 38, 38]
          data.cell.styles.fontStyle = 'normal'
        }
      }
      if (data.section === 'body' && data.column.index === 1) {
        const row = transactions[data.row.index]
        if (row?.type === 'income') {
          data.cell.styles.textColor = [22, 163, 74]
        } else {
          data.cell.styles.textColor = [220, 38, 38]
        }
      }
    },
    didDrawPage: () => {
      const pageCount = doc.internal.getNumberOfPages()
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber
      const footerY = doc.internal.pageSize.getHeight() - 8
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `© ${now.getFullYear()} FinTrack Pro. All Rights Reserved.`,
        14, footerY
      )
      doc.text(
        `Page ${currentPage} of ${pageCount}`,
        pageWidth - 14, footerY, { align: 'right' }
      )
    }
  })

  doc.save(`fintrack_transactions_${now.toISOString().split('T')[0]}.pdf`)
}