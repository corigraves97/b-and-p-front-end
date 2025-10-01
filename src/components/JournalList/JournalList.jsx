import { Link } from 'react-router'

const JournalList = (props) => {
    if (!Array.isArray(props.journals)) {
    return <p>No journals available.</p>
  }
    return (
        <main>
            {props.journals.map((journal) => (
                <Link key={journal._id} to={`/journals/${journal._id}`}>
                    <article>
                        <header>
                            <h2>{journal.symbol}</h2>
                            <p>
                            {`${new Date(journal.createdAt).toLocaleDateString()}`}
                            </p>
                        </header>
                        <p>{journal.executedDay}</p>
                    </article>
        </Link>
      ))}
    </main>
  )
}

export default JournalList