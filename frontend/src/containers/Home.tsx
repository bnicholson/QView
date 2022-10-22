
import React from 'react'
import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
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
import { Route, useNavigate, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SettingsIcon from '@mui/icons-material/Settings';
import { selectDisplayDate, selectTournament, setDisplayDate, setTournament, toggleIsOn } from '../breadcrumb'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { breadCrumb } from '../breadcrumb'

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



const add31Days = (theDate: Date): Date => {
  theDate.setTime(theDate.getTime() + (31 * 24 * 3600 * 1000));
  //console.log("Adding: " + theDate.toLocaleDateString());
  return (theDate);
}

export const Home = () => {
  const [expanded, setExpanded] = React.useState(false)
  const [processing, setProcessing] = React.useState<boolean>(false)
  const [tournaments, setTournaments] = React.useState<Tournament[]>([])

  const navigate = useNavigate();

  var displayDate = useAppSelector( (state) => state.breadCrumb.displayDate) ;
  const tournament = useAppSelector( (state) => state.breadCrumb.tournament );
  const dispatcher = useAppDispatch();

  const subtract31Days = () => {
    displayDate = displayDate - (31 * 24 * 3600 * 1000);
    dispatcher(setDisplayDate(displayDate));
  }
  
  const add31Days = () => {
    displayDate = displayDate + (31 * 24 * 3600 * 1000);
    dispatcher(setDisplayDate(displayDate));
  }

  console.log("Display Date = "+displayDate + " Tournament is "+tournament);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setProcessing(true)
    TournamentAPI.get(0, 25).then((tournaments: Tournament[]) => {
      setTournaments(tournaments)
      setProcessing(false)
    })
    console.log("In useeffect - pulling from api")
  }, [displayDate])

  const fromDate = new Date();
  fromDate.setTime(displayDate);
  const toDate = new Date();
  toDate.setTime(displayDate + (31*24*3600*1000));

  return (
    // Okay here's where I have to go get the tournaments starting at some
    // page and page_size.   We start at by displaying all the tournaments
    // that end 30 days before today and 30 days after today.   I need to change
    // the API to not worry abut page size and page.  This is more date based.

    <div>
      <div className="Form">
        <div style={{ display: 'flex' }}>
          <button onClick={() => subtract31Days()}>{` << Previous Month`}</button>
          <span style={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h5">
              { fromDate.toLocaleDateString()} - {toDate.toLocaleDateString() }
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
              dispatcher(setTournament( tournament.tname ));  
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
                  <span>
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
                  </span>
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
                { fromDate.toLocaleDateString() }  - { toDate.toLocaleDateString()}
            </span>
            <button
              disabled={processing}
              onClick={() => add31Days()}
            >{`Next Month >>`}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
