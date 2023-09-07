import { NextResponse, NextRequest } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/db/config'

export async function POST(req: NextRequest) {
  const { query } = await req.json()
  console.log('pase por aca')

  //DB QUERY
  // const results = await db.execute(
  //   sql`SELECT
  //   column_name,
  //   data_type,
  //   is_nullable,
  //   character_maximum_length,
  //   numeric_precision_radix 
  //   FROM information_schema.columns WHERE table_name = 'mock_data';
  // `
  // )
  // console.log(results.rows)

  return NextResponse.json({ response: 'resultado de la db' })
}
