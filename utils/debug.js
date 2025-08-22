export const checkGraphQLConnection = async () => {
  const url = 'http://localhost:8080/graphql'

  console.log('Testing connection to:', url)

  try {
    // Test basic HTTP connection
    const response = await fetch(url, {
      method: 'OPTIONS', // Simple request to check if server responds
    })

    console.log('Server responded with status:', response.status)

    // Test GraphQL endpoint
    const graphqlResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' }),
    })

    const result = await graphqlResponse.json()
    console.log('GraphQL response:', result)

    return true
  } catch (error) {
    console.error('Connection test failed:', error)

    // Check common issues
    if (error.message.includes('Failed to fetch')) {
      console.log('🔍 Possible issues:')
      console.log('1. GraphQL server not running')
      console.log('2. Wrong URL or port')
      console.log('3. CORS issues')
      console.log('4. Network connectivity')
    }

    return false
  }
}

// Run this in your browser console to test
window.testGraphQLConnection = checkGraphQLConnection
