import { useParams } from 'react-router'

const JournalDetails = () => {
    const { journalId } = useParams()
    console.log('journalId', journalId)
    return <main>Journal Details</main>
}

export default JournalDetails