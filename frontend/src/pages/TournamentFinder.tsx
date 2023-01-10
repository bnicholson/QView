import AddIcon from '@mui/icons-material/Add';
import { Button, Card, CardActions, CardContent, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setTid, setTournament } from '../breadcrumb';
import { TournamentAPI, TournamentTS } from '../features/TournamentAPI';
import { makeCancelable } from '../features/makeCancelable';
import { states } from '../features/states';
import { TournamentCardContent } from '../features/TournamentCardContent';
import { TournamentEditorDialog } from '../features/TournamentEditorDialog';

interface Props {

}

/**
 * This renders a tournament finder and tournament editor and serves as the main component for the
 * home page.
 */
export const TournamentFinder = (props: Props) => {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs())
  const [stopDate, setStopDate] = React.useState<Dayjs | null>(dayjs().add(1, 'month'))
  const [selectedCountry, setSelectedCountry] = React.useState<string>("USA")
  const [selectedRegion, setSelectedRegion] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [tournaments, setTournaments] = React.useState<TournamentTS[]>([])
  const [tournamentEditor, setTournamentEditor] = React.useState<{ isOpen: boolean, tournament: TournamentTS | undefined }>({ isOpen: false, tournament: undefined });
  const isUserAdmin = true;
  const dispatcher = useAppDispatch();
  const navigate = useNavigate();
  const openTournament = (tournament: TournamentTS) => {
    dispatcher(setTournament(tournament.tname));
    dispatcher(setTid(tournament.tid));
    navigate("/division");
  }
  const closeTournamentEditor = () => setTournamentEditor({ isOpen: false, tournament: undefined });
  React.useEffect(() => {
    setIsLoading(true)
    const startMillis = startDate ? startDate.valueOf() : 0;
    const stopMillis = stopDate ? stopDate.valueOf() : dayjs().add(1, 'month').valueOf();
    const cancelable = makeCancelable(TournamentAPI.getByDate(startMillis, stopMillis));
    cancelable.promise
      .then((tournaments: TournamentTS[]) => {
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
              <Card key={tournament.tid}>
                <TournamentCardContent onClick={() => openTournament(tournament)} tournament={tournament} />
                {isUserAdmin && (
                  <CardActions sx={{ justifyContent: "flex-end" }}>
                    <Button onClick={() => setTournamentEditor({ isOpen: true, tournament })} size="small">
                      Edit
                    </Button>
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
        onCancel={closeTournamentEditor}
        onSave={tournament => {
          closeTournamentEditor();
          if (tournamentEditor.tournament === undefined) {
            setTournaments(tournaments => tournaments.concat([tournament]));
          } else {
            setTournaments(state => {
              const index = state.findIndex(t => t.tid === tournament.tid);
              state[index] = tournament;
              return state;
            })
          }
        }}
      />
    </div>
  )
}
