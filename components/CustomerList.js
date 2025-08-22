import { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { GET_CUSTOMER } from '@/graphql/queries'
import useStore from '@/store/store'

export default function CustomerList() {
  const { customers, selectedCustomer, setSelectedCustomer, setError } = useStore()
  const [customerIdInput, setCustomerIdInput] = useState('')

  const [getCustomer] = useLazyQuery(GET_CUSTOMER, {
    onCompleted: data => {
      setSelectedCustomer(data.getCustomer)
    },
    onError: error => {
      setError(error.message)
    },
  })

  const handleCustomerClick = customer => {
    getCustomer({ variables: { customerId: customer.customerId } })
  }

  const handleCustomerIdSubmit = e => {
    e.preventDefault()
    if (!customerIdInput.trim()) {
      setError('Please enter an customer ID')
      return
    }

    getCustomer({ variables: { customerId: customerIdInput.trim() } })
    setCustomerIdInput('')
  }
  const validCustomers = customers.filter(customer => customer != null)

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-4'>Customers</h2>

      {/* Customer ID Input Prompt */}
      <form onSubmit={handleCustomerIdSubmit} className='mb-4'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={customerIdInput}
            onChange={e => setCustomerIdInput(e.target.value)}
            placeholder='Enter Customer ID'
            className='flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            type='submit'
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Query
          </button>
        </div>
      </form>

      {validCustomers.length === 0 ? (
        <p className='text-gray-500'>No customers created yet</p>
      ) : (
        <div className='space-y-2'>
          {validCustomers.map(customer => (
            <div
              key={customer.customerId}
              onClick={() => handleCustomerClick(customer)}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedCustomer && selectedCustomer?.customerId === customer.customerId
                  ? 'bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className='font-medium'>{customer.name}</div>
              <div className='text-sm text-gray-600'>{customer.email}</div>
              <div className='text-xs text-gray-400'>ID: {customer.customerId}</div>
            </div>
          ))}
        </div>
      )}

      {selectedCustomer && (
        <div className='mt-6 p-4 bg-gray-50 rounded-md'>
          <h3 className='font-semibold mb-2'>Customer Details</h3>
          <div className='text-sm space-y-1'>
            <div>
              <strong>ID:</strong> {selectedCustomer.customerId}
            </div>
            <div>
              <strong>Name:</strong> {selectedCustomer.name}
            </div>
            <div>
              <strong>Email:</strong> {selectedCustomer.email}
            </div>
            {selectedCustomer.orders && selectedCustomer.orders.length > 0 && (
              <div>
                <strong>Orders:</strong>
                <ul className='mt-1 ml-4'>
                  {selectedCustomer.orders.map(order => (
                    <li key={order.orderId} className='text-xs'>
                      Order #{order.orderId} - ${order.totalAmount} ({order.status})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
