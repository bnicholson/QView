/* This file is generated and managed by tsync */

interface ApiCalllog {
  created_at: UTC
  apicallid: BigId
  method: string
  uri: string
  version: string
  headers: string
}

interface ApiCalllogChangeset {
  method: string
  uri: string
  version: string
  headers: string
}

type ID = number

type BigId = number

type UTC = Date

interface PaginationParams {
  page: number
  page_size: number
}

interface SearchDateParams {
  from_date: number
  to_date: number
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
  breadcrumb: string
  hide: boolean
  shortinfo: string | undefined
}

interface Eventlog {
  evid: BigId
  created_at: UTC
  clientkey: string
  organization: string
  bldgroom: string
  tournament: string
  division: string
  room: string
  round: string
  question: number
  eventnum: number
  name: string
  team: number
  quizzer: number
  event: string
  parm1: string
  parm2: string
  ts: string
  clientip: string
  md5digest: string
  nonce: string
  s1s: string
}

interface EventlogChangeset {
  clientkey: string
  organization: string
  bldgroom: string
  tournament: string
  division: string
  room: string
  round: string
  question: number
  eventnum: number
  name: string
  team: number
  quizzer: number
  event: string
  parm1: string
  parm2: string
  ts: string
  clientip: string
  md5digest: string
  nonce: string
  s1s: string
}

interface Game {
  gid: BigId
  org: string
  tournament: string
  division: string
  room: string
  round: string
  clientkey: string
  ignore: boolean
  ruleset: string
}

interface GameChangeset {
  org: string
  tournament: string
  division: string
  room: string
  round: string
  clientkey: string
  ignore: boolean
  ruleset: string
}

interface QuizEvent {
  gid: BigId
  question: number
  eventnum: number
  name: string
  team: number
  quizzer: number
  event: string
  parm1: string
  parm2: string
  clientts: UTC
  serverts: UTC
  md5digest: string
}

interface QuizEventChangeset {
  name: string
  team: number
  quizzer: number
  event: string
  parm1: string
  parm2: string
  clientts: UTC
  serverts: UTC
  md5digest: string
}

interface Schedule {
  sid: BigId
  tid: BigId
  roundtime: UTC
  org: string
  tournament: string
  division: string
  room: string
  round: string
  team1: string
  team2: string
  team3: string
  quizmaster: string
  contentjudge: string
  scorekeeper: string
  stats: string
}

interface ScheduleChangeset {
  roundtime: UTC
  org: string
  tournament: string
  division: string
  room: string
  round: string
  team1: string
  team2: string
  team3: string
  quizmaster: string
  contentjudge: string
  scorekeeper: string
  stats: string
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
