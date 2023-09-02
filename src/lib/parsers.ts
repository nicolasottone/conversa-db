import { z } from 'zod'
import { StructuredOutputParser } from 'langchain/output_parsers'
import { PromptTemplate } from 'langchain/prompts'
import { OpenAI } from 'langchain/llms/openai'
import { ClientSchema } from './types'

export const runtime = 'edge'

export const parseClient = async (conversation: string) => {
  const clientParser = StructuredOutputParser.fromZodSchema(ClientSchema)
  const formatInstructions = clientParser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template:
      '{format_instructions}\nReview the next conversation and retrieve information.\n{messages}',
    inputVariables: ['messages'],
    partialVariables: { format_instructions: formatInstructions },
  })

  const input = await prompt.format({ messages: conversation })

  const llm = new OpenAI({
    modelName: 'gpt-3.5-turbo',
    maxTokens: 200,
    temperature: 0.2,
    topP: 1,
  })

  const response = await llm.call(input)

  const parsed_client = await clientParser.parse(response)

  return parsed_client
}
