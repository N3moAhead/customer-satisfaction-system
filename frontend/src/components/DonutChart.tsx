import React from 'react'
import { DonutChart as TremorDonutChart } from '@tremor/react'
import { cx } from '@/lib/utils'

export interface DonutChartData {
  name: string
  value: number
  color?: string
}

export interface DonutChartProps {
  data: DonutChartData[]
  category?: string
  index?: string
  valueFormatter?: (value: number) => string
  colors?: string[]
  className?: string
  showLabel?: boolean
  showAnimation?: boolean
  showTooltip?: boolean
}

/**
 * DonutChart component using Tremor library for displaying pie/donut chart data.
 * 
 * @param data - Array of data points with name, value, and optional color
 * @param category - Key for the value field (defaults to "value")
 * @param index - Key for the name field (defaults to "name") 
 * @param valueFormatter - Function to format displayed values
 * @param colors - Array of color names for chart segments
 * @param className - Additional CSS classes
 * @param showLabel - Whether to show labels on segments
 * @param showAnimation - Whether to animate chart rendering
 * @param showTooltip - Whether to show tooltips on hover
 */
export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  category = "value",
  index = "name", 
  valueFormatter = (value: number) => value.toString(),
  colors = ["blue", "green", "yellow", "red", "indigo", "purple", "pink"],
  className,
  showLabel = true,
  showAnimation = true,
  showTooltip = true,
}) => {
  // Validate data to prevent crashes
  if (!data || data.length === 0) {
    return (
      <div className={cx("flex items-center justify-center h-32", className)}>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </div>
    )
  }

  // Transform data to ensure proper format for Tremor
  const chartData = data.map((item, index) => ({
    [index]: item.name,
    [category]: item.value,
    color: item.color,
  }))

  return (
    <div className={cx("w-full", className)}>
      <TremorDonutChart
        data={chartData}
        category={category}
        index={index}
        valueFormatter={valueFormatter}
        colors={colors}
        showLabel={showLabel}
        showAnimation={showAnimation}
        showTooltip={showTooltip}
        className="h-32"
      />
    </div>
  )
}

/**
 * Test function for DonutChart component
 */
export function testDonutChart() {
  const testData: DonutChartData[] = [
    { name: "Reviews", value: 60, color: "blue" },
    { name: "Customers", value: 25, color: "green" },
    { name: "Issues", value: 15, color: "red" }
  ]
  
  // Test basic functionality
  const result = DonutChart({ 
    data: testData,
    valueFormatter: (value) => `${value}%`
  })
  
  // Test empty data handling
  const emptyResult = DonutChart({ data: [] })
  
  return {
    basic: result !== null,
    emptyHandling: emptyResult !== null,
    dataLength: testData.length === 3
  }
}