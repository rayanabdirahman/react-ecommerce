import { API_BASE_URL } from "../config";

const API_CREATE_ORDER = `${API_BASE_URL}/order/create`
const API_GET_ORDERS = `${API_BASE_URL}/order`
const API_GET_STATUS_VALUES = `${API_BASE_URL}/order/status-values`

/**
 * Create order
 * @param { string } userId - stores logged in user id
 * @param { string } token - stores user bearer token
 * @param { any } order - stores required order details for creating a new order
 */
export const createOrder = async(userId: string, token: string, order:  any) => {
  try {
    let response = await fetch(`${API_CREATE_ORDER}/${userId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ order })
    })

    return await response.json();

  } catch(error) {
    console.log(error)
    console.error(`API CALL:createOrder=>>>>>> Error when creating a order: ${error}`)
  }
}

/**
 * Return a list of all orders
 * @param { string } userId - stores logged in user id
 * @param { string } token - stores user bearer token
 */
export const getOrders = async(userId: string, token: string,) => {
  try {
    let response = await fetch(`${API_GET_ORDERS}/${userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    })

    return await response.json();

  } catch(error) {
    console.log(error)
    console.error(`API CALL:getOrders=>>>>>> Error when getting a list of all orders: ${error}`)
  }
}

/**
 * Return a list of all status values for orders
 * @param { string } userId - stores logged in user id
 * @param { string } token - stores user bearer token
 */
export const getOrderStatusValues = async(userId: string, token: string) => {
  try {
    let response = await fetch(`${API_GET_STATUS_VALUES}/${userId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
    })

    return await response.json();

  } catch(error) {
    console.log(error)
    console.error(`API CALL:getOrderStatusValues=>>>>>> Error when getting a list of all status values for orders: ${error}`)
  }
}

/**
 * Update status values for an order
 * @param { string } userId - stores logged in user id
 * @param { string } token - stores user bearer token
 * @param { string } orderId - stores order id
 * @param { string } status - stores current order status
 */
export const updateOrderStatus = async(userId: string, token: string, orderId: string, status: string) => {
  try {
    let response = await fetch(`${API_GET_ORDERS}/${orderId}/status/${userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status, orderId })
    })

    return await response.json();

  } catch(error) {
    console.log(error)
    console.error(`API CALL:updateOrderStatus=>>>>>> Error when updating status for an order: ${error}`)
  }
}