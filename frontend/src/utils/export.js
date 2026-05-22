import { format } from 'date-fns'

export function exportTXT(chat) {
  const lines = chat.messages.map(m =>
    `[${format(new Date(m.timestamp), 'PPpp')}] ${m.role === 'user' ? 'You' : 'AI'}:\n${m.content}\n`
  )
  const blob = new Blob([`Chat: ${chat.title}\n\n${lines.join('\n---\n\n')}`], { type: 'text/plain' })
  download(blob, `${chat.title}.txt`)
}

export function exportJSON(chat) {
  const blob = new Blob([JSON.stringify(chat, null, 2)], { type: 'application/json' })
  download(blob, `${chat.title}.json`)
}

export async function exportPDF(chat) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(chat.title, 14, 18)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  let y = 30
  for (const msg of chat.messages) {
    const role = msg.role === 'user' ? 'You' : 'AI'
    const ts   = format(new Date(msg.timestamp), 'PPpp')
    doc.setFont('helvetica', 'bold')
    doc.text(`${role}  (${ts})`, 14, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(msg.content, 180)
    lines.forEach(line => {
      if (y > 280) { doc.addPage(); y = 14 }
      doc.text(line, 14, y)
      y += 5
    })
    y += 6
    if (y > 280) { doc.addPage(); y = 14 }
  }
  doc.save(`${chat.title}.pdf`)
}

function download(blob, name) {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href = url; a.download = name; a.click()
  URL.revokeObjectURL(url)
}
