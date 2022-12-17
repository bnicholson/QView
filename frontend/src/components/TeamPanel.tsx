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
    name: string,
    division: string,
    coach: string,
    coachphone: string,
    coachemail: string,
) {
    return { name, division, coach, coachphone, coachemail };
}

const rows = [
    createData("Naperville", "Local Experienced", "Barry Nicholson", "630-746-7332", "b.nicholson@niceng.com"),
];

function handleRoomAdd() {

}

export default function TeanPanel() {
    return (
        <div>
            <Tooltip title="Add a new team" arrow>
                <Fab color="primary" onClick={() => handleRoomAdd()} aria-label="Add Room">
                    <AddIcon />
                </Fab>
            </Tooltip>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                    <TableHead>
                        <TableRow>
                            <TableCell> </TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Building</TableCell>
                            <TableCell align="right">QuizMaster</TableCell>
                            <TableCell align="right">Content Judge</TableCell>
                            <TableCell align="right">Comments</TableCell>
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
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{row.division}</TableCell>
                                <TableCell align="right">{row.coach}</TableCell>
                                <TableCell align="right">{row.coachphone}</TableCell>
                                <TableCell align="right">{row.coachemail}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}