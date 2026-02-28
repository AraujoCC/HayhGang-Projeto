import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, ArrowLeft, Tag } from 'lucide-react'
import { productService } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

type Product = {
  _id: string
  name: string
  price: number
  category: string
  stock: number
  featured: boolean
  tag?: string
  images: string[]
  slug: string
}

export default function AdminProducts() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return }
    fetchProducts()
  }, [user])

  const fetchProducts = () => {
    setLoading(true)
    productService.getAll({ limit: 100 })
      .then((res) => setProducts(res.data.products))
      .catch(() => toast.error('Erro ao carregar produtos'))
      .finally(() => setLoading(false))
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deletar "${name}"?`)) return
    try {
      await productService.delete(id)
      toast.success('Produto removido!')
      fetchProducts()
    } catch {
      toast.error('Erro ao remover produto')
    }
  }

  const handleToggleFeatured = async (product: Product) => {
    try {
      await productService.update(product._id, { featured: !product.featured })
      toast.success(product.featured ? 'Removido dos destaques' : 'Adicionado aos destaques!')
      fetchProducts()
    } catch {
      toast.error('Erro ao atualizar')
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">

      {/* Topbar */}
      <div className="bg-[#111111] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <span className="font-display text-xl text-white tracking-widest">PRODUTOS</span>
        </div>
        <Link
          to="/admin/produtos/novo"
          className="inline-flex items-center gap-2 bg-[#FF3B00] text-white px-4 py-2 font-display tracking-widest text-sm hover:bg-[#e03500] transition-colors"
        >
          <Plus size={16} /> NOVO PRODUTO
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-[#111111] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="font-display text-3xl text-white/20">NENHUM PRODUTO</p>
            <Link
              to="/admin/produtos/novo"
              className="inline-flex items-center gap-2 bg-[#FF3B00] text-white px-6 py-3 font-display tracking-widest hover:bg-[#e03500] transition-colors"
            >
              <Plus size={16} /> CADASTRAR PRIMEIRO PRODUTO
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider py-3 pr-4">Produto</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider py-3 pr-4">Categoria</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider py-3 pr-4">Preço</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider py-3 pr-4">Estoque</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider py-3 pr-4">Destaque</th>
                  <th className="text-left text-white/40 text-xs uppercase tracking-wider py-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1A1A1A] overflow-hidden flex-shrink-0">
                          {product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Tag size={14} className="text-white/20" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{product.name}</p>
                          {product.tag && (
                            <span className="text-[#FF3B00] text-xs">{product.tag}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="text-white/50 text-sm capitalize">{product.category}</span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="text-white text-sm font-medium">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`text-sm font-medium ${product.stock === 0 ? 'text-[#FF3B00]' : product.stock <= 5 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        className={`text-xs px-2 py-1 border transition-colors ${
                          product.featured
                            ? 'border-[#FF3B00] text-[#FF3B00]'
                            : 'border-white/20 text-white/30 hover:border-white/40'
                        }`}
                      >
                        {product.featured ? 'SIM' : 'NÃO'}
                      </button>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/admin/produtos/editar/${product._id}`}
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.name)}
                          className="text-white/40 hover:text-[#FF3B00] transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
