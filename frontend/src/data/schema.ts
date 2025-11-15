export type Usage = {
  owner: string
  status: string
  costs: number
  region: string
  stability: number
  lastEdited: string
}

export type OverviewData = {
  date: string
  "Rows written": number
  "Rows read": number
  Queries: number
  "Payments completed": number
  "Sign ups": number
  Logins: number
  "Sign outs": number
  "Support calls": number
}

export type ReviewTimeseriesMetrics = {
  date: string
  "Reviews submitted": number
  "Reviews approved": number
  "Reviews pending": number
  "Reviews rejected": number
  "Average rating": number
  "5-star reviews": number
  "Customer interactions": number
  "Support escalations": number
}
