
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

export const DivisionAPI = {
  get: async (page: number, size: number) =>
    await (await fetch(`/api/divisions?page=${page}&page_size=${size}`)).json(),
  create: async (division: string) =>
    await (
      await fetch('/api/divisions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: division }),
      })
    ).json(),
  delete: async (id: number) =>
    await fetch(`/api/divisions/${id}`, { method: 'DELETE' }),
  update: async (id: number, division: string) =>
    await fetch(`/api/divisions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: division }),
    }),
}
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

export const Divisions = () => {
  const [expanded, setExpanded] = React.useState(false)
  const [processing, setProcessing] = React.useState<boolean>(false)
  const [displayDate, setDisplayDate] = React.useState<Date>(new Date())
  const [divisions, setDivisions] = React.useState<Division[]>([])

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setProcessing(true)
    DivisionAPI.get(0, 25).then((divisions: Division[]) => {
      setDivisions(divisions)
      setProcessing(false)
    })
    console.log("In useeffect - pulling from api")
  }, [displayDate])

  return (
    <div>
      <div className="Form">
        {divisions.map((division, index) =>
          <Card style={{ maxWidth: 845 }} key={division.division}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="division">
                  M
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={<Typography variant="h5">{division.division}</Typography>}
              subheader={<Typography variant="h6"> {division.fromdate} - {division.todate}</Typography>}
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
                    Contact: {division.contact} Email:{division.contactemail}<br/>
                    Organization: {division.organization}<br />
                    Venue: {division.venue}<br />
                    Location: {division.city}, {division.region}, {division.country}<br />
                    ShortInfo: {division.shortinfo}
                    <br />
                    ID: {division.id}<br />
                    Hidden: {division.hide}<br />
                    Originally created: {division.created_at} <br />
                    Last Update: {division.updated_at}
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
                  {division.info}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        )}
      </div>
    </div>
  )
}
