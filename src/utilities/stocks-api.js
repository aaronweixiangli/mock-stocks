import sendRequest from "./send-request";
const BASE_URL = '/api/stocks';

export async function getStockData(symbol, startDate, interval) {
    // Use POST instead of GET
    // GET requests should not have a body, 
    // since they do not need to send any data to the server.
    return sendRequest(`${BASE_URL}/${symbol}`, 'POST', { startDate, interval });
}

export async function getStockInfo(symbol) {
    return sendRequest(`${BASE_URL}/${symbol}/info`);
}

export async function marketOrder(symbol, buyOrSell, orderType, sharesOrDollars, shares, dollars) {
    return sendRequest(`${BASE_URL}/market_order`, 'POST', { symbol, buyOrSell, orderType, sharesOrDollars, shares, dollars });
}