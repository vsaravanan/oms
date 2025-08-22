import { gql } from 'graphql-request'

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      orderId
      customerId
      totalAmount
      status
      createdAt
      items {
        itemId
        productId
        quantity
        price
      }
    }
  }
`

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      name
      email
    }
  }
`
