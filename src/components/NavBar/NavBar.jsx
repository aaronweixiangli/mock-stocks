import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import * as userService from '../../utilities/users-service';

export default function NavBar({ user, setUser }) {
  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }
  function dropdownClick() {
    document.getElementById("dropdown").classList.toggle("show");
  }

  // if the clicked elemetn does not match dropbtn, remove show class
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdown = document.getElementsByClassName("dropdown-content")[0];
      if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
      }
    }
  }

  const [symbol, setSymbol] = useState('');
  const navigate = useNavigate();
  
  function handleSubmit(evt) {
    evt.preventDefault();
    if (!symbol) return;
    navigate(`/stocks/${symbol}`);
    setSymbol('');
  }

  function handleChange(evt) {
    setSymbol(evt.target.value);
  }

  return (
    <nav className="main-nav">
      <div className="logo">
        <Link to="/">
          <img src="https://i.imgur.com/GtqNrzK.png" alt="mockstock" />
        </Link>
      </div>
      <div className="search-bar-container">
        <form className="search-bar" onSubmit={handleSubmit}>
          <i className="material-icons">search</i>
          <input type="text" placeholder="symbol (example: AAPL)" name="symbol" value={symbol} onChange={handleChange}/>
          <button type='submit'>Search</button>
        </form>
      </div>
      <div className="nav-right">
        <Link to="/">About</Link>
        <Link to="/">Investing</Link>
        <Link to="/">Notifications</Link>
        <div className="dropdown">
          <button className="dropbtn" onClick={dropdownClick}>Account</button>
          <div id="dropdown" className="dropdown-content">
            <span>{user.name}</span>
            <Link to="/profile"><div><i className="material-icons">person</i>Profile</div></Link>
            <Link to="/account/investing"><div><i className="material-icons">credit_card</i>Investing</div></Link>
            <Link to="/account/cryto"><div><i className="material-icons">copyright</i>Crypto</div></Link>
            <Link to="/account/recurring"><div><i className="material-icons">event_repeat</i>Recurring</div></Link>
            <Link to="/account/reports-statements"><div><i className="material-icons">description</i>Statements</div></Link>
            <Link to="/account/history"><div><i className="material-icons">history</i>History</div></Link>
            <Link to="/account/settings"><div><i className="material-icons">settings</i>Settings</div></Link>
            <Link to="/account/help"><div><i className="material-icons">info</i>Help</div></Link>
            <Link to="" onClick={handleLogOut}><div><i className="material-icons">logout</i>Log Out</div></Link>
          </div>
        </div>
      </div>
    </nav>
  );
}