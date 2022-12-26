import React from 'react'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import { TournamentAPI } from '../containers/TournamentPage'
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
import { DatePickerComponent } from '../components/DatePickerComponent'
import { ConfirmDialog } from '../components/ConfirmDialog'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// {
//   "code": 200,
//   "message": "",
//   "data": {
//     "tid": 13,
//     "organization": "Nazarene",
//     "tname": "Boxing Day",
//     "breadcrumb": "",
//     "fromdate": "2022-12-26",
//     "todate": "2022-12-27",
//     "venue": "",
//     "city": "",
//     "region": "Michigan",
//     "country": "",
//     "contact": "somebody",
//     "contactemail": "@@@",
//     "hide": true,
//     "shortinfo": "",
//     "info": "",
//     "created_at": "2022-12-26T22:41:25.973816Z",
//     "updated_at": "2022-12-26T22:41:25.973816Z"
//   }
// }

const confirmDialogDefaultState = {
  isOpen: false,
  message: "",
  handleCancel: () => {},
  handleConfirm: () => {},
  title: ""
};

interface Props {
  isOpen: boolean;
  onCancel: VoidFunction;
  onSave: (tournament: Tournament) => void;
}

export const TournamentEditorDialog = (props: Props) => {
  const { isOpen, onCancel, onSave } = props;
  const [tournamentName, setTournamentName] = React.useState<string>("")
  const [venue, setVenue] = React.useState<string>("")
  const [org, setOrg] = React.useState<string>("Nazarene")
  const fromDateRef = React.useRef<Dayjs | null>(null)
  const toDateRef = React.useRef<Dayjs | null>(null)
  const [city, setCity] = React.useState<string>("")
  const [region, setRegion] = React.useState<string>("")
  const [country, setCountry] = React.useState<string>("")
  const [hide, setHide] = React.useState<string>("True");
  const [breadcrumb, setBreadcrumb] = React.useState<string>("")
  const [shortinfo, setShortInfo] = React.useState<string>("");
  const [info, setInfo] = React.useState<string>("");
  const [contact, setContact] = React.useState<string>("somebody");
  const [contactemail, setContactEmail] = React.useState<string>("@@@");
  const [alertopened, setAlertOpened] = React.useState(false);
  const [errormsg, setErrorMsg] = React.useState<string>("Simple error message");
  const [confirmDialog, setConfirmDialog] = React.useState(confirmDialogDefaultState);

  const openCancelDialog = () => setConfirmDialog({
    isOpen: true,
    message: "Any changes you've made to the tournament will be lost.",
    handleCancel: () => setConfirmDialog(confirmDialogDefaultState),
    handleConfirm: () => onCancel(),
    title: "Are you sure you want to cancel tournament edit?"
  });

  const handleTournamentEditorSave = async () => {
    if (!fromDateRef.current || !toDateRef.current || fromDateRef.current.isAfter(toDateRef.current)) {
      setErrorMsg("Invalid dates - please fill in appropriate dates");
      setAlertOpened(true);
      return;
    }

    let tournamentCS: TournamentChangeset = {
      organization: org,
      tname: tournamentName,
      breadcrumb: breadcrumb,
      fromdate: fromDateRef.current?.format("YYYY-MM-DD"),
      todate: toDateRef.current?.format("YYYY-MM-DD"),
      venue: venue,
      city: city,
      region: region,
      country: country,
      contact: contact,
      contactemail: contactemail,
      hide: true,
      shortinfo: shortinfo,
      info: info
    };

    // now send the data to the backend microservice
    const result = await TournamentAPI.create(tournamentCS).catch((err: any) => {
      setErrorMsg("Didn't save 1st - " + err);
      setAlertOpened(true);
      return;
    });

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
    handleConfirm: () => handleTournamentEditorSave(),
    title: "Save changes to the tournament?"
  });

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode == 'dark' ? '#1a2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

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
      <div className="form">
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
                    value={org}
                    onChange={(event) => {
                      setOrg(event.target.value as string);
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
                    value={tournamentName}
                    onChange={(event) => {
                      setTournamentName(event.target.value as string);
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
                    <DatePickerComponent
                      label="From Date"
                      setDay={(newValue) => { fromDateRef.current = newValue }}
                    />
                  </Item>
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Tournament End Date</InputLabel>
                  <Item >
                    <DatePickerComponent
                      label="To Date"
                      setDay={(newValue) => { toDateRef.current = newValue }}
                    />
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
                    value={venue}
                    onChange={(event) => {
                      setVenue(event.target.value as string);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel>Hide or Show this Tournament</InputLabel>
                  <Select
                    labelId='demo-simple-select-label55'
                    id="select-organization"
                    label="Hide"
                    value={hide}
                    onChange={(event) => {
                      setHide(event.target.value as string);
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
                    value={breadcrumb}
                    onChange={(event) => {
                      setBreadcrumb(event.target.value as string);
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
                    value={city}
                    onChange={(event) => {
                      setCity(event.target.value as string);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel>Region/State/Province</InputLabel>
                  <TextField
                    variant="outlined"
                    label="Region/State/Province:"
                    value={region}
                    onChange={(event) => {
                      setRegion(event.target.value as string);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputLabel>Country</InputLabel>
                  <TextField
                    variant="outlined"
                    label="Country"
                    value={country}
                    onChange={(event) => {
                      setCountry(event.target.value as string);
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <InputLabel>Contact </InputLabel>
                  <TextField
                    variant="outlined"
                    label="Contact"
                    value={contact}
                    onChange={(event) => {
                      setContact(event.target.value as string);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Contact Email</InputLabel>
                  <TextField
                    variant="outlined"
                    label="Contact Email"
                    value={contactemail}
                    onChange={(event) => {
                      setContactEmail(event.target.value as string);
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <InputLabel>One line of information about the tournament</InputLabel>
                  <TextField
                    variant="outlined"
                    label="Short Information"
                    value={shortinfo}
                    style={{ width: 900 }}
                    onChange={(event) => {
                      setShortInfo(event.target.value as string);
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
                      value={info}
                      onChange={(event) => {
                        setInfo(event.target.value as string);
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
      </div >
    </Dialog >
  )

}