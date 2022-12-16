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
import Fab from '@mui/material/Fab'
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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import Filters from '../components/Filters'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SortFilterMenu from './SortFilterMenu'

function createData(
    start: string,
    tournament: string,
    division: string,
    room: string,
    round: string,
    team1: string,
    team2: string,
    team3: string,
    quizmaster: string,
    contentjudge: string,
    stats1: string,
    stats2: string,
    stats3: string,
    stats4: string,
    stats5: string,
    stats6: string,
    stats7: string,
    stats8: string,
    stats9: string,
) {
    return { start, tournament, division, room, round, team1, team2, team3, quizmaster, contentjudge, stats1, stats2, stats3, stats4, stats5, stats6, stats7, stats8, stats9 };
}

const rows = [
    createData("2022-06-28-07:45:00.000000", "Q2022", "Local Experienced", "Hodges 113", "Tue07d", "Canton Nazarene", "", "Eikon-ic", "Paul Baker", "Abbie Baker", "",
        "LX", "LXA", "", "", "", "", "", ""),
];

function handleRoomAdd() {
    // rows.splice(rows.length, 0, { "456" : string, "Big room" : string, "Paul Baker" : string , "Michael Sherman" :string } );
}

export default function RoomPanel() {
    return (
        <div>
            <Tooltip title="Add a new scheduled quiz" arrow>
                <Fab color="primary" onClick={() => handleRoomAdd()} aria-label="Add Room">
                    <AddIcon />
                </Fab>
            </Tooltip>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="contained" component="label" color="primary">
                {" "}
                <FileUploadIcon />
                Upload
                <input type="file" hidden />
            </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button variant="contained" component="label" color="primary">
                {" "}
                <DownloadIcon />
                Download
                <input type="file" hidden />
            </Button>
            {Filters()}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                    <TableHead>
                        <TableRow>
                            <TableCell> </TableCell>
                            <TableCell align="right"><div style={{display:"flex"}}>Start{SortFilterMenu()}</div></TableCell>
                            <TableCell align="right"><div style={{display:"flex"}}>Tournament{SortFilterMenu()}</div></TableCell>
                            <TableCell align="right"><div style={{display:"flex"}}>Division{SortFilterMenu()}</div></TableCell>
                            <TableCell align="right"><div style={{display:"flex"}}>Room{SortFilterMenu()}</div></TableCell>
                            <TableCell align="right"><div style={{display:"flex"}}>Round{SortFilterMenu()}</div></TableCell>
                            <TableCell align="right"><div style={{display:"flex"}}>Team1{SortFilterMenu()}</div></TableCell>
                            <TableCell align="right"><div style={{display:"flex"}}>Team2{SortFilterMenu()}</div></TableCell>
                            <TableCell align="right"><div style={{display:"flex"}}>Team3{SortFilterMenu()}</div></TableCell>
                            <TableCell align="right">QuizMaster</TableCell>
                            <TableCell align="right">Content Judge</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.start}>
                                <TableCell component="th" scope="row">
                                    <DeleteIcon /> <UpdateIcon />
                                </TableCell>
                                <TableCell align="right">{row.start}</TableCell>
                                <TableCell align="right">{row.tournament}</TableCell>
                                <TableCell align="right">{row.division}</TableCell>
                                <TableCell align="right">{row.room}</TableCell>
                                <TableCell align="right">{row.round}</TableCell>
                                <TableCell align="right">{row.team1}</TableCell>
                                <TableCell align="right">{row.team2}</TableCell>
                                <TableCell align="right">{row.team3}</TableCell>
                                <TableCell align="right">{row.quizmaster}</TableCell>
                                <TableCell align="right">{row.contentjudge}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}