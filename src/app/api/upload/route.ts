import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import pdf from 'pdf-parse'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'Nessun file ricevuto.' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Estrazione testo con pdf-parse (funziona su Bolt)
  let text = ''
  try {
    const data = await pdf(buffer)
    text = data.text.trim()
  } catch (err) {
    return NextResponse.json({ error: 'Errore nella lettura del PDF.' }, { status: 500 })
  }

  // Upload su Supabase
  const supabase = createClient(
    'https://kysddyoyiehkahfdfrhj.supabase.co', // ← sostituisci
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5c2RkeW95aWVoa2FoZmRmcmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjA4NjQsImV4cCI6MjA2MzU5Njg2NH0.XjK5XnRTTkod_2N_hQkHazdKKnWi0t01VCup2leT4z0' // ← sostituisci
  )

  const nomeFile = `statements/${Date.now()}_${file.name}`
  await supabase.storage.from('uploads').upload(nomeFile, buffer, {
    contentType: file.type,
  })

  return NextResponse.json({ visura: text })
}
