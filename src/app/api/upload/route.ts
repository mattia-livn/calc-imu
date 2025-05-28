console.log("📥 Upload endpoint hit")

// src/app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import pdfParseCjs from 'pdf-parse/lib/pdf-parse.js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'Nessun file fornito' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // ✅ Estrazione testo
  let testoEstratto = ''
  try {
    const parsed = await pdfParseCjs(buffer)
    testoEstratto = parsed.text
  } catch (err) {
    return NextResponse.json({ error: 'Errore nella lettura del PDF' }, { status: 500 })
  }

  // ✅ Upload su Supabase
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${randomUUID()}.${fileExt}`

  await supabase.storage
    .from('uploads')
    .upload(`visure/${fileName}`, buffer, {
      contentType: file.type,
      upsert: false,
    })

  // ✅ Chiamata a OpenRouter
  const prompt = `
Calcola l'IMU per questa visura catastale:
${testoEstratto}
Rispondi con: Aliquota, motivazione, e riferimento normativo.
`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openchat/openchat-3.5-0106',
      messages: [
        { role: 'system', content: 'Sei un esperto di fiscalità immobiliare in Italia.' },
        { role: 'user', content: prompt },
      ],
    }),
  })

  const json = await res.json()
  const risposta = json.choices?.[0]?.message?.content

  return NextResponse.json({
    success: true,
    risposta: risposta || 'Non sono riuscito a calcolare l’IMU.',
    testoEstratto,
  })
}
