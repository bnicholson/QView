import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AddIcon from '@mui/material'
import Button from '@mui/material/Button'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';

export default function Filters() {
    const division: string = "Local-Experienced";
    const room: string = "South Hallway";
    const round: string = "Tue09c";
    const handleChange = async () => {
    }

    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Filters/Searching</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <FormControl >
                        <InputLabel id="demo-simple-select-label">Division</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={division}
                            label="Division"
                            onChange={handleChange}
                        >
                            <MenuItem value={"All"}>Everything</MenuItem>
                            <MenuItem value={"Not a division"}>Not a division</MenuItem>
                            <MenuItem value={"Local-Experienced"}>Local Experienced</MenuItem>
                            <MenuItem value={"Local-Novice"}>Local Novice</MenuItem>
                            <MenuItem value={"District-Experienced"}>District Experienced</MenuItem>
                            <MenuItem value={"District-Novice"}>District Novice</MenuItem>
                            <MenuItem value={"Field-A"}>Field A</MenuItem>
                            <MenuItem value={"Field-B"}>Field B</MenuItem>
                        </Select>
                    </FormControl>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <FormControl >
                        <InputLabel id="demo-simple-select-label">Room</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={room}
                            label="Room"
                            onChange={handleChange}
                        >
                            <MenuItem value={"All"}>All Rooms</MenuItem>
                            <MenuItem value={"Not a room"}>Not a room</MenuItem>
                            <MenuItem value={"Local-Experienced"}>Jester 103</MenuItem>
                            <MenuItem value={"Local-Novice"}>1</MenuItem>
                            <MenuItem value={"District-Experienced"}>2</MenuItem>
                            <MenuItem value={"District-Novice"}>Auditorium</MenuItem>
                            <MenuItem value={"Field-A"}>Gym</MenuItem>
                            <MenuItem value={"South Hallway"}>South Hallway</MenuItem>
                        </Select>
                    </FormControl>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <FormControl >
                        <InputLabel id="demo-simple-select-label">Round</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={round}
                            label="Round"
                            onChange={handleChange}
                        >
                            <MenuItem value={"All"}>All Rounds</MenuItem>
                            <MenuItem value={"Not a round"}>Not a round</MenuItem>
                            <MenuItem value={"Local-Experienced"}>Tue07c</MenuItem>
                            <MenuItem value={"Local-Novice"}>Tue08a</MenuItem>
                            <MenuItem value={"District-Experienced"}>Tue08c</MenuItem>
                            <MenuItem value={"District-Novice"}>Tue09a</MenuItem>
                            <MenuItem value={"Tue09c"}>Tue09c</MenuItem>
                            <MenuItem value={"Tue10a"}>Tue10a</MenuItem>
                        </Select>
                    </FormControl>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography>Load/Reload/Update</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Button variant="contained" component="label" color="primary">
                        {" "}
                        <FileUploadIcon />
                        Upload a file
                        <input type="file" hidden />
                    </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button variant="contained" component="label" color="primary">
                        {" "}
                        <DownloadIcon />
                        Download a file
                        <input type="file" hidden />
                    </Button>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
