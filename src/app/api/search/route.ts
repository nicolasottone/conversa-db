import { ChatOpenAI } from 'langchain/chat_models/openai'
import { NextResponse, NextRequest } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/db/config'

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()

  const LLMFunctionTrigger = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo-0613',
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  const response = await LLMFunctionTrigger.invoke(prompt, {
    functions: [
      {
        name: 'searchInDB',
        description: 'Make the search in the database',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: "Summary of the user's query",
            },
          },
          required: ['query'],
        },
      },
    ],
  })

  console.log(response)
  //DB QUERY
  // const results = await db.execute(sql`select * from mock_data limit 3`)
  // console.log(results.rows)

  return NextResponse.json(response)
}
