/* This file is generated and managed by tsync */

type ID = number

type BigId = number

type UTC = Date

interface PaginationParams {
  page: number
  page_size: number
}

interface Division {
  did: BigId
  tid: BigId
  dname: string
  breadcrumb: string
  hide: boolean
  shortinfo: string
  created_at: UTC
  updated_at: UTC
}

interface DivisionChangeset {
  dname: string
  tname: string
  breadcrumb: string
  hide: boolean
  shortinfo: string | undefined
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
  tid: BigId
  organization: string
  tname: string
  breadcrumb: string
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
  tname: string
  breadcrumb: string
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
