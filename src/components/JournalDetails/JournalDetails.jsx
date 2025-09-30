
import { useParams, Link } from 'react-router'
import { useState, useEffect, useContext } from 'react'
import * as journalService from '../../services/journalService'
import { UserContext } from '../../contexts/UserContext'

const JournalDetails = (props) => {
    const { journalId } = useParams()
    const { user } = useContext(UserContext)
    const [journal, setJournal] = useState(null)
    useEffect(() => {
        const fetchJournal = async () => {
            const journalData = await journalService.show(journalId)
            setJournal(journalData)
        }
        fetchJournal()
    }, [journalId])
    console.log('journal state', journal)
    if (!journal) return <main>No Journal Entries</main>
    return (
        <main>
            <section>
                <header>
                    <h1>{journal.symbol}</h1>
                    <p>{journal.side}</p>
                    <p>{journal.timeOfDay}</p>
                    <p>{journal.shareSize}</p>
                    <p>{journal.entry}</p>
                    <p>{journal.exit}</p>
                    <p>{journal.volume}</p>
                    <p>{journal.fees}</p>
                    <p>{journal.executedDay}</p>
                    <p>{journal.meta}</p>
                    <p>{journal.notes}</p>
                    <p>{journal.marketSnapshot}</p>
                    <Link to= {`/journal/${journalId}/edit`}>Edit Entry</Link>
                    <button onClick={() => props.handleDeleteJournal(journalId)}>Delete</button>
                </header>
            </section>
        </main>
    )
}

export default JournalDetails