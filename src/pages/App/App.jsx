import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../../utilities/users-service';
import * as usersAPI from "../../utilities/users-api";
import './App.css';
import AuthPage from '../AuthPage/AuthPage';
import HomePage from '../HomePage/HomePage';
import NavBar from '../../components/NavBar/NavBar';
import StockPage from '../StockPage/StockPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import InvestingPage from '../InvestingPage/InvestingPage';
import HistoryPage from '../HistoryPage/HistoryPage';

export default function App() {
  const [user, setUser] = useState(getUser());
  const [balance, setBalance] = useState(0);
  const [balanceOnHold, setBalanceOnHold] = useState(0);


  // Get the current user's balance from database, depends on user
  useEffect(() => {
    if (!user) return;
    async function getUserBalance() {
      const balance = await usersAPI.getBalance();
      setBalance(balance);
      const balanceOnHold = await usersAPI.getBalanceOnHold();
      setBalanceOnHold(balanceOnHold);
      console.log('balance', balance)
      console.log('balanceOnHold', balanceOnHold)
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
              <Route path="/stocks/:symbol" element={<StockPage user={user} balance={balance} setBalance={setBalance} balanceOnHold={balanceOnHold} setBalanceOnHold={setBalanceOnHold}/>} />
              <Route path="/" element={<HomePage balance={balance} setBalance={setBalance} balanceOnHold={balanceOnHold}/>} />
              <Route path="/profile" element={<ProfilePage user={user} balance={balance} setBalance={setBalance} balanceOnHold={balanceOnHold} setBalanceOnHold={setBalanceOnHold}/>} />
              <Route path="/account/investing" element={<InvestingPage user={user} balance={balance} setBalance={setBalance} balanceOnHold={balanceOnHold} setBalanceOnHold={setBalanceOnHold}/>} />
              <Route path="/account/history" element={<HistoryPage user={user}/>} />
            </Routes>
          </>
          :
          <AuthPage setUser={setUser} />
      }
    </main>
  );
}
