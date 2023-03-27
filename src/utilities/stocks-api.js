import sendRequest from "./send-request";
const BASE_URL = '/api/stocks';

export async function getStockData(symbol, startDate, interval) {
    console.log('type symbol',typeof(symbol));
    console.log(symbol);
    console.log('type date',typeof(startDate));
    console.log(startDate);
    console.log('type date',typeof(interval));
    console.log(interval);
    // Use POST instead of GET
    // GET requests should not have a body, 
    // since they do not need to send any data to the server.
    return sendRequest(`${BASE_URL}/${symbol}`, 'POST', { startDate, interval });
}