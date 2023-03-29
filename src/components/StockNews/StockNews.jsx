import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as newsAPI from "../../utilities/news-api";

export default function StockNews( {symbol} ) {
    const [news, setNews] = useState(null);
    useEffect(function() {
        async function getNews() {
            console.log('stocknews symbol', symbol);
            try {
                const news = await newsAPI.getStockNews(symbol);
                console.log(news)
                setNews(news);
            } catch {
                setNews(null);
            }
        }
        getNews();
    },[symbol])

    function getTimeDiff(timePublished) {
        const publishedTime = new Date(
          timePublished.slice(0, 4),
          timePublished.slice(4, 6) - 1,
          timePublished.slice(6, 8),
          timePublished.slice(9, 11),
          timePublished.slice(11, 13),
          timePublished.slice(13, 15)
        );
        // convert to Pacific Time
        publishedTime.setHours(publishedTime.getHours() - 7);
        const currentTime = new Date();
        const diffInMs = currentTime - publishedTime;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        return diffInHours > 0 ? diffInHours + "h" : "<1h";
    }

    function getTimePDT(timePublished) {
        const publishedTime = new Date(
          timePublished.slice(0, 4),
          timePublished.slice(4, 6) - 1,
          timePublished.slice(6, 8),
          timePublished.slice(9, 11),
          timePublished.slice(11, 13),
          timePublished.slice(13, 15)
        );
        // convert to Pacific Time
        publishedTime.setHours(publishedTime.getHours() - 7);
        const publishedTimePDT = publishedTime.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
        });
        return `${publishedTimePDT} PDT`;
    }

    const navigate = useNavigate();

    function handleClick(evt, ticker) {
        // Prevent navigating to the news article url
        evt.preventDefault();
        // navigate to stock detail page
        navigate(`/stocks/${ticker}`);
    }
    let news_card;
    if (news) {
        news_card = news.map((n, index) => 
            <a href={n.url} className="news-container" key={index}>
                <div className="news-content-left">
                    <span className="news-time">{n.source} &nbsp; {getTimeDiff(n.time_published)}</span>
                    <p>{n.title}</p>
                    <div className="news-ticker">{ n.ticker_sentiment.map((t, idx) => <span className="ticker_sentiment" key={idx} onClick={(evt) => handleClick(evt, t.ticker)}>{t.ticker}</span>)}</div>
                    <div className="news-topic">{ n.topics.map((t,idx) => <span className="topic" key={idx}>{t.topic}</span>)}</div>
                </div>
                <div className="news-content-right">
                    <span className="news-time">{getTimePDT(n.time_published)}</span>
                    <img src={n.banner_image} alt="news-img"/>
                </div>
            </a>
        );
    }

    return (
        <>
            <h1>News</h1>
            { news ?
            <section className="stock-news-container">
                {news_card}
            </section>
            :
            <p>Loading....  if it loads more than 30 seconds, try refreshing the page.</p> }
        </>
    )
}