import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Search, X } from 'lucide-react'
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Bloqueia scroll do body quando menu aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
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

            {/* Hamburger animado */}
            <button
              className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span className={`block w-5 h-[1.5px] bg-ink transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-ink transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block w-5 h-[1.5px] bg-ink transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
            </button>
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

      {/* Mobile menu — overlay full screen */}
      <div className={`fixed inset-0 bg-bg z-40 flex flex-col md:hidden transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

        {/* Promo bar replica */}
        <div className="bg-ink py-2" />

        {/* Topo do menu */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
          <Link to="/" className="font-display text-lg tracking-widest text-ink" onClick={() => setMenuOpen(false)}>
            HAYH GANG
          </Link>
          <button onClick={() => setMenuOpen(false)} className="text-ink p-1">
            <X size={20} />
          </button>
        </div>

        {/* Links de navegação */}
        <div className="flex flex-col px-6 pt-4 flex-1 overflow-y-auto">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.to} onClick={() => setMenuOpen(false)}
              className="font-display text-3xl py-4 tracking-wider text-ink hover:text-muted transition-colors border-b border-border/30 last:border-b-0">
              {l.label}
            </Link>
          ))}

          {/* Busca mobile */}
          <div className="mt-6 flex items-center gap-3 border border-border px-3 py-2.5">
            <Search size={14} className="text-muted flex-shrink-0" />
            <input type="text" placeholder="Buscar..."
              onKeyDown={(e) => { if (e.key === 'Enter') { navigate(`/shop?search=${(e.target as HTMLInputElement).value}`); setMenuOpen(false) } }}
              className="w-full bg-transparent text-xs text-ink placeholder-muted focus:outline-none uppercase tracking-wider" />
          </div>

          {/* Botões login/cadastro se não logado */}
          {!user && (
            <div className="flex gap-3 mt-4">
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="flex-1 bg-ink text-white py-3 text-xs uppercase tracking-widest text-center hover:bg-accent transition-colors">
                Entrar
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}
                className="flex-1 border border-border text-ink py-3 text-xs uppercase tracking-widest text-center hover:border-ink transition-colors">
                Cadastrar
              </Link>
            </div>
          )}
        </div>

        {/* Rodapé do menu */}
        <div className="px-6 py-8 flex gap-6 border-t border-border/30 flex-shrink-0">
          <a href="https://www.instagram.com/hayhgang/" target="_blank" rel="noreferrer"
            className="text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors">Instagram</a>
          <a href="https://wa.me/7192055641" target="_blank" rel="noreferrer"
            className="text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors">WhatsApp VIP</a>
        </div>
      </div>
    </>
  )
}