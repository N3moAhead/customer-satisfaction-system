"use client"

import { CategoryBarCard } from "@/components/ui/overview/DashboardCategoryBarCard"
import { ChartCard } from "@/components/ui/overview/DashboardChartCard"
import { DonutCard } from "@/components/ui/overview/DonutCard"
import { Filterbar } from "@/components/ui/overview/DashboardFilterbar"
import { ProgressBarCard } from "@/components/ui/overview/DashboardProgressBarCard"
import { useOverviewData } from "@/lib/api"
import { OverviewData } from "@/data/schema"
import { usage } from "@/data/data"
import { cx } from "@/lib/utils"
import { subDays, toDate } from "date-fns"
import React from "react"
import { DateRange } from "react-day-picker"

export type PeriodValue = "previous-period" | "last-year" | "no-comparison"

const categories: {
  title: keyof OverviewData
  type: "currency" | "unit"
}[] = [
  {
    title: "Rows read",
    type: "unit",
  },
  {
    title: "Rows written",
    type: "unit",
  },
  {
    title: "Queries",
    type: "unit",
  },
  {
    title: "Payments completed",
    type: "currency",
  },
  {
    title: "Sign ups",
    type: "unit",
  },
  {
    title: "Logins",
    type: "unit",
  },
  {
    title: "Sign outs",
    type: "unit",
  },
  {
    title: "Support calls",
    type: "unit",
  },
]

export type KpiEntry = {
  title: string
  percentage: number
  current: number
  allowed: number
  unit?: string
}

export type KpiEntryExtended = Omit<
  KpiEntry,
  "current" | "allowed" | "unit"
> & {
  value: string
  color: string
}

