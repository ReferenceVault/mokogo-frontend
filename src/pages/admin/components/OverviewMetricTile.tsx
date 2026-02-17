import type { ReactNode } from 'react'

interface OverviewMetricTileProps {
  icon: ReactNode
  iconBgClass: string
  label: string
  value: ReactNode
  subtitle?: string
  valueClassName?: string
}

/** Reusable metric tile for Overview to avoid repeated markup. */
export function OverviewMetricTile({
  icon,
  iconBgClass,
  label,
  value,
  subtitle,
  valueClassName = 'text-gray-900',
}: OverviewMetricTileProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 text-center">
      <div className="flex justify-center mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgClass}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-600 mb-1">{label}</p>
        <p className={`text-2xl font-bold mb-1 ${valueClassName}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  )
}
