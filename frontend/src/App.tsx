import { useApolloClient } from '@apollo/client'
import { GraphQLPage } from './containers/GraphQLPage'
import { useAuth, useAuthCheck } from './hooks/useAuth'
import { AccountPage } from './containers/AccountPage'
import { LoginPage } from './containers/LoginPage'
import { ActivationPage } from './containers/ActivationPage'
import { RegistrationPage } from './containers/RegistrationPage'
import { RecoveryPage } from './containers/RecoveryPage'
import { ResetPage } from './containers/ResetPage'
import { TournamentPage } from './containers/TournamentPage'
import React from 'react'
import './App.css'
import { Home } from './containers/Home'
import { Todos } from './containers/Todo'
import { Files } from './containers/Files'
import { Route, useNavigate, Routes } from 'react-router-dom'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { ChevronLeft, ChevronRight, Inbox, Mail } from '@mui/icons-material'
import { Divider, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'

if (process.env.NODE_ENV === 'development') import('./setupDevelopment')

const drawerWidth = 240;

const App = () => {
  useAuthCheck()
  const auth = useAuth()

  const navigate = useNavigate()
  /* CRA: app hooks */
  const apollo = useApolloClient()

  const theme = useTheme();

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    /*padding: theme.spacing(0, 1),*/
    // necessary for content to be below app bar
/*    ...theme.mixins.toolbar,*/
    justifyContent: 'flex-end',
  }));


  const [open, setOpen] = React.useState(false);

  const handleDrawerClose = () => {
    if(open==true)
      setOpen(false);
    else
      setOpen(true);
  };

  // @ts-ignore
  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => {handleDrawerClose()}}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => handleDrawerClose()}>
              QView
            </Typography>
            <Button color="inherit" onClick={() => alert("button")}>Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft/>
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <Inbox /> : <Mail />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <Inbox /> : <Mail />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <div onClick={() => alert("boo hoo")}>Boo Hoo</div>
    </div>
  )
}

export default App


