import { gql } from '@apollo/client'

// Queries

export const GET_CUSTOMER = gql`
  query GetCustomer($customerId: ID!) {
    getCustomer(customerId: $customerId) {
      customerId
      name
      email
    }
  }
`

export const GET_ORDER = gql`
  query GetOrder($orderId: ID!) {
    getOrder(orderId: $orderId) {
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

export const GET_ORDERS_BY_CUSTOMER = gql`
  query GetOrdersByCustomer($customerId: ID!) {
    getOrdersByCustomer(customerId: $customerId) {
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

// Mutations

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      customerId
      name
      email
    }
  }
`

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
