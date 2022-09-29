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

interface Tournament {
  id: ID
  organization: string
  tournament: string
  fromdate: UTC
  todate: UTC
  venue: string
  city: string
  region: string
  country: string
  contact: string
  contactemail: string
  hide: boolean
  info: string
  created_at: UTC
  updated_at: UTC
}

interface TournamentChangeset {
  organization: string
  tournament: string
  fromdate: UTC
  todate: UTC
  venue: string
  city: string
  region: string
  country: string
  contact: string
  contactemail: string
  hide: boolean
  info: string
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
