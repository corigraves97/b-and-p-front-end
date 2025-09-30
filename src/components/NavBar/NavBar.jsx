const NavBar = () => {
    return (
        <nav>
            { user ? (
                <ul>
                    <li><Link to='/'>Dashboard</Link></li>
                    <li><Link to='/journal'>My Journals</Link></li>
                    <li><Link to='/' onClick={handleSignOut}>Sign Out</Link></li>
                </ul>
            ) : (
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/sign-in'>SIGN IN</Link></li>
                    <li><Link to='/sign-up'>SIGN UP</Link></li>
                </ul>
            )}
        </nav>>  
    )
}

export default NavBar