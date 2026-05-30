export const exportToCSV = (transactions, user, currency = 'USD') => {
  const now = new Date()
  const exportDate = now.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  // Header rows
  const headerRows = [
    [`FinTrack Pro - Transaction History Report`],
    [`Exported On:,${exportDate}`],
    [`User Name:,${user?.name || 'N/A'}`],
    [`Email:,${user?.email || 'N/A'}`],
    [`Currency:,${currency}`],
    [`Total Records:,${transactions.length}`],
    [],
    ['Title', 'Amount', 'Type', 'Category', 'Date']
  ]

  // Data rows — Notes column removed
  const dataRows = transactions.map(t => {
    const d = new Date(t.date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return [
      `"${t.title || ''}"`,
      Number(t.amount).toFixed(2),
      t.type || '',
      t.category || '',
      `"${day}-${month}-${year}"`
    ]
  })

  const allRows = [
    ...headerRows.map(row => row.join(',')),
    ...dataRows.map(row => row.join(','))
  ]

  const csvContent = allRows.join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `fintrack_transactions_${now.toISOString().split('T')[0]}.csv`
  link.click()
}