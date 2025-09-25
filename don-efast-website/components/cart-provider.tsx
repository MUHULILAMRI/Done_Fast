"use client"

import type React from "react"
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  type ReactNode,
  useMemo,
  useCallback,
} from "react"
import { CartDatabase, type CartItem as DBCartItem } from "@/lib/cart-database"
import { CustomerInfoModal } from "@/components/customer-info-modal"
import { useToast } from "@/components/ui/use-toast"

// This is the CartItem shape used for the UI state
interface CartItem {
  id: string
  serviceId: string
  serviceName: string
  packageName: string
  price: number
  quantity: number
}

// This is the type for the item that pages pass to initiate adding to cart
// It matches the structure I created in the services pages
export type NewCartItemPayload = Omit<DBCartItem, "id" | "created_at" | "updated_at" | "quantity">

interface CartState {
  items: CartItem[]
  isOpen: boolean
  isLoading: boolean
}

type CartAction =
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem } // Reducer now gets a full CartItem
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
  addToCart: (item: NewCartItemPayload) => void // This is now the public signature
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.payload }

    case "ADD_ITEM":
      const existingItem = state.items.find(
        (item) =>
          item.serviceId === action.payload.serviceId && item.packageName === action.payload.packageName,
      )
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }
      }
      return { ...state, items: [...state.items, action.payload] }

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) }

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item))
          .filter((item) => item.quantity > 0),
      }

    case "CLEAR_CART":
      return { ...state, items: [] }

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }

    case "OPEN_CART":
      return { ...state, isOpen: true }

    case "CLOSE_CART":
      return { ...state, isOpen: false }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    default:
      return state
  }
}

function convertDBItemToUICartItem(dbItem: DBCartItem): CartItem {
  return {
    id: dbItem.id!,
    serviceId: dbItem.service_slug,
    serviceName: dbItem.service_title,
    packageName: dbItem.package_name,
    price: dbItem.price,
    quantity: dbItem.quantity,
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isLoading: true, // Start with loading true
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingItem, setPendingItem] = useState<NewCartItemPayload | null>(null)
  const { toast } = useToast()

  const cartDB = useMemo(() => new CartDatabase(), [])

  const reloadCart = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const dbItems = await cartDB.getCartItems()
      const cartItems = dbItems.map(convertDBItemToUICartItem)
      dispatch({ type: "SET_ITEMS", payload: cartItems })
    } catch (error) {
      console.error("Error loading cart items:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [cartDB])

  useEffect(() => {
    reloadCart()
  }, [reloadCart])

  // Public addToCart: opens the modal
  const addToCart = (item: NewCartItemPayload) => {
    setPendingItem(item)
    setIsModalOpen(true)
  }

  // Internal function to handle the actual cart addition after getting user info
  const handleModalSubmit = async (name: string, phone: string) => {
    if (!pendingItem) return

    dispatch({ type: "SET_LOADING", payload: true })
    setIsModalOpen(false)

    const itemWithCustomerInfo: Omit<DBCartItem, "id" | "created_at" | "updated_at"> = {
      ...pendingItem,
      customer_name: name,
      customer_phone: phone,
      quantity: 1,
    }

    try {
      const success = await cartDB.addToCart(itemWithCustomerInfo)
      if (success) {
        await reloadCart() // Reload from DB to get the source of truth
        dispatch({ type: "OPEN_CART" })
        toast({
          title: "Sukses!",
          description: `${pendingItem.service_title} telah ditambahkan ke keranjang.`,
          className: "bg-green-600 text-white border-green-700",
        })
      } else {
        throw new Error("Failed to add item to database.")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menambahkan item ke keranjang.",
        variant: "destructive",
      })
    } finally {
      setPendingItem(null)
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
      <CustomerInfoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setPendingItem(null)
        }}
        onSubmit={handleModalSubmit}
      />
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