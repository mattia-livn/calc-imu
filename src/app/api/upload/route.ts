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
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      console.error("❌ Nessun file fornito")
      return NextResponse.json({ error: 'Nessun file fornito' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // ✅ Estrazione testo
    let testoEstratto = ''
    try {
      const parsed = await pdfParseCjs(buffer)
      testoEstratto = parsed.text
      console.log("✅ Testo estratto dal PDF:", testoEstratto.slice(0, 100))
    } catch (err) {
      console.error("❌ Errore parsing PDF:", err)
      return NextResponse.json({ error: 'Errore nella lettura del PDF' }, { status: 500 })
    }

    // ✅ Upload su Supabase
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(`visure/${fileName}`, buffer, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) {
        console.error("❌ Errore upload Supabase:", uploadError)
        return NextResponse.json({ error: 'Errore nel caricamento su Supabase' }, { status: 500 })
      }
    } catch (err) {
      console.error("❌ Catch upload Supabase:", err)
      return NextResponse.json({ error: 'Errore nel caricamento su Supabase' }, { status: 500 })
    }

    // ✅ Chiamata a OpenRouter
    const prompt = `
Calcola l'IMU per questa visura catastale:
${testoEstratto}
Rispondi con: Aliquota, motivazione, e riferimento normativo.
    `.trim()

    let risposta = ''
    try {
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
      risposta = json.choices?.[0]?.message?.content || ''
      console.log("✅ Risposta LLM:", risposta.slice(0, 100))
    } catch (err) {
      console.error("❌ Errore chiamata LLM:", err)
    }

    return NextResponse.json({
      success: true,
      risposta: risposta || 'Non sono riuscito a calcolare l’IMU.',
      testoEstratto,
    })

  } catch (e) {
    console.error("❌ Errore generale nel route.ts:", e)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
