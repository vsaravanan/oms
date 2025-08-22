import { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { GET_ORDERS_BY_CUSTOMER } from '@/graphql/queries'
import useStore from '@/store/store'

export default function QueryPanel() {
  const [customerId, setCustomerId] = useState('')
  const [customerOrders, setCustomerOrders] = useState([])
  const { customers, setError } = useStore()

  const [getOrdersByCustomer, { loading }] = useLazyQuery(GET_ORDERS_BY_CUSTOMER, {
    onCompleted: data => {
      setCustomerOrders(data.getOrdersByCustomer || [])
    },
    onError: error => {
      setError(error.message)
      setCustomerOrders([])
    },
  })

  const handleSearch = () => {
    if (!customerId) {
      setError('Please select a customer')
      return
    }

    getOrdersByCustomer({ variables: { customerId } })
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-4'>Query Orders by Customer</h2>

      <div className='space-y-4'>
        <div>
          <label className='form-label'>Select Customer</label>
          <select
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            className='form-input'
          >
            <option value=''>Choose a customer</option>
            {customers.map(customer => (
              <option key={customer.customerId} value={customer.customerId}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleSearch} disabled={loading} className='btn btn-primary'>
          {loading ? 'Searching...' : 'Get Customer Orders'}
        </button>

        {customerOrders.length > 0 && (
          <div className='mt-6'>
            <h3 className='font-semibold mb-3'>Customer Orders ({customerOrders.length})</h3>
            <div className='space-y-2'>
              {customerOrders.map(order => (
                <div key={order.orderId} className='p-3 bg-gray-50 rounded border'>
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <div className='font-medium'>Order #{order.orderId}</div>
                      <div className='text-sm text-gray-600'>
                        {order.createdAt && new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-medium'>${order.totalAmount}</div>
                      <div
                        className={`text-xs px-2 py-1 rounded ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </div>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className='text-xs space-y-1'>
                      <div className='font-medium'>Items:</div>
                      {order.items.map(item => (
                        <div key={item.itemId} className='ml-2'>
                          {item.productId} × {item.quantity} @ ${item.price} each
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {customerOrders.length === 0 && customerId && !loading && (
          <div className='text-gray-500 mt-4'>No orders found for this customer.</div>
        )}
      </div>
    </div>
  )
}
