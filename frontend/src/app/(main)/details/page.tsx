"use client"

import { columns } from "@/components/ui/data-table/columns"
import { DataTable } from "@/components/ui/data-table/DataTable"
import { useReviewsData } from "@/lib/api"

export default function DetailsPage() {
  const { data: reviews, loading, error } = useReviewsData()

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-gray-600 dark:text-gray-400">
          Loading reviews...
        </div>
      </div>
    )
  }

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
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Details
      </h1>
      <div className="mt-4 sm:mt-6 lg:mt-10">
        <DataTable data={reviews} columns={columns} />
      </div>
    </>
  )
}
