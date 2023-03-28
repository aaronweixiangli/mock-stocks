const Alpha_Vantage_API_Key = process.env.Alpha_Vantage_API_Key;

module.exports = {
    getAllNews
};

async function getAllNews(req, res) {
    try {
        const news = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${Alpha_Vantage_API_Key}`).then(res => res.json());
        res.json(news.feed);
    } catch (err) {
        res.status(400).json(err);
    }
}
