import { useState, useEffect } from "react"
import type { Review, ReviewTimeseriesMetrics } from "@/data/schema"

/**
 * Base API configuration
 */
const API_BASE_URL = "http://localhost:2509"

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

export async function fetchReviews(): Promise<Review[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reviews`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    const data: Review[] = result.success ? result.data.reviews : result

    if (!Array.isArray(data)) {
      throw new Error("Failed to fetch reviews")
    }

    return data
  } catch (err) {
    console.error("Failed to fetch reviews", err)
    throw err
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

export function useReviewsData() {
  const [data, setData] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchReviews()
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
