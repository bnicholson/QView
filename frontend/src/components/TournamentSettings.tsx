import React from 'react'
import { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
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
import AddIcon from "@mui/icons-material/Add"
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import { TournamentAPI } from '../containers/TournamentPage'
import { Route, useNavigate, Routes, Form } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SettingsIcon from '@mui/icons-material/Settings';
import { selectDisplayDate, selectTournament, setDisplayDate, setTournament, toggleIsOn, setTid } from '../breadcrumb'
import { useAppSelector, useAppDispatch } from '../app/hooks';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
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
import { Code } from '@mui/icons-material'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export default function TournamentSettings() {
    const [tournament_name, setTournamentName] = React.useState<string>("")
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
    const [alertopened, setAlertOpened] = React.useState(false);
    const [errormsg, setErrorMsg] = React.useState<string>("Simple error message");


    const handleTournamentEditorSave = async () => {

        console.log("Invalid tournament_name "+tournament_name);
        if (tournament_name.length <= 0) {
            setErrorMsg("Invalid tournament name");
            setAlertOpened(true);
            return (false);
        }
        if (!fromDate || !toDate) {
            setErrorMsg("Invalid dates - please fill in appropriate dates");
            setAlertOpened(true);
            return (false);
        }
        if (fromDate.isAfter(toDate)) {
            setErrorMsg("Invalid dates - please fill in appropriate dates");
            setAlertOpened(true);
            return (false);
        }

        let tournamentCS: TournamentChangeset = {
            organization: org,
            tname: tournament_name,
            breadcrumb: breadcrumb,
            fromdate: fromDate?.format("YYYY-MM-DD"),
            todate: toDate?.format("YYYY-MM-DD"),
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
        const result = await TournamentAPI.create(tournamentCS).catch(err => {
            setErrorMsg("Didn't save 1st - " + err);
            setAlertOpened(true);
            return (false);
        });

        // make sure we had a successful
        if ((result.code < 200) || (result.code > 209)) {
            setErrorMsg(result.message + " " + result.code);
            setAlertOpened(true);
            return (false);
        }
        console.log(result);
        setErrorMsg("Tournament Saved");
        setAlertOpened(true);
        return(true);
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
                        {errormsg} 
                    </Alert>
                </Collapse>
                <List>
                    <ListItem>
                        <Grid container>
                            <Grid item xs={5} >
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
                                    value={tournament_name}
                                    onChange={(event) => {
                                        setTournamentName(event.target.value as string);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={1}>
                            <Button autoFocus color="primary" onClick={handleTournamentEditorSave}>
                                    Update
                                </Button>
                                <Button autoFocus color="primary" onClick={handleTournamentEditorSave}>
                                    Delete
                                </Button>
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
        </div >
    )

}

