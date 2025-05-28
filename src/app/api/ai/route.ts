import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  console.log("🧠 Chiamata ricevuta da /api/ai")

  const { visura } = await req.json()

  const prompt = `
Calcola l'IMU per questa visura catastale:
${visura}
Rispondi con: Aliquota, motivazione, e riferimento normativo.
`

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        { role: 'system', content: 'Sei un esperto di fiscalità immobiliare in Italia.' },
        { role: 'user', content: prompt },
      ],
    }),
  })

  const json = await res.json()
  console.log("📨 Risposta OpenRouter:", JSON.stringify(json, null, 2))

  const risposta = json.choices?.[0]?.message?.content
  return NextResponse.json({ risposta })
}
