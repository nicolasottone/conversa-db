'use client'

import { useChat } from 'ai/react'
import { useEffect, useState } from 'react'
import { Message } from 'ai'
import { useMessagesStore } from '@/store/chatStore'

interface ChatProps {
  setup: Message
}

export default function Chat() {
  const { history, setHistory } = useMessagesStore()

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: history,
    })

  useEffect(() => {
    //working only if the response is complete
    setHistory(messages)
  }, [isLoading])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //Hacer edge el trigger
    e.preventDefault()
    debugger
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: e.target.elements[0].value }),
    })
    console.log(await response.json())

    handleSubmit(e, { functions: ['search_db'] })
  }

  return (
    <div className='h-full w-full flex flex-col justify-between overflow-auto'>
      <div className='h-full flex flex-col stretch overflow-y-auto'>
        {messages.length > 0 &&
          messages.map((message) => {
            if (message.role === 'user') {
              return (
                <p key={message.id} className='whitespace-pre-wrap'>
                  User: {message.content}
                </p>
              )
            } else if (message.role === 'assistant') {
              return (
                <p key={message.id} className='whitespace-pre-wrap'>
                  AI: {message.content}
                </p>
              )
            }
          })}
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
