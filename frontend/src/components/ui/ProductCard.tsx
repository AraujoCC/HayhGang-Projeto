import { Link } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore'
import toast from 'react-hot-toast'

type Product = {
  _id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  sizes: string[]
  stock: number
  tag?: string
  slug: string
  description: string
  featured: boolean
  createdAt: string
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore()
  const frontImage = product.images[0] || null
  const backImage = product.images[1] || null
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock === 0) return
    if (product.sizes.length === 1) {
      addItem(product, product.sizes[0])
      openCart()
      toast.success('Adicionado!')
    } else {
      window.location.href = `/product/${product.slug}`
    }
  }

  return (
    <Link to={`/product/${product.slug}`} className="group block">

      {/* Image */}
      <div className="relative overflow-hidden bg-card aspect-[3/4]">

        {/* Front */}
        <img
          src={frontImage || 'https://placehold.co/400x530/EFEFEB/888880?text=HAYH+GANG'}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
            backImage ? 'group-hover:opacity-0 group-hover:scale-[1.03]' : 'group-hover:scale-[1.03]'
          }`}
        />

        {/* Back */}
        {backImage && (
          <img
            src={backImage}
            alt={`${product.name} verso`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 scale-[1.03] transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-100"
          />
        )}

        {/* Tag */}
        {product.tag && (
          <span className={`absolute top-2.5 left-2.5 z-10 text-[10px] font-display tracking-widest px-2 py-1 ${
            product.tag === 'SALE' || product.tag === 'LIMITADO'
              ? 'bg-accent text-white'
              : 'bg-ink text-white'
          }`}>
            {product.tag}
          </span>
        )}

        {/* Discount */}
        {discount && (
          <span className="absolute top-2.5 right-2.5 z-10 bg-accent text-white text-[10px] font-bold px-2 py-1">
            -{discount}%
          </span>
        )}

        {/* Verso hint */}
        {backImage && (
          <span className="absolute bottom-2.5 right-2.5 z-10 text-[9px] uppercase tracking-widest text-ink/40 bg-white/70 px-2 py-0.5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300">
            verso
          </span>
        )}

        {/* Add btn */}
        <button
          onClick={handleQuickAdd}
          disabled={product.stock === 0}
          className={`absolute bottom-0 left-0 right-0 z-10 py-3 text-xs font-display tracking-widest uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out ${
            product.stock === 0
              ? 'bg-ink/30 text-white cursor-not-allowed'
              : 'bg-ink text-white hover:bg-accent'
          }`}
        >
          {product.stock === 0 ? 'Esgotado' : 'Adicionar'}
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <p className="text-xs text-muted uppercase tracking-wider mb-1 capitalize">{product.category}</p>
        <p className="text-sm text-ink font-medium truncate leading-snug">{product.name}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm text-ink font-semibold">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted line-through">
              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
        {/* Sizes */}
        <div className="flex gap-1.5 mt-2">
          {product.sizes.map((s) => (
            <span key={s} className="text-[10px] text-muted uppercase tracking-wide">{s}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}
