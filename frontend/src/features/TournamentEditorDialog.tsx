import React from 'react'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import { TournamentAPI, TournamentCreateUpdateResult, TournamentTS } from '../features/TournamentAPI'
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import TextField from '@mui/material/TextField'
import { Dayjs } from 'dayjs'
import AppBar from '@mui/material/AppBar'
import Dialog from '@mui/material/Dialog'
import Toolbar from '@mui/material/Toolbar'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const confirmDialogDefaultState = {
  isOpen: false,
  message: "",
  handleCancel: () => {},
  handleConfirm: () => {},
  title: ""
};

interface TournamentChangesetTS extends Omit<TournamentChangeset, "fromdate" | "todate"> {
  fromdate: Dayjs | null;
  todate: Dayjs | null;
}

const tournamentEmptyState: TournamentChangesetTS = {
  breadcrumb: "",
  city: "",
  contact: "somebody",
  contactemail: "@@@",
  country: "",
  fromdate: null,
  hide: true,
  info: "",
  organization: "Nazarene",
  region: "",
  shortinfo: "",
  tname: "",
  todate: null,
  venue: ""
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode == 'dark' ? '#1a2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface Props {
  initialTournament?: TournamentTS;
  isOpen: boolean;
  onCancel: VoidFunction;
  onSave: (tournament: TournamentTS) => void;
}

