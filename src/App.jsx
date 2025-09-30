import { useState, useContext, useEffect } from 'react'
import {Route, Routes, useNavigate } from 'react-router'
import JournalList from './components/JournalList/JournalList'
import HomePage from './components/HomePage/HomePage'
import SignUpForm from './components/SignUpForm/SignUpForm'
import SignInForm from './components/SignInForm/SignInForm'
import NavBar from './components/NavBar/NavBar'
import JournalDetails from './components/JournalDetails/JournalDetails'
import JournalForm from './components/JournalForm/JournalForm'
import * as journalService from './services/journalService'
import './App.css'

function App() {
  const navigate = useNavigate()
  const [journals, setJournals] = useState([])
  useEffect(() => {
    const fetchAllJournals = async () => {
      const journalsData = await journalService.index()
      setJournals(journalsData)
    }
    if (user) fetchAllJournals()
  }, [user])

  const handleAddJournal = async (journalFormData) => {
    console.log('journalFormData', journalFormData)
    navigate('/journal')
  }
  return (
    <>
      <NavBar />
      <Routes>
        <Route path = '/' element={user? <Dashboard /> : <HomePage />}/>
        {user ? (
          <>
            <Route path='/journal' element={<JournalList journals={journals}/>} />
            <Route 
              path='/journal/:journalId' element={<JournalDetails />}/>
              <Route path='journal/new' element={<JournalForm handleAddJournal={handleAddJournal} />} />
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
