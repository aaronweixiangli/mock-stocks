import "./AboutPage.css";

export default function AboutPage() {
    return (
        <main className="AboutPage">
            <h1>About MockStocks</h1>
            <section>
                <p>MockStocks is a stock trading simulation platform designed for educational and entertainment purposes. Our platform allows users to trade stocks with virtual money and learn how to invest in the stock market without risking their own capital.</p>
                <p>Currently, we only support limit orders and market orders. However, we are continuously working on developing and adding more order types such as stop loss orders, stop limit orders, trailing stop orders, and recurring investments. We are also planning to introduce crypto trading soon, so stay tuned for updates on our progress!</p>
                <p>Thank you for choosing MockStocks as your go-to platform for learning and practicing stock trading.</p>
            </section>
            <h1>About the Developer - Aaron Li</h1>
            <section>
                <p><span>A little about my educational background:</span> <br /> I graduated from the University of Washington with a Master's degree in Computational Finance and Risk Management. Prior to that, I earned a Bachelor's degree in Joint Mathematics and Economics from the University of California San Diego.</p>
                <p><span>A little about the project:</span>  <br /> This project was built using React, Node, Express, and MongoDB, and utilizes Twelve Data API for real-time time series data, as well as the Alpha Vantage API for news and stock overview data.</p>   
                <p><span>A little message to users:</span>  <br /> I developed this project on my own in just 10 days, so while I have tested it extensively, there may still be some issues or unusual behavior that I haven't encountered yet. If you run into any problems, or have any feedback or suggestions, please don't hesitate to reach out to me at aaronlicareer@gmail.com. Thank you!</p>
            </section>
            <section className="about-page-end">
                <p>If you are interested in exploring the project's source code, feel free to check out the project's GitHub repository at <a href="https://github.com/aaronweixiangli/mock-stocks">MockStocks Github</a> .</p> 
                <p>If you would like to connect with me or learn more about my background and experience, feel free to visit my LinkedIn profile at <a href="https://www.linkedin.com/in/aaronweixiangli/">My LinkedIn Profile</a> .</p> 
            </section>
        </main>
    )
}