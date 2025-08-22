import React, { useState } from 'react'

// Simple GraphQL Test Component without external libraries
function GraphQLTester() {
  const [query, setQuery] = useState(`{
                getOrder(orderId: "1") {
                    totalAmount
                    status
                    createdAt
                }
}`)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const executeQuery = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('http://localhost:8080/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
        }),
      })

      const data = await response.json()

      if (data.errors) {
        setError(data.errors)
      } else {
        setResult(data)
      }
    } catch (err) {
      setError([{ message: err.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>GraphQL Tester</h1>

      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <h2 className='text-xl font-semibold mb-4'>GraphQL Query</h2>
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Enter your GraphQL query here...'
          className='w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm'
        />

        <button
          onClick={executeQuery}
          disabled={loading}
          className='mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'
        >
          {loading ? 'Executing...' : 'Execute Query'}
        </button>
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
          <h3 className='text-lg font-semibold text-red-800 mb-2'>Error</h3>
          <pre className='text-red-700 text-sm whitespace-pre-wrap'>
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      {result && (
        <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
          <h3 className='text-lg font-semibold text-green-800 mb-2'>Result</h3>
          <pre className='text-green-700 text-sm whitespace-pre-wrap max-h-96 overflow-y-auto'>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default GraphQLTester
