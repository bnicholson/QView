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
import { Route, useNavigate, Routes } from 'react-router-dom'

const App = () => {
  useAuthCheck()
  const auth = useAuth()
    
  const navigate = useNavigate()
  /* CRA: app hooks */
  
  // @ts-ignore
    return (
    <div className="App">
      <div className="App-nav-header">
        <div style={{ display: 'flex', flex: 1 }}>
          <a className="NavButton" onClick={() => navigate('/')}>Home</a>
          <a className="NavButton" onClick={() => navigate('/todos')}>Todos</a>
          {/* CRA: left-aligned nav buttons */}
          <a className="NavButton" onClick={() => navigate('/account')}>Account</a>
        </div>
        <div>
          {/* CRA: right-aligned nav buttons */}
          { auth.isAuthenticated && <a className="NavButton" onClick={() => auth.logout()}>Logout</a> }
          { !auth.isAuthenticated && <a className="NavButton" onClick={() => navigate('/login')}>Login/Register</a> }
        </div>
      </div>
      <div style={{ margin: '0 auto', maxWidth: '800px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todos" element={<Todos />} />
            {/* CRA: routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recovery" element={<RecoveryPage />} />
            <Route path="/reset" element={<ResetPage />} />
            <Route path="/activate" element={<ActivationPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/account" element={<AccountPage />} />
    
          </Routes>
      </div>
    </div>
  )
}

export default App
