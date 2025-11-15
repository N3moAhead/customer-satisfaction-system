import { useState, useEffect } from "react"
import type { OverviewData, ReviewTimeseriesMetrics } from "@/data/schema"

/**
 * Base API configuration
 */
const API_BASE_URL = "http://localhost:2509"

/**
 * Fetches overview/metrics data from the backend API
 *
 * @returns Promise<OverviewData[]> Array of overview data points with dates and metrics
 * @throws Error if the API request fails
 *
 * @example
 * const data = await fetchOverviewData()
 * console.log(data) // [{ date: "2023-01-01T00:00:00", "Rows written": 5, ... }]
 */
export async function fetchOverviewData(): Promise<OverviewData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/metrics`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    // Handle API response wrapper format
    const data: OverviewData[] = result.success ? result.data : result

    // Validate that we received an array
    if (!Array.isArray(data)) {
      throw new Error("Expected array of overview data")
    }

    return data
  } catch (error) {
    console.error("Failed to fetch overview data:", error)
    throw error
  }
}

export async function fetchReviewMetrics(): Promise<ReviewTimeseriesMetrics[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/metrics/timeseries`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    const data: ReviewTimeseriesMetrics[] = result.success
      ? result.data
      : result

    if (!Array.isArray(data)) {
      throw new Error("Faild to fetch review metrics time series")
    }

    return data
  } catch (err) {
    console.error("Failed to fetch overview data", err)
    throw err
  }
}

/**
 * React hook for fetching overview data with loading and error states
 *
 * @returns Object with data, loading, error, and refetch function
 *
 * @example
 * const { data, loading, error, refetch } = useOverviewData()
 * if (loading) return <div>Loading...</div>
 * if (error) return <div>Error: {error.message}</div>
 * return <div>{data.length} records loaded</div>
 */
export function useOverviewData() {
  const [data, setData] = useState<OverviewData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchOverviewData()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on mount
  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  }
}

export function useReviewMetricsData() {
  const [data, setData] = useState<ReviewTimeseriesMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchReviewMetrics()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}
