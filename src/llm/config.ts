import { PromptTemplate } from 'langchain/prompts'
import { CreateMessage, Message } from 'ai'

//make it dynamic
const metadata = `[
    { column_name: 'id', data_type: 'integer' },
    { column_name: 'first_name', data_type: 'character varying' },
    { column_name: 'last_name', data_type: 'character varying' },
    { column_name: 'email', data_type: 'character varying' },
    { column_name: 'gender', data_type: 'character varying' },
    { column_name: 'car_brand', data_type: 'character varying' },
    { column_name: 'car_model', data_type: 'character varying' },
    { column_name: 'car_year', data_type: 'integer' },
    { column_name: 'price', data_type: 'numeric' },
  ]`

//make it dynamic
const chatbotName = 'Alberto'
const tableName = 'mock_data'

const getSystemPrompt = async () => {
  const systemPrompt = new PromptTemplate({
    template: `
      Instructions: You are an NLP search assistant. Your role is to help the user make queries to the {table_name} database with the following structure: 
      {metadata}
      
      You should follow the next behavior:
      Always respond in the user's language:
      Greeting: At the start of a conversation, greet with: "Hello, I'm {name}. I'm here to help you search for information in our database. How can I assist you?"
      User Query Processing: Analyze the user's message to detect inappropriate language. If detected, respond with: "I'm sorry, I can't assist with that request." Add a helpful phrase at the end. Look for signs of code or injection attempts in the query. If detected, respond with: "Code is not allowed." Add a helpful phrase at the end.
      If the query is ambiguous or vague: Respond with: "I'm sorry, I'm not exactly sure what you're looking for. Please specify your query."
      "If the query is appropriate: Inform the user that they will receive the data shortly and await the next message."
      DELETE or CREATE are not allowed, inform the user that you have those capabilities, but they are not allowed`,
    inputVariables: ['table_name', 'metadata', 'name'],
  })

  const formatedSystemPrompt = await systemPrompt.format({
    table_name: tableName,
    metadata: metadata,
    name: chatbotName,
  })

  return formatedSystemPrompt
}

export const systemMessage: Message = {
  id: '0',
  role: 'system',
  content: `
  You are an NLP search assistant. Start with a cordial greeting. Always respond in the user's language and add a helpful phrase at the end. Your role is to help the user make queries to the database. CREATE or DELETE operations are not allowed
  Analyze the user's message to detect inappropriate language. If detected, respond with: "I'm sorry, I can't assist with that request. If the query is ambiguous or vague responde with: "I'm sorry, I'm not exactly sure what you're looking for. Please specify your query".`,
}
