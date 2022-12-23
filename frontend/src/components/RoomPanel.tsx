import React, { useEffect } from 'react'
import Fab from '@mui/material/Fab'
import AddIcon from "@mui/icons-material/Add"
import { useAppSelector, useAppDispatch } from '../app/hooks';
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

export const RoomAPI = {
    get: async (tid: number) =>
        await (await fetch(`/api/rooms`)).json(),
    create: async (room: string) =>
        await (
            await fetch('/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: room }),
            })
        ).json(),
    delete: async (id: number) =>
        await fetch(`/api/rooms/${id}`, { method: 'DELETE' }),
    update: async (id: number, room: string) =>
        await fetch(`/api/rooms/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: room }),
        }),
}


function createData(
    name: string,
    building: string,
    quizmaster: string,
    contentjudge: string,
    comments: string,
) {
    return { name, building, quizmaster, contentjudge, comments };
}

const rows = [
    createData("Living Room", "House", "Paul Baker", "Mark Baker", "long narrow room with long staircase"),
];

function handleRoomAdd() {
    rows.push(createData("Default Room", "Church", "Default QuizMaster", "Default ContentJudge", "No comment"));
}

export default function RoomPanel() {
    const [expanded, setExpanded] = React.useState(false);

    // time to add the useEffects 
    //    useEffect(() => {yea
    //        setProcessing(true)
    //        RoomAPI.getByDate(displayDate, (displayDate + (31 * 24 * 3600 * 1000))).then((tournaments: Tournament[]) => {
    //           setTournaments(tournaments)
    //          setProcessing(false)
    //    })
    //    }, [rowsohoh ])

    const dispatcher = useAppDispatch();

    return (
        <div>
            <Tooltip title="Add a new room" arrow>
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
                                    <Tooltip title="Delete this room" arrow>
                                        <DeleteIcon />
                                    </Tooltip>
                                    <Tooltip title="Update this room" arrow>
                                        <UpdateIcon />
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{row.building}</TableCell>
                                <TableCell align="right">{row.quizmaster}</TableCell>
                                <TableCell align="right">{row.contentjudge}</TableCell>
                                <TableCell align="right">{row.comments}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}