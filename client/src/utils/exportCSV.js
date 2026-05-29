export const exportToCSV = (transactions, filename = 'transactions') => {
  const headers = ['Title', 'Amount', 'Type', 'Category', 'Date', 'Notes']

  const rows = transactions.map(t => [
    t.title,
    t.amount,
    t.type,
    t.category,
    `"${new Date(t.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })}"`,
    t.notes || ''
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map((cell, index) => 
        index === 4 ? cell : `"${String(cell).replace(/"/g, '""')}"`
      ).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}