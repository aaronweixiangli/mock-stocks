import { Link } from 'react-router-dom';
import * as userService from '../../utilities/users-service';

export default function NavBar({ user, setUser }) {
  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }
  function dropdownClick() {
    document.getElementById("dropdown").classList.toggle("show");
  }

  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  return (
    <nav className="main-nav">
      <div className="logo">LOGO</div>
      <div className="search-bar-container">
        <form className="search-bar">
          <i className="material-icons">search</i>
          <input type="text" placeholder="symbol" name="symbol" />
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
            <Link to="/"><div><i className="material-icons">person</i>Profile</div></Link>
            <Link to="/"><div><i className="material-icons">credit_card</i>Investing</div></Link>
            <Link to="/"><div><i className="material-icons">copyright</i>Crypto</div></Link>
            <Link to="/"><div><i className="material-icons">attach_money</i>Buy in</div></Link>
            <Link to="/"><div><i className="material-icons">history</i>History</div></Link>
            <Link to="/"><div><i className="material-icons">info</i>Help</div></Link>
            <Link to="" onClick={handleLogOut}><div><i className="material-icons">logout</i>Log Out</div></Link>
          </div>
        </div>
      </div>
    </nav>
  );
}