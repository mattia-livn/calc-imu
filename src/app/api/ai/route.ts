import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import axios from 'axios'

const supabase = createClient(
  'https://kysddyoyiehkahfdfrhj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5c2RkeW95aWVoa2FoZmRmcmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjA4NjQsImV4cCI6MjA2MzU5Njg2NH0.XjK5XnRTTkod_2N_hQkHazdKKnWi0t01VCup2leT4z0'
)

const openrouterApiKey = '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' // Inserisci qui la tua chiave OpenRouter

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const visuraUrl: string = body.visuraUrl

    if (!visuraUrl) {
      return NextResponse.json({ error: 'Nessun URL della visura fornito.' }, { status: 400 })
    }

    // Scarica il file PDF come array buffer
    const fileResponse = await axios.get(visuraUrl, { responseType: 'arraybuffer' })
    const pdfBuffer = fileResponse.data

    // Estrai testo dal PDF usando pdf-parse
    const pdfParse = require('pdf-parse')
    const parsed = await pdfParse(pdfBuffer)
    const text = parsed.text?.trim()

    if (!text) {
      return NextResponse.json({ error: 'Nessun testo trovato nel PDF.' }, { status: 400 })
    }

    // Prompt per il LLM
    const prompt = `
Sei un assistente fiscale. Questo è il contenuto di una visura catastale:\n\n${text}\n\n
In base ai dati della visura, individua il Comune e calcola l’IMU dovuta per il 2025.
Fornisci una spiegazione dettagliata e chiedi ulteriori dati all’utente se necessari.
    `.trim()

    const openai = new OpenAI({
      apiKey: openrouterApiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    })

    const completion = await openai.chat.completions.create({
      model: 'mistral-7b-instruct',
      messages: [
        { role: 'system', content: 'Rispondi sempre in italiano. Fornisci spiegazioni precise e chiare.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
    })

    const result = completion.choices[0].message.content
    return NextResponse.json({ result })
  } catch (err: any) {
    console.error('❌ ERRORE GENERALE:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
