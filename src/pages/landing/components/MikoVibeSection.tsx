import { ArrowRight, Bot, BrainCircuit, Sparkles } from 'lucide-react'
import type { MikoQuestionPill } from '../types'

interface MikoVibeSectionProps {
  questions: MikoQuestionPill[]
  onTryMiko: () => void
}

const MikoVibeSection = ({ questions, onTryMiko }: MikoVibeSectionProps) => {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-gradient-to-br from-orange-50 via-white to-orange-100/80 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-orange-100 md:px-10 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-orange-100/70 blur-3xl" />
      </div>

      <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-orange-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Meet Miko
            </div>

            <div className="space-y-3">
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Your AI vibe match for finding the <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">right home faster</span>
              </h2>
              <p className="max-w-2xl text-base leading-7 text-gray-600">
                Answer 7 quick questions and let Miko guide you to homes that match how you actually live.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {questions.map((item, index) => (
              <div
                key={item.text}
                className={[
                  'flex items-center gap-3 rounded-2xl border border-orange-100/80 bg-white/90 px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md',
                  index === questions.length - 1 ? 'md:col-span-3 md:mx-auto md:w-full md:max-w-sm' : '',
                ].join(' ')}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-lg shadow-inner">
                  <span>{item.emoji}</span>
                </div>
                <p className="text-sm font-medium leading-5 text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 text-center sm:flex-col sm:items-center">
            <button
              type="button"
              onClick={onTryMiko}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-300/30 transition-all duration-200 hover:bg-orange-600"
            >
              Try Miko Vibe Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md rounded-[32px] border border-white/80 bg-white/85 p-4 shadow-[0_28px_70px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="absolute right-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
              Vibe Match: 94%
            </div>

            <div className="rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                    <Bot className="h-6 w-6 text-orange-300" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Miko is analyzing your vibe</p>
                    <p className="mt-1 text-xs text-white/70">Lifestyle, budget, routine, and compatibility</p>
                  </div>
                </div>
                <BrainCircuit className="mt-1 h-5 w-5 text-orange-300" />
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">Best Match</p>
                <p className="mt-2 text-xl font-semibold">Calm, social, late-evening friendly homes</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Based on your answers, Miko prioritizes spaces that fit your routine, comfort, and people preferences.
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/60">Questions answered</p>
                  <p className="mt-1 text-2xl font-bold">07</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/60">Match confidence</p>
                  <p className="mt-1 text-2xl font-bold text-orange-300">High</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85">Late-night friendly</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85">Cooking okay</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/85">Pet positive</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-gray-500 lg:max-w-md">
            Quick, guided, and built for real-life flatmate chemistry.
          </p>
        </div>
      </div>
    </section>
  )
}

export default MikoVibeSection
