"use client"

import { CategoryBarCard } from "@/components/ui/overview/DashboardCategoryBarCard"
import { ChartCard } from "@/components/ui/overview/DashboardChartCard"
import { Filterbar } from "@/components/ui/overview/DashboardFilterbar"
import { ProgressBarCard } from "@/components/ui/overview/DashboardProgressBarCard"
import { useReviewMetricsData } from "@/lib/api"
import { ReviewTimeseriesMetrics } from "@/data/schema"
import { cx } from "@/lib/utils"
import { subDays, toDate } from "date-fns"
import React from "react"
import { DateRange } from "react-day-picker"

export type PeriodValue = "previous-period" | "last-year" | "no-comparison"

const categories: {
  title: keyof Omit<ReviewTimeseriesMetrics, "data">
  type: "unit" | "rating"
}[] = [
  {
    title: "Reviews submitted",
    type: "unit",
  },
  {
    title: "Reviews approved",
    type: "unit",
  },
  {
    title: "Reviews pending",
    type: "unit",
  },
  {
    title: "Reviews rejected",
    type: "unit",
  },
  {
    title: "Average rating",
    type: "rating",
  },
  {
    title: "5-star reviews",
    type: "unit",
  },
  {
    title: "Customer interactions",
    type: "unit",
  },
  {
    title: "Support escalations",
    type: "unit",
  },
]

export default function OverviewPage() {
  const { data: reviews, loading, error } = useReviewMetricsData()

  // Calculate max date from API data, fallback to current date
  const reviewsDates = reviews.map((item) => new Date(item.date).getTime())
  const maxDate =
    reviewsDates.length > 0 ? new Date(Math.max(...reviewsDates)) : new Date()

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
    if (reviews.length > 0) {
      const dates = reviews.map((item) => new Date(item.date).getTime())
      const newMaxDate = toDate(Math.max(...dates))
      setSelectedDates({
        from: subDays(newMaxDate, 30),
        to: newMaxDate,
      })
    }
  }, [reviews])

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

  const latestMetrics = reviews.length > 0 ? reviews[reviews.length - 1] : null
  const previousMetrics =
    reviews.length > 1 ? reviews[reviews.length - 2] : null

  return (
    <>
      <section aria-labelledby="overview-metrics">
        <h1
          id="overview-metrics"
          className="scroll-mt-10 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Overview metrics summary
        </h1>
        <div className="mt-4 grid grid-cols-1 gap-14 sm:mt-8 sm:grid-cols-2 lg:mt-10 xl:grid-cols-3">
          <ProgressBarCard
            title="Average Rating"
            change={
              latestMetrics && previousMetrics
                ? `${(latestMetrics["Average rating"] - previousMetrics["Average rating"]).toFixed(1)}`
                : "N/A"
            }
            value={
              latestMetrics
                ? `${latestMetrics["Average rating"].toFixed(1)}/5.0`
                : "0/5.0"
            }
            valueDescription="average customer rating"
            ctaDescription="Based on all customer review ratings."
            ctaText="View details"
            ctaLink="#"
            data={
              latestMetrics
                ? [
                    {
                      title: "Satisfaction Score",
                      percentage: (latestMetrics["Average rating"] / 5) * 100,
                      current: latestMetrics["Average rating"],
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
              latestMetrics && previousMetrics
                ? `${latestMetrics["Reviews submitted"] - previousMetrics["Reviews submitted"]}`
                : "N/A"
            }
            value={
              latestMetrics
                ? latestMetrics["Reviews submitted"].toString()
                : "0"
            }
            valueDescription="reviews submitted today"
            ctaDescription="Track daily review submission trends."
            ctaText="View trends"
            ctaLink="#"
            data={
              latestMetrics && previousMetrics
                ? [
                    {
                      title: "Reviews Today",
                      percentage:
                        (latestMetrics["Reviews submitted"] /
                          (previousMetrics["Reviews submitted"] || 1)) *
                        100,
                      current: latestMetrics["Reviews submitted"],
                      allowed: previousMetrics["Reviews submitted"] || 1,
                      unit: "",
                    },
                  ]
                : []
            }
          />
          <CategoryBarCard
            title="Review Activity"
            change={
              latestMetrics && previousMetrics
                ? `${latestMetrics["Reviews approved"] + latestMetrics["Reviews rejected"] - (previousMetrics["Reviews approved"] + previousMetrics["Reviews rejected"])}`
                : "N/A"
            }
            value={
              latestMetrics
                ? (
                    latestMetrics["Reviews approved"] +
                    latestMetrics["Reviews rejected"]
                  ).toString()
                : "0"
            }
            valueDescription="reviews processed today"
            subtitle="Activity breakdown"
            ctaDescription="Monitor review processing"
            ctaText="detailed analytics"
            ctaLink="#"
            data={
              latestMetrics
                ? [
                    {
                      title: "Approved",
                      percentage:
                        (latestMetrics["Reviews approved"] /
                          (latestMetrics["Reviews submitted"] || 1)) *
                        100,
                      value: latestMetrics["Reviews approved"].toString(),
                      color: "bg-green-600 dark:bg-green-500",
                    },
                    {
                      title: "Pending",
                      percentage:
                        (latestMetrics["Reviews pending"] /
                          (latestMetrics["Reviews submitted"] || 1)) *
                        100,
                      value: latestMetrics["Reviews pending"].toString(),
                      color: "bg-yellow-500 dark:bg-yellow-400",
                    },
                    {
                      title: "Rejected",
                      percentage:
                        (latestMetrics["Reviews rejected"] /
                          (latestMetrics["Reviews submitted"] || 1)) *
                        100,
                      value: latestMetrics["Reviews rejected"].toString(),
                      color: "bg-red-600 dark:bg-red-500",
                    },
                  ]
                : []
            }
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
            overviewData={reviews.map((item) => ({ ...item, date: item.date }))}
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
                  overviewData={reviews.map((item) => ({
                    ...item,
                    date: item.date,
                  }))}
                />
              )
            })}
        </dl>
      </section>
    </>
  )
}
