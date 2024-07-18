export type YCSortBy = "time" | "teamsize";

export type YCStatus = "All" | "Public" | "Inactive" | "Acquired"

export type YCSearchParams = {
  sort?: YCSortBy,
  status?: YCStatus
}
