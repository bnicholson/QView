
import React from 'react'
import reactLogo from '../images/logo.svg'
import rustLogo from '../images/logo2.svg'
import plus from '../images/plus.svg'

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Grid } from '@mui/material'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export const Home = () => {
  return (
 
    <div>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Item>Q2022 June 23-July 2, 2022
            xs=8</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid>
      </Grid>   
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img src={rustLogo} className="App-logo" alt="rust-logo" />
        <img src={plus} alt="plus" />
        <img src={reactLogo} className="App-logo" alt="react-logo" />
      </div>
      <p>
        Edit <code>app/src/App.tsx</code> and save to reload.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a
          className="App-link"
          href="https://create-rust-app.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>
        &nbsp;
        <a
          className="App-link"
          href="https://github.com/Wulf/create-rust-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Repo
        </a>
      </div>
    </div>
  )
}
