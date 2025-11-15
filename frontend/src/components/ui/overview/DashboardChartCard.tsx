import { PeriodValue } from "@/app/(main)/overview/page"
import { Badge } from "@/components/Badge"
import { LineChart } from "@/components/LineChart"
import { cx, formatters, percentageFormatter } from "@/lib/utils"
import {
  eachDayOfInterval,
  formatDate,
  interval,
  isWithinInterval,
  isValid,
  subDays,
} from "date-fns"
import { DateRange } from "react-day-picker"
import { getPeriod } from "./DashboardFilterbar"

type ChartDataPoint = {
  date: string
  [key: string]: number | string
}

export type CardProps = {
  title: string
  type: "currency" | "unit" | "rating"
  selectedDates: DateRange | undefined
  selectedPeriod: PeriodValue
  overviewData: ChartDataPoint[]
  isThumbnail?: boolean
}

const formattingMap = {
  currency: formatters.currency,
  unit: formatters.unit,
  rating: (value: number) => (value ? value.toFixed(1) : "0.0"),
}

export const getBadgeType = (value: number) => {
  if (value > 0) {
    return "success"
  } else if (value < 0) {
    if (value < -50) {
      return "warning"
    }
    return "error"
  } else {
    return "neutral"
  }
}

export function ChartCard({
  title,
  type,
  selectedDates,
  selectedPeriod,
  overviewData,
  isThumbnail,
}: CardProps) {
  const formatter = formattingMap[type]

  let effectiveSelectedDates = selectedDates
  if (
    !effectiveSelectedDates ||
    !effectiveSelectedDates.from ||
    !effectiveSelectedDates.to ||
    !isValid(effectiveSelectedDates.from) ||
    !isValid(effectiveSelectedDates.to)
  ) {
    const to = new Date()
    const from = subDays(to, 30)
    effectiveSelectedDates = { from, to }
  }

  const selectedDatesInterval =
    effectiveSelectedDates?.from && effectiveSelectedDates?.to
      ? interval(effectiveSelectedDates.from, effectiveSelectedDates.to)
      : null
  const allDatesInInterval =
    effectiveSelectedDates?.from && effectiveSelectedDates?.to
      ? eachDayOfInterval(
          interval(effectiveSelectedDates.from, effectiveSelectedDates.to),
        )
      : null
  const prevDates = getPeriod(effectiveSelectedDates, selectedPeriod)

  const prevDatesInterval =
    prevDates?.from &&
    prevDates?.to &&
    isValid(prevDates.from) &&
    isValid(prevDates.to)
      ? interval(prevDates.from, prevDates.to)
      : null

  const data = overviewData
    .filter((overview) => {
      if (selectedDatesInterval) {
        const date = new Date(overview.date)
        return isValid(date) && isWithinInterval(date, selectedDatesInterval)
      }
      return true
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const prevData = overviewData
    .filter((overview) => {
      if (prevDatesInterval) {
        const date = new Date(overview.date)
        return isValid(date) && isWithinInterval(date, prevDatesInterval)
      }
      return false
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const chartData = allDatesInInterval
    ?.map((date, index) => {
      const overview = data[index]
      const prevOverview = prevData[index]
      const value = (overview?.[title] as number) || null
      const previousValue = (prevOverview?.[title] as number) || null

      return {
        title,
        date: date,
        formattedDate: formatDate(date, "dd/MM/yyyy"),
        value,
        previousDate: prevOverview?.date,
        previousFormattedDate: prevOverview
          ? formatDate(new Date(prevOverview.date), "dd/MM/yyyy")
          : null,
        previousValue:
          selectedPeriod !== "no-comparison" ? previousValue : null,
        evolution:
          selectedPeriod !== "no-comparison" && value && previousValue
            ? (value - previousValue) / previousValue
            : undefined,
      }
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const categories =
    selectedPeriod === "no-comparison" ? ["value"] : ["value", "previousValue"]
  const value =
    chartData?.reduce((acc, item) => acc + (item.value || 0), 0) || 0
  const previousValue =
    chartData?.reduce((acc, item) => acc + (item.previousValue || 0), 0) || 0
  const evolution =
    selectedPeriod !== "no-comparison"
      ? (value - previousValue) / previousValue
      : 0

  return (
    <div className={cx("transition")}>
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex items-center gap-x-2">
          <dt className="font-bold text-gray-900 sm:text-sm dark:text-gray-50">
            {title}
          </dt>
          {selectedPeriod !== "no-comparison" && (
            <Badge variant={getBadgeType(evolution)}>
              {percentageFormatter(evolution)}
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <dd className="text-xl text-gray-900 dark:text-gray-50">
          {formatter(value)}
        </dd>
        {selectedPeriod !== "no-comparison" && (
          <dd className="text-sm text-gray-500">
            from {formatter(previousValue)}
          </dd>
        )}
      </div>
      <LineChart
        className="mt-6 h-32"
        data={chartData || []}
        index="formattedDate"
        colors={["indigo", "gray"]}
        startEndOnly={true}
        valueFormatter={(value) => formatter(value as number)}
        showYAxis={false}
        showLegend={false}
        categories={categories}
        showTooltip={isThumbnail ? false : true}
        autoMinValue
      />
    </div>
  )
}
