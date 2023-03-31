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

export async function getSharesOwn(symbol) {
  return sendRequest(`${BASE_URL}/stock_shares_own/${symbol}`);
}