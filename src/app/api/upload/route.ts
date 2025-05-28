import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kysddyoyiehkahfdfrhj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filename, buffer, {
      contentType: file.type,
    })

  if (error) {
    console.error('Errore upload:', error)
    return NextResponse.json({ error: 'Upload fallito' }, { status: 500 })
  }

  const publicUrl = `https://kysddyoyiehkahfdfrhj.supabase.co/storage/v1/object/public/uploads/visure/${filename}`
  return NextResponse.json({ pdfUrl: publicUrl })
}
