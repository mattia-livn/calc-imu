'use server'

import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  'https://kysddyoyiehkahfdfrhj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5c2RkeW95aWVoa2FoZmRmcmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjA4NjQsImV4cCI6MjA2MzU5Njg2NH0.XjK5XnRTTkod_2N_hQkHazdKKnWi0t01VCup2leT4z0'
)

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const file = data.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Nessun file ricevuto.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error } = await supabase.storage
      .from('uploads')
      .upload(`${file.name}`, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const publicUrl = `https://kysddyoyiehkahfdfrhj.supabase.co/storage/v1/object/public/uploads/${file.name}`

    return NextResponse.json({ url: publicUrl })
  } catch (err: any) {
    console.error('❌ ERRORE GENERALE:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
