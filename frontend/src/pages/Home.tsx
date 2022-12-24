import { Card, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react'
import { TournamentAPI } from '../containers/TournamentPage';
import { states } from '../features/states';

interface Props {

}

export const Home = (props: Props) => {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs())
  const [stopDate, setStopDate] = React.useState<Dayjs | null>(dayjs().add(1, 'month'))
  const [selectedCountry, setSelectedCountry] = React.useState<string>("")
  const [selectedRegion, setSelectedRegion] = React.useState<string>("USA")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [tournaments, setTournaments] = React.useState<Tournament[]>([])
  React.useEffect(() => {
    setIsLoading(true)
    const startMillis = startDate ? startDate.valueOf() : 0;
    const stopMillis = stopDate ? stopDate.valueOf() : dayjs().add(1, 'month').valueOf();
    TournamentAPI.getByDate(startMillis, stopMillis)
      .then((tournaments: Tournament[]) => {
        setTournaments(tournaments)
        setIsLoading(false)
      })
  }, [selectedCountry, selectedRegion, startDate, stopDate])
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          alignItems: "flex-start",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          marginLeft: "20px",
          marginRight: "20px",
          width: 650
        }}
      >
        <h1>
          Find a Tournament
        </h1>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: 20,
          width: "100%"
        }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={"Search Start Date"}
              inputFormat="MM/DD/YYYY"
              value={startDate}
              onChange={setStartDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{ flexGrow: 1, flexShrink: 1 }}
                />
              )}
            />
            <DatePicker
              label={"Search Stop Date"}
              inputFormat="MM/DD/YYYY"
              value={stopDate}
              onChange={setStopDate}
              renderInput={(params) => (
                <TextField {...params} sx={{ flexGrow: 1, flexShrink: 1 }} />
              )}
            />
          </LocalizationProvider>
        </div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: 20,
          width: "100%"
        }}>
          <FormControl sx={{ flexGrow: 1, flexShrink: 1 }}>
            <InputLabel htmlFor="home-tournament-filter-country">
              Tournament Country
            </InputLabel>
            <Select
              id="home-tournament-filter-country"
              label="Tournament Country"
              onChange={event => setSelectedCountry(event.target.value)}
              sx={{ textAlign: "left" }}
              value={selectedCountry}
            >
              <MenuItem value={"USA"}>
                United States of America
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ flexGrow: 1, flexShrink: 1 }}>
            <InputLabel htmlFor="home-tournament-filter-region">
              Tournament Region
            </InputLabel>
            <Select
              id="home-tournament-filter-region"
              label="Tournament Region"
              onChange={event => setSelectedRegion(event.target.value)}
              sx={{ textAlign: "left" }}
              value={selectedRegion}
            >
              {states.map(state => (
                <MenuItem key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          {isLoading ? (
            "Loading tournaments..."
          ) : (
            tournaments.map(tournament => (
              <Card key={tournament.tid}>
                <React.Fragment>
                  {`Organization: ${tournament.organization}`}
                  <br />
                  {`Venue: ${tournament.venue}`}
                  <br />
                  {`Location: ${tournament.city}, ${tournament.region}, ${tournament.country}`}
                  <br />
                  {`ShortInfo: ${tournament.shortinfo}`}
                </React.Fragment>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
