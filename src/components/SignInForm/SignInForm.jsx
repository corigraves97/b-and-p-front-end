import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import './signin.css'
import { signIn } from '../../services/authService';

import { UserContext } from '../../contexts/UserContext';

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      // This function doesn't exist yet, but we'll create it soon.
      // It will cause an error right now
      const signedInUser = await signIn(formData);

      setUser(signedInUser);
      navigate('/');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <main className='signin-page'>
      <section className='signin-panel'>
        <header className='signin-header'>
          <p className='signin-kicker'>Welcome back</p>
          <h1 className='signin-title'>Sign in to continue</h1>
          <p className='signin-description'>Enter your credentials to access your trading journal and stay on top of performance.</p>
          {message && <p className='signin-message' role='alert'>{message}</p>}
        </header>
        <form className='signin-form' autoComplete='off' onSubmit={handleSubmit}>
          <div className='signin-field'>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              autoComplete='username'
              id='username'
              value={formData.username}
              name='username'
              onChange={handleChange}
              required
            />
          </div>
          <div className='signin-field'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              autoComplete='current-password'
              id='password'
              value={formData.password}
              name='password'
              onChange={handleChange}
              required
            />
          </div>
          <div className='signin-actions'>
            <button className='primary'>Sign In</button>
            <button type='button' className='ghost' onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default SignInForm;



