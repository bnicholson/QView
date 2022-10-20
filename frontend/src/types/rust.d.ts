/* This file is generated and managed by tsync */

type ID = number

type BigId = number

type UTC = Date

interface PaginationParams {
  page: number
  page_size: number
}

interface Game {
  tdrri: Uuid
  org: string
  tournament: string
  division: string
  room: string
  round: string
  key4server: string | undefined
  ignore: boolean | undefined
  ruleset: string | undefined
}

interface GameChangeset {
  org: string
  tournament: string
  division: string
  room: string
  round: string
  key4server: string | undefined
  ignore: boolean | undefined
  ruleset: string | undefined
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
  shortinfo: string
  info: string
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
  contactemail: string | undefined
  hide: boolean
  info: string | undefined
}

interface FileInfo {
  id: number
  key: string
  name: string
  url: string | undefined
}
