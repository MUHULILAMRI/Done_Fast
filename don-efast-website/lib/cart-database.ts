import { createClient } from "@/lib/supabase/client"

export interface CartItem {
  id?: string
  user_id?: string
  session_id?: string
  service_slug: string
  service_title: string
  package_name: string
  price: number
  quantity: number
  created_at?: string
  updated_at?: string
}

// Generate session ID for anonymous users
function getSessionId(): string {
  let sessionId = localStorage.getItem("cart_session_id")
  if (!sessionId) {
    sessionId = "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
    localStorage.setItem("cart_session_id", sessionId)
  }
  return sessionId
}

function getLocalStorageCart(): CartItem[] {
  try {
    const cart = localStorage.getItem("cart_items")
    return cart ? JSON.parse(cart) : []
  } catch {
    return []
  }
}

function setLocalStorageCart(items: CartItem[]): void {
  try {
    localStorage.setItem("cart_items", JSON.stringify(items))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

export class CartDatabase {
  private supabase = createClient()
  private useLocalStorage = false
  private databaseChecked = false

  private async checkDatabaseAvailable(): Promise<boolean> {
    if (this.databaseChecked) {
      return !this.useLocalStorage
    }

    try {
      console.log("[v0] Checking database availability...")

      // Try to get current user first to ensure auth is working
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser()

      if (authError) {
        console.log("[v0] Auth error:", authError.message)
      } else {
        console.log("[v0] Auth check successful, user:", user ? "authenticated" : "anonymous")
      }

      // Try a simple select query to test table access
      const { data, error } = await this.supabase.from("cart_items").select("id").limit(1)

      if (error) {
        console.log("[v0] Database error:", error.message)
        console.log("[v0] Falling back to localStorage")
        this.useLocalStorage = true
      } else {
        console.log("[v0] Database connection successful")
        this.useLocalStorage = false
      }
    } catch (error) {
      console.log("[v0] Database check failed:", error)
      this.useLocalStorage = true
    }

    this.databaseChecked = true
    return !this.useLocalStorage
  }

  async getCartItems(): Promise<CartItem[]> {
    const dbAvailable = await this.checkDatabaseAvailable()

    if (!dbAvailable) {
      console.log("[v0] Using localStorage for cart items")
      return getLocalStorageCart()
    }

    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      let query = this.supabase.from("cart_items").select("*").order("created_at", { ascending: false })

      if (user) {
        // Authenticated user
        console.log("[v0] Fetching cart for authenticated user:", user.id)
        query = query.eq("user_id", user.id)
      } else {
        // Anonymous user
        const sessionId = getSessionId()
        console.log("[v0] Fetching cart for anonymous session:", sessionId)
        query = query.eq("session_id", sessionId).is("user_id", null)
      }

      const { data, error } = await query

      if (error) {
        console.error("[v0] Error fetching cart items:", error)
        this.useLocalStorage = true
        return getLocalStorageCart()
      }

      console.log("[v0] Successfully fetched", data?.length || 0, "cart items from database")
      return data || []
    } catch (error) {
      console.error("[v0] Unexpected error fetching cart:", error)
      this.useLocalStorage = true
      return getLocalStorageCart()
    }
  }

  async addToCart(item: Omit<CartItem, "id" | "created_at" | "updated_at">): Promise<boolean> {
    const dbAvailable = await this.checkDatabaseAvailable()

    if (!dbAvailable) {
      console.log("[v0] Adding to localStorage cart")
      const items = getLocalStorageCart()
      const existingIndex = items.findIndex(
        (existing) => existing.service_slug === item.service_slug && existing.package_name === item.package_name,
      )

      if (existingIndex >= 0) {
        items[existingIndex].quantity += item.quantity
      } else {
        items.push({
          ...item,
          id: "local_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
        })
      }

      setLocalStorageCart(items)
      return true
    }

    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      const cartItem: Partial<CartItem> = {
        ...item,
        user_id: user?.id || null,
        session_id: user ? null : getSessionId(),
      }

      console.log("[v0] Adding item to database cart:", cartItem)

      // Check if item already exists
      const existingItems = await this.getCartItems()
      const existingItem = existingItems.find(
        (existing) => existing.service_slug === item.service_slug && existing.package_name === item.package_name,
      )

      if (existingItem) {
        // Update quantity
        console.log("[v0] Updating existing cart item quantity")
        return await this.updateCartItem(existingItem.id!, {
          quantity: existingItem.quantity + item.quantity,
        })
      } else {
        // Add new item
        const { error } = await this.supabase.from("cart_items").insert([cartItem])

        if (error) {
          console.error("[v0] Error adding to cart:", error)
          return false
        }

        console.log("[v0] Successfully added item to database cart")
        return true
      }
    } catch (error) {
      console.error("[v0] Unexpected error adding to cart:", error)
      return false
    }
  }

  async updateCartItem(id: string, updates: Partial<CartItem>): Promise<boolean> {
    if (this.useLocalStorage) {
      const items = getLocalStorageCart()
      const index = items.findIndex((item) => item.id === id)
      if (index >= 0) {
        items[index] = { ...items[index], ...updates }
        setLocalStorageCart(items)
        return true
      }
      return false
    }

    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      let query = this.supabase.from("cart_items").update(updates).eq("id", id)

      if (!user) {
        const sessionId = getSessionId()
        query = query.eq("session_id", sessionId)
      }

      const { error } = await query

      if (error) {
        console.error("[v0] Error updating cart item:", error)
        return false
      }
      return true
    } catch (error) {
      console.error("[v0] Unexpected error updating cart item:", error)
      return false
    }
  }

  async removeFromCart(id: string): Promise<boolean> {
    if (this.useLocalStorage) {
      const items = getLocalStorageCart()
      const filteredItems = items.filter((item) => item.id !== id)
      setLocalStorageCart(filteredItems)
      return true
    }

    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      let query = this.supabase.from("cart_items").delete().eq("id", id)

      if (!user) {
        const sessionId = getSessionId()
        query = query.eq("session_id", sessionId)
      }

      const { error } = await query

      if (error) {
        console.error("[v0] Error removing from cart:", error)
        return false
      }
      return true
    } catch (error) {
      console.error("[v0] Unexpected error removing from cart:", error)
      return false
    }
  }

  async clearCart(): Promise<boolean> {
    if (this.useLocalStorage) {
      setLocalStorageCart([])
      return true
    }

    try {
      const {
        data: { user },
      } = await this.supabase.auth.getUser()

      let query = this.supabase.from("cart_items").delete()

      if (user) {
        query = query.eq("user_id", user.id)
      } else {
        const sessionId = getSessionId()
        query = query.eq("session_id", sessionId).is("user_id", null)
      }

      const { error } = await query

      if (error) {
        console.error("[v0] Error clearing cart:", error)
        return false
      }
      return true
    } catch (error) {
      console.error("[v0] Unexpected error clearing cart:", error)
      return false
    }
  }

  // Migrate anonymous cart to authenticated user
  async migrateAnonymousCart(userId: string): Promise<boolean> {
    if (this.useLocalStorage) {
      return true
    }

    try {
      const sessionId = localStorage.getItem("cart_session_id")
      if (!sessionId) return true

      const { error } = await this.supabase
        .from("cart_items")
        .update({ user_id: userId, session_id: null })
        .eq("session_id", sessionId)
        .is("user_id", null)

      if (error) {
        console.error("[v0] Error migrating cart:", error)
        return false
      }

      // Clear session ID after migration
      localStorage.removeItem("cart_session_id")
      return true
    } catch (error) {
      console.error("[v0] Unexpected error migrating cart:", error)
      return false
    }
  }
}
