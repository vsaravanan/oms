'use client'

import { useEffect } from 'react'
import CustomerForm from '@/components/CustomerForm'
import CustomerList from '@/components/CustomerList'
import OrderForm from '@/components/OrderForm'
import OrderList from '@/components/OrderList'
// import QueryPanel from '@/components/QueryPanel'
import useStore from '@/store/store'

export default function Home() {
  const { loading, error, clearError } = useStore()

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  return (
    <div className='px-4 py-6 sm:px-0'>
      {/* Loading Overlay */}
      {loading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-4 rounded-lg'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-2 text-sm text-gray-600'>Processing...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className='mb-6 bg-red-50 border border-red-200 rounded-md p-4'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <svg className='h-5 w-5 text-red-400' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <p className='text-sm text-red-800'>{error}</p>
            </div>
            <div className='ml-auto pl-3'>
              <div className='-mx-1.5 -my-1.5'>
                <button
                  onClick={clearError}
                  className='inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100'
                >
                  <span className='sr-only'>Dismiss</span>
                  <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Left Column - Forms */}
        <div className='space-y-6'>
          <CustomerForm />
          <OrderForm />
        </div>

        {/* Right Column - Lists and Queries */}
        <div className='space-y-6'>
          <CustomerList />
          <OrderList />
        </div>
      </div>

      {/* Query Panel - Full Width */}
      <div className='mt-6'>{/* <QueryPanel /> */}</div>
    </div>
  )
}
