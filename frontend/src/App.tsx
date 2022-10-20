import { useApolloClient } from '@apollo/client'
import { GraphQLPage } from './containers/GraphQLPage'
import { useAuth, useAuthCheck } from './hooks/useAuth'
import { AccountPage } from './containers/AccountPage'
import { LoginPage } from './containers/LoginPage'
import { ActivationPage } from './containers/ActivationPage'
import { RegistrationPage } from './containers/RegistrationPage'
import { RecoveryPage } from './containers/RecoveryPage'
import { ResetPage } from './containers/ResetPage'
import { Tournaments } from './containers/TournamentPage'
import { Divisions } from './containers/DivisionPage'
import React from 'react'
import './App.css'
import { Home } from './containers/Home'
import { Todos } from './containers/Todo'
import { Files } from './containers/Files'
import { Route, useNavigate, Routes } from 'react-router-dom'

import '@mui/material/colors'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { ChevronLeft, Inbox, Mail, AccountCircle } from '@mui/icons-material'
import { Breadcrumbs, Divider, Link, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material'

if (process.env.NODE_ENV === 'development') import('./setupDevelopment')

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: "#008080"
    }
  }
})

const App = () => {
  useAuthCheck()
  const auth = useAuth()

  const navigate = useNavigate()
  /* CRA: app hooks */
  const apollo = useApolloClient()

  //const theme = useTheme();  

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    //padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    //    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));


  const [open, setOpen] = React.useState(false);

  const handleDrawerClose = () => {
    if (open == true)
      setOpen(false);
    else
      setOpen(true);
  };

  // @ts-ignore
  return (
    <ThemeProvider theme={theme}>
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
                onClick={() => { handleDrawerClose() }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" onClick={() => { navigate("/") }}>QView</Typography>
              <Typography variant="h6" component="div" sx={{ flexGrow: 2 }} onClick={() => handleDrawerClose()}>

              </Typography>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {/* CRA: right-aligned nav buttons */}
                {auth.isAuthenticated && <a onClick={() => { auth.logout(); apollo.resetStore(); }}>Logout</a>}
                {!auth.isAuthenticated && <button onClick={() => navigate('/login')}>Login/Register</button>}
              </Typography>
              { auth.isAuthenticated && <IconButton> <AccountCircle onClick={() => navigate('/account')} /></IconButton>}
            </Toolbar>
          </AppBar>
          <div>
            <Breadcrumbs aria-label="breadcrumb" >
              <Link underline="hover" color="inherit" href="/">
                &nbsp;&nbsp;&nbsp;&nbsp;Home
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
          </div>
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
              <ChevronLeft />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {['Tournament', 'Division', 'Room', 'Round'].map((text, index) => (
              <ListItem key={text} disablePadding
                onClick={() => {
                  switch (index % 4) {
                    case 0:
                      navigate("/tournament");
                      break;
                    case 1:
                      navigate("/division");
                      break;
                    case 2:
                      alert("room");
                      break;
                    case 3:
                      alert('round');
                  }
                }}>
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
            {['Quizzes', 'Team', 'Individual'].map((text, index) => (
              <ListItem key={text} disablePadding
                onClick={() => {
                  switch (index % 3) {
                    case 0:
                      alert("quizzes");
                      break;
                    case 1:
                      alert("team");
                      break;
                    case 2:
                      alert("individual");
                      break;
                  }
                }}>
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
            {['Todos', 'Files', 'GraphQL'].map((text, index) => (
              <ListItem key={text} disablePadding
                onClick={() => {
                  switch (index % 3) {
                    case 0:
                      navigate("/todos");
                      break;
                    case 1:
                      navigate("/files");
                      break;
                    case 2:
                      navigate("/gql");
                      break;
                  }
                }}
              >
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
        <div style={{ margin: '0 auto', maxWidth: '800px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todos" element={<Todos />} />
            {/* CRA: routes */}
            <Route path="/gql" element={<GraphQLPage />} />
            <Route path="/files" element={<Files />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recovery" element={<RecoveryPage />} />
            <Route path="/reset" element={<ResetPage />} />
            <Route path="/activate" element={<ActivationPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/tournament" element={<Tournaments />} />
            <Route path="/division" element={<Divisions />} /> 
          </Routes>
        </div>
        <Box textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 }}>
        </Box>
        <Box px={{ xs: 3, sm: 10 }} py={{ xs: 5, sm: 10 }} bgcolor="text.secondary" color="white">
          <Typography variant="h6">
            <Container maxWidth='lg'>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                  <Box borderBottom={1}>Help</Box>
                  <Box>Contact</Box>
                  <Box>Support</Box>
                  <Box>Privacy</Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box borderBottom={1}>Help</Box>
                  <Box>Login</Box>
                  <Box>Register</Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box borderBottom={1}>Messages</Box>
                  <Box>Backup</Box>
                  <Box>History</Box>
                  <Box>Roll</Box>
                </Grid>
              </Grid>
            </Container>
            <Box textAlign="center" pt={{ xs: 5, sm: 10 }} pb={{ xs: 5, sm: 0 }}>
              QView by QuizStuff &reg; 2022-{new Date().getFullYear()}
            </Box>
          </Typography>
        </Box>
      </div >
    </ThemeProvider>
  )
}

export default App
