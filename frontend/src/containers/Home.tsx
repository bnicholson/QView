
import React from 'react'
import { useState, useEffect } from 'react'
import { createTheme, styled } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import Card from "@mui/material/Card"
import CardHeader from '@mui/material/CardHeader'
import CardMedia from "@mui/material/CardMedia"
import CardContent from "@mui/material/CardContent"
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Fab from '@mui/material/Fab'
import AddIcon from "@mui/icons-material/Add"
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import { TournamentAPI } from './TournamentPage'
import { Route, useNavigate, Routes, Form } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SettingsIcon from '@mui/icons-material/Settings';
import { selectDisplayDate, selectTournament, setDisplayDate, setTournament, toggleIsOn } from '../breadcrumb'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import AppBar from '@mui/material/AppBar'
import Dialog from '@mui/material/Dialog'
import Toolbar from '@mui/material/Toolbar'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import TextareaAutosize from '@mui/material/TextareaAutosize';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


//const add31Days = (theDate: Date): Date => {
//  theDate.setTime(theDate.getTime() + (31 * 24 * 3600 * 1000));
//  return (theDate);
//}

export const Home = () => {
  const [expanded, setExpanded] = React.useState(false)
  const [processing, setProcessing] = React.useState<boolean>(false)
  const [tournaments, setTournaments] = React.useState<Tournament[]>([])

  const navigate = useNavigate();

  var displayDate = useAppSelector((state) => state.breadCrumb.displayDate);
  const tournament = useAppSelector((state) => state.breadCrumb.tournament);
  const dispatcher = useAppDispatch();

  const subtract31Days = () => {
    displayDate = displayDate - (31 * 24 * 3600 * 1000);
    dispatcher(setDisplayDate(displayDate));
  }

  const add31Days = () => {
    displayDate = displayDate + (31 * 24 * 3600 * 1000);
    dispatcher(setDisplayDate(displayDate));
  }

  console.log("Display Date = " + displayDate + " Tournament is " + tournament);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setProcessing(true)
    TournamentAPI.getByDate(displayDate, (displayDate + (31 * 24 * 3600 * 1000))).then((tournaments: Tournament[]) => {
      setTournaments(tournaments)
      setProcessing(false)
    })
    console.log("In useeffect - pulling from api " + displayDate)
  }, [displayDate])

  const fromDate = new Date();
  fromDate.setTime(displayDate);
  const toDate = new Date();
  toDate.setTime(displayDate + (31 * 24 * 3600 * 1000));

  const [openTournamentEditor, setTournamentEditorOpen] = React.useState(false);

  const handleTournamentEditorClickOpen = () => {
    setTournamentEditorOpen(true);
  };

  return (
    // Okay here's where I have to go get the tournaments starting at some
    // page and page_size.   We start at by displaying all the tournaments
    // that end 30 days before today and 30 days after today.   I need to change
    // the API to not worry abut page size and page.  This is more date based.
    <div>
      <Fab color="primary" onClick={() => handleTournamentEditorClickOpen()} aria-label="Add Tournament">
        <AddIcon />
      </Fab>
      <div className="Form">
        <div style={{ display: 'flex' }}>
          <button onClick={() => subtract31Days()}>{` << Previous Month`}</button>
          <span style={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h5">
              {fromDate.toLocaleDateString()} - {toDate.toLocaleDateString()}
            </Typography>
          </span>
          <button
            disabled={processing}
            onClick={() => add31Days()}
          >{`Next Month >>`}</button>
        </div>
      </div>
      <div className="Form">
        {tournaments.map((tournament, index) =>
          <Card style={{ maxWidth: 845 }} key={tournament.tname}
            onClick={() => {
              dispatcher(setTournament(tournament.tname));
              navigate("/division")
            }} >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="tournament">
                  M
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <SettingsIcon />
                </IconButton>
              }
              title={<Typography variant="h5">{tournament.tname}</Typography>}
              subheader={<Typography variant="h6"> {tournament.fromdate} - {tournament.todate}</Typography>}
            />
            <Box sx={{ display: 'flex' }}>
              <CardMedia
                component="img"
                sx={{ width: 200 }}
                height="200"
                image="../images/promo.jpg"
                alt="Kentucky Promo picture"
              />
              <CardContent>
                <Typography align="left" variant="body1" color="text.primary" >
                  <div>
                    Contact: {tournament.contact} Email:{tournament.contactemail}<br />
                    Organization: {tournament.organization}<br />
                    Venue: {tournament.venue}<br />
                    Location: {tournament.city}, {tournament.region}, {tournament.country}<br />
                    ShortInfo: {tournament.shortinfo}
                    <br />
                    ID: {tournament.tid}<br />
                    Hidden: {tournament.hide}<br />
                    Originally created: {tournament.created_at} <br />
                    Last Update: {tournament.updated_at}
                    breadcrumbs.tournament  --- not working correctly - why?
                  </div>
                </Typography>
              </CardContent>
            </Box>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <Typography>33</Typography>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph>
                  {tournament.info}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        )}
      </div>
      <div>
        <div className="Form">
          <div style={{ display: 'flex' }}>
            <button onClick={() => subtract31Days()}>{`<< Previous Month`}</button>
            <span style={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h5">
                {fromDate.toLocaleDateString()}  - {toDate.toLocaleDateString()}
              </Typography>
            </span>
            <button
              disabled={processing}
              onClick={() => add31Days()}
            >{`Next Month >>`}</button>
          </div>
        </div>
      </div>
      {TournamentEditorDialog(openTournamentEditor, setTournamentEditorOpen)}
    </div>
  )
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const TournamentEditorDialog = (openTournamentEditor: boolean, setTournamentEditorOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  const [tournamentName, setTournamentName] = React.useState<string>("")
  const [venue, setVenue] = React.useState<string>("")
  const [org, setOrg] = React.useState<string>("Nazarene")
  const [fromDate, setFromDate] = React.useState<Dayjs | null>(null)
  const [toDate, setToDate] = React.useState<Dayjs | null>(null)
  const [city, setCity] = React.useState<string>("")
  const [region, setRegion] = React.useState<string>("")
  const [country, setCountry] = React.useState<string>("")
  const [hide, setHide] = React.useState<string>("True");
  const [breadcrumb, setBreadcrumb] = React.useState<string>("")
  const [shortinfo, setShortInfo] = React.useState<string>("");
  const [info, setInfo] = React.useState<string>("");
  const [contact, setContact] = React.useState<string>("somebody");
  const [contactemail, setContactEmail] = React.useState<string>("@@@");


  const handleTournamentEditorClose = () => {
    setTournamentEditorOpen(false);
  };
  const createTournament = async (tournament: Tournament) => {
    await TournamentAPI.create(tournament)
  }

  const handleTournamentEditorSave = () => {
    let tournament: Tournament = {
      tid: 0,
      organization: org,
      tname: tournamentName,
      breadcrumb: breadcrumb,
      fromdate: fromDate,
      todate: toDate,
      venue: venue,
      city: city,
      region: region,
      country: country,
      contact: contact,
      contactemail: contactemail,
      hide: true,
      shortinfo: shortinfo,
      info: info,
      created_at: new Date(),
      updated_at: new Date()
    };

    createTournament(tournament);
    setTournamentEditorOpen(false);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode == 'dark' ? '#1a2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const theme = createTheme();

  return (
    <Dialog
      fullScreen
      open={openTournamentEditor}
      onClose={handleTournamentEditorClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleTournamentEditorClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Tournament Settings
          </Typography>
          <Button autoFocus color="inherit" onClick={handleTournamentEditorSave}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <div className="form">
        <Box component="form">
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="From Date"
                        value={fromDate}
                        onChange={(newValue) => {
                          setFromDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Item>
                </Grid>
                <Grid item xs={6}>
                <InputLabel>Tournament End Date</InputLabel>
                  <Item >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="To Date"
                        value={toDate}
                        onChange={(newValue) => {
                          setToDate(newValue);
                        }}
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
      </div >
    </Dialog >
  )

}

