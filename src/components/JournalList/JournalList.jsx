import { Link } from 'react-router'
import './list.css'


const JournalList = ({ journals }) => {
  if (!journals.length) return <p>No journals yet</p>
  return (
    <ul className='journal-list'>
      {journals.map((journal) => (
        <li key={journal._id} className='journal-item'>
          <Link to={`/journal/${journal._id}`} className='journal-link'>
            {journal.symbol} - {journal.side}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default JournalList