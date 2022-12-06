
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
import Button from '@mui/material/Button';
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

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

export const Swagger = () => {
    const [expanded, setExpanded] = React.useState(false)

    const navigate = useNavigate();

    var displayDate = useAppSelector((state) => state.breadCrumb.displayDate);
    const tournament = useAppSelector((state) => state.breadCrumb.tournament);
    const dispatcher = useAppDispatch();

    console.log("Display Date = " + displayDate + " Tournament is " + tournament);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

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
            <div className="Form">
                <Card key="pingmsg" sx={{ bgcolor: "#e8f6f0", m: 1 }}>
                    <CardHeader
                        title={<Typography >/pingmsg or /api/pingmsg API endpoint</Typography>}
                        subheader={<Typography>Used by clients to checkin to the server once a minute</Typography>}
                    >
                    </CardHeader>
                    <CardContent>
                        <Box sx={{ display: 'flex', wdith: '100%' }} >
                            <Button
                                variant="outlined"
                                sx={{ width: '100%' }}
                                style={{ justifyContent: "space-between" }}
                            >
                                GET /pingmsg
                                <ExpandMore
                                    expand={expanded}
                                    onClick={handleExpandClick}
                                    aria-expanded={expanded}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </ExpandMore>
                            </Button>
                        </Box>
                    </CardContent>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <List>
                                <ListItem>
                                    bldgroom -- uilding and room the client is in
                                </ListItem>
                                <ListItem>
                                    key   -- client's key
                                </ListItem>
                                <ListItem>
                                    tk    -- Tournament key
                                </ListItem>
                                <ListItem>
                                    org   -- Organization
                                </ListItem>
                                <ListItem>
                                    tn    -- Tournament       
                                </ListItem>
                                <ListItem>
                                    dn    -- Division
                                </ListItem>
                                <ListItem>
                                    rm    -- Room
                                </ListItem>
                                <ListItem>
                                    rd    -- Round
                                </ListItem>
                                <ListItem>
                                    qn    -- Question #
                                </ListItem>
                                <ListItem>
                                    ts    -- The time this event occurred on the client using the client's clock
                                </ListItem>
                                <ListItem>
                                    qmv   -- QuizMachine Version
                                </ListItem>
                                <ListItem>
                                    jp    -- Jobs Pending (# of jobs that are waiting to be sent to the client)
                                </ListItem>
                                <ListItem>
                                   myip  -- IP address that the client is connect to a network
                                </ListItem>
                            </List>
                        </CardContent>
                    </Collapse>
                </Card>
                <Card key="scoreevent" sx={{ bgcolor: "#fbf1e6", m: 1 }}>
                    <CardHeader
                        title={<Typography>/scoreevent or /api/scoreevent API endpoint</Typography>}
                        subheader={<Typography>Used by clients to send Quiz events to the server</Typography>}
                    >
                    </CardHeader>
                    <CardContent>
                        <Box sx={{ display: 'flex' }}>
                            <Button variant="outlined"
                                sx={{ width: '100%' }}
                                style={{ justifyContent: "space-between" }}
                            >
                                GET /scoreevent
                                <ExpandMoreIcon

                                />
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card key="namelist" sx={{ bgcolor: "#ebf3fb", m: 1 }}>
                    <CardHeader
                        title={<Typography>/namelist or /api/namelist API</Typography>}
                        subheader={<Typography>Used by clients to request a list of schedules & associated team/quizzer pairings for this tournament.</Typography>}
                    >
                    </CardHeader>
                    <CardContent>
                        <Box sx={{ display: 'flex' }}>
                            <Button
                                variant="outlined"
                                sx={{ width: '100%' }}
                                style={{ justifyContent: "space-between" }}
                            >
                                GET /namelist
                                <ExpandMoreIcon

                                />
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card key="tournament" sx={{ bgcolor: "#fae7e7", m: 1 }}>
                    <CardHeader
                        title={<Typography>/api/tournament API</Typography>}
                        subheader={<Typography>Used by clients to checkin to request information about a tournament</Typography>}
                    >
                    </CardHeader>
                    <CardContent>
                        <Box sx={{ display: 'flex' }}>
                            <Button
                                variant="outlined"
                                sx={{ width: '100%' }}
                                style={{ justifyContent: "space-between" }}
                            >
                                GET /tournament
                                <ExpandMoreIcon

                                />
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card key="division" sx={{ bgcolor: "#e8f6f0", m: 1 }}>
                    <CardHeader
                        title={<Typography>/api/division API</Typography>}
                        subheader={<Typography>Used by clients to checkin to request information about a division</Typography>}
                    >
                    </CardHeader>
                    <CardContent>
                        <Box sx={{ display: 'flex' }}>
                            <Button
                                variant="outlined"
                                sx={{ width: '100%' }}
                                style={{ justifyContent: "space-between" }}
                            >
                                GET /division
                                <ExpandMoreIcon

                                />
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card key="game" sx={{ bgcolor: "#fbf1e6", m: 1 }}>
                    <CardHeader
                        title={<Typography>/api/game API</Typography>}
                        subheader={<Typography>Used by clients to checkin to request information about a game</Typography>}
                    >
                    </CardHeader>
                    <CardContent>
                        <Box sx={{ display: 'flex' }}>
                            <Button
                                variant="outlined"
                                sx={{ width: '100%' }}
                                style={{ justifyContent: "space-between" }}
                            >
                                GET /game
                                <ExpandMoreIcon

                                />
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card key="quizevent" sx={{ bgcolor: "#ebf3fb", m: 1 }}>
                    <CardHeader
                        title={<Typography>/api/quizevent API</Typography>}
                        subheader={<Typography>Used by clients to checkin to request information about a quizevent</Typography>}
                    >
                    </CardHeader>
                    <CardContent>
                        <Box sx={{ display: 'flex' }}>
                            <Button
                                variant="outlined"
                                sx={{ width: '100%' }}
                                style={{ justifyContent: "space-between" }}
                            >
                                GET /quizevent
                                <ExpandMoreIcon

                                />
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card key="helpmsg" sx={{ bgcolor: "#fae7e7", m: 1 }}>
                    <CardHeader
                        title={<Typography>/helpmsg or /api/helpmsg API</Typography>}
                        subheader={<Typography>Used by clients to checkin to request help</Typography>}
                    >
                    </CardHeader>
                    <CardContent>
                        <Box sx={{ display: 'flex' }}>
                            <Button
                                variant="outlined"
                                sx={{ width: '100%' }}
                                style={{ justifyContent: "space-between" }}
                            >
                                GET /helpmsg
                                <ExpandMoreIcon

                                />
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card key="chat_handler" sx={{ bgcolor: "#e8f6f0", m: 1 }}>
                    <CardHeader
                        title={<Typography>/chat_handler or /api/chat API</Typography>}
                        subheader={<Typography>Used by clients to checkin to chat</Typography>}
                    >
                    </CardHeader>
                    <CardContent>
                        <Box sx={{ display: 'flex' }}>
                            <Button
                                variant="outlined"
                                sx={{ width: '100%' }}
                                style={{ justifyContent: "space-between" }}
                            >
                                GET /chat_handler
                                <ExpandMoreIcon

                                />
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
                <Card key="schedule" sx={{ bgcolor: "#fbf1e6", m: 1 }}>
                    <CardHeader
                        title={<Typography>/api/schedule API</Typography>}
                        subheader={<Typography>Used by clients or frontends to request a list of schedules or do CRUD on those schedules.</Typography>}
                    >
                    </CardHeader>
                    <CardContent>
                        <Box sx={{ display: 'flex' }}>
                            <Button
                                variant="outlined"
                                sx={{ width: '100%' }}
                                style={{ justifyContent: "space-between" }}
                            >
                                GET /schedule
                                <ExpandMoreIcon

                                />
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

