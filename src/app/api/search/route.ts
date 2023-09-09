import { NextResponse, NextRequest } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/db/config'

export async function POST(req: NextRequest) {
  const { querys } = await req.json()
  const { SQLQuery, calculationSQLQuery } = querys

  if (SQLQuery) {
    const { rows } = await db.execute(sql.raw(SQLQuery))
    if (calculationSQLQuery) {
      const result = await db.execute(sql.raw(calculationSQLQuery))
      return NextResponse.json({ rows, result: result.rows })
    }
    //Hacer que devuelva result o un objeto vacio
    return NextResponse.json({ rows, result: '' })
  }
  return NextResponse.json({ result: [] })
}
