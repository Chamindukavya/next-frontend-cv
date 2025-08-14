'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, User, Bot, Sparkles, MessageCircle } from 'lucide-react'
import { getResponse } from '../actions/botActions'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([])
  const [input, setInput] = useState('')
  const [botResponse, setBotResponse] = useState('')
  const msgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, botResponse])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const inputArray = [input]
    setMessages(prev => [...prev, { sender: 'user', text: input }])

    // Simulate API response - replace with actual getResponse call
    setMessages(prev => [...prev, { sender: 'bot', text: "" }])
    let responseText = ""
    // const sampleResponse = "This is a sample response that will be typed out character by character to simulate streaming."
    const sampleResponse = await getResponse(inputArray)
    for await (const chunk of sampleResponse) {
      await new Promise(resolve => setTimeout(resolve, 30))
      responseText += chunk
      setBotResponse(responseText)
    }

    setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1].text = responseText
        return newMessages
    })

    setBotResponse('')
    setInput('')
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-gray-200/50 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Assistant
            </h1>
            <p className="text-sm text-gray-500">Ask Questions related to my CV</p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 h-full flex flex-col">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-500" />
              About This Assistant
            </h3>
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                <p>
                  My virtual assistant is designed to answer questions specifically related to my CV. It can provide information such as my personal details, education, work experience, skills, and achievements.
                </p>
                <p>
                   For example, if asked 'What is your name?', the assistant will respond, 'I am Chamindu.'
                   </p>
                   <p>
                    It serves as an interactive way to present my professional profile.
                </p>
                {/* <p>
                  Whether you need help with work, want to brainstorm ideas, learn something new, or just have a friendly chat, I'm ready to assist you.
                </p>
                <p>
                  Feel free to ask me anything - from complex questions to simple requests. I'll do my best to provide helpful, accurate, and engaging responses.
                </p> */}
              </div>
              
              {/* <div className="mt-6 p-4 bg-white/70 rounded-xl border border-indigo-200/50">
                <h4 className="font-medium text-gray-800 mb-2">Quick Tips:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Be specific in your questions</li>
                  <li>• Ask for examples when needed</li>
                  <li>• Request different formats or styles</li>
                  <li>• Feel free to ask follow-up questions</li>
                </ul>
              </div> */}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Ready to chat
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 max-w-4xl mx-auto">
              {messages.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-10 h-10 text-indigo-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Start a conversation</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    Send a message to begin chatting with your AI assistant. Ask questions, get help, or just have a friendly conversation.
                  </p>
                </div>
              )}

              <div className="space-y-6 pb-6">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 ${
                      msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                        : 'bg-gradient-to-br from-emerald-400 to-cyan-500'
                    }`}>
                      {msg.sender === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    
                    <div className={`max-w-[70%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-4 rounded-2xl shadow-sm backdrop-blur-sm ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-md'
                          : 'bg-white/80 border border-gray-200/50 text-gray-800 rounded-tl-md'
                      }`}>
                        <div className="whitespace-pre-wrap leading-relaxed">
                          {msg.sender === 'bot' && msg === messages[messages.length - 1] && botResponse !== ""
                            ? botResponse
                            : msg.text}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={msgRef} />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-sm p-6 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  className="min-h-[52px] rounded-2xl border-gray-300/50 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 py-4 px-6 pr-14 resize-none shadow-sm text-base"
                  disabled={botResponse !== ''}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim() || botResponse !== ''}
                className="h-[52px] w-[52px] rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl hover:scale-105"
              >
                <Send className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}