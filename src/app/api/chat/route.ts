import {
  StreamingTextResponse,
  LangChainStream,
  Message,
  AIStreamCallbacks,
} from 'ai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { AIMessage, HumanMessage, SystemMessage } from 'langchain/schema'

export const runtime = 'edge'

export async function POST(req: Request) {
  const response = await req.json()
  const { messages } = response as { messages: Message[] }
  const { dbQuerys, dbResult } = response
  const lastMessage = messages[messages.length - 1].content

  const myCallbacks: AIStreamCallbacks = {
    onStart: async () => {},
    onCompletion: async (completion) => {},
    onToken: async (token) => {},
  }

  const { stream, handlers } = LangChainStream(myCallbacks)

  const Chat = new ChatOpenAI({
    streaming: true,
    verbose: false,
    callbacks: [handlers],
    temperature: 0.9,
    maxTokens: 200,
  })

  const ResponseChat = new OpenAI({
    streaming: true,
    verbose: false,
    callbacks: [handlers],
    temperature: 0,
    maxTokens: 200,
  })

  if (response.functions) {
    console.log('Pase por aca')
    const template = new PromptTemplate({
      template: `You are an NLP database assistant. You have to create a semantic response for the user. You should not include information about the queries made unless the user requests it. If you do not find the result, simply report the state of the table. Round the numbers. Use the next informatión:
Question: {input}

Querys => Result
{sqlquery} => The table has been actualized
{calculation_sqlquery} => {db_result}

Response: 
      `,
      inputVariables: [
        'input',
        'sqlquery',
        'calculation_sqlquery',
        'db_result',
      ],
    })

    const prompt = await template.format({
      input: lastMessage,
      sqlquery: dbQuerys.SQLQuery,
      calculation_sqlquery: dbQuerys.calculationSQLQuery,
      db_result: JSON.stringify(dbResult),
    })
    console.log(prompt)
    ResponseChat.call(prompt).catch(console.error)
  } else {
    console.log('Nono por aca pase')
    //toma como parámetro un array de BaseMessages, a diferencia de .predict que toma solo un input. Sea cual sea el método actualiza el stream
    Chat.call(
      messages.map((message: Message) => {
        switch (message.role) {
          case 'user':
            return new HumanMessage(message.content)
          case 'system':
            return new SystemMessage(message.content)
          default:
            return new AIMessage(message.content)
        }
      }),
      {}
    ).catch(console.error)
  }

  return new StreamingTextResponse(stream)
}
