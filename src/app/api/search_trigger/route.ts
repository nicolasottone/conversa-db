import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAI } from 'langchain/llms/openai'
import { NextResponse } from 'next/server'
import { PromptTemplate } from 'langchain/prompts'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { z } from 'zod'

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const LLMFunctionTrigger = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo-0613',
    temperature: 0.7,
  })

  const response = await LLMFunctionTrigger.invoke(prompt, {
    functions: [
      {
        name: 'makeSearch',
        description: 'Activate if the user makes a query',
        parameters: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'summary of the query in english',
            },
          },
          required: ['query'],
        },
      },
    ],
  })

  const { function_call } = response.additional_kwargs

  if (function_call) {
    const parser = StructuredOutputParser.fromZodSchema(
      z.object({
        SQLQuery: z.string().describe('SQL Query to retrieve the data used'),
        calculationSQLQuery: z
          .string()
          .describe('SQL Query to run the calculate'),
      })
    )

    const formatedInstructions = parser.getFormatInstructions()

    const SQL_POSTGRES_PROMPT = new PromptTemplate({
      template: `You are a PostgreSQL expert. Given an input question, first create a syntactically correct SQL query to retrieve the data used for calculations (select all the columns), 
      and then create a separate SQL query to calculate the specific information the user is requesting. Pay attention to use only the column names available in the tables below. 
      Be careful not to query for columns that do not exist, and make sure to use the correct table for each column. 
      If the query does not require any calculations, simply build the SQL query that returns the requested information.
      If the user does not make a query then do not generate any query.
      
      Only use the following table's info:
      Name: mock_data
      Metadata: {table_info}
      
      Use the following format:
      {format_instructions}
    
      Question: {input}`,
      inputVariables: ['table_info', 'input'],
      partialVariables: { format_instructions: formatedInstructions },
    })

    const metadata = `{
      column_name: 'id',
      data_type: 'integer',
      is_nullable: 'YES',
      character_maximum_length: null,
      numeric_precision_radix: 2
    },
    {
      column_name: 'first_name',
      data_type: 'character varying',
      is_nullable: 'YES',
      character_maximum_length: 255,
      numeric_precision_radix: null
    },
    {
      column_name: 'last_name',
      data_type: 'character varying',
      is_nullable: 'YES',
      character_maximum_length: 255,
      numeric_precision_radix: null
    },
    {
      column_name: 'email',
      data_type: 'character varying',
      is_nullable: 'YES',
      character_maximum_length: 255,
      numeric_precision_radix: null
    },
    {
      column_name: 'gender',
      data_type: 'character varying',
      is_nullable: 'YES',
      character_maximum_length: 255,
      numeric_precision_radix: null
    },
    {
      column_name: 'car_brand',
      data_type: 'character varying',
      is_nullable: 'YES',
      character_maximum_length: 255,
      numeric_precision_radix: null
    },
    {
      column_name: 'car_model',
      data_type: 'character varying',
      is_nullable: 'YES',
      character_maximum_length: 255,
      numeric_precision_radix: null
    },
    {
      column_name: 'car_year',
      data_type: 'integer',
      is_nullable: 'YES',
      character_maximum_length: null,
      numeric_precision_radix: 2
    },
    {
      column_name: 'price',
      data_type: 'numeric',
      is_nullable: 'YES',
      character_maximum_length: null,
      numeric_precision_radix: 10
    }`

    const LLMQueryGenerator = new OpenAI({
      temperature: 0,
    })
    const formatedPrompt = await SQL_POSTGRES_PROMPT.format({
      table_info: metadata,
      input: function_call.arguments,
    })

    const response = await LLMQueryGenerator.call(formatedPrompt)

    console.log(await parser.parse(response))
  }
  return NextResponse.json({
    trigger: function_call,
  })
}
