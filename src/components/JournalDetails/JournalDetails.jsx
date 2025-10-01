
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
            try {
                const data = await journalService.show(journalId)
                console.log("Fetched journal:", data)
                setJournal(data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchJournal()
    }, [journalId])
    if (!journal) return <main>No Journal Entries</main>
    return (
        <main>
            <section>
                <header>
                    <h2>{journal.symbol}</h2>
                    <p><strong>Side:</strong> {journal.side}</p>
                    <p><strong>Time of Day:</strong> {journal.timeOfDay}</p>
                    <p><strong>Share Size:</strong> {journal.shareSize}</p>
                    <p><strong>Entry: </strong> {journal.entry}</p>
                    <p><strong>Exit: </strong> {journal.exit}</p>
                    <p><strong>Volume:</strong>: {journal.volume}</p>
                    <p><strong>Fees:</strong> {journal.fees}</p>
                    <p><strong>Executed Day:</strong> {journal.executedDay}</p>
                    <p><strong>Meta:</strong> {journal.meta}</p>
                    <p><strong>Notes: </strong> {journal.notes}</p>
                    <Link to={`/journal/${journalId}/edit`}>Edit Entry</Link>
                    <button onClick={() => props.handleDeleteJournal(journalId)}>Delete</button>
                </header>
            </section>
        </main>
    )
}

export default JournalDetails