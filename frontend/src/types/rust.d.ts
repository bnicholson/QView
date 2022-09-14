/* This file is generated and managed by tsync */

type ID = number

type UTC = Date

interface PaginationParams {
  page: number
  page_size: number
}

interface Todo {
  id: ID
  text: string
  created_at: UTC
  updated_at: UTC
}

interface TodoChangeset {
  text: string
}

interface FileInfo {
  id: number
  key: string
  name: string
  url: string | undefined
}

interface Todo {
  id: number
  text: string
  created_at: Date
  updated_at: Date
}

interface TodoJson {
  text: string
}
