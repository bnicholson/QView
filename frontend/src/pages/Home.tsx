import AddIcon from '@mui/icons-material/Add';
import { Button, Card, CardActions, CardContent, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react'
import { TournamentAPI } from '../containers/TournamentPage';
import { makeCancelable } from '../features/makeCancelable';
import { states } from '../features/states';
import { TournamentCardContent } from '../features/TournamentCardContent';
import { TournamentEditorDialog } from '../features/TournamentEditorDialog';

interface Props {

}

export const Home = (props: Props) => {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs())
  const [stopDate, setStopDate] = React.useState<Dayjs | null>(dayjs().add(1, 'month'))
  const [selectedCountry, setSelectedCountry] = React.useState<string>("USA")
  const [selectedRegion, setSelectedRegion] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [tournaments, setTournaments] = React.useState<Tournament[]>([])
  const [tournamentEditor, setTournamentEditor] = React.useState<{ isOpen: boolean, tournament: Tournament | undefined }>({ isOpen: false, tournament: undefined });
  const isUserAdmin = true;
  React.useEffect(() => {
    setIsLoading(true)
    const startMillis = startDate ? startDate.valueOf() : 0;
    const stopMillis = stopDate ? stopDate.valueOf() : dayjs().add(1, 'month').valueOf();
    const cancelable = makeCancelable(TournamentAPI.getByDate(startMillis, stopMillis));
    cancelable.promise
      .then((tournaments: Tournament[]) => {
        setTournaments(tournaments)
        setIsLoading(false)
      })
    return () => cancelable.cancel();
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
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10
        }}>
          {isUserAdmin && (
            <Card onClick={() => setTournamentEditor({ isOpen: true, tournament: undefined })}>
              <CardContent sx={{ alignItems: "center", display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
                <div style={{
                  alignItems: "center",
                  background: "#e5e5e5",
                  borderRadius: 40,
                  display: "flex",
                  height: 80,
                  justifyContent: "center",
                  width: 80
                }}>
                  <AddIcon fontSize="large" />
                </div>
                Create a New Tournament
              </CardContent>
            </Card>
          )}
          {isLoading ? (
            "Loading tournaments..."
          ) : (
            tournaments.map(tournament => (
              <Card key={tournament.tid} onClick={() => setTournamentEditor({ isOpen: true, tournament })}>
                <TournamentCardContent
                  sx={{
                    textAlign: "left",
                  }}
                  tournament={tournament}
                />
                {isUserAdmin && (
                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button size="small">Edit</Button>
                  </CardActions>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
      <TournamentEditorDialog
        initialTournament={tournamentEditor.tournament}
        isOpen={tournamentEditor.isOpen}
        onCancel={() => setTournamentEditor({ isOpen: false, tournament: undefined })}
        onSave={tournament => setTournaments(tournaments => tournaments.concat([tournament]))}
      />
    </div>
  )
}
