import { NextResponse } from 'next/server'
import { getDocument } from 'pdfjs-dist'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'

// fix per pdfjs su Next.js
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'Nessun file ricevuto' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise

  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items.map((item: any) => item.str).join(' ')
    fullText += text + '\n'
  }

  console.log('📄 TESTO ESTRATTO (inizio):', fullText.slice(0, 500))

  return NextResponse.json({ visura: fullText })
}
