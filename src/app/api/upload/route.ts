// src/app/api/upload/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import pdfParse from 'pdf-parse'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  console.log("📥 Upload endpoint hit")

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file)
