import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_ORDER } from '@/graphql/queries'
import useStore from '@/store/store'

export default function OrderForm() {
  const [customerId, setCustomerId] = useState(1)
  const [items, setItems] = useState([{ productId: 'abc', quantity: 5, price: 10 }])
  const { customers, addOrder, setError, setLoading } = useStore()

  const [createOrder] = useMutation(CREATE_ORDER, {
    onCompleted: data => {
      const myorder = data.createOrder
      console.log('Order created:', myorder)
      addOrder(myorder)
      setCustomerId(1)
      setItems([{ productId: 'dog', quantity: 7, price: 15 }])
      setLoading(false)
    },
    onError: error => {
      setError(error.message)
      setLoading(false)
    },
  })

  const handleSubmit = async e => {
    e.preventDefault()
    if (
      !customerId ||
      items.some(item => !item.productId || item.quantity <= 0 || item.price <= 0)
    ) {
      setError('Please fill in all fields correctly')
      return
    }

    setLoading(true)
    try {
      await createOrder({
        variables: {
          input: {
            customerId,
            items: items.map(item => ({
              productId: item.productId,
              quantity: parseInt(item.quantity),
              price: parseFloat(item.price),
            })),
          },
        },
      })
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, price: 0 }])
  }

  const removeItem = index => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-4'>Create Order</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='form-label'>Customer Id</label>
          <input
            type='text'
            value={customerId}
            onChange={e => setCustomerId(e.target.value)}
            className='form-input'
            placeholder='Enter customer id'
          />
        </div>

        <div>
          <label className='form-label'>Order Items</label>
          {items.map((item, index) => (
            <div key={index} className='flex gap-2 mb-2'>
              <input
                type='text'
                placeholder='Product ID'
                value={item.productId}
                onChange={e => updateItem(index, 'productId', e.target.value)}
                className='form-input flex-1'
              />
              <input
                type='number'
                placeholder='Quantity'
                value={item.quantity}
                onChange={e => updateItem(index, 'quantity', e.target.value)}
                className='form-input w-24'
                min='1'
              />
              <input
                type='number'
                placeholder='Price'
                value={item.price}
                onChange={e => updateItem(index, 'price', e.target.value)}
                className='form-input w-24'
                step='0.01'
                min='0'
              />
              {items.length > 1 && (
                <button
                  type='button'
                  onClick={() => removeItem(index)}
                  className='btn btn-danger px-2'
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button type='button' onClick={addItem} className='btn btn-secondary mt-2'>
            Add Item
          </button>
        </div>

        <button type='submit' className='btn btn-primary'>
          Create Order
        </button>
      </form>
    </div>
  )
}
