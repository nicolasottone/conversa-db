import { NextResponse, NextRequest } from 'next/server'
import Papa from 'papaparse'

export async function POST(request: NextRequest) {
  //Returns JSON data
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' })
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const csvString = buffer.toString('utf-8')

    const parsedData = await new Promise((resolve, reject) => {
      Papa.parse(csvString, {
        header: true,
        complete: (results) => {
          resolve(results.data)
        },
      })
    })

    return NextResponse.json(parsedData)
  } catch (error) {
    return NextResponse.json({ error: 'Error parsing CSV file' })
  }
}
