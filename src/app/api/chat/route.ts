import {
  StreamingTextResponse,
  LangChainStream,
  Message,
  AIStreamCallbacks,
} from 'ai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAI } from 'langchain/llms/openai'
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from 'langchain/schema'
import { SqlDatabase } from 'langchain/sql_db'
import { SqlDatabaseChain } from 'langchain/chains/sql_db'
import { DataSource } from 'typeorm'

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Message[] }
  console.log('aaaa')
  const myCallbacks: AIStreamCallbacks = {
    onStart: async () => {},
    onCompletion: async (completion) => {
      //no imprime el ultimo mensaje respondido por la ia!
      /*       const formattedMessages: string = messages
        .slice(1)
        .map(({ role, content }) => `${role}: ${content}`)
        .join('\n')

      if (messages.length > 5) {
        const new_client: Client = await parseClient(formattedMessages)
        new_client.messages_count = Math.floor(messages.length / 2)
        console.log(new_client)
      } */
    },
    onToken: async (token) => {},
  }

  const { stream, handlers } = LangChainStream(myCallbacks)

  const chatHistory: BaseMessage[] = messages.map((message: Message) => {
    switch (message.role) {
      case 'user':
        return new HumanMessage(message.content)
      case 'system':
        return new SystemMessage(message.content)
      default:
        return new AIMessage(message.content)
    }
  })

  const Chat = new ChatOpenAI({
    streaming: true,
    verbose: false,
    callbacks: [handlers],
    temperature: 0.9,
    maxTokens: 200,
  })
  const LLMFunctionTrigger = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo-0613',
    temperature: 0,
  })

  // const db = new DataSource({
  //   type: 'postgres', // Tipo de base de datos PostgreSQL
  //   host: 'ep-round-butterfly-330080-pooler.us-east-1.postgres.vercel-storage.com', // Dirección del servidor de la base de datos
  //   port: 5432, // Puerto de la base de datos de PostgreSQL
  //   database: 'verceldb', // Nombre de la base de datos a la que te quieres conectar
  //   username: 'default', // Nombre de usuario de la base de datos
  //   password: 'TfJ9CinwW0GU', // Contraseña del usuario de la base de datos
  // })

  // const db = await SqlDatabase.fromDataSourceParams({
  //   appDataSource: datasource,
  // })

  // const SQLchain = new SqlDatabaseChain({
  //   llm: new OpenAI({ temperature: 0 }),
  //   database: db,
  //   verbose: true,
  // })

  const response = await LLMFunctionTrigger.invoke(
    messages[messages.length - 1].content,
    {
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
    }
  )

  const functionInfo = response.additional_kwargs.function_call
  console.log('respuesta del llm:', response)
  console.log('funciont', functionInfo)

  if (functionInfo) {
    const res = await SQLchain.run('How many BMW are in mock_data?')
    console.log(res)
  }
  Chat.call(chatHistory, {}).catch(console.error)

  //console.log(messages[messages.length - 1].content)
  return new StreamingTextResponse(stream)
}
