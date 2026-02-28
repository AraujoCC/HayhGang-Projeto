import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, MessageCircle, Truck, RotateCcw, Shield, ArrowLeft } from 'lucide-react'
import { productService } from '../services/api'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'

type Product = {
  _id: string; name: string; description: string; price: number
  originalPrice?: number; images: string[]; category: string
  sizes: string[]; stock: number; featured: boolean; tag?: string
  slug: string; createdAt: string
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem, openCart } = useCartStore()

  useEffect(() => {
    if (!slug) return
    productService.getBySlug(slug)
      .then((res) => { setProduct(res.data); setSelectedSize(res.data.sizes[0] || '') })
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAdd = () => {
    if (!product) return
    if (!selectedSize) { toast.error('Selecione um tamanho'); return }
    addItem(product, selectedSize, quantity)
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!product) return null

  const images = product.images.length > 0 ? product.images : ['https://placehold.co/600x800/EFEFEB/888880?text=HAYH+GANG']

  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-muted uppercase tracking-wider mb-8">
          <Link to="/" className="hover:text-ink transition-colors">Início</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-ink transition-colors">Coleção</Link>
          <span>/</span>
          <span className="text-ink truncate max-w-40">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] bg-card overflow-hidden">
              <img src={images[selectedImage]} alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300" />
              {product.tag && (
                <span className={`absolute top-3 left-3 text-[10px] font-display tracking-widest px-2.5 py-1 ${
                  product.tag === 'SALE' || product.tag === 'LIMITADO' ? 'bg-accent text-white' : 'bg-ink text-white'
                }`}>{product.tag}</span>
              )}
              {discount && (
                <span className="absolute top-3 right-3 bg-accent text-white text-[10px] font-bold px-2 py-1">-{discount}%</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-20 h-24 border-2 overflow-hidden transition-all bg-card ${
                      selectedImage === i ? 'border-ink' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] text-muted uppercase tracking-widest mb-2 capitalize">{product.category}</p>
            <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight mb-5">{product.name}</h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="font-display text-3xl text-ink">R$ {product.price.toFixed(2).replace('.', ',')}</span>
              {product.originalPrice && (
                <span className="text-muted line-through text-lg">R$ {product.originalPrice.toFixed(2).replace('.', ',')}</span>
              )}
              {discount && <span className="text-accent text-sm font-bold">-{discount}%</span>}
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] text-muted uppercase tracking-wider">
                  Tamanho: <span className="text-ink font-medium">{selectedSize}</span>
                </p>
                <button className="text-[11px] text-muted hover:text-ink transition-colors underline uppercase tracking-wider">
                  Guia de tamanhos
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] px-3 py-2.5 text-xs border transition-all ${
                      selectedSize === size
                        ? 'bg-ink text-white border-ink'
                        : 'border-border text-muted hover:border-ink hover:text-ink bg-white'
                    }`}>{size}</button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-[11px] text-muted uppercase tracking-wider mb-3">Quantidade</p>
              <div className="flex items-center border border-border w-fit bg-white">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-ink hover:bg-card transition-colors">−</button>
                <span className="w-10 h-10 flex items-center justify-center text-ink text-sm border-x border-border">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-ink hover:bg-card transition-colors">+</button>
              </div>
              <p className="text-[11px] text-muted uppercase tracking-wider mt-2">{product.stock} disponíveis</p>
            </div>

            {/* Buttons */}
            <button onClick={handleAdd} disabled={product.stock === 0}
              className={`w-full py-4 text-xs uppercase tracking-widest font-medium flex items-center justify-center gap-2 transition-all mb-3 ${
                added ? 'bg-green-600 text-white'
                : product.stock === 0 ? 'bg-card text-muted cursor-not-allowed'
                : 'bg-ink text-white hover:bg-accent'
              }`}>
              <ShoppingBag size={16} />
              {product.stock === 0 ? 'Esgotado' : added ? 'Adicionado!' : 'Adicionar ao Carrinho'}
            </button>

            <a href={`https://wa.me/7192055641?text=Tenho interesse: ${product.name}`}
              target="_blank" rel="noreferrer"
              className="w-full py-3.5 border border-border text-ink text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:border-ink transition-colors mb-8 bg-white">
              <MessageCircle size={14} />
              Comprar pelo WhatsApp
            </a>

            {/* Benefits */}
            <div className="space-y-3 border-t border-border pt-6">
              {[
                { icon: Truck, text: 'Frete grátis em compras acima de R$299' },
                { icon: RotateCcw, text: 'Troca em até 30 dias corridos' },
                { icon: Shield, text: 'Compra 100% segura' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={14} className="text-muted flex-shrink-0" />
                  <span className="text-xs text-muted uppercase tracking-wider">{text}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="border-t border-border pt-6 mt-6">
              <p className="text-[11px] text-ink uppercase tracking-widest font-medium mb-3">Descrição</p>
              <p className="text-sm text-muted leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
