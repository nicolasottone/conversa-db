import { NextResponse, NextRequest } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/db/config'

export async function POST(req: NextRequest) {
  const { querys } = await req.json()
  const { SQLQuery, calculationSQLQuery } = querys
  console.log(SQLQuery, typeof SQLQuery)

  if (SQLQuery) {
    const data = await db.execute(sql`${SQLQuery}`)
    return NextResponse.json(data.rows)
  }
  return NextResponse.json({ result: [] })
}
