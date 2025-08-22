import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_CUSTOMER } from '@/graphql/queries'
import useStore from '@/store/store'

export default function CustomerForm() {
  const [name, setName] = useState('a')
  const [email, setEmail] = useState('a@a.com')
  const { addCustomer, setError, setLoading } = useStore()

  const [createCustomer] = useMutation(CREATE_CUSTOMER, {
    onCompleted: data => {
      addCustomer(data.createCustomer)
      setName('b')
      setEmail('b@b.com')
      setLoading(false)
    },
    onError: error => {
      setError(error.message)
      setLoading(false)
    },
  })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await createCustomer({
        variables: {
          input: { name: name.trim(), email: email.trim() },
        },
      })
    } catch (error) {
      console.error('Error creating customer:', error)
    }
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-4'>Create Customer</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='form-label'>Name</label>
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            className='form-input'
            placeholder='Enter customer name'
          />
        </div>
        <div>
          <label className='form-label'>Email</label>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='form-input'
            placeholder='Enter customer email'
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Create Customer
        </button>
      </form>
    </div>
  )
}
