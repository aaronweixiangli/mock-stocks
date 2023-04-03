import sendRequest from "./send-request";
const BASE_URL = '/api/users';

export async function signUp(userData) {
  return sendRequest(BASE_URL, 'POST', userData);
}

export async function login(credentials) {
  return sendRequest(`${BASE_URL}/login`, 'POST', credentials);
}

// when the payload is a float number, 
// it cannot be directly stringified as JSON
// Hence set payload to be an object
export async function deposit(amount) {
  console.log('API amount', amount)
  return sendRequest(`${BASE_URL}/deposit`, 'PUT', { amount });
}

export async function getBalance() {
  return sendRequest(`${BASE_URL}/balance`);
}

export async function getBalanceOnHold() {
  return sendRequest(`${BASE_URL}/balance_on_hold`);
}

export async function getSharesOwn(symbol) {
  return sendRequest(`${BASE_URL}/stock_shares_own/${symbol}`);
}

export async function getSharesOnHold(symbol) {
  return sendRequest(`${BASE_URL}/stock_shares_on_hold/${symbol}`);
}

export async function getBrokerageHolding() {
  return sendRequest(`${BASE_URL}/brokerage_holding`);
}

export async function getStocksHolding() {
  return sendRequest(`${BASE_URL}/stocks_holding`);
}

export async function getHistory() {
  return sendRequest(`${BASE_URL}/history`);
}

export async function getPendingOrder() {
  return sendRequest(`${BASE_URL}/pending_order`);
}

export async function cancelOrder(id) {
  return sendRequest(`${BASE_URL}/cancel_order/${id}`, 'DELETE');
}

export async function getStockWatch(symbol) {
  return sendRequest(`${BASE_URL}/stock_watch/${symbol}`);
}

export async function toggleStockWatch(symbol) {
  return sendRequest(`${BASE_URL}/toggle_stock_watch/${symbol}`);
}