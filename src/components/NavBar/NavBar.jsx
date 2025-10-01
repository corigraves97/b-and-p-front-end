import './navstyle.css'
import { useContext } from 'react'
import { Link } from 'react-router'
import { UserContext } from '../../contexts/UserContext'
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)({
  backgroundColor: 'transparent',
  boxShadow: '0 4px 8px rgba(0.1,0.1,0.1 ,0.1)',
  borderRadius: '5rem',
});



const NavBar = () => {
    const { user } = useContext(UserContext)
    const handleSignOut = () => {
        localStorage.removeItem('token')
        setUser(null)
    }



    return (
         <StyledAppBar position="static">
    <Toolbar>
      <Typography className="my-typography" variant="h6">Bull & Paper</Typography>
        <nav className="nav">
            { user ? (
                <ul className="ul">
                    <li className="Li"><Link className="link" to='/'>Dashboard</Link></li>
                    <li className="Li"><Link className="link" to='/journal'>My Journals</Link></li>
                    <li className="Li"><Link className="link" to='/journal/new'>Create a New Entry</Link></li>
                    <li className="Li"><Link className="link" to='/' onClick={handleSignOut}>Sign Out</Link></li>
               </ul>
            ) : (
                <ul className="ul">
                    <li className="Li"><Link className="link" to='/'>Home</Link></li>
                    <li className="Li"><Link className="link" to='/sign-in'>SIGN IN</Link></li>
                    <li className="Li"><Link className="link" to='/sign-up'>SIGN UP</Link></li>
                </ul>
            )}
        </nav>
    </Toolbar>
  </StyledAppBar>
    )
}

export default NavBar