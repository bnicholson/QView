
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
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import { TournamentAPI } from './TournamentPage'

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

const subtract31Days = (theDate: Date): Date => {
  theDate.setTime(theDate.getTime() - (31 * 24 * 3600 * 1000));
  //  alert("Subtracting: " + theDate.toLocaleDateString());
  return (theDate);
}

const add31Days = (theDate: Date): Date => {
  theDate.setTime(theDate.getTime() + (31 * 24 * 3600 * 1000));
  //console.log("Adding: " + theDate.toLocaleDateString());
  return (theDate);
}

export const Home = () => {
  const [expanded, setExpanded] = React.useState(false)
  const [processing, setProcessing] = React.useState<boolean>(false)
  const [displayDate, setDisplayDate] = React.useState<Date>(new Date())
  const [tournaments, setTournaments] = React.useState<Tournament[]>([])

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

  const setMyDisplayDate = (theDate: Date) => {
    console.log("Orig: "+displayDate.toLocaleDateString() +" Adding or subtracting"+theDate.toLocaleDateString())
    setDisplayDate(theDate);
  }

  return (
    // Okay here's where I have to go get the tournaments starting at some
    // page and page_size.   We start at by displaying all the tournaments
    // that end 30 days before today and 30 days after today.   I need to change
    // the API to not worry abut page size and page.  This is more date based.

    <div>
      <div className="Form">
        <div style={{ display: 'flex' }}>
          <button onClick={() => setMyDisplayDate(subtract31Days(displayDate))}>{` << Previous Month`}</button>
          <span style={{ flex: 1, textAlign: 'center' }}>
            { displayDate.toLocaleDateString() }  - {add31Days(displayDate).toLocaleDateString()}
          </span>
          <button
            disabled={processing}
            onClick={() => setMyDisplayDate(add31Days(displayDate))}
          >{`Next Month >>`}</button>
        </div>
      </div>
      <div className="Form">
        {tournaments.map((tournament, index) =>
          <Card style={{ maxWidth: 845 }} key={tournament.tournament}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="tournament">
                  M
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={<Typography variant="h5">{tournament.tournament}</Typography>}
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
                    Contact: {tournament.contact} Email:{tournament.contactemail}<br/>
                    Organization: {tournament.organization}<br />
                    Venue: {tournament.venue}<br />
                    Location: {tournament.city}, {tournament.region}, {tournament.country}<br />
                    ShortInfo: {tournament.shortinfo}
                    <br />
                    ID: {tournament.id}<br />
                    Hidden: {tournament.hide}<br />
                    Originally created: {tournament.created_at} <br />
                    Last Update: {tournament.updated_at}
                  </span>
                </Typography>
              </CardContent>
            </Box>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
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
            <button onClick={() => setMyDisplayDate(subtract31Days(displayDate))}>{`<< Previous Month`}</button>
            <span style={{ flex: 1, textAlign: 'center' }}>
              {displayDate.toLocaleDateString()}  - {add31Days(displayDate).toLocaleDateString()}
            </span>
            <button
              disabled={processing}
              onClick={() => setMyDisplayDate(add31Days(displayDate))}
            >{`Next Month >>`}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
