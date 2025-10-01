import { Link } from 'react-router'

const JournalList = ({ journals }) => {
  if (!journals.length) return <p>No journals yet</p>
  return (
    <ul>
      {journals.map((journal) => (
        <li key={journal._id}>
          <Link to={`/journal/${journal._id}`}>
            {journal.symbol} - {journal.side}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default JournalList