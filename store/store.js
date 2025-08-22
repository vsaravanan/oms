import { create } from 'zustand'

const useStore = create(set => ({
  // State
  customers: [],
  orders: [],
  selectedCustomer: null,
  selectedOrder: null,
  loading: false,
  error: null,

  // Actions
  setCustomers: customers => set({ customers }),
  setOrders: orders => set({ orders }),
  setSelectedCustomer: customer => set({ selectedCustomer: customer }),
  setSelectedOrder: order => set({ selectedOrder: order }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),

  // Add customer
  addCustomer: customer =>
    set(state => ({
      customers: [...state.customers, customer],
    })),

  // Add order
  addOrder: order =>
    set(state => ({
      orders: [...state.orders, order],
    })),

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () =>
    set({
      customers: [],
      orders: [],
      selectedCustomer: null,
      selectedOrder: null,
      loading: false,
      error: null,
    }),
}))

export default useStore