export default function Overview() {
  const { data: overviews, loading, error } = useOverviewData()

  // Calculate max date from API data, fallback to current date
  const overviewsDates = overviews.map((item) => toDate(item.date).getTime())
  const maxDate =
    overviewsDates.length > 0 ? toDate(Math.max(...overviewsDates)) : new Date()

  const [selectedDates, setSelectedDates] = React.useState<
    DateRange | undefined
  >({
    from: subDays(maxDate, 30),
    to: maxDate,
  })
  const [selectedPeriod, setSelectedPeriod] =
    React.useState<PeriodValue>("last-year")

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    categories.map((category) => category.title),
  )

  // Update selected dates when data loads
  React.useEffect(() => {
    if (overviews.length > 0) {
      const dates = overviews.map((item) => toDate(item.date).getTime())
      const newMaxDate = toDate(Math.max(...dates))
      setSelectedDates({
        from: subDays(newMaxDate, 30),
        to: newMaxDate,
      })
    }
  }, [overviews])

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Loading dashboard data...
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-red-600 dark:text-red-400">
          Error loading data: {error.message}
        </div>
      </div>
    )
  }

  return (
    <>
      <section aria-labelledby="review-metrics">
        <h1
          id="review-metrics"
          className="scroll-mt-10 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Review metrics summary
        </h1>
        <div className="mt-4 grid grid-cols-1 gap-14 sm:mt-8 sm:grid-cols-2 lg:mt-10 xl:grid-cols-3">
          <ProgressBarCard
            title="Average Satisfaction"
            change={
              overviews && overviews.length > 1
                ? `${(
                    Math.max(
                      0,
                      overviews[overviews.length - 1]["Payments completed"] ||
                        0,
                    ) /
                      25 -
                    Math.max(
                      0,
                      overviews[overviews.length - 2]["Payments completed"] ||
                        0,
                    ) /
                      25
                  ).toFixed(1)}`
                : "N/A"
            }
            value={
              overviews && overviews.length > 0
                ? `${Math.min(5, Math.max(0, (overviews[overviews.length - 1]["Payments completed"] || 0) / 25)).toFixed(1)}/5.0`
                : "0/5.0"
            }
            valueDescription="average customer rating"
            ctaDescription="Based on all customer review ratings."
            ctaText="View details"
            ctaLink="#"
            data={
              overviews
                ? [
                    {
                      title: "Satisfaction Score",
                      percentage:
                        overviews.length > 0
                          ? Math.min(
                              100,
                              Math.max(
                                0,
                                ((overviews[overviews.length - 1][
                                  "Payments completed"
                                ] || 0) /
                                  25 /
                                  5) *
                                  100,
                              ),
                            )
                          : 0,
                      current:
                        overviews.length > 0
                          ? Math.min(
                              5,
                              Math.max(
                                0,
                                (overviews[overviews.length - 1][
                                  "Payments completed"
                                ] || 0) / 25,
                              ),
                            )
                          : 0,
                      allowed: 5,
                      unit: "★",
                    },
                  ]
                : []
            }
          />
          <ProgressBarCard
            title="Daily Reviews"
            change={
              overviews && overviews.length > 1
                ? `${Math.max(0, (overviews[overviews.length - 1]["Rows written"] || 0) - (overviews[overviews.length - 2]["Rows written"] || 0))}`
                : "N/A"
            }
            value={
              overviews && overviews.length > 0
                ? Math.max(
                    0,
                    overviews[overviews.length - 1]["Rows written"] || 0,
                  ).toString()
                : "0"
            }
            valueDescription="reviews submitted today"
            ctaDescription="Track daily review submission trends."
            ctaText="View trends"
            ctaLink="#"
            data={
              overviews
                ? [
                    {
                      title: "Reviews Today",
                      percentage:
                        overviews.length > 0 && overviews.length > 1
                          ? Math.min(
                              100,
                              Math.max(
                                0,
                                ((overviews[overviews.length - 1][
                                  "Rows written"
                                ] || 0) /
                                  Math.max(
                                    overviews[overviews.length - 2][
                                      "Rows written"
                                    ] || 0,
                                    1,
                                  )) *
                                  100,
                              ),
                            )
                          : 50,
                      current:
                        overviews.length > 0
                          ? Math.max(
                              0,
                              overviews[overviews.length - 1]["Rows written"] ||
                                0,
                            )
                          : 0,
                      allowed:
                        overviews.length > 1
                          ? Math.max(
                              overviews[overviews.length - 2]["Rows written"] ||
                                0,
                              1,
                            )
                          : 10,
                      unit: "",
                    },
                  ]
                : []
            }
          />
          <CategoryBarCard
            title="Review Activity"
            change={
              overviews && overviews.length > 1
                ? `${Math.max(0, (overviews[overviews.length - 1]["Sign ups"] || 0) - (overviews[overviews.length - 2]["Sign ups"] || 0))}`
                : "N/A"
            }
            value={
              overviews && overviews.length > 0
                ? Math.max(
                    0,
                    overviews[overviews.length - 1]["Sign ups"] || 0,
                  ).toString()
                : "0"
            }
            valueDescription="new customers today"
            subtitle="Activity breakdown"
            ctaDescription="Monitor customer engagement"
            ctaText="detailed analytics"
            ctaLink="#"
            data={
              overviews && overviews.length > 0
                ? [
                    {
                      title: "Reviews Submitted",
                      percentage: (overviews[overviews.length - 1]["Rows written"] || 0) > 0 ? 60 : 0,
                      value: Math.max(
                        0,
                        overviews[overviews.length - 1]["Rows written"] || 0,
                      ).toString(),
                      color: "bg-blue-600 dark:bg-blue-500",
                    },
                    {
                      title: "New Customers",
                      percentage: (overviews[overviews.length - 1]["Sign ups"] || 0) > 0 ? 25 : 0,
                      value: Math.max(
                        0,
                        overviews[overviews.length - 1]["Sign ups"] || 0,
                      ).toString(),
                      color: "bg-green-600 dark:bg-green-500",
                    },
                    {
                      title: "Escalations",
                      percentage: (overviews[overviews.length - 1]["Support calls"] || 0) > 0 ? 15 : 0,
                      value: Math.max(
                        0,
                        overviews[overviews.length - 1]["Support calls"] || 0,
                      ).toString(),
                      color: "bg-red-600 dark:bg-red-500",
                    },
                  ]
                : []
            }
          />
        </div>
      </section>
      <section aria-labelledby="current-billing-cycle">
        <h1
          id="current-billing-cycle"
          className="mt-16 scroll-mt-8 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Current Billing Cycle
        </h1>
        <div className="mt-4 grid grid-cols-1 gap-14 sm:mt-8 sm:grid-cols-2 lg:mt-10 xl:grid-cols-3">
          <ProgressBarCard
            title="Total Costs"
            change={usage && usage.length > 1 ? 
              `$${(usage.slice(-5).reduce((acc, u) => acc + u.costs, 0) - usage.slice(-10, -5).reduce((acc, u) => acc + u.costs, 0)).toFixed(2)}` : 
              "N/A"}
            value={usage && usage.length > 0 ? 
              `$${usage.slice(-5).reduce((acc, u) => acc + u.costs, 0).toFixed(2)}` : 
              "$0.00"}
            valueDescription="last 5 active projects"
            ctaDescription="View detailed billing breakdown and cost analysis."
            ctaText="View billing"
            ctaLink="#"
            data={usage ? [{
              title: "Current Costs",
              percentage: usage.length > 0 ? 
                Math.min(100, Math.max(0, (usage.slice(-5).reduce((acc, u) => acc + u.costs, 0) / 50000) * 100)) : 0,
              current: usage.length > 0 ? usage.slice(-5).reduce((acc, u) => acc + u.costs, 0) : 0,
              allowed: 50000,
              unit: "$"
            }] : []}
          />
          <ProgressBarCard
            title="System Stability"
            change={usage && usage.length > 1 ? 
              `${(usage.filter(u => u.status === 'live').reduce((acc, u) => acc + u.stability, 0) / Math.max(usage.filter(u => u.status === 'live').length, 1) - 
                 usage.filter(u => u.status === 'archived').reduce((acc, u) => acc + u.stability, 0) / Math.max(usage.filter(u => u.status === 'archived').length, 1)).toFixed(1)}%` : 
              "N/A"}
            value={usage && usage.length > 0 ? 
              `${(usage.filter(u => u.status === 'live').reduce((acc, u) => acc + u.stability, 0) / Math.max(usage.filter(u => u.status === 'live').length, 1)).toFixed(1)}%` : 
              "0%"}
            valueDescription="average uptime across active systems"
            ctaDescription="Monitor system health and performance metrics."
            ctaText="View monitoring"
            ctaLink="#"
            data={usage ? [{
              title: "Stability Score",
              percentage: usage.length > 0 ? 
                usage.filter(u => u.status === 'live').reduce((acc, u) => acc + u.stability, 0) / Math.max(usage.filter(u => u.status === 'live').length, 1) : 0,
              current: usage.length > 0 ? usage.filter(u => u.status === 'live').reduce((acc, u) => acc + u.stability, 0) / Math.max(usage.filter(u => u.status === 'live').length, 1) : 0,
              allowed: 100,
              unit: "%"
            }] : []}
          />
          <DonutCard
            title="Regional Distribution"
            change={usage && usage.length > 1 ? 
              `${usage.filter(u => u.status === 'live').length - usage.filter(u => u.status === 'archived').length}` : 
              "N/A"}
            value={usage && usage.length > 0 ? usage.filter(u => u.status === 'live').length.toString() : "0"}
            valueDescription="active deployments"
            subtitle="Distribution by region"
            ctaDescription="Manage regional infrastructure deployments"
            ctaText="view regions"
            ctaLink="#"
            data={usage && usage.length > 0 ? [
              {
                name: "US Regions",
                value: usage.filter(u => u.region.startsWith('US') && u.status === 'live').length,
                color: "blue"
              },
              {
                name: "EU Regions", 
                value: usage.filter(u => u.region.startsWith('EU') && u.status === 'live').length,
                color: "green"
              },
              {
                name: "Inactive",
                value: usage.filter(u => u.status !== 'live').length,
                color: "red"
              }
            ] : []}
          />
        </div>
      </section>
      <section aria-labelledby="usage-overview">
        <h1
          id="usage-overview"
          className="mt-16 scroll-mt-8 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Overview
        </h1>
        <div className="sticky top-16 z-20 flex items-center justify-between border-b border-gray-200 bg-white pb-4 pt-4 sm:pt-6 lg:top-0 lg:mx-0 lg:px-0 lg:pt-8 dark:border-gray-800 dark:bg-gray-950">
          <Filterbar
            maxDate={maxDate}
            minDate={new Date(2024, 0, 1)}
            selectedDates={selectedDates}
            onDatesChange={(dates) => setSelectedDates(dates)}
            selectedPeriod={selectedPeriod}
            onPeriodChange={(period) => setSelectedPeriod(period)}
            categories={categories}
            setSelectedCategories={setSelectedCategories}
            selectedCategories={selectedCategories}
            overviewData={overviews || []}
          />
        </div>
        <dl
          className={cx(
            "mt-10 grid grid-cols-1 gap-14 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {categories
            .filter((category) => selectedCategories.includes(category.title))
            .map((category) => {
              return (
                <ChartCard
                  key={category.title}
                  title={category.title}
                  type={category.type}
                  selectedDates={selectedDates}
                  selectedPeriod={selectedPeriod}
                  overviewData={overviews}
                />
              )
            })}
        </dl>
      </section>
    </>
  )
}
