"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode, useMemo } from "react"
import { CartDatabase, type CartItem as DBCartItem } from "@/lib/cart-database"

interface CartItem {
  id: string
  serviceId: string
  serviceName: string
  packageName: string
  price: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
}

type CartAction =
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "SET_LOADING"; payload: boolean }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return {
        ...state,
        items: action.payload,
      }

    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) => item.serviceId === action.payload.serviceId && item.packageName === action.payload.packageName,
      )

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
          .filter((item) => item.quantity > 0),
      }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case "OPEN_CART":
      return {
        ...state,
        isOpen: true,
      }

    case "CLOSE_CART":
      return {
        ...state,
        isOpen: false,
      }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }

    default:
      return state
  }
}

function convertDBItemToCartItem(dbItem: DBCartItem): CartItem {
  return {
    id: dbItem.id!,
    serviceId: dbItem.service_slug,
    serviceName: dbItem.service_title,
    packageName: dbItem.package_name,
    price: `Rp ${dbItem.price.toLocaleString("id-ID")}`,
    quantity: dbItem.quantity,
  }
}

function convertCartItemToDBItem(
  cartItem: Omit<CartItem, "quantity">,
): Omit<DBCartItem, "id" | "created_at" | "updated_at"> {
  return {
    service_slug: cartItem.serviceId,
    service_title: cartItem.serviceName,
    package_name: cartItem.packageName,
    price: Number.parseInt(cartItem.price.replace(/[^\d]/g, "")),
    quantity: 1,
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isLoading: false,
  })

  const cartDB = useMemo(() => new CartDatabase(), [])

  useEffect(() => {
    const loadCartItems = async () => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        const dbItems = await cartDB.getCartItems()
        const cartItems = dbItems.map(convertDBItemToCartItem)
        dispatch({ type: "SET_ITEMS", payload: cartItems })
      } catch (error) {
        console.error("Error loading cart items:", error)
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadCartItems()
  }, [cartDB])

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const dbItem = convertCartItemToDBItem(item)
      const success = await cartDB.addToCart(dbItem)

      if (success) {
        // Reload items from database to get updated state
        const dbItems = await cartDB.getCartItems()
        const cartItems = dbItems.map(convertDBItemToCartItem)
        dispatch({ type: "SET_ITEMS", payload: cartItems })
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const removeFromCart = async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const success = await cartDB.removeFromCart(id)

      if (success) {
        dispatch({ type: "REMOVE_ITEM", payload: id })
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id)
      return
    }

    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const success = await cartDB.updateCartItem(id, { quantity })

      if (success) {
        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const clearCart = async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const success = await cartDB.clearCart()

      if (success) {
        dispatch({ type: "CLEAR_CART" })
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
