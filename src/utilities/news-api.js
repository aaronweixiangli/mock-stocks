import sendRequest from "./send-request";
const BASE_URL = "/api/news";

export async function getAllNews() {
  return sendRequest(BASE_URL);
}

export async function getStockNews(symbol) {
  return sendRequest(`${BASE_URL}/${symbol}`);
}
