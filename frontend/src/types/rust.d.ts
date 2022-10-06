/* This file is generated and managed by tsync */

type ID = number

type BigId = number

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
  id: BigId
  organization: string
  tournament: string
  fromdate: NaiveDate
  todate: NaiveDate
  venue: string
  city: string
  region: string
  country: string
  contact: string
  contactemail: string
  hide: boolean
  info: string | undefined
  created_at: UTC
  updated_at: UTC
}

interface TournamentChangeset {
  organization: string
  tournament: string
  fromdate: NaiveDate
  todate: NaiveDate
  venue: string
  city: string
  region: string
  country: string
  contact: string
  contactemail: string
  hide: boolean
  info: string | undefined
}

interface FileInfo {
  id: number
  key: string
  name: string
  url: string | undefined
}
