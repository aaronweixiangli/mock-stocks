import { useState } from 'react';
import * as usersService from '../../utilities/users-service';

export default function LoginForm({ setUser, showSignUp, setShowSignUp }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  function handleChange(evt) {
    setCredentials({ ...credentials, [evt.target.name]: evt.target.value });
    setError('');
  }

  async function handleSubmit(evt) {
    // Prevent form from being submitted to the server
    evt.preventDefault();
    try {
      // The promise returned by the signUp service method 
      // will resolve to the user object included in the
      // payload of the JSON Web Token (JWT)
      const user = await usersService.login(credentials);
      setUser(user);
    } catch {
      setError('Log In Failed - Try Again');
    }
  }

  return (
    <div className="auth-body">
      <h3>Log in to MockStocks </h3>
      <div className="auth-form-container">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="text" name="email" value={credentials.email} onChange={handleChange} required />
          <label>Password</label>
          <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
          <button type="submit">LOG IN</button>
        </form>
      </div>
      <button className="auth-switch-btn" onClick={() => setShowSignUp(!showSignUp)}>{showSignUp ? 'Already have an account? Log In' : 'Not On MockStocks? Create an account'}</button>
      <p className="error-message">&nbsp;{error}</p>
    </div>
  );
}