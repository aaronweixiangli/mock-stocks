import "./HomePage.css"
import WatchList from "../../components/WatchList/WatchList";
import BuyingPower from "../../components/BuyingPower/BuyingPower";

export default function HomePage({ user, setUser }) {
  return (
    <main className="HomePage">
      <h1>HomePage</h1>
      <WatchList />
      <img src="https://cdn.robinhood.com/assets/generated_assets/webapp/web-platform-prefetch-sdp/member/04a63fd4f116951d91ad9b6037b42ee1.svg" alt="homepage-img" />
      <h1>Welcome to MockStocks</h1>
      <BuyingPower user={user} setUser={setUser}/>
    </main>
  );
}