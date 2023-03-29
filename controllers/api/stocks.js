const Twelve_Data_API_Key = process.env.Twelve_Data_API_Key;
const Alpha_Vantage_API_Key = process.env.Alpha_Vantage_API_Key;

module.exports = {
    getStock,
    getStockInfo,
};

async function getStock(req, res) {
    try {
        const symbol = req.params.symbol;
        const interval = req.body.interval;
        const startDate = req.body.startDate;
        const stock = await fetch(`https://api.twelvedata.com/time_series?apikey=${Twelve_Data_API_Key}&interval=${interval}&format=JSON&timezone=America/Los_Angeles&symbol=${symbol}&start_date=${startDate}&dp=2`)
        .then(res => res.json());
        res.json(stock);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function getStockInfo(req, res) {
    try {
        const symbol = req.params.symbol;
        const stockInfo = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${Alpha_Vantage_API_Key}`).then(res => res.json());
        res.json(stockInfo);
    } catch (err) {
        res.status(400).json(err);
    }
}
