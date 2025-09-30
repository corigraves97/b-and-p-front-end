import { useParams } from 'react-router'
import { useState, useEffect } from 'react'
import * as journalService from '../../services/journalService'

const JournalDetails = () => {
    const { journalId } = useParams()
    console.log('journalId', journalId)
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
                </header>
            </section>
        </main>
    )
}

export default JournalDetails