import { NextResponse, NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const content = await req.json()
  console.log('pase por aca', content.body)
  return NextResponse.json({ req: 'todo esta bien' })
}
