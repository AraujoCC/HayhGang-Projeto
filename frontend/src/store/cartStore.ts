import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Product = {
  _id: string; name: string; price: number; images: string[]
  sizes: string[]; stock: number; slug: string; description: string
  category: string; featured: boolean; tag?: string; originalPrice?: number; createdAt: string
}

type CartItem = { product: Product; size: string; quantity: number }

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, size: string, quantity?: number) => void
  removeItem: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, size, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(i => i.product._id === product._id && i.size === size)
          if (existing) {
            return { items: state.items.map(i => i.product._id === product._id && i.size === size ? { ...i, quantity: i.quantity + quantity } : i) }
          }
          return { items: [...state.items, { product, size, quantity }] }
        })
      },
      removeItem: (productId, size) => set((state) => ({ items: state.items.filter(i => !(i.product._id === productId && i.size === size)) })),
      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) { get().removeItem(productId, size); return }
        set((state) => ({ items: state.items.map(i => i.product._id === productId && i.size === size ? { ...i, quantity } : i) }))
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      total: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
)
