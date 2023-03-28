export default function StockOverview({ stockInfo }) {
  return (
    <>
      <h1>About</h1>
      {stockInfo ? (
        <>
          <section className="stock-overview-container">
            <div className="stock-overview-content">
              <p>
                <span>Symbol: </span> {stockInfo.Symbol}
              </p>
              <p>
                <span>Asset Type:</span> {stockInfo.AssetType}
              </p>
              <p>
                <span>Name:</span> {stockInfo.Name}
              </p>
            </div>
            <div className="stock-overview-content">
              <p>
                <span>Exchange:</span> {stockInfo.Exchange}
              </p>
              <p>
                <span>Currency:</span> {stockInfo.Currency}
              </p>
              <p>
                <span>Country:</span> {stockInfo.Country}
              </p>
            </div>
            <div className="stock-overview-content">
              <p>
                <span>Sector:</span> {stockInfo.Sector}
              </p>
              <p>
                <span>Industry:</span> {stockInfo.Industry}
              </p>
              <p>
                <span>Address:</span> {stockInfo.Address}
              </p>
            </div>
            <div className="stock-overview-content">
              <p>
                <span>Fiscal Year End:</span> {stockInfo.FiscalYearEnd}
              </p>
              <p>
                <span>Dividend Date:</span> {stockInfo.DividendDate}
              </p>
              <p>
                <span>Ex-Dividend Date:</span> {stockInfo.ExDividendDate}
              </p>
            </div>
            <p className="stock-description">{stockInfo.Description} </p>
          </section>
          <h1>Key statistics</h1>
          <section className="stock-stats-container">
            <div className="stock-stats-content">
              <div className="stock-stats">
                <span className="info-title">
                  Market Cap:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The total dollar value of a company's outstanding shares
                      of stock.
                    </span>
                  </div>
                </span>{" "}
                ${stockInfo.MarketCapitalization / 1000000}M
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  EBITDA:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      Earnings before interest, taxes, depreciation, and
                      amortization. This metric measures a company's
                      profitability before accounting for non-operating
                      expenses.
                    </span>
                  </div>
                </span>
                ${stockInfo.EBITDA / 1000000}M
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Revenue:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The total revenue earned by a company over the past 12
                      months.
                    </span>
                  </div>
                </span>
                ${stockInfo.RevenueTTM / 1000000}M
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Shares Outstanding:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The total number of shares of a company's stock that are
                      currently held by all its shareholders, including
                      institutional investors, individual investors, and company
                      insiders.
                    </span>
                  </div>
                </span>
                {stockInfo.SharesOutstanding / 1000000}M
              </div>
            </div>
            <div className="stock-stats-content">
              <div className="stock-stats">
                <span className="info-title">
                  Gross Profit:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The total revenue earned by a company minus the cost of
                      goods sold.
                    </span>
                  </div>
                </span>
                ${stockInfo.GrossProfitTTM / 1000000}M
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  P/E Ratio:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      Price-to-earnings ratio. This metric compares a company's
                      current stock price to its earnings per share (EPS) and
                      helps investors evaluate whether the stock is overvalued
                      or undervalued.
                    </span>
                  </div>
                </span>
                {stockInfo.PERatio}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  PEG Ratio:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      Price-to-earnings growth ratio. This metric compares a
                      company's current stock price to its expected earnings
                      growth and can help investors determine if the stock is
                      overvalued or undervalued.
                    </span>
                  </div>
                </span>
                {stockInfo.PEGRatio}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Enterprise Value to Revenue:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      Enterprise value divided by revenue. This metric
                      represents the amount of money investors are willing to
                      pay for every dollar of a company's revenue.
                    </span>
                  </div>
                </span>
                {stockInfo.EVToRevenue}
              </div>
            </div>
            <div className="stock-stats-content">
              <div className="stock-stats">
                <span className="info-title">
                  Earnings per Share:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      Earnings per share. This metric represents the portion of
                      a company's profit that is allocated to each outstanding
                      share of stock.
                    </span>
                  </div>
                </span>
                ${stockInfo.EPS}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Dividend Per Share:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The total amount of dividends paid out to shareholders per
                      share of stock.
                    </span>
                  </div>
                </span>
                ${stockInfo.DividendPerShare}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Dividend Yield:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The annual dividend per share divided by the current stock
                      price. This metric helps investors determine the amount of
                      income they can expect to receive from owning the stock.
                    </span>
                  </div>
                </span>
                {stockInfo.DividendYield}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Book Value per Share:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The total value of a company's assets minus its
                      liabilities and intangible assets.
                    </span>
                  </div>
                </span>
                ${stockInfo.BookValue}
              </div>
            </div>
            <div className="stock-stats-content">
              <div className="stock-stats">
                <span className="info-title">
                  Profit Margin:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The percentage of revenue that is left after deducting all
                      expenses, including taxes and interest.
                    </span>
                  </div>
                </span>
                {stockInfo.ProfitMargin}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Operating Margin:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The percentage of revenue that is left after deducting all
                      operating expenses.
                    </span>
                  </div>
                </span>
                {stockInfo.OperatingMarginTTM}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Revenue per Share:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The total revenue earned by a company over the past 12
                      months divided by the total number of outstanding shares
                      of stock.
                    </span>
                  </div>
                </span>
                ${stockInfo.RevenuePerShareTTM}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Diluted Earnings per Share (EPS) :
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The earnings per share of a company calculated using a
                      more conservative method that assumes all stock options
                      and other potential dilutions have been exercised.
                    </span>
                  </div>
                </span>
                ${stockInfo.DilutedEPSTTM}
              </div>
            </div>
            <div className="stock-stats-content">
              <div className="stock-stats">
                <span className="info-title">
                  Return on Assets (ROA):
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The percentage of profit a company earns in relation to
                      its total assets.
                    </span>
                  </div>
                </span>
                {stockInfo.ReturnOnAssetsTTM}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Return on Equity (ROE):
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The percentage of profit a company earns in relation to
                      its shareholders' equity.
                    </span>
                  </div>
                </span>
                {stockInfo.ReturnOnEquityTTM}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Analyst Target Price:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The median price target of analysts who cover a particular
                      stock.
                    </span>
                  </div>
                </span>
                ${stockInfo.AnalystTargetPrice}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Quarterly Earnings Growth YOY:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The percentage change in a company's earnings over the
                      past quarter compared to the same quarter in the previous
                      year.
                    </span>
                  </div>
                </span>
                {stockInfo.QuarterlyEarningsGrowthYOY}
              </div>
            </div>
            <div className="stock-stats-content">
              <div className="stock-stats">
                <span className="info-title">
                  Beta:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      A measure of a stock's volatility in relation to the
                      overall market.
                    </span>
                  </div>
                </span>
                {stockInfo.Beta}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Forward P/E Ratio:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      Price-to-earnings ratio based on a company's expected
                      earnings over the next 12 months.
                    </span>
                  </div>
                </span>
                {stockInfo.ForwardPE}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Trailing P/E Ratio:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      Price-to-earnings ratio based on a company's earnings from
                      the past 12 months.
                    </span>
                  </div>
                </span>
                {stockInfo.TrailingPE}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Quarterly Revenue Growth YOY:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The percentage change in a company's revenue over the past
                      quarter compared to the same quarter in the previous year.
                    </span>
                  </div>
                </span>
                {stockInfo.QuarterlyRevenueGrowthYOY}
              </div>
            </div>
            <div className="stock-stats-content">
              <div className="stock-stats">
                <span className="info-title">
                  Price-to-Book Ratio:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The company's current stock price divided by its book
                      value per share.
                    </span>
                  </div>
                </span>
                {stockInfo.PriceToBookRatio}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Price-to-Sales Ratio:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The company's current stock price divided by its revenue
                      per share.
                    </span>
                  </div>
                </span>
                {stockInfo.PriceToSalesRatioTTM}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  52-Week High:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The highest price a stock has traded at over the past 52
                      weeks.
                    </span>
                  </div>
                </span>
                ${stockInfo["52WeekHigh"]}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  Enterprise Value to EBITDA:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      Enterprise value divided by earnings before interest,
                      taxes, depreciation, and amortization. This metric is
                      similar to the price-to-earnings ratio but takes into
                      account a company's debt and other liabilities.
                    </span>
                  </div>
                </span>
                {stockInfo.EVToEBITDA}
              </div>
            </div>
            <div className="stock-stats-content">
              <div className="stock-stats">
                <span className="info-title">
                  52-Week Low:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The lowest price at which a stock has traded over the past
                      52 weeks.
                    </span>
                  </div>
                </span>
                ${stockInfo["52WeekLow"]}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  50-Day Moving Average:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The average price of a stock over the past 50 trading
                      days.
                    </span>
                  </div>
                </span>
                ${stockInfo["50DayMovingAverage"]}
              </div>
              <div className="stock-stats">
                <span className="info-title">
                  200-Day Moving Average:
                  <div className="info-detail">
                    i
                    <span className="tooltip-text" id="right">
                      The average price of a stock over the past 200 trading
                      days.
                    </span>
                  </div>
                </span>
                ${stockInfo["200DayMovingAverage"]}
              </div>
            </div>
          </section>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
