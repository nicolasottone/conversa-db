import {
  StreamingTextResponse,
  LangChainStream,
  Message,
  AIStreamCallbacks,
} from 'ai'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { AIMessage, HumanMessage, SystemMessage } from 'langchain/schema'

export const runtime = 'edge'

export async function POST(req: Request) {
  const response = await req.json()
  const { messages } = response as { messages: Message[] }

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

  const Chat = new ChatOpenAI({
    streaming: true,
    verbose: false,
    callbacks: [handlers],
    temperature: 0.9,
    maxTokens: 200,
  })

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

  return new StreamingTextResponse(stream)
}
