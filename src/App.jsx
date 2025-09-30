import { useState, useContext, useEffect } from 'react'
import {Route, Routes, useNavigate } from 'react-router'
import JournalList from './components/JournalList/JournalList'
import HomePage from './components/Landing/Landing'
import SignUpForm from './components/SignUpForm/SignUpForm'
import SignInForm from './components/SignInForm/SignInForm'
import NavBar from './components/NavBar/NavBar'
import JournalDetails from './components/JournalDetails/JournalDetails'
import Dashboard from './components/Dashboard/Dashboard'
import JournalForm from './components/JournalForm/JournalForm'
import { UserContext } from '../src/contexts/UserContext'
import * as journalService from './services/journalService'



function App() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [journals, setJournals] = useState([])
  useEffect(() => {
    const fetchAllJournals = async () => {
      const journalsData = await journalService.index()
      setJournals(journalsData)
    }
    if (user) fetchAllJournals()
  }, [user])

  const handleAddJournal = async (journalFormData) => {
    const newJournal = await journalService.create(journalFormData)
    setJournals([newJournal, ...journals])
    navigate('/journal')
  }

  const handleDeleteJournal = async (journalId) => {
    const deletedJournal= await journalService.deleteJournal(journalId)
    setJournals(journals.filter((journal) => journal._id !== journalId))
    navigate('/journal')
  }
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user? <Dashboard /> : <HomePage />}/>
        {user ? (
          <>
            <Route path='/journal' element={<JournalList journals={journals}/>} />
            <Route 
              path='/journal/:journalId' element={<JournalDetails />}/>
              <Route path='journal/new' element={<JournalForm handleAddJournal={handleAddJournal} />} />
              <Route path='/journal/:journalId' element={<JournalDetails handleDeleteJournal={handleDeleteJournal} />}/>
              <Route
              path='/journal/:journalId/edit'
              element={<JournalForm />}
            />
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
