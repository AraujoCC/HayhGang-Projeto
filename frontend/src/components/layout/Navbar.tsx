import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { itemCount, openCart } = useCartStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const count = itemCount()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Promo bar */}
      <div className="bg-ink text-white text-center py-2 text-xs uppercase tracking-widest">
        Frete grátis acima de R$299 &nbsp;·&nbsp; 5% OFF no PIX &nbsp;·&nbsp;
        <a href="https://wa.me/7192055641" target="_blank" rel="noreferrer" className="underline ml-1">Grupo VIP WhatsApp</a>
      </div>

      <nav className={`sticky top-0 z-50 bg-bg border-b transition-all duration-300 ${scrolled ? 'border-border shadow-sm' : 'border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="font-display text-2xl tracking-widest text-ink flex-shrink-0">
            HAYH GANG
          </Link>

          {/* Nav — desktop */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Novidades', to: '/shop' },
              { label: 'Camisetas', to: '/shop?category=camiseta' },
              { label: 'Calças', to: '/shop?category=calca' },
              { label: 'Acessórios', to: '/shop?category=acessorio' },
            ].map((l) => (
              <Link key={l.label} to={l.to}
                className="text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors font-medium">
                {l.label}
              </Link>
            ))}
            <a href="/shop?featured=true"
              className="text-xs uppercase tracking-wider text-accent hover:text-ink transition-colors font-bold">
              Sale
            </a>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="text-muted hover:text-ink transition-colors p-1">
              <Search size={18} />
            </button>

            {user ? (
              <div className="relative group">
                <button className="text-muted hover:text-ink transition-colors p-1">
                  <User size={18} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {user.isAdmin && (
                    <Link to="/admin" className="block px-4 py-2.5 text-xs uppercase tracking-wider text-ink hover:bg-card transition-colors">
                      Admin
                    </Link>
                  )}
                  <Link to="/orders" className="block px-4 py-2.5 text-xs uppercase tracking-wider text-ink hover:bg-card transition-colors">
                    Meus Pedidos
                  </Link>
                  <button onClick={() => { logout(); navigate('/') }}
                    className="block w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider text-accent hover:bg-card transition-colors">
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-muted hover:text-ink transition-colors p-1">
                <User size={18} />
              </Link>
            )}

            <button onClick={openCart} className="relative text-muted hover:text-ink transition-colors p-1">
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <button className="md:hidden text-ink p-1" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border px-4 py-3">
            <input
              autoFocus
              type="text"
              placeholder="Buscar produtos..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/shop?search=${(e.target as HTMLInputElement).value}`)
                  setSearchOpen(false)
                }
              }}
              className="w-full bg-transparent text-sm text-ink placeholder-muted focus:outline-none uppercase tracking-wider"
            />
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-bg z-40 pt-16 px-6 flex flex-col md:hidden">
          <div className="flex flex-col gap-1 mt-4">
            {[
              { label: 'Novidades', to: '/shop' },
              { label: 'Camisetas', to: '/shop?category=camiseta' },
              { label: 'Calças', to: '/shop?category=calca' },
              { label: 'Acessórios', to: '/shop?category=acessorio' },
              { label: 'Sale', to: '/shop?featured=true', accent: true },
            ].map((l) => (
              <Link key={l.label} to={l.to}
                onClick={() => setMenuOpen(false)}
                className={`font-display text-5xl py-2 tracking-wider transition-colors ${l.accent ? 'text-accent' : 'text-ink hover:text-muted'}`}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto mb-10 flex gap-6">
            <a href="https://www.instagram.com/hayhgang/" target="_blank" rel="noreferrer"
              className="text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors">
              Instagram
            </a>
            <a href="https://wa.me/7192055641" target="_blank" rel="noreferrer"
              className="text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors">
              WhatsApp VIP
            </a>
          </div>
        </div>
      )}
    </>
  )
}
