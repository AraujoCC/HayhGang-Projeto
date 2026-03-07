import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const totalValue = total()
  const freeShipping = totalValue >= 299
  const shippingLeft = 299 - totalValue

  if (!isOpen) return null

  const handleCheckout = () => {
    closeCart()
    if (!user) {
      navigate('/login')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-ink/40 z-50" onClick={closeCart} />

      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[400px] bg-white z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-ink tracking-widest">CARRINHO</span>
            {items.length > 0 && (
              <span className="bg-ink text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button onClick={closeCart} className="text-muted hover:text-ink transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Free shipping bar */}
        {items.length > 0 && (
          <div className="px-6 py-3 bg-card border-b border-border">
            {freeShipping ? (
              <p className="text-[11px] uppercase tracking-wider text-green-600">✓ Você ganhou frete grátis!</p>
            ) : (
              <div>
                <p className="text-[11px] text-muted uppercase tracking-wider mb-1.5">
                  Falta R$ {shippingLeft.toFixed(2).replace('.', ',')} para frete grátis
                </p>
                <div className="h-0.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-ink transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, (totalValue / 299) * 100)}%` }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <ShoppingBag size={32} className="text-border" />
              <div>
                <p className="font-display text-xl text-ink mb-1">CARRINHO VAZIO</p>
                <p className="text-xs text-muted uppercase tracking-wider">Adicione produtos para continuar</p>
              </div>
              <button onClick={closeCart} className="text-xs uppercase tracking-wider text-accent hover:underline mt-2">
                Continuar comprando →
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-5">
              {items.map((item) => (
                <div key={`${item.product._id}-${item.size}`} className="flex gap-4">
                  <Link to={`/product/${item.product.slug}`} onClick={closeCart}
                    className="flex-shrink-0 w-20 h-24 bg-card overflow-hidden">
                    <img src={item.product.images[0] || ''} alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/product/${item.product.slug}`} onClick={closeCart}
                        className="text-sm text-ink font-medium hover:text-accent transition-colors truncate">
                        {item.product.name}
                      </Link>
                      <button onClick={() => removeItem(item.product._id, item.size)}
                        className="text-muted hover:text-accent transition-colors flex-shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <p className="text-[11px] text-muted uppercase tracking-wider mt-0.5">Tam: {item.size}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                          className="w-8 h-7 text-ink flex items-center justify-center hover:bg-card transition-colors text-sm">−</button>
                        <span className="w-8 h-7 text-ink text-xs flex items-center justify-center border-x border-border">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                          className="w-8 h-7 text-ink flex items-center justify-center hover:bg-card transition-colors text-sm">+</button>
                      </div>
                      <span className="text-sm text-ink font-semibold">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted uppercase tracking-wider">Subtotal</span>
              <span className="font-display text-xl text-ink">R$ {totalValue.toFixed(2).replace('.', ',')}</span>
            </div>
            {freeShipping && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted uppercase tracking-wider">Frete</span>
                <span className="text-xs text-green-600 font-medium uppercase tracking-wider">Grátis</span>
              </div>
            )}
            {!user && (
              <p className="text-[11px] text-center text-muted uppercase tracking-wider">
                Faça login para finalizar o pedido
              </p>
            )}
            <button onClick={handleCheckout}
              className="flex items-center justify-center gap-2 w-full bg-ink text-white py-4 text-xs uppercase tracking-widest font-medium hover:bg-accent transition-colors">
              {user ? 'Finalizar Pedido' : 'Entrar e Finalizar'} <ArrowRight size={14} />
            </button>
            <button onClick={closeCart}
              className="w-full text-center text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors">
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}