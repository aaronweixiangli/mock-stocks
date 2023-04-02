import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./StockPage.css";
import * as stocksAPI from "../../utilities/stocks-api";
import * as usersAPI from "../../utilities/users-api";
import StockChart from "../../components/StockChart/StockChart";
import StockOverview from "../../components/StockOverview/StockOverview";
import StockNews from "../../components/StockNews/StockNews";
import StockOrder from "../../components/StockOrder/StockOrder";

export default function StockPage( {user, balance, setBalance, balanceOnHold, setBalanceOnHold} ) {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState(null);
  const [dataStartDate, setDataStartDate] = useState(getStartDate_1D());
  const [dataInterval, setDataInterval] = useState('1min');
  const [error, setError] = useState(false);
  const [chartBtn, setChartBtn] = useState('1D');
  const [stockInfo, setStockInfo] = useState(null);

  const [sharesOwn, setSharesOwn] = useState(0);
  const [sharesOnHold, setSharesOnHold] = useState(0);

  // Get stock price data
  useEffect(function() {
    async function getData() {
      try {
        const data = await stocksAPI.getStockData( symbol, dataStartDate, dataInterval );
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
  }, [symbol, dataStartDate]);

  // Get stock info data
  useEffect(function() {
    async function getStockInfo() {
      try {
        const infoData = await stocksAPI.getStockInfo(symbol);
        console.log("Overview", infoData)
        setStockInfo(infoData);
      } catch {
        setStockInfo(null);
      }
    }
    getStockInfo();
  }, [symbol]);

  // Get stock shares owned and shares on hold by the user for this stock  
  useEffect(function() {
    async function getStockOwnShares() {
      if (!user) return;
      const sharesOwn = await usersAPI.getSharesOwn(symbol);
      const sharesOnHold = await usersAPI.getSharesOnHold(symbol);
      console.log('sharesOwn', sharesOwn);
      console.log('sharesOnHold', sharesOnHold);
      setSharesOwn(sharesOwn);
      setSharesOnHold(sharesOnHold);
    }
    getStockOwnShares();
  }, [symbol, user]);


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
    // Set the start time to 6:30 AM PDT. Store them as constant for getStartDate functions
    const startHour = 6;
    const startMinute = 30;
    const startSecond = 0;
    const startMillisecond = 0;
    // Set the statrDate to be a date object
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

  function getStartDate_1W() {
    const today = new Date();
    // Subtract one week from today's date
    const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 7,
        6,30,0,0 //6:30 AM
    );
    // Convert the start date to a string in this format: YYYY-MM-DD HH:mm:ss
    const dateString = startDate.toISOString().substring(0, 10); // Get the date part of the ISO string
    const timeString = startDate.toTimeString().substring(0, 8); // Get the time part of the time string
    const startDateStr = `${dateString} ${timeString}`; // Combine the date and time parts
    return startDateStr;
  }

  function getStartDate_1M() {
    const today = new Date();
    // Subtract one month from today's date
    const startDate = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate(),
        6,30,0,0 //6:30 AM
    );
    // Convert the start date to a string in this format: YYYY-MM-DD HH:mm:ss
    const dateString = startDate.toISOString().substring(0, 10); // Get the date part of the ISO string
    const timeString = startDate.toTimeString().substring(0, 8); // Get the time part of the time string
    const startDateStr = `${dateString} ${timeString}`; // Combine the date and time parts
    return startDateStr;
  }

  function getStartDate_3M() {
    const today = new Date();
    // Subtract three month from today's date
    const startDate = new Date(
        today.getFullYear(),
        today.getMonth() - 3,
        today.getDate(),
        6,30,0,0 //6:30 AM
    );
    // Convert the start date to a string in this format: YYYY-MM-DD HH:mm:ss
    const dateString = startDate.toISOString().substring(0, 10); // Get the date part of the ISO string
    const timeString = startDate.toTimeString().substring(0, 8); // Get the time part of the time string
    const startDateStr = `${dateString} ${timeString}`; // Combine the date and time parts
    return startDateStr;
  }

  function getStartDate_1Y() {
    const today = new Date();
    // Subtract three month from today's date
    const startDate = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate(),
        6,30,0,0 //6:30 AM
    );
    // Convert the start date to a string in this format: YYYY-MM-DD HH:mm:ss
    const dateString = startDate.toISOString().substring(0, 10); // Get the date part of the ISO string
    const timeString = startDate.toTimeString().substring(0, 8); // Get the time part of the time string
    const startDateStr = `${dateString} ${timeString}`; // Combine the date and time parts
    return startDateStr;
  }

  function getStartDate_5Y() {
    const today = new Date();
    // Subtract three month from today's date
    const startDate = new Date(
        today.getFullYear() - 5,
        today.getMonth(),
        today.getDate(),
        6,30,0,0 //6:30 AM
    );
    // Convert the start date to a string in this format: YYYY-MM-DD HH:mm:ss
    const dateString = startDate.toISOString().substring(0, 10); // Get the date part of the ISO string
    const timeString = startDate.toTimeString().substring(0, 8); // Get the time part of the time string
    const startDateStr = `${dateString} ${timeString}`; // Combine the date and time parts
    return startDateStr;
  }

  function handleOneDay() {
    setDataStartDate(getStartDate_1D());
    setDataInterval('1min');
    const chartBtns = [...document.getElementsByClassName('chart-btn')];
    // remove 'active' class for all chartBtns
    chartBtns.forEach(btn => btn.classList.remove('active'));
    chartBtns[0].classList.add('active');
  }

  function handleOneWeek() {
    setDataStartDate(getStartDate_1W());
    setDataInterval('5min');
    const chartBtns = [...document.getElementsByClassName('chart-btn')];
    chartBtns.forEach(btn => btn.classList.remove('active'));
    chartBtns[1].classList.add('active');
  }

  function handleOneMonth() {
    setDataStartDate(getStartDate_1M());
    setDataInterval('1h');
    const chartBtns = [...document.getElementsByClassName('chart-btn')];
    chartBtns.forEach(btn => btn.classList.remove('active'));
    chartBtns[2].classList.add('active');
  }

  function handleThreeMonths() {
    setDataStartDate(getStartDate_3M());
    setDataInterval('1day');
    const chartBtns = [...document.getElementsByClassName('chart-btn')];
    chartBtns.forEach(btn => btn.classList.remove('active'));
    chartBtns[3].classList.add('active');
  }

  function handleOneYear() {
    setDataStartDate(getStartDate_1Y());
    setDataInterval('1day');
    const chartBtns = [...document.getElementsByClassName('chart-btn')];
    chartBtns.forEach(btn => btn.classList.remove('active'));
    chartBtns[4].classList.add('active');
  }

  function handleFiveYears() {
    setDataStartDate(getStartDate_5Y());
    setDataInterval('1week');
    const chartBtns = [...document.getElementsByClassName('chart-btn')];
    chartBtns.forEach(btn => btn.classList.remove('active'));
    chartBtns[5].classList.add('active');
  }


  if (error) return (
    <main className="StockPage">
      <h1>{symbol}</h1>
      <h2>Symbol not found. <br/><br/>Invalid input: {symbol}. <br/><br/>Please double-check and try again. <br/><br/>Remember to enter the stock symbol instead of the company name. For example, instead of searching for APPLE, use the stock symbol AAPL.</h2>
      <h2>Sometimes it can be the network issue. If the input is valid, try refreshing the page later.</h2>
    </main>
  )
  return (
    <main className="StockPage">
      <h1>{symbol}</h1>
      { stockData 
        ? 
        <>
          <div className="stock-info">
            <span>Type: {stockData.meta.type}</span>
            <span>Exchange: {stockData.meta.exchange}</span>
            <span>Exchange Timezone: {stockData.meta.exchange_timezone}</span>
            <span>Chart Timezone: America/Los_Angeles</span>
          </div>
          <StockChart stockData={stockData}/>
          <div className="chart-btns-container">
            <button className={ `chart-btn ${chartBtn === '1D' ? 'active' : ''}` } onClick={handleOneDay}>1D</button>
            <button className={ `chart-btn ${chartBtn === '1W' ? 'active' : ''}` } onClick={handleOneWeek}>1W</button>
            <button className={ `chart-btn ${chartBtn === '1M' ? 'active' : ''}` } onClick={handleOneMonth}>1M</button>
            <button className={ `chart-btn ${chartBtn === '3M' ? 'active' : ''}` } onClick={handleThreeMonths}>3M</button>
            <button className={ `chart-btn ${chartBtn === '1Y' ? 'active' : ''}` } onClick={handleOneYear}>1Y</button>
            <button className={ `chart-btn ${chartBtn === '5Y' ? 'active' : ''}` } onClick={handleFiveYears}>5Y</button>
          </div>
          <StockOverview stockInfo={stockInfo}/>
          <StockNews symbol={symbol} />
          <StockOrder symbol={symbol} marketPrice={stockData.values[0].open} user={user} sharesOwn={sharesOwn} setSharesOwn={setSharesOwn} sharesOnHold={sharesOnHold} setSharesOnHold={setSharesOnHold} balance={balance} setBalance={setBalance} balanceOnHold={balanceOnHold} setBalanceOnHold={setBalanceOnHold}/>
        </>
          :
          <p>Loading...</p>
      }
    </main>
  );
}