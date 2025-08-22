import { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { GET_ORDER } from '@/graphql/queries'
import useStore from '@/store/store'

export default function OrderList() {
  const [orderIdInput, setOrderIdInput] = useState('')
  const { orders, selectedOrder, setSelectedOrder, setError } = useStore()

  const [getOrder, { loading }] = useLazyQuery(GET_ORDER, {
    onCompleted: data => {
      setSelectedOrder(data.getOrder)
    },
    onError: error => {
      setError(error.message)
    },
  })

  const handleOrderClick = order => {
    getOrder({ variables: { orderId: order.orderId } })
  }

  const handleOrderIdSubmit = e => {
    e.preventDefault()
    if (!orderIdInput.trim()) {
      setError('Please enter an order ID')
      return
    }
    getOrder({ variables: { orderId: orderIdInput.trim() } })
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-4'>Orders</h2>

      {/* Order ID Search */}
      <div className='mb-4 p-4 bg-gray-50 rounded-md'>
        <h3 className='text-sm font-medium mb-2'>Search Order by ID</h3>
        <form onSubmit={handleOrderIdSubmit} className='flex gap-2'>
          <input
            type='text'
            value={orderIdInput}
            onChange={e => setOrderIdInput(e.target.value)}
            placeholder='Enter Order ID'
            className='form-input flex-1'
          />
          <button type='submit' disabled={loading} className='btn btn-primary px-3'>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>
      </div>
      {/* Orders List */}
      {orders.length === 0 ? (
        <p className='text-gray-500'>No orders created yet</p>
      ) : (
        <div>
          <h3 className='text-sm font-medium mb-2 text-gray-700'>Created Orders</h3>
          <div className='space-y-2'>
            {orders.map(order => (
              <div
                key={order.orderId}
                onClick={() => handleOrderClick(order)}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedOrder?.orderId === order.orderId
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <div className='font-medium'>Order #{order.orderId}</div>
                    <div className='font-medium'>Customer Id #{order.customerId}</div>
                    <div className='text-xs text-gray-400'>
                      {order.createdAt && new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-medium'>${order.totalAmount || 0}</div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status || 'pending'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className='mt-6 p-4 bg-gray-50 rounded-md'>
          <h3 className='font-semibold mb-2'>Order Details</h3>
          <div className='text-sm space-y-2'>
            <div>
              <strong>Order ID:</strong> {selectedOrder.orderId}
            </div>
            <div>
              <strong>Customer ID:</strong> {selectedOrder.customerId}
            </div>
            <div>
              <strong>Status:</strong> {selectedOrder.status}
            </div>
            <div>
              <strong>Total Amount:</strong> ${selectedOrder.totalAmount}
            </div>
            <div>
              <strong>Created:</strong>{' '}
              {selectedOrder.createdAt && new Date(selectedOrder.createdAt).toLocaleDateString()}
            </div>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div>
                <strong>Items:</strong>
                <div className='mt-1 space-y-1'>
                  {selectedOrder.items.map(item => (
                    <div key={item.itemId} className='text-xs bg-white p-2 rounded border'>
                      <div>Product: {item.productId}</div>
                      <div>Quantity: {item.quantity}</div>
                      <div>Price: ${item.price}</div>
                      <div>Subtotal: ${(item.quantity * item.price).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
