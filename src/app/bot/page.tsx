'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, User, Bot, Sparkles, MessageCircle, ClipboardList, FilePenLine } from 'lucide-react'
import { getResponse, getArchitecture } from '../actions/botActions'
import ArchitectureDiagram from '@/components/ui/ArchitectureDiagram'
import type { ArchitectureData } from '@/app/types/architecture'
import { toPng } from 'html-to-image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string; arch?: ArchitectureData }[]>([])
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

    // After the bot has finished, request the architecture from backend and append under the bot message
    try {
      const arch = await getArchitecture(input)
      setMessages(prev => {
        const newMessages = [...prev]
        const i = newMessages.length - 1
        if (newMessages[i]?.sender === 'bot') {
          newMessages[i] = { ...newMessages[i], arch }
        }
        return newMessages
      })
    } catch (e) {
      // Ignore diagram on failure; chat content remains
      console.warn('Failed to fetch architecture', e)
    }
  }

  const newChat = () => {
    setMessages([])
    setInput('')
    setBotResponse('')
    // attempt to scroll to top of the conversation area
    const scrollRoot = document.querySelector('.chat-scroll-root') as HTMLElement | null
    if (scrollRoot) scrollRoot.scrollTop = 0
    // focus input if present
    const el = document.querySelector('[data-slot="input"]') as HTMLElement | null
    if (el && typeof (el as any).focus === 'function') (el as any).focus()
  }

  const downloadDiagramPng = async (idx: number) => {
    const container = document.getElementById(`arch-${idx}`)
    if (!container) return
    const target = (container.querySelector('.react-flow') as HTMLElement) || container
    await new Promise(r => setTimeout(r, 50))
    try {
      // pick a sensible background from CSS variables (fallback to dark slate)
      const root = document.documentElement
      const cardBg = getComputedStyle(root).getPropertyValue('--card') || ''
      const bg = cardBg.trim() || (root.classList.contains('dark') ? '#0b1220' : '#ffffff')

      const dataUrl = await toPng(target, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: bg,
        filter: (node: Element) => {
          const el = node as HTMLElement
          if (!el) return true
          const cls = el.className?.toString?.() || ''
          if (cls.includes('react-flow__minimap') || cls.includes('react-flow__controls')) return false
          return true
        }
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `architecture-${idx + 1}.png`
      a.click()
    } catch (err) {
      console.warn('PNG export failed', err)
    }
  }

  return (
    <div className="h-screen flex overflow-hidden" style={{ color: '#000' }}>
      {/* Sidebar */}
  <div className="w-80 p-6 flex flex-col" style={{ background: 'var(--sidebar)', borderRight: '1px solid var(--sidebar-border)', color: '#fff' }}>
        <div className="flex items-center gap-3 mb-8">
          {/* <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div> */}
          <div className='text-amber-50'>
            <h1 className="text-xl font-bold bg-gradient-to-r  bg-clip-text ">
              Software Engineering Workbench
            </h1>
            <p className="text-sm text-gray-500" style={{ color: '#fff' }}>Automate software design from requirements</p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="rounded-2xl p-6 h-full flex flex-col" style={{ background: 'var(--popover)', border: '1px solid var(--border)', color: '#fff' }}>
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#fff' }}>
              <MessageCircle className="w-5 h-5 text-white" />
              About This Workbench
            </h3>
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#fff' }}>
                <p>
                  This workbench automates software design. Enter high-level requirements and it will generate a solution architecture with explained design decisions and a visual diagram.
                  Try ‘Build an e-commerce website’ as an example to see suggested components and reasoning.
                </p>
                <p>
                  You can refine requirements, review updated architecture suggestions, and export diagrams.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: 'linear-gradient(90deg, rgba(72,72,196,0.06), rgba(124,58,237,0.06))', color: '#fff' }}>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Ready for your project requirements
          </div>
        </div>
      </div>

      {/* Chat Area */}
  <div className="flex-1 flex flex-col min-w-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 max-w-4xl mx-auto">
              <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={newChat} className="px-3 py-1 bg-amber-50">New Chat</Button>
              </div>
              {messages.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))' }}>
                    <MessageCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>Start your project design</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
                    <div className="rounded-xl p-6 shadow-sm flex flex-col items-center" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: '#fff' }}>
                      <ClipboardList className="w-8 h-8 text-white mb-2" />
                      <h4 className="font-semibold mb-2" style={{ color: '#fff' }}>Describe Requirements</h4>
                      <p className="text-sm" style={{ color: '#fff' }}>Enter your high-level project requirements to begin the design process.</p>
                    </div>
                    <div className="rounded-xl p-6 shadow-sm flex flex-col items-center" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: '#fff' }}>
                      <Bot className="w-8 h-8 text-white mb-2" />
                      <h4 className="font-semibold mb-2" style={{ color: '#fff' }}>Architecture Suggestions</h4>
                      <p className="text-sm" style={{ color: '#fff' }}>Receive solution architecture and reasoning tailored to your project.</p>
                    </div>
                    <div className="rounded-xl p-6 shadow-sm flex flex-col items-center" style={{ background: 'var(--card)', border: '1px solid var(--border)', color: '#fff' }}>
                      <FilePenLine className="w-8 h-8 text-white mb-2" />
                      <h4 className="font-semibold mb-2" style={{ color: '#fff' }}>Edit & Download</h4>
                      <p className="text-sm" style={{ color: '#fff' }}>Refine the architecture diagram and export it for documentation or development.</p>
                    </div>
                  </div>
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
                          : 'rounded-tl-md'
                      }`} id={msg.sender === 'bot' ? `bot-msg-${idx}` : undefined} style={msg.sender === 'bot' ? { background: 'var(--card)', border: '1px solid var(--border)', color: '#fff' } : undefined}>
                        <div className="leading-relaxed">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.sender === 'bot' && msg === messages[messages.length - 1] && botResponse !== ""
                              ? botResponse
                              : msg.text}
                          </ReactMarkdown>
                        </div>
                      </div>
                      {msg.sender === 'bot' && msg.arch && (
                        <div className="mt-3" id={`arch-${idx}`}>
                          <ArchitectureDiagram data={msg.arch} />
                          <div className="mt-2 flex justify-end">
                            <Button onClick={() => downloadDiagramPng(idx)} className="h-8 px-3 rounded-lg" style={{ background: 'linear-gradient(90deg,#111827,#0f172a)', color: '#fff' }}>
                              Download Diagram (PNG)
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={msgRef} />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
  <div className="p-6 flex-shrink-0" style={{ borderTop: '1px solid var(--border)', background: 'var(--popover)', color: '#fff' }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Describe your project requirements..."
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  className="min-h-[52px] rounded-2xl border-gray-300/50 bg-x/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 py-4 px-6 pr-14 resize-none shadow-sm text-base"
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