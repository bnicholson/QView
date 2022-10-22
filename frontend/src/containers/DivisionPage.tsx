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
import SettingsIcon from '@mui/icons-material/Settings';

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

export const Divisions = () => {
  const [expanded, setExpanded] = React.useState(false)
  const [processing, setProcessing] = React.useState<boolean>(false)
  const [displayDate, setDisplayDate] = React.useState<Date>(new Date())
  const [divisions, setDivisions] = React.useState<Division[]>([])

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
                <IconButton aria-label="settings">
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
      </div>
    </div >
  )
}