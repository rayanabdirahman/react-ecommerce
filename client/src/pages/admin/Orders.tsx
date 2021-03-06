import React from 'react'
import { isAuthenticated } from '../../api/auth'
import Layout from '../../components/Layout'
import { createProduct } from '../../api/product'
import Alert from "../../components/Alert"
import { AlertEnum } from '../../domain/enums'
import { Link } from 'react-router-dom'
import { getOrders, getOrderStatusValues, updateOrderStatus } from '../../api/order'
import moment from 'moment'

const OrdersPage: React.FunctionComponent = () => {
  // sets initial state for component
  const [orders, setOrders] = React.useState<any>([])
  const [statusValues, setStatusValues] = React.useState<any>([])
  const [error, setError] = React.useState<any>('')

  // destructure user and token information from isAuthenticated response
  const { user, token } = isAuthenticated()

  const loadOrders = async () => {
    try {
      const response = await getOrders(user._id, token)

      // check for errors
      if (response.error) {
        setError(response.error);
      }

      setOrders(response)

    } catch (error) {
      console.log(`OrdersPage:loadOrders>>>>Failed to load list of orders: ${error}`)
    }
  }

  const loadStatusValues = async () => {
    try {
      const response = await getOrderStatusValues(user._id, token)

      // check for errors
      if (response.error) {
        setError(response.error); 
      }

      setStatusValues(response)

    } catch (error) {
      console.log(`OrdersPage:loadOrders>>>>Failed to load list of orders: ${error}`)
    }
  }

  // lifecycle method to run everytime the component mounts
  React.useEffect(() => {
    // run required function to get list of orders and status values for orders
    loadOrders()
    loadStatusValues()
  },[])

  const showInput = (key: string, value: any) => (
    <div className="input-group mb-2 mr-sm-2">
      <div className="input-group-prepend">
        <div className="input-group-text">{key}</div>
      </div>
      <input type="text" value={value} className="form-control" readOnly/>
    </div>
  )

  // update status for order
  const handleStatusChange = async(event: any, orderId: any) => {
    try {
      const response = await updateOrderStatus(user._id, token, orderId, event.target.value)

      // check for errors
      if (response.error) {
        console.log('ERRR: ', response.error)
        setError(response.error); 
      }

      // load a new batch of orders
      loadOrders()

    } catch (error) {
      console.log(`OrdersPage:handleStatusChange>>>>Failed to update status for order: ${error}`)
    }
  }

  const showStatus = (order: any) => (
    <div className="form-group">
      <h3 className="mark mb-4">Status: {order.status}</h3>
      <select onChange={(event) => handleStatusChange(event, order._id)} className="form-control">
        <option value="">Update order status</option>
        {
          statusValues.map((status: any, index: number) => (
            <option key={`status-value--${index}`} value={status}>{status}</option>
          ))
        }
      </select>
    </div>
  )

  return (
    <Layout title="Orders" description={`${user.firstName}, you can manage your orders here`} >
      <div className="row">
      <div className="col-md-8 offset-md-2">
        {/* check if orders have been made */}
        { orders.length > 0 ? 
          <h1 className="text-danger display-2">Total orders: { orders.length}</h1> : 
          <h1 className="text-danger display-2">No orders</h1> 
        }

        {orders.map((order: any, index: number) => {
          return (
            <div key={`order--${index}`} className="mt-5" style={{borderBottom: "5px solid indigo"}}>
              <h2 className="mb-5">
                <span className="bg-primary">Order Id: ${order._id}</span>
              </h2>

              <ul className="list-group mb-2">
                <li className="list-group-item">Status: {showStatus(order)}</li>
                <li className="list-group-item">Transaction ID: {order.transaction_id}</li>
                <li className="list-group-item">Amount: {order.amount}</li>
                <li className="list-group-item">Ordered by: {order.user.firstName}</li>
                <li className="list-group-item">Ordered on: {moment(order.createdAt).fromNow()}</li>
                <li className="list-group-item">Delivery address: {order.address}</li>
              </ul>
              
              <h3 className="mt-4 mb-4 font-italic">Total products in this order: {order.products.length}</h3>
              {order.products.map((product: any, index: number) => (
                <div key={`order-product-item--${index}`} className="mb-4" style={{ padding: '20px', border: "1px solid indigo"}}>
                  {showInput('Product name', product.name)}
                  {showInput('Product price', product.price)}
                  {showInput('Product total', product.count)}
                  {showInput('Product Id', product._id)}
                </div>
              ))}

            </div>
          )
        })}
      </div>

      </div>
    </Layout>
  )
}

export default OrdersPage