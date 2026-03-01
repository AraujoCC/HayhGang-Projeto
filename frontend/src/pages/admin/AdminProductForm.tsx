import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { productService } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const CATEGORIES = ['camiseta', 'moletom', 'calca', 'bone', 'acessorio']
const ALL_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG', 'ÚNICO']
const TAGS = ['', 'NOVO', 'SALE', 'LIMITADO', 'ESGOTADO']

type FormData = {
  name: string
  description: string
  price: string
  originalPrice: string
  category: string
  sizes: string[]
  stock: string
  featured: boolean
  tag: string
  images: string[]
}

const empty: FormData = {
  name: '', description: '', price: '', originalPrice: '',
  category: 'camiseta', sizes: [], stock: '', featured: false, tag: '', images: [],
}

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isEdit = !!id

  const [form, setForm] = useState<FormData>(empty)
  const [imageInput, setImageInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return }
    if (isEdit) {
      productService.getAll({ limit: 100 })
        .then((res) => {
          const product = res.data.products.find((p: any) => p._id === id)
          if (product) {
            setForm({
              name: product.name,
              description: product.description,
              price: String(product.price),
              originalPrice: product.originalPrice ? String(product.originalPrice) : '',
              category: product.category,
              sizes: product.sizes,
              stock: String(product.stock),
              featured: product.featured,
              tag: product.tag || '',
              images: product.images,
            })
          }
        })
        .finally(() => setFetching(false))
    }
  }, [user, id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  const addImage = () => {
    if (!imageInput.trim()) return
    setForm((prev) => ({ ...prev, images: [...prev.images, imageInput.trim()] }))
    setImageInput('')
  }

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.sizes.length === 0) { toast.error('Selecione pelo menos um tamanho'); return }
    setLoading(true)
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        stock: parseInt(form.stock),
        tag: form.tag || undefined,
      }
      if (isEdit) {
        await productService.update(id!, data)
        toast.success('Produto atualizado!')
      } else {
        await productService.create(data)
        toast.success('Produto cadastrado!')
      }
      navigate('/admin/produtos')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[#0A0A0A] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#FF3B00] transition-colors placeholder-white/20"
  const labelClass = "block text-white/50 text-xs uppercase tracking-wider mb-2"

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF3B00] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A]">

      {/* Topbar */}
      <div className="bg-[#111111] border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link to="/admin/produtos" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <span className="font-display text-xl text-white tracking-widest">
          {isEdit ? 'EDITAR PRODUTO' : 'NOVO PRODUTO'}
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Nome */}
          <div>
            <label className={labelClass}>Nome do Produto *</label>
            <input
              name="name" value={form.name} onChange={handleChange}
              required placeholder="Ex: Camiseta Drop 01"
              className={inputClass}
            />
          </div>

          {/* Descrição */}
          <div>
            <label className={labelClass}>Descrição *</label>
            <textarea
              name="description" value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required rows={4} placeholder="Descreva o produto..."
              className={inputClass + ' resize-none'}
            />
          </div>

          {/* Preços */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Preço (R$) *</label>
              <input
                name="price" type="number" step="0.01" min="0"
                value={form.price} onChange={handleChange}
                required placeholder="149.90" className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Preço Original (R$) — opcional</label>
              <input
                name="originalPrice" type="number" step="0.01" min="0"
                value={form.originalPrice} onChange={handleChange}
                placeholder="199.90" className={inputClass}
              />
            </div>
          </div>

          {/* Categoria e Estoque */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Categoria *</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Estoque *</label>
              <input
                name="stock" type="number" min="0"
                value={form.stock} onChange={handleChange}
                required placeholder="10" className={inputClass}
              />
            </div>
          </div>

          {/* Tag */}
          <div>
            <label className={labelClass}>Tag</label>
            <select name="tag" value={form.tag} onChange={handleChange} className={inputClass}>
              {TAGS.map((t) => (
                <option key={t} value={t}>{t || '— Sem tag —'}</option>
              ))}
            </select>
          </div>

          {/* Tamanhos */}
          <div>
            <label className={labelClass}>Tamanhos disponíveis *</label>
            <div className="flex gap-2 flex-wrap">
              {ALL_SIZES.map((size) => (
                <button
                  key={size} type="button" onClick={() => toggleSize(size)}
                  className={`px-4 py-2.5 text-sm border transition-colors ${
                    form.sizes.includes(size)
                      ? 'bg-[#FF3B00] border-[#FF3B00] text-white'
                      : 'border-white/20 text-white/50 hover:border-white/50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Imagens */}
          <div>
            <label className={labelClass}>Imagens (URLs)</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text" value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                placeholder="https://... cole a URL da imagem"
                className={inputClass}
              />
              <button
                type="button" onClick={addImage}
                className="bg-[#FF3B00] text-white px-4 py-3 hover:bg-[#e03500] transition-colors flex-shrink-0"
              >
                <Plus size={18} />
              </button>
            </div>
            {form.images.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group w-20 h-20">
                    <img src={img} alt="" className="w-full h-full object-cover bg-[#1A1A1A]" />
                    <button
                      type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-white/20 text-xs mt-2">
              Dica: use links do Google Drive, Imgur ou Cloudinary
            </p>
          </div>

          {/* Destaque */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox" id="featured" name="featured"
              checked={form.featured} onChange={handleChange}
              className="w-4 h-4 accent-[#FF3B00]"
            />
            <label htmlFor="featured" className="text-white/60 text-sm uppercase tracking-wider cursor-pointer">
              Destacar na página inicial
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit" disabled={loading}
              className="flex-1 bg-[#FF3B00] text-white py-4 font-display text-xl tracking-widest hover:bg-[#e03500] transition-colors disabled:opacity-60"
            >
              {loading ? 'SALVANDO...' : isEdit ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR PRODUTO'}
            </button>
            <Link
              to="/admin/produtos"
              className="px-8 py-4 border border-white/20 text-white/50 font-display tracking-widest hover:border-white/50 hover:text-white transition-colors text-center"
            >
              CANCELAR
            </Link>
          </div>

        </form>
      </div>
    </main>
  )
}
