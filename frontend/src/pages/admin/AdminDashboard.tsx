import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, ShoppingBag, Users, TrendingUp, Plus, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { productService, orderService } from '../../services/api'

export default function AdminDashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ products: 0, orders: 0 })

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return }
    Promise.all([
      productService.getAll({ limit: 1 }),
      orderService.getAll(),
    ]).then(([p, o]) => {
      setStats({ products: p.data.total || 0, orders: o.data.length || 0 })
    }).catch(() => {})
  }, [user])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <main className="min-h-screen bg-[#0A0A0A] pt-0">

      {/* Admin Topbar */}
      <div className="bg-[#111111] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-display text-xl text-white tracking-widest">HAYH GANG</Link>
          <span className="text-white/20">|</span>
          <span className="text-[#FF3B00] text-xs font-display tracking-widest">ADMIN</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-sm hidden md:block">Olá, {user?.name}</span>
          <Link to="/" className="text-white/40 hover:text-white text-xs uppercase tracking-wider">Ver Site</Link>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-[#FF3B00] text-xs uppercase tracking-wider hover:text-white transition-colors">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-white">PAINEL ADMIN</h1>
          <p className="text-white/40 text-sm mt-1">Gerencie produtos, pedidos e estoque</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Produtos', value: stats.products, icon: Package, color: '#FF3B00' },
            { label: 'Pedidos', value: stats.orders, icon: ShoppingBag, color: '#FF3B00' },
            { label: 'Clientes', value: '—', icon: Users, color: '#FF3B00' },
            { label: 'Receita', value: '—', icon: TrendingUp, color: '#FF3B00' },
          ].map((s) => (
            <div key={s.label} className="bg-[#111111] border border-white/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/40 text-xs uppercase tracking-wider">{s.label}</span>
                <s.icon size={16} color={s.color} />
              </div>
              <p className="font-display text-3xl text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/produtos"
            className="group bg-[#111111] border border-white/10 hover:border-[#FF3B00]/50 p-6 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <Package size={24} className="text-[#FF3B00]" />
              <span className="text-white/20 group-hover:text-[#FF3B00] transition-colors text-xl">→</span>
            </div>
            <h2 className="font-display text-2xl text-white mb-1">PRODUTOS</h2>
            <p className="text-white/40 text-sm">Cadastrar, editar e remover produtos</p>
          </Link>

          <Link
            to="/admin/pedidos"
            className="group bg-[#111111] border border-white/10 hover:border-[#FF3B00]/50 p-6 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <ShoppingBag size={24} className="text-[#FF3B00]" />
              <span className="text-white/20 group-hover:text-[#FF3B00] transition-colors text-xl">→</span>
            </div>
            <h2 className="font-display text-2xl text-white mb-1">PEDIDOS</h2>
            <p className="text-white/40 text-sm">Ver e atualizar status dos pedidos</p>
          </Link>
        </div>

        {/* Add product shortcut */}
        <div className="mt-6">
          <Link
            to="/admin/produtos/novo"
            className="inline-flex items-center gap-3 bg-[#FF3B00] text-white px-8 py-4 font-display text-lg tracking-widest hover:bg-[#e03500] transition-colors"
          >
            <Plus size={20} />
            CADASTRAR NOVO PRODUTO
          </Link>
        </div>
      </div>
    </main>
  )
}
