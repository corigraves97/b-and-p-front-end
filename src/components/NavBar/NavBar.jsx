
import { useContext } from 'react'
import { Link } from 'react-router'
import { UserContext } from '../../contexts/UserContext'
const NavBar = () => {
    const { user } = useContext(UserContext)
    const handleSignOut = () => {
        localStorage.removeItem('token')
        setUser(null)
    }
    return (
        <nav>
            { user ? (
                <ul>
                    <li><Link to='/'>Dashboard</Link></li>
                    <li><Link to='/journal'>My Journals</Link></li>
                    <li><Link to='/journal/new'>Create a New Entry</Link></li>
                    <li><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
                </ul>
            ) : (
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/sign-in'>SIGN IN</Link></li>
                    <li><Link to='/sign-up'>SIGN UP</Link></li>
                </ul>
            )}
        </nav>
    )}

export default NavBar