export const TournamentEditorDialog = (props: Props) => {
  const { initialTournament, isOpen, onCancel, onSave } = props;
  const [tournament, setTournament] = React.useState<TournamentChangesetTS>(initialTournament ? initialTournament : tournamentEmptyState);
  const [alertopened, setAlertOpened] = React.useState(false);
  const [errormsg, setErrorMsg] = React.useState<string>("Simple error message");
  const [confirmDialog, setConfirmDialog] = React.useState(confirmDialogDefaultState);

  /** Call this whenever the tournament editor is closed. */
  const resetState = () => {
    setTournament(tournamentEmptyState);
    setConfirmDialog(confirmDialogDefaultState);
    setErrorMsg("Simple error message");
  };

  // If the initial tournament changes, set or clear the initial fields.
  React.useEffect(() => {
    if (initialTournament !== undefined) {
      setTournament(initialTournament);
    } else {
      setTournament(tournamentEmptyState);
    }
  }, [initialTournament])

  const openCancelDialog = () => {
    if (tournament == initialTournament || tournament == tournamentEmptyState) {
      onCancel();
      resetState();
    } else {
      setConfirmDialog({
        isOpen: true,
        message: "Any changes you've made to the tournament will be lost.",
        handleCancel: () => setConfirmDialog(confirmDialogDefaultState),
        handleConfirm: () => { onCancel(); resetState(); },
        title: "Are you sure you want to cancel tournament edit?"
      })
    }
  };

  const handleTournamentEditorSave = async () => {
    if (!tournament.fromdate || !tournament.todate || tournament.fromdate.isAfter(tournament.todate)) {
      setErrorMsg("Invalid dates - please fill in appropriate dates");
      setAlertOpened(true);
      return;
    }

    let tournamentCS: TournamentChangeset = {
      organization: tournament.organization,
      tname: tournament.tname,
      breadcrumb: tournament.breadcrumb,
      fromdate: tournament.fromdate?.format("YYYY-MM-DD"),
      todate: tournament.todate?.format("YYYY-MM-DD"),
      venue: tournament.venue,
      city: tournament.city,
      region: tournament.region,
      country: tournament.country,
      contact: tournament.contact,
      contactemail: tournament.contactemail,
      hide: true,
      shortinfo: tournament.shortinfo,
      info: tournament.info
    };

    // now send the data to the backend microservice
    let result: TournamentCreateUpdateResult;
    try {
      result = initialTournament
        ? await TournamentAPI.update(initialTournament.tid, tournamentCS)
        : await TournamentAPI.create(tournamentCS);
    } catch(err: any) {
      setErrorMsg("Didn't save 1st - " + err);
          setAlertOpened(true);
          return;
    }

    // make sure we had a successful
    if ((result.code < 200) || (result.code > 209)) {
      setErrorMsg(result.message + " " + result.code);
      setAlertOpened(true);
      return;
    }
    console.log(result);
    setErrorMsg("Tournament Saved");
    onSave(result.data);
  };

  const openSaveDialog = () => setConfirmDialog({
    isOpen: true,
    message: "Cancel if you want to make more changes.",
    handleCancel: () => setConfirmDialog(confirmDialogDefaultState),
    handleConfirm: () => { handleTournamentEditorSave(); resetState(); },
    title: "Save changes to the tournament?"
  });

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={openCancelDialog}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={openCancelDialog}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Tournament Settings
          </Typography>
          <Button autoFocus color="inherit" onClick={openSaveDialog}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="form">
        <Collapse in={alertopened}>
          <Alert severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertOpened(false);
                }}
              >

                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            <AlertTitle>Error</AlertTitle>
            {errormsg} Close me!
          </Alert>
        </Collapse>
        <List>
          <ListItem>
            <Grid container>
              <Grid item xs={6} >
                <InputLabel>Organization</InputLabel>
                <Select
                  labelId='demo-simple-select-label55'
                  id="select-organization"
                  label="Organization"
                  value={tournament.organization}
                  onChange={(event) => {
                    setTournament(state => ({ ...state, organization: event.target.value as string }));
                  }}
                >
                  <MenuItem value={"Nazarene"}>Nazarene</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Tournament Name ( must be unique)</InputLabel>
                <TextField
                  variant="outlined"
                  label="Tournament Name"
                  value={tournament.tname}
                  onChange={(event) => {
                    setTournament(state => ({ ...state, tname: event.target.value as string }));
                  }}
                />
              </Grid>
              <Grid item xs={6}>

              </Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid container>
              <Grid item xs={6} md={4}>
                <InputLabel>Tournament Start Date</InputLabel>
                <Item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="From Date"
                      inputFormat="MM/DD/YYYY"
                      value={tournament.fromdate}
                      onChange={fromdate => setTournament(state => ({ ...state, fromdate }))}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Item>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Tournament End Date</InputLabel>
                <Item >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      label="To Date"
                      inputFormat="MM/DD/YYYY"
                      value={tournament.todate}
                      onChange={todate => setTournament(state => ({ ...state, todate }))}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Item>
              </Grid>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid container>
              <Grid item xs={4}>
                <InputLabel>Venue</InputLabel>
                <TextField
                  variant="outlined"
                  label="Venue"
                  value={tournament.venue}
                  onChange={(event) => {
                    setTournament(state => ({ ...state, venue: event.target.value as string }));
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <InputLabel>Hide or Show this Tournament</InputLabel>
                <Select
                  labelId='demo-simple-select-label55'
                  id="select-organization"
                  label="Hide"
                  value={tournament.hide ? "True" : "False"}
                  onChange={(event) => {
                    setTournament(state => ({ ...state, hide: event.target.value === "True" }));
                  }}
                >
                  <MenuItem value={"True"}>Hide</MenuItem>
                  <MenuItem value={"False"}>Show to public</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={4}>
                <InputLabel>Breadcrumb (short url name)</InputLabel>
                <TextField
                  variant="outlined"
                  label="Breadcrumb"
                  value={tournament.breadcrumb}
                  onChange={(event) => {
                    setTournament(state => ({ ...state, breadcrumb: event.target.value as string }));
                  }}
                />
              </Grid>

            </Grid>
          </ListItem>
          <ListItem>
            <Grid container>
              <Grid item xs={4}>
                <InputLabel>City</InputLabel>
                <TextField
                  variant="outlined"
                  label="City"
                  value={tournament.city}
                  onChange={(event) => {
                    setTournament(state => ({ ...state, city: event.target.value as string }));
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <InputLabel>Region/State/Province</InputLabel>
                <TextField
                  variant="outlined"
                  label="Region/State/Province:"
                  value={tournament.region}
                  onChange={(event) => {
                    setTournament(state => ({ ...state, region: event.target.value as string }));
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <InputLabel>Country</InputLabel>
                <TextField
                  variant="outlined"
                  label="Country"
                  value={tournament.country}
                  onChange={(event) => {
                    setTournament(state => ({ ...state, country: event.target.value as string }));
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <InputLabel>Contact </InputLabel>
                <TextField
                  variant="outlined"
                  label="Contact"
                  value={tournament.contact}
                  onChange={(event) => {
                    setTournament(state => ({ ...state, contact: event.target.value as string }));
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Contact Email</InputLabel>
                <TextField
                  variant="outlined"
                  label="Contact Email"
                  value={tournament.contactemail}
                  onChange={(event) => {
                    setTournament(state => ({ ...state, contactemail: event.target.value as string }));
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel>One line of information about the tournament</InputLabel>
                <TextField
                  variant="outlined"
                  label="Short Information"
                  value={tournament.shortinfo}
                  style={{ width: 900 }}
                  onChange={(event) => {
                    setTournament(state => ({ ...state, shortinfo: event.target.value as string }));
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <InputLabel>Detailed Information.</InputLabel>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={12}
                    placeholder="Minimum 3 rows"
                    style={{ width: 900 }}
                    value={tournament.info}
                    onChange={(event) => {
                      setTournament(state => ({ ...state, info: event.target.value as string }));
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </Box>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onCancel={confirmDialog.handleCancel}
        onConfirm={confirmDialog.handleConfirm}
        title={confirmDialog.title}
      />
    </Dialog >
  )
};
