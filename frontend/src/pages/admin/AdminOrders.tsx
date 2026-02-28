import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { orderService } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const STATUS_COLORS: Record<string, string> = {
  pendente: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  confirmado: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  enviado: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  entregue: 'text-green-400 border-green-400/30 bg-green-400/10',
  cancelado: 'text-red-400 border-red-400/30 bg-red-400/10',
}

const STATUS_OPTIONS = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado']

type Order = {
  _id: string
  user: { name: string; email: string }
  items: any[]
  total: number
  status: string
  createdAt: string
  shippingAddress: { city: string; state: string; name: string }
}

export default function AdminOrders() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return }
    orderService.getAll()
      .then((res) => setOrders(res.data))
      .catch(() => toast.error('Erro ao carregar pedidos'))
      .finally(() => setLoading(false))
  }, [user])

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await orderService.updateStatus(orderId, status)
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o))
      toast.success('Status atualizado!')
    } catch {
      toast.error('Erro ao atualizar status')
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">

      {/* Topbar */}
      <div className="bg-[#111111] border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <span className="font-display text-xl text-white tracking-widest">PEDIDOS</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-[#111111] animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="font-display text-3xl text-white/20">NENHUM PEDIDO</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="bg-[#111111] border border-white/10">
                {/* Header row */}
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/2 transition-colors"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                >
                  <div className="flex items-center gap-6 flex-wrap">
                    <div>
                      <p className="text-white text-sm font-medium">{order.shippingAddress?.name || 'Cliente'}</p>
                      <p className="text-white/30 text-xs">{order.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider">Total</p>
                      <p className="text-white font-semibold">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider">Itens</p>
                      <p className="text-white">{order.items.length}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider">Data</p>
                      <p className="text-white text-sm">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 border rounded uppercase tracking-wider ${STATUS_COLORS[order.status] || ''}`}>
                      {order.status}
                    </span>
                    <span className="text-white/30 text-lg">{expanded === order._id ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* Expanded details */}
                {expanded === order._id && (
                  <div className="border-t border-white/10 p-5 space-y-4">
                    {/* Items */}
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Itens do Pedido</p>
                      <div className="space-y-2">
                        {order.items.map((item: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover bg-[#1A1A1A]" />
                              )}
                              <div>
                                <p className="text-white">{item.name}</p>
                                <p className="text-white/40">Tam: {item.size} × {item.quantity}</p>
                              </div>
                            </div>
                            <p className="text-white">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Endereço */}
                    {order.shippingAddress && (
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Endereço de Entrega</p>
                        <p className="text-white/70 text-sm">
                          {order.shippingAddress.name} — {order.shippingAddress.city}/{order.shippingAddress.state}
                        </p>
                      </div>
                    )}

                    {/* Status update */}
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Atualizar Status</p>
                      <div className="flex gap-2 flex-wrap">
                        {STATUS_OPTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(order._id, s)}
                            className={`px-3 py-1.5 text-xs border uppercase tracking-wider transition-colors ${
                              order.status === s
                                ? 'bg-[#FF3B00] border-[#FF3B00] text-white'
                                : 'border-white/20 text-white/50 hover:border-white/50 hover:text-white'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
