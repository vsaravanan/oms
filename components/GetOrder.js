'use client'
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import useOrderStore from '@/store/orderStore'
import { GET_ORDER } from '@/graphql/queries'

const GetOrder = () => {
  const [orderId, setOrderId] = useState('')
  const [submittedOrderId, setSubmittedOrderId] = useState('')
  const { setOrder, setError } = useOrderStore()

  const { loading, error, data } = useQuery(GET_ORDER, {
    variables: { orderId: submittedOrderId },
    skip: !submittedOrderId,
    onCompleted: data => {
      if (data.getOrder) {
        setOrder(data.getOrder)
        setError(null)
      }
    },
    onError: error => {
      setError(error.message)
      setOrder(null)
    },
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (orderId.trim()) {
      setSubmittedOrderId(orderId)
    }
  }

  const order = data?.getOrder

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h2>Get Order</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type='text'
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            placeholder='Enter Order ID'
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button type='submit' disabled={loading} style={{ padding: '5px 10px' }}>
            {loading ? 'Loading...' : 'Get Order'}
          </button>
        </div>
      </form>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>Error: {error.message}</div>}

      {order && (
        <div style={{ marginTop: '20px' }}>
          <h3>Order Details:</h3>
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <p>
            <strong>Customer ID:</strong> {order.customerId}
          </p>
          <p>
            <strong>Total Amount:</strong> ${order.totalAmount}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Created At:</strong> {order.createdAt}
          </p>

          <h4>Items:</h4>
          <ul>
            {order.items.map(item => (
              <li key={item.itemId}>
                Product: {item.productId}, Quantity: {item.quantity}, Price: ${item.price}
              </li>
            ))}
          </ul>
        </div>
      )}

      {submittedOrderId && !order && !loading && !error && (
        <div style={{ marginTop: '20px', color: 'gray' }}>
          No order found with ID: {submittedOrderId}
        </div>
      )}
    </div>
  )
}

export default GetOrder
