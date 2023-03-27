import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { CategoryScale, Tooltip } from "chart.js";
import "./StockPage.css";
import StockChart from "../../components/StockChart/StockChart";
import * as stocksAPI from "../../utilities/stocks-api";

export default function StockPage() {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [dataStartDate, setDataStartDate] = useState(getStartDate_1D());
  const [interval, setInterval] = useState('1min');
  const [error, setError] = useState(false);

  useEffect(function() {
    async function getData() {
      try {
        const data = await stocksAPI.getStockData( symbol, dataStartDate, interval );
        console.log(data);
        console.log('labels', data.values.map((value) => value.datetime))
        console.log('data.close', data.values.map((value) => value.close))
        setStockData(data);
        setError(false);
      } catch {
        setError(true);
      }
    }
    getData();
  }, [symbol, dataStartDate])

  function getStartDate_1D() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    // If today is Saturday or Sunday, set the start date to the previous Friday
    if (dayOfWeek === 6) { // Saturday
      today.setDate(today.getDate() - 1);
    } else if (dayOfWeek === 0) { // Sunday
      today.setDate(today.getDate() - 2);
    } else if ( dayOfWeek === 1 && ( today.getHours() < 6 || (today.getHours() === 6 && today.getMinutes() < 30) ) ) {
      // If today is Monday before 6:30 AM, set the start date to the previous Friday
      today.setDate(today.getDate() - 3);
    } else if ( dayOfWeek > 1 && dayOfWeek < 6 && ( today.getHours() < 6 || (today.getHours() === 6 && today.getMinutes() < 30) ) ) {
      // If today is Weekday(except Monday) before 6:30 AM, set the start date to the previous day
      today.setDate(today.getDate() - 1);
    }
    // Set the start time to 6:30 AM PDT
    const startHour = 6;
    const startMinute = 30;
    const startSecond = 0;
    const startMillisecond = 0;
    // Set the timezone to PDT
    const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        startHour,
        startMinute,
        startSecond,
        startMillisecond
    );
    // Convert the start date to a string in this format: YYYY-MM-DD HH:mm:ss
    const dateString = startDate.toISOString().substring(0, 10); // Get the date part of the ISO string
    const timeString = startDate.toTimeString().substring(0, 8); // Get the time part of the time string
    const startDateStr = `${dateString} ${timeString}`; // Combine the date and time parts

    return startDateStr;
  }

  if (error) return (
    <main className="StockPage">
      <h2>Invalid Symbol. {symbol} is not found. Please double check and do another search.</h2>
    </main>
  )

  return (
    <main className="StockPage">
      <h1>{symbol}</h1>
      { stockData 
        ? 
        <>
          <span>Exchange: {stockData.meta.exchange}</span>
          <StockChart stockData={stockData}/>
        </>
          :
          <p>Loading...</p>
      }
    </main>
  );
}