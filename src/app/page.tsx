"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import ArchitectureDiagram from '@/components/ui/ArchitectureDiagram'
import type { ArchitectureData } from './types/architecture'

export default function Home() {
  const [requirements, setRequirements] = useState('Build a simple e-commerce platform with product catalog, carts, and payment integration.')
  const [model, setModel] = useState('gpt-4o')

  const sample: ArchitectureData = {
    summary: 'Simple e-commerce with frontend, API, database and payment gateway',
    nodes: [
      { id: 'frontend', label: 'Frontend (React/Next)', type: 'ui' },
      { id: 'api', label: 'API (Node/Express)', type: 'service' },
      { id: 'db', label: 'Database (Postgres)', type: 'data' },
      { id: 'payments', label: 'Payments (Stripe)', type: 'external' },
    ],
    edges: [
      { source: 'frontend', target: 'api', label: 'HTTP / GraphQL' },
      { source: 'api', target: 'db', label: 'SQL' },
      { source: 'api', target: 'payments', label: 'HTTPS' },
    ],
    reasons: [
      'Next.js for fast SSR and good DX',
      'REST/GraphQL API separates concerns and enables multiple clients',
      'Postgres for relational consistency of orders',
    ]
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative pt-16 pb-12 bg-[linear-gradient(180deg,var(--background)_0%,rgba(0,0,0,0))]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--foreground)' }}>Design production-ready software architecture in minutes</h1>
              <p className="text-lg mb-6" style={{ color: 'var(--muted-foreground)' }}>Give the assistant your project goals and constraints — get a recommended architecture, rationale, and an editable visual diagram to jumpstart implementation.</p>

              <div className="flex items-center gap-3">
                <a href="/bot"><Button variant="default">Try the Workbench</Button></a>
                <a href="#features"><Button variant="ghost">View Examples</Button></a>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-md" style={{ background: 'var(--popover)', border: '1px solid var(--border)', color: 'var(--card-foreground)' }}>
                  <div className="font-semibold">Auto-generated diagrams</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Visualize recommended components & interactions.</div>
                </div>
                <div className="p-3 rounded-md" style={{ background: 'var(--popover)', border: '1px solid var(--border)', color: 'var(--card-foreground)' }}>
                  <div className="font-semibold">Design rationale</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Get concise trade-offs and patterns recommended by the assistant.</div>
                </div>
                <div className="p-3 rounded-md" style={{ background: 'var(--popover)', border: '1px solid var(--border)', color: 'var(--card-foreground)' }}>
                  <div className="font-semibold">Export & iterate</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Export PNG/JSON/PDF and refine in the Workbench.</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden shadow-lg" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
                <div className="p-4">
                  <div className="text-sm font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>Live preview</div>
                  <div className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>Example architecture generated from a short requirement.</div>
                </div>
                <div style={{ height: 360 }} className="w-full">
                  <ArchitectureDiagram data={sample} height={340} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--foreground)' }}>How it helps teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-md" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>Faster design reviews</h4>
              <p className="text-sm text-[var(--muted-foreground)]">Create a starting architecture to review with stakeholders and reduce iteration time.</p>
            </div>
            <div className="p-6 rounded-md" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>Consistency & patterns</h4>
              <p className="text-sm text-[var(--muted-foreground)]">Apply established patterns and reasoning that align with your constraints.</p>
            </div>
            <div className="p-6 rounded-md" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>Exportable artifacts</h4>
              <p className="text-sm text-[var(--muted-foreground)]">Download diagrams to include in docs or repo artifacts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA + Footer */}
      <section className="py-10 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--foreground)' }}>Ready to design?</h3>
          <div className="flex items-center justify-center gap-3">
            <a href="/bot"><Button variant="default">Open Workbench</Button></a>
            {/* <Button variant="ghost">Explore Docs</Button> */}
          </div>

          <footer className="mt-8 text-sm text-[var(--muted-foreground)]">© {new Date().getFullYear()} Architecture Workbench • Built with Next.js</footer>
        </div>
      </section>
    </div>
  )
}
