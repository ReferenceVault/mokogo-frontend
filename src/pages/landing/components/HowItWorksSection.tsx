import { useState } from 'react'
import type { HowItWorksWorkflow } from '../types'

interface HowItWorksSectionProps {
  workflows: HowItWorksWorkflow[]
}

const HowItWorksSection = ({ workflows }: HowItWorksSectionProps) => {
  const [activeWorkflowId, setActiveWorkflowId] = useState(workflows[0]?.id ?? 'find')
  const activeWorkflow =
    workflows.find((workflow) => workflow.id === activeWorkflowId) ?? workflows[0]

  if (!activeWorkflow) {
    return null
  }

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[radial-gradient(circle_at_top_left,_rgba(255,237,213,0.9),_rgba(255,255,255,0.98)_42%,_rgba(255,247,237,0.92)_100%)] px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-orange-100 md:px-10 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-8 h-36 w-36 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-rose-100/30 blur-3xl" />
      </div>

      <div className="relative mb-10 text-center md:mb-12">
        <div className="flex items-center justify-center gap-4">
          <span className="hidden h-px w-14 bg-gradient-to-r from-transparent to-orange-300 sm:block" />
          <span className="inline-flex items-center rounded-full border border-orange-200/80 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.34em] text-orange-700 shadow-sm backdrop-blur">
            How It Works
          </span>
          <span className="hidden h-px w-14 bg-gradient-to-l from-transparent to-orange-300 sm:block" />
        </div>
        <h2 className="relative mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          One platform, <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">two simple journeys</span>
        </h2>
        <div className="mt-6 flex justify-center">
          <div className="inline-flex rounded-[22px] border border-orange-200/80 bg-white/80 p-1.5 shadow-sm backdrop-blur">
            {workflows.map((workflow) => {
              const isActive = workflow.id === activeWorkflow.id

              return (
                <button
                  key={workflow.id}
                  type="button"
                  onClick={() => setActiveWorkflowId(workflow.id)}
                  className={[
                    'rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 md:px-5',
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-300/30'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600',
                  ].join(' ')}
                >
                  {workflow.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mx-auto mt-5 max-w-2xl rounded-[24px] border border-white/80 bg-white/75 px-5 py-4 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold text-gray-900 md:text-base">{activeWorkflow.title}</p>
          <p className="mt-1 text-sm leading-6 text-gray-600">{activeWorkflow.description}</p>
        </div>
      </div>

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-3">
        {activeWorkflow.steps.map((step, index) => {
          const Icon = step.icon

          return (
            <div
              key={`${activeWorkflow.id}-${step.number}`}
              className="flex flex-col gap-4 lg:flex-1 lg:flex-row lg:items-stretch"
            >
              <article
                className={[
                  'group relative flex-1 overflow-hidden rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur transition-transform duration-300 hover:-translate-y-1',
                  index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-10',
                ].join(' ')}
              >
                <div className="absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-300/40">
                    <Icon className="h-7 w-7" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-bold tracking-[0.24em] text-orange-600">
                      STEP {step.number}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold leading-snug text-gray-900 md:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-gray-600 md:text-[15px]">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs font-medium text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-orange-400" />
                  <span>Simple, direct, no-broker flow</span>
                </div>
              </article>

              {index < activeWorkflow.steps.length - 1 ? (
                <div className="flex items-center justify-center px-2 py-1 lg:px-0" aria-hidden="true">
                  <div className="relative h-8 w-14 lg:h-14 lg:w-8">
                    <span className="absolute left-1/2 top-1/2 h-5 w-9 -translate-x-[85%] -translate-y-1/2 rounded-full border-2 border-orange-300/90 bg-white/80 shadow-sm lg:h-9 lg:w-5 lg:-translate-x-1/2 lg:-translate-y-[85%]" />
                    <span className="absolute left-1/2 top-1/2 h-5 w-9 -translate-x-[15%] -translate-y-1/2 rounded-full border-2 border-orange-400/90 bg-orange-50/90 shadow-sm lg:h-9 lg:w-5 lg:-translate-x-1/2 lg:-translate-y-[15%]" />
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default HowItWorksSection
