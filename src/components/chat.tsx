'use client'

import { useChat } from 'ai/react'
import { useEffect, useState } from 'react'
import { useMessagesStore } from '@/store/chatStore'
import { useDataStore } from '@/store/dataStore'
import { systemMessage } from '@/llm/config'

export default function Chat() {
  const { history, setHistory } = useMessagesStore()
  const { setData } = useDataStore()
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setInput,
    append,
  } = useChat({
    initialMessages: history,
  })
  useEffect(() => {
    if (!messages.length) {
      append(systemMessage)
    }
  }, [])

  useEffect(() => {
    //working only if the response is complete
    setHistory(messages)
    console.log(messages)
  }, [isLoading])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setInput(input)
    const searchTrigger = await fetch('/api/search_trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input }),
    })

    const { trigger, querys } = await searchTrigger.json()

    if (!trigger) {
      handleSubmit(e)
      return
    }

    const data = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ querys }),
    })

    const { rows, result } = await data.json()
    setData(rows)

    handleSubmit(e, {
      functions: [trigger],
      options: {
        body: {
          dbQuerys: querys,
          dbResult: result,
        },
      },
    })
  }

  return (
    <div className='h-full w-full p-6 pt-2 flex flex-col justify-between overflow-auto'>
      <div className='h-full flex flex-col gap-4 stretch overflow-y-auto'>
        {messages.map(
          (message) =>
            message.role === 'user' || message.role === 'assistant' ? (
              message.role === 'user' ? (
                <div
                  className='bg-user-msg w-msg text-white flex self-end p-4 rounded-[20px] rounded-br-[5px]'
                  key={message.id}
                >
                  <p aria-details='User message'>{message.content}</p>
                </div>
              ) : (
                <div
                  className='bg-ai-msg w-msg flex p-4 rounded-[20px] rounded-bl-[5px]'
                  key={message.id}
                >
                  <p aria-details='Assistant message'>{message.content}</p>
                </div>
              )
            ) : null // Ignore system messages
        )}
      </div>

      <form className='flex' onSubmit={onSubmit}>
        <input
          className='w-full border border-gray-300 rounded shadow-xl p-2 mt-4'
          value={input}
          placeholder='Say something...'
          onChange={handleInputChange}
        />
      </form>
    </div>
  )
}
