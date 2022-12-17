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
import { Tooltip } from '@mui/material';

function createData(
    bldgroom: string,
    chkdin: string,
    tournament: string,
    division: string,
    room: string,
    round: string,
    question: number,
    hostip: string,
    qmversion: string,
    pending: number,
    status_error: string,
    resend: string,
) {
    return { bldgroom, chkdin, tournament, division, room, round, question, hostip, qmversion, pending, status_error, resend };
}

const rows = [
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
    createData("Jester 103", "11:03", "Q2022", "Local-Experienced", "Jester 103", "Tues07d", 21, "192.168.4.23", "5.4 J30", 33, "Missing a quizzer", "resend 33"),
];

export default function RoomMonitor() {
    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                    <TableHead>
                        <TableRow>
                            <TableCell> </TableCell>
                            <TableCell align="right">BldgRoom</TableCell>
                            <TableCell align="right">ChkdIn</TableCell>
                            <TableCell align="right">Tournament</TableCell>
                            <TableCell align="right">Division</TableCell>
                            <TableCell align="right">Room</TableCell>
                            <TableCell align="right">Round</TableCell>
                            <TableCell align="right">Question</TableCell>
                            <TableCell align="right">Host/IP</TableCell>
                            <TableCell align="right">QMVersion</TableCell>
                            <TableCell align="right">Pending</TableCell>
                            <TableCell align="right">Status/Error</TableCell>
                            <TableCell align="right">Resend</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    <Tooltip title="Delete this division " arrow>
                                        <DeleteIcon />
                                    </Tooltip>
                                    <Tooltip title="Update this division" arrow>
                                        <UpdateIcon />
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right">{row.bldgroom}</TableCell>
                                <TableCell align="right">{row.chkdin}</TableCell>
                                <TableCell align="right">{row.tournament}</TableCell>
                                <TableCell align="left">{row.division}</TableCell>
                                <TableCell align="left">{row.room}</TableCell>
                                <TableCell align="left">{row.round}</TableCell>
                                <TableCell align="left">{row.question}</TableCell>
                                <TableCell align="left">{row.hostip}</TableCell>
                                <TableCell align="left">{row.qmversion}</TableCell>
                                <TableCell align="left">{row.pending}</TableCell>
                                <TableCell align="left">{row.status_error}</TableCell>
                                <TableCell align="left">{row.resend}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}