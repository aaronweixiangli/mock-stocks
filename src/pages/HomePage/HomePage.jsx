import "./HomePage.css"
import WatchList from "../../components/WatchList/WatchList";
import BuyingPower from "../../components/BuyingPower/BuyingPower";
import NewsHome from "../../components/NewsHome/NewsHome";
import LearnInvesting from "../../components/LearnInvesting/LearnInvesting";

export default function HomePage({ balance, setBalance }) {
  return (
    <main className="HomePage">
      <h1>HomePage</h1>
      <WatchList />
      <img src="https://cdn.robinhood.com/assets/generated_assets/webapp/web-platform-prefetch-sdp/member/04a63fd4f116951d91ad9b6037b42ee1.svg" alt="homepage-img" />
      <h1>Welcome to MockStocks</h1>
      <BuyingPower balance={balance} setBalance={setBalance}/>
      <h1>Learn About Investing</h1>
      <LearnInvesting />
      <h1>News</h1>
      <NewsHome />
    </main>
  );
}