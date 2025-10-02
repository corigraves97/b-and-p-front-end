
// SignUpForm.jsx
import './signup.css'
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService'
import { UserContext } from '../../contexts/UserContext'

const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext)
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
  });

  const { username, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage('');
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      const newUser = await signUp(formData);
      setUser(newUser)
      navigate('/')
    } catch (err) {
      setMessage(err.message);
    }
  };

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <main className="signup-page">
      <section className="signup-panel">
        <header className="signup-header">
          <p className="signup-kicker">Join the community</p>
          <h1 className="signup-title">Create your account</h1>
          <p className="signup-description">
            A few quick details so you can start logging trades, tracking performance, and unlocking insights.
          </p>
          {message && <p className="signup-message" role="alert">{message}</p>}
        </header>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              id='username'
              value={username}
              name='username'
              onChange={handleChange}
              required
              autoComplete='username'
            />
          </div>
          <div className="signup-field">
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              value={password}
              name='password'
              onChange={handleChange}
              required
              autoComplete='new-password'
            />
          </div>
          <div className="signup-field">
            <label htmlFor='confirm'>Confirm Password</label>
            <input
              type='password'
              id='confirm'
              value={passwordConf}
              name='passwordConf'
              onChange={handleChange}
              required
              autoComplete='new-password'
            />
          </div>
          <div className="signup-actions">
            <button className="primary" disabled={isFormInvalid()}>Sign Up</button>
            <button type='button' className="ghost" onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default SignUpForm;


