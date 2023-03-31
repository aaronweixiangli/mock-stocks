import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../../utilities/users-service';
import * as usersAPI from "../../utilities/users-api";
import './App.css';
import AuthPage from '../AuthPage/AuthPage';
import HomePage from '../HomePage/HomePage';
import NavBar from '../../components/NavBar/NavBar';
import StockPage from '../StockPage/StockPage';

export default function App() {
  const [user, setUser] = useState(getUser());
  const [balance, setBalance] = useState(0);
  
  // Get the current user's balance from database, depends on user
  useEffect(() => {
    if (!user) return;
    async function getUserBalance() {
      const balance = await usersAPI.getBalance();
      setBalance(balance);
      console.log('balance', balance)
    }
    getUserBalance();
  }, [user])

  return (
    <main className="App">
      { user ?
          <>
            <NavBar user={user} setUser={setUser} />
            <Routes>
              {/* Route components in here */}
              <Route path="/stocks/:symbol" element={<StockPage user={user} balance={balance}/>} />
              <Route path="/" element={<HomePage balance={balance} setBalance={setBalance}/>} />
            </Routes>
          </>
          :
          <AuthPage setUser={setUser} />
      }
    </main>
  );
}
