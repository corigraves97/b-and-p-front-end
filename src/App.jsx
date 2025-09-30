import { useState, useContext, useEffect } from 'react'
import {Route, Routes } from 'react-router'
import JournalList from './components/JournalList/JournalList'
import HomePage from './components/HomePage/HomePage'
import SignUpForm from './components/SignUpForm/SignUpForm'
import SignInForm from './components/SignInForm/SignInForm'
import NavBar from './components/NavBar/NavBar'
import * as journalService from './services/journalService'
import './App.css'

function App() {
  const [journals, setJournals] = useState([])
  useEffect(() => {
    const fetchAllJournals = async () => {
      const journalsData = await journalService.index()
      setJournals(journalsData)
    }
    if (user) fetchAllJournals()
  }, [user])
  return (
    <>
      <NavBar />
      <Routes>
        <Route path = '/' element={user? <Dashboard /> : <HomePage />}/>
        {user ? (
          <>
            <Route path='/journal' element={<JournalList journals={journals}/>} />
          </>
        ) : (
          <>
            <Route path='/sign-up' element={<SignUpForm />}/>
            <Route path='/sign-in' element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  )
}

export default App
