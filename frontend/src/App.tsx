import { useApolloClient } from '@apollo/client'
import { GraphQLPage } from './containers/GraphQLPage'
import { useAuth, useAuthCheck } from './hooks/useAuth'
import { AccountPage } from './containers/AccountPage'
import { LoginPage } from './containers/LoginPage'
import { ActivationPage } from './containers/ActivationPage'
import { RegistrationPage } from './containers/RegistrationPage'
import { RecoveryPage } from './containers/RecoveryPage'
import { ResetPage } from './containers/ResetPage'
import React from 'react'
import './App.css'
import { Home } from './containers/Home'
import { Todos } from './containers/Todo'
import { Files } from './containers/Files'
import { Route, useNavigate, Routes } from 'react-router-dom'
import { TournamentPage } from './containers/TournamentPage'

if (process.env.NODE_ENV === 'development') import('./setupDevelopment')
    
const App = () => {
  useAuthCheck()
  const auth = useAuth()
    
  const navigate = useNavigate()
  /* CRA: app hooks */
  const apollo = useApolloClient()
  
  // @ts-ignore
    return (
    <div className="App">
      <div className="App-nav-header">
        <div style={{ display: 'flex', flex: 1 }}>
          <a className="NavButton" onClick={() => navigate('/')}>Home</a>
	  <a className="NavButton" onClick={() => navigate('/tournament')}>Tournament</a>
	  <a className="NavButton" onClick={() => navigate('/todos')}>Todos</a>
	  <a className="NavButton" onClick={() => navigate('/files')}>Files</a>
          {/* CRA: left-aligned nav buttons */}
          <a className="NavButton" onClick={() => navigate('/gql')}>GraphQL</a>
          <a className="NavButton" onClick={() => navigate('/account')}>Account</a>

        </div>
        <div>
          {/* CRA: right-aligned nav buttons */}
          { auth.isAuthenticated && <a className="NavButton" onClick={() => { auth.logout(); apollo.resetStore(); }}>Logout</a> }
          { !auth.isAuthenticated && <a className="NavButton" onClick={() => navigate('/login')}>Login/Register</a> }
        </div>
      </div>
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
            <Route path="/tournament" element={<TournamentPage />} />	    
    
          </Routes>
      </div>
    </div>
  )
}

export default App
