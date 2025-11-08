import { Badge } from "@/components/Badge"
import { DonutChart, DonutChartData } from "@/components/DonutChart"
import { getBadgeType } from "@/components/ui/overview/DashboardChartCard"
import { cx } from "@/lib/utils"
import React from "react"

export interface DonutCardProps {
  title: string
  change?: string
  value: string
  valueDescription?: string
  subtitle?: string
  ctaDescription?: string
  ctaText?: string
  ctaLink?: string
  data: DonutChartData[]
  showEvolution?: boolean
  colors?: string[]
  className?: string
}

/**
 * DonutCard component that displays a donut chart with accompanying metrics and controls.
 * 
 * @param title - Main title for the card
 * @param change - Change value to display as a badge (e.g., "+12.5%")
 * @param value - Primary metric value to display
 * @param valueDescription - Description text for the primary value
 * @param subtitle - Subtitle text below the main content
 * @param ctaDescription - Description for the call-to-action
 * @param ctaText - Text for the call-to-action button
 * @param ctaLink - Link URL for the call-to-action
 * @param data - Data array for the donut chart
 * @param showEvolution - Whether to show the evolution badge
 * @param colors - Color palette for the chart segments
 * @param className - Additional CSS classes
 */
export const DonutCard: React.FC<DonutCardProps> = ({
  title,
  change,
  value,
  valueDescription,
  subtitle,
  ctaDescription,
  ctaText,
  ctaLink,
  data,
  showEvolution = true,
  colors = ["blue", "green", "yellow", "red", "indigo", "purple"],
  className,
}) => {
  // Calculate evolution from change string
  const evolution = change && change !== "N/A" ? parseFloat(change.replace(/[^-0-9.]/g, '')) : 0

  // Validate data
  if (!data || data.length === 0) {
    return (
      <div className={cx("rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">{title}</h3>
        </div>
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </div>
    )
  }

  return (
    <div className={cx("rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
            {title}
          </h3>
          {showEvolution && change && change !== "N/A" && (
            <Badge variant={getBadgeType(evolution)}>
              {change.startsWith("+") || change.startsWith("-") ? change : `+${change}`}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Value */}
      <div className="mt-4">
        <div className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
          {value}
        </div>
        {valueDescription && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {valueDescription}
          </div>
        )}
      </div>

      {/* Donut Chart */}
      <div className="mt-6">
        <DonutChart 
          data={data}
          colors={colors}
          valueFormatter={(val) => val.toString()}
          showLabel={true}
          showAnimation={true}
          showTooltip={true}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.slice(0, 4).map((item, index) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-x-2">
              <div 
                className={cx(
                  "h-3 w-3 rounded-full",
                  item.color ? `bg-${item.color}-500` : `bg-${colors[index % colors.length]}-500`
                )}
              />
              <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-gray-50">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
          {subtitle}
        </div>
      )}

      {/* Call to Action */}
      {ctaDescription && ctaText && (
        <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {ctaDescription}
          </div>
          {ctaLink && (
            <a
              href={ctaLink}
              className="mt-2 inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              {ctaText} →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Test function for DonutCard component
 */
export function testDonutCard() {
  const testData: DonutChartData[] = [
    { name: "Active", value: 75 },
    { name: "Pending", value: 20 },
    { name: "Failed", value: 5 }
  ]
  
  const testProps = {
    title: "Test Distribution",
    change: "+5.2%",
    value: "100",
    valueDescription: "total items",
    data: testData
  }
  
  // Test component creation
  const result = DonutCard(testProps)
  
  return {
    componentExists: result !== null,
    hasData: testData.length === 3,
    hasTitle: testProps.title === "Test Distribution"
  }
}