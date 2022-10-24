import React from 'react'
import { useState, useEffect } from 'react'
import Card from "@mui/material/Card"
import CardHeader from '@mui/material/CardHeader'
import CardContent from "@mui/material/CardContent"
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { Breadcrumbs, Link } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import AppBar from '@mui/material/AppBar'
import Dialog from '@mui/material/Dialog'
import Toolbar from '@mui/material/Toolbar'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import { TransitionProps } from '@mui/material/transitions'
import Button from '@mui/material/Button';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Fab from '@mui/material/Fab'
import AddIcon from "@mui/icons-material/Add"

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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Divisions = () => {
  const [expanded, setExpanded] = React.useState(false)
  const [processing, setProcessing] = React.useState<boolean>(false)
  const [displayDate, setDisplayDate] = React.useState<Date>(new Date())
  const [divisions, setDivisions] = React.useState<Division[]>([])
  const [openDivisionEditor, setDivisionEditorOpen] = React.useState(false);

  const handleEditorClickOpen = () => {
    setDivisionEditorOpen(true);
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
      <Fab color="primary" onClick={() => handleEditorClickOpen()} aria-label="Add Tournament">
        <AddIcon />
      </Fab>
      <Box>
        <Breadcrumbs aria-label="breadcrumb" >
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/t/q2022">
            Q2022
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/t/q2022/district%20novice"
          >
            District Novice
          </Link>
          <Typography color="text.primary">Teams</Typography>
        </Breadcrumbs>
      </Box>
      <div className="Form">
        {divisions.map((division, index) =>
          <Card style={{ maxWidth: 845 }} key={division.dname}>
            <CardHeader
              action={
                <IconButton onClick={() => handleEditorClickOpen()} aria-label="settings">
                  <SettingsIcon />
                </IconButton>
              }
              title={<Typography variant="h5">
                <Link
                  underline="hover"
                  color="primary"
                  href="//">{division.dname}</Link>
              </Typography>}
              subheader={<Typography variant="h6"> Need to put something here for now nothing. </Typography>}
            />
            <Box sx={{ display: 'flex' }}>
              <CardContent>
                <Typography align="left" variant="h5" color="primary" >
                  <Link
                    underline="hover"
                    color="inherit"
                    href="/t/q2022/district%20novice"
                  >
                    Team Standings
                  </Link>&nbsp;&nbsp;
                  <Link
                    underline="hover"
                    color="inherit"
                    href="/t/q2022/district%20novice"
                  >
                    Individual Standings
                  </Link>
                </Typography>
                <Typography align="left" variant="body1" color="text.primary" >
                  Breadcrumb: {division.breadcrumb}
                </Typography>
                <Typography align="left" variant="body1" color="text.primary" >
                  ShortInfo: {division.shortinfo}
                </Typography>
                <Typography align="left" variant="body1" color="text.primary" >
                  ID: {division.did}                   Hidden: {division.hide}
                </Typography>
                <Typography align="left" variant="body1" color="text.primary" >
                  Created: {division.created_at} - Last Update: {division.updated_at}
                </Typography>
              </CardContent>
            </Box>
          </Card>

        )}
        { DivisionEditor(openDivisionEditor, setDivisionEditorOpen) }
      </div>
    </div >
  )
}

const test = () => {
  return (
    <ListItem button>
      <ListItemText
        primary="Snake button"
        secondary="Tethys"
      />
    </ListItem>
  )

}

const DivisionEditor = (  openDivisionEditor : Boolean, setDivisionEditorOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  const handleDivisionEditorClose = () => {
    setDivisionEditorOpen(false);
  };

  return (
    <Dialog
      fullScreen
      open={openDivisionEditor}
      onClose={handleDivisionEditorClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDivisionEditorClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Division Settings
          </Typography>
          <Button autoFocus color="inherit" onClick={handleDivisionEditorClose}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <List>
        <ListItem button>
          <ListItemText primary="Phone ringtone" secondary="Titania" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText
            primary="Default notification ringtone"
            secondary="Tethys"
          />
        </ListItem>
      </List>
    </Dialog>
  )

}