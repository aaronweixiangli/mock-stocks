import { useState, useEffect } from "react";
import "./HomePage.css"
import WatchList from "../../components/WatchList/WatchList";
import BuyingPower from "../../components/BuyingPower/BuyingPower";
import NewsHome from "../../components/NewsHome/NewsHome";
import LearnInvesting from "../../components/LearnInvesting/LearnInvesting";
import * as usersAPI from "../../utilities/users-api";

export default function HomePage({ user, balance, setBalance, balanceOnHold }) {
  const [stockWatchList, setStockWatchList] = useState(null);

  useEffect(() => {
    if (!user) return;
    async function getUserStockWatchList() {
      const stockWatchList = await usersAPI.getStockWatchList();
      console.log('stockWatchList',stockWatchList);
      console.log('is array stockWatchList', Array.isArray(stockWatchList));
      setStockWatchList(stockWatchList);
    }
    getUserStockWatchList();
  }, [user]);

  return (
    <main className="HomePage">
      <h1>HomePage</h1>
      <WatchList stockWatchList={stockWatchList}/>
      <img src="https://cdn.robinhood.com/assets/generated_assets/webapp/web-platform-prefetch-sdp/member/04a63fd4f116951d91ad9b6037b42ee1.svg" alt="homepage-img" />
      <h1>Welcome to MockStocks</h1>
      <BuyingPower balance={balance} setBalance={setBalance} balanceOnHold={balanceOnHold}/>
      <h1>Learn About Investing</h1>
      <LearnInvesting />
      <h1>News</h1>
      <NewsHome />
    </main>
  );
}