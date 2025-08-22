import axios from 'axios'

const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await axios.post(
      'http://localhost:8080/graphql',
      {
        query,
        variables,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('GraphQL request failed:', error)
    throw error
  }
}

export { graphqlRequest }
