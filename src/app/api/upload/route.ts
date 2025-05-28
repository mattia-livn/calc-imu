export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.error("❌ Nessun file ricevuto.")
      return NextResponse.json({ error: 'Nessun file ricevuto.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdf = (await import('pdf-parse')).default

    // Estrai testo dal PDF
    let text = ''
    try {
      const data = await pdf(buffer)
      text = data.text.trim()
    } catch (err) {
      console.error('❌ Errore lettura PDF:', err)
      return NextResponse.json({ error: 'Errore nella lettura del PDF.' }, { status: 500 })
    }

    const { createClient } = await import('@supabase/supabase-js')
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

    console.log('✅ Upload riuscito, testo visura:', text.slice(0, 200)) // Logga i primi 200 caratteri

    return NextResponse.json({ visura: text })
  } catch (err) {
    console.error('❌ ERRORE GENERALE:', err)
    return NextResponse.json({ error: 'Errore generico API Upload.' }, { status: 500 })
  }
}
