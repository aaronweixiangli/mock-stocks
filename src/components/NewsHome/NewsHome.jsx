import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as newsAPI from "../../utilities/news-api";

export default function NewsHome() {
    const [news, setNews] = useState([]);
    useEffect(function() {
        async function getNews() {
            const news = await newsAPI.getAllNews();
            console.log(news);
            console.log(Array.isArray(news));
            console.log(new Date(news[0].time_published));
            setNews(news);
        }
        getNews();

    },[])

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

    const news_card = news.map((n) => 
        <a href={n.url} className="news-container">
            <div className="news-content-left">
                <span className="news-time">{n.source} &nbsp; {getTimeDiff(n.time_published)}</span>
                <p>{n.title}</p>
                <div className="news-ticker">{ n.ticker_sentiment.map((t) => <Link to="/" className="ticker_sentiment" >{t.ticker}</Link>)}</div>
                <div>{ n.topics.map((t,idx) => <span className="topic" key={idx}>{t.topic}</span>)}</div>
            </div>
            <div className="news-content-right">
                <span className="news-time">{getTimePDT(n.time_published)}</span>
                <img src={n.banner_image} alt="news-img"/>
            </div>
        </a>
    );

    return (
        <>
            {news.length ? 
            <>  
                {news_card}
            </>
            : <p>News are still loading. Try rephrash the page.</p>}
        </>
    )
}