import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

const NAV_LINKS = [
  { label: 'Novidades', to: '/shop' },
  { label: 'Camisetas', to: '/shop?category=camiseta' },
  { label: 'Calças', to: '/shop?category=calca' },
  { label: 'Acessórios', to: '/shop?category=acessorio' },
  { label: 'Lookbook', to: '/lookbook' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { itemCount, openCart } = useCartStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const count = itemCount()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <>
      {/* Promo bar */}
      <div className="bg-ink text-white text-center py-2 text-[10px] md:text-xs uppercase tracking-widest">
        Frete grátis acima de R$299 &nbsp;·&nbsp; 5% OFF no PIX &nbsp;·&nbsp;
        <a href="https://wa.me/7192055641" target="_blank" rel="noreferrer" className="underline ml-1">Grupo VIP WhatsApp</a>
      </div>

      <nav className={`sticky top-0 z-50 bg-bg border-b transition-all duration-300 ${scrolled ? 'border-border shadow-sm' : 'border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="font-display text-lg md:text-2xl tracking-widest text-ink flex-shrink-0">
            HAYH GANG
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} to={l.to}
                className="text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors font-medium">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search — só desktop */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="hidden md:block text-muted hover:text-ink transition-colors p-1">
              <Search size={18} />
            </button>

            {/* User */}
            {user ? (
              <div className="relative group">
                <button className="text-muted hover:text-ink transition-colors p-1">
                  <User size={18} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {user.isAdmin && (
                    <Link to="/admin" className="block px-4 py-2.5 text-xs uppercase tracking-wider text-ink hover:bg-card transition-colors">Admin</Link>
                  )}
                  <Link to="/orders" className="block px-4 py-2.5 text-xs uppercase tracking-wider text-ink hover:bg-card transition-colors">Meus Pedidos</Link>
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

            {/* Cart */}
            <button onClick={openCart} className="relative text-muted hover:text-ink transition-colors p-1">
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            {/* Hamburger — mobile */}
            <div className="md:hidden relative" ref={menuRef}>
              <button
                className="text-ink p-1 w-8 h-8 flex flex-col justify-center items-center gap-[5px]"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
              >
                <span className={`block w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
                <span className={`block w-5 h-[1.5px] bg-current transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block w-5 h-[1.5px] bg-current transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
              </button>

              {/* Dropdown pequeno */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border shadow-xl z-50 rounded-sm overflow-hidden">
                  {NAV_LINKS.map((l) => (
                    <Link
                      key={l.label}
                      to={l.to}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-xs uppercase tracking-wider text-ink hover:bg-card hover:text-accent transition-colors border-b border-border/40 last:border-b-0"
                    >
                      {l.label}
                    </Link>
                  ))}

                  {/* Divider */}
                  {!user && (
                    <div className="border-t border-border">
                      <Link to="/login" onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 text-xs uppercase tracking-wider text-ink hover:bg-card transition-colors border-b border-border/40">
                        Entrar
                      </Link>
                      <Link to="/register" onClick={() => setMenuOpen(false)}
                        className="block px-4 py-3 text-xs uppercase tracking-wider text-ink hover:bg-card transition-colors">
                        Cadastrar
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search bar — desktop */}
        {searchOpen && (
          <div className="border-t border-border px-4 py-3">
            <input autoFocus type="text" placeholder="Buscar produtos..."
              onKeyDown={(e) => { if (e.key === 'Enter') { navigate(`/shop?search=${(e.target as HTMLInputElement).value}`); setSearchOpen(false) } }}
              className="w-full bg-transparent text-sm text-ink placeholder-muted focus:outline-none uppercase tracking-wider" />
          </div>
        )}
      </nav>
    </>
  )
}