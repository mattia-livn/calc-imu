import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PDFDocument } from 'pdf-lib'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.error("❌ Nessun file ricevuto.")
      return NextResponse.json({ error: 'Nessun file ricevuto.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // ✅ Estrai testo usando pdf-lib
    let text = ''
    try {
      const pdfDoc = await PDFDocument.load(buffer)
      const pages = pdfDoc.getPages()
      text = pages.map(page => page.getTextContent?.()?.toString?.() ?? '').join('\n').trim()
    } catch (err) {
      console.error('❌ Errore parsing PDF:', err)
      return NextResponse.json({ error: 'Errore nella lettura del PDF.' }, { status: 500 })
    }

    // ✅ Upload file su Supabase
    const supabase = createClient(
      'https://kysddyoyiehkahfdfrhj.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5c2RkeW95aWVoa2FoZmRmcmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjA4NjQsImV4cCI6MjA2MzU5Njg2NH0.XjK5XnRTTkod_2N_hQkHazdKKnWi0t01VCup2leT4z0'
    )

    const path = `uploads/${Date.now()}_${file.name}`
    const { error } = await supabase.storage
      .from('uploads')
      .upload(path, buffer, {
        contentType: file.type,
      })

    if (error) {
      console.error('❌ Errore Supabase upload:', error)
      return NextResponse.json({ error: 'Errore upload su Supabase.' }, { status: 500 })
    }

    console.log('✅ Upload riuscito. Estratto testo visura:', text.slice(0, 200))

    return NextResponse.json({ visura: text })
  } catch (err) {
    console.error('❌ Errore generale API Upload:', err)
    return NextResponse.json({ error: 'Errore generale.' }, { status: 500 })
  }
}
