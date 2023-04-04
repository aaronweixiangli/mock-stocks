<div align="center" id="mockstocks">
   <img width="302" alt="mockstocks" src="https://i.imgur.com/mSyRgSe.png">
</div>

<div align="center" id="header">
   
# MockStocks
**Created by [Aaron Li](https://www.linkedin.com/in/weixiangaaronli/)**
### [CLICK TO DEMO](https://mock-stocks-al.herokuapp.com/)

</div>
  
## 📝 Description
MockStocks is a MERN stack project built using MongoDB, Express, React, and Node. It is a stock trading simulation platform designed for educational and entertainment purposes, allowing users to trade stocks with virtual money and learn how to invest in the stock market without risking their own capital.

The platform features a responsive and intuitive UI, with an investment page for users to track their portfolio and stocks, as well as a transaction history that includes the ability to cancel pending orders. Users receive immediate notification of any actions such as order cancellation, order expiration, deposit made, transaction executed, and order placement success or failure.

MockStocks offers a comprehensive stock analysis tool, featuring dynamic charts that allow users to view stock performance over various timeframes, including 1 day, 1 week, 1 month, 3 months, 1 year, and 5 years. In addition to charting, users can access stock overviews and key statistics, as well as news related to the stock. Users can also add stocks to their watchlist for easy tracking and monitoring of their favorite stocks. With these features, MockStocks provides a comprehensive suite of tools to help users make informed decisions about their investments.

MockStocks follows real-world trading practices for orders placed when the market is open or closed. Currently, the platform supports limit orders and market orders, but it will continuously work on developing and adding more order types such as stop loss orders, stop limit orders, trailing stop orders, and recurring investments.

In addition to stock trading, MockStocks plans to introduce crypto trading. The platform utilizes Twelve Data API for real-time time series data and the Alpha Vantage API for news and company overview data.

Please note that while extensive testing has been conducted, there may still be some issues or unusual behavior that haven't been encountered yet. If you encounter any problems or have any feedback or suggestions, please don't hesitate to reach out to the MockStocks team at aaronlicareer@gmail.com. Thank you for choosing MockStocks as your go-to platform for learning and practicing stock trading.


## 💻 Screenshots
| Screenshot | Description |
|:------------:|:------------:|
|**Auth Page**| <img src="https://i.imgur.com/QNM26UG.png" width="600">  
|**Home Page**| <img src="https://i.imgur.com/a7U8diU.png" width="600">  
|**Home Page**| <img src="https://i.imgur.com/AC3Mv86.png" width="600"> 
|**Stock Page**| <img src="https://i.imgur.com/44xO1rv.png" width="600"> 
|**Stock Page**| <img src="https://i.imgur.com/Gf529Bo.png" width="600"> 
|**Stock Page**| <img src="https://i.imgur.com/S7T2wcD.png" width="600"> 
|**Place Order**| <img src="https://i.imgur.com/fZ3tDuu.png" width="600"> 
|**Order Confirm**| <img src="https://i.imgur.com/8Hv3CF4.png" width="600"> 
|**Profile Page**| <img src="https://i.imgur.com/v5VPXtM.png" width="600"> 
|**Investing Page**| <img src="https://i.imgur.com/S3yltHA.png" width="600"> 
|**History Page**| <img src="https://i.imgur.com/a79EZsB.png" width="600"> 
|**Notification Page**| <img src="https://i.imgur.com/zQimiis.png" width="600"> 


## 💻 Technologies Used
- ![React](https://img.shields.io/badge/-React.js-05122A?style=flat&logo=visualstudio)
- ![Node](https://img.shields.io/badge/-Node.js-05122A?style=flat&logo=node.js)
- ![Express](https://img.shields.io/badge/-Express.js-05122A?style=flat&logo=express)
- ![MongoDB](https://img.shields.io/badge/-MongoDB-05122A?style=flat&logo=mongodb)
- ![JavaScript](https://img.shields.io/badge/-JavaScript-05122A?style=flat&logo=javascript)
- ![CSS3](https://img.shields.io/badge/-CSS_Grid-05122A?style=flat&logo=css3) 
- ![HTML5](https://img.shields.io/badge/-HTML5-05122A?style=flat&logo=html5)  
- ![Git](https://img.shields.io/badge/-Git-05122A?style=flat&logo=git)
- ![Github](https://img.shields.io/badge/-GitHub-05122A?style=flat&logo=github)
- ![VSCode](https://img.shields.io/badge/-VS_Code-05122A?style=flat&logo=visualstudio)


## 🔥 Getting Started

Welcome to Mockstocks, your your go-to platform for learning and practicing stock trading. Follow these simple steps to get started:
<details open>
<summary> Getting Started with MockStocks </summary>

1. `Sign up` for an account by providing your name and email address.

2. On the homepage, you can click on the `Buying Power` section and expand it to see the `Deposit Funds` button. By default, you'll begin with $10,000 virtual money.

3. Explore the `Learn About Investing` section if you're interested in gaining basic investment knowledge. Click on the card to be directed to an article website.

4. Stay up-to-date with the latest news in the `News` section. Each news article lists the stocks affected by the news. Click on the symbol to be directed to the stock detail page.

5. Ready to start searching for stocks? Simply type in the symbol you're interested in using the `search bar`. Note that the input must be a valid symbol.

6. Once you're on a stock detail page, use the `dynamic chart` to observe stock price changes over various time periods. Hover over the chart to see the corresponding vertical line and the stock price on that date and time.

7. Take a deep dive into the stock's details using the `About` section, `Key Statistics`, and `News` section.

8. Add the stock to your watchlist by clicking the `Add to List` button. If the stock is already in your watchlist, the button will read `Remove from List`.

9. To place an order, complete the form on the stock detail page. You can select either a `market order` or a `limit order`, but you must satisfy certain conditions before being able to review and submit your order. It is worth noting that at present, we only accept market and limit orders. Nevertheless, forms for other order types like stop loss order, stop limit order, trailing stop order, and recurring investment are accessible, but you cannot place these orders as they are not supported at this time.

10. If you meet the criteria, the `Review Order` button will be available. Once you click it, you'll see the order details. When you `place the order`, you'll be notified whether the order succeeds or fails. Keep in mind that MockStocks follows real-world trading practices, such as pending market orders outside of trading hours.

11. After placing an order, you'll receive an `immediate notification`. The notification will have a red dot in the navigation bar indicating that you have unread messages. You'll also receive notifications whenever an order executes, transaction is made, deposit is made, order expires, order is cancelled, etc. Your buying power and available shares will also be updated.

12. Click on `Account` and select `Profile` to view your profile page, which contains your `investing value`, `brokerage holdings`, and `brokerage cash` info.

13. Click on `Account` and select `Investing` to view your portfolio value, consisting of `Stocks & Options` and `Brokerage Cash`. You can see the `current price`, `total return`, and `current equity` for each stock in your portfolio, as well as visualizations in the form of doughnut charts.

14. Click on `Account` and select `History` to see your `pending orders`, recent `transaction history`, or `deposit history`. In the pending orders section, you can click on an order to see its details and `cancel` it if necessary.

</details>

<details open>
<summary>Trello Board</summary>
<a href="https://trello.com/b/Hw1R35WG/mockstocks">https://trello.com/b/Hw1R35WG/mockstocks</a>
</details>


<details open>
<summary>Deployed Link (Heroku)</summary>
<a href="https://mock-stocks-al.herokuapp.com/">https://mock-stocks-al.herokuapp.com/</a>
</details>

## 📡 Upcoming Features
- [❌] `More Order Types`: Introducing additional order types such as stop loss order, stop limit order, trailing stop order, and recurring investment. These features will allow users to set specific conditions for buying and selling stocks and automate their investment strategy.
- [❌] `Crypto trading`: Adding support for crypto trading, along with a crypto watchlist and other related features. This will allow users to diversify their portfolio and invest in cryptocurrencies right from our platform.
- [❌] `Enhancing Platform Functionality`: Completing the remaining functionality for crypto trading, recurring investments, reports and statements, settings, help, and other important components. These enhancements will provide a more seamless and user-friendly experience, making it easier for users to manage their investments and access important information.

I am dedicated to improving this platform and providing the best possible experience for its users. Stay tuned for these exciting updates and more!


