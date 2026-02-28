import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X, ChevronDown } from 'lucide-react'
import { productService } from '../services/api'
import ProductCard from '../components/ui/ProductCard'

type Product = {
  _id: string; name: string; description: string; price: number
  originalPrice?: number; images: string[]; category: string
  sizes: string[]; stock: number; featured: boolean; tag?: string
  slug: string; createdAt: string
}

const CATEGORIES = [
  { label: 'Todos', value: '' },
  { label: 'Camisetas', value: 'camiseta' },
  { label: 'Moletons', value: 'moletom' },
  { label: 'Calças', value: 'calca' },
  { label: 'Bonés', value: 'bone' },
  { label: 'Acessórios', value: 'acessorio' },
]

const SORT_OPTIONS = [
  { label: 'Mais recentes', value: 'newest' },
  { label: 'Menor preço', value: 'price_asc' },
  { label: 'Maior preço', value: 'price_desc' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [sort, setSort] = useState('newest')
  const [sortOpen, setSortOpen] = useState(false)

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''

  useEffect(() => {
    setLoading(true)
    productService.getAll({ category: category || undefined, search: search || undefined })
      .then((res) => {
        let sorted = [...res.data.products]
        if (sort === 'price_asc') sorted.sort((a, b) => a.price - b.price)
        if (sort === 'price_desc') sorted.sort((a, b) => b.price - a.price)
        setProducts(sorted)
        setTotal(res.data.total)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [category, search, sort])

  const setCategory = (val: string) => {
    const p = new URLSearchParams()
    if (val) p.set('category', val)
    setSearchParams(p)
  }

  const activeCat = CATEGORIES.find((c) => c.value === category)
  const activeSort = SORT_OPTIONS.find((s) => s.value === sort)

  return (
    <main className="min-h-screen bg-bg">

      {/* Page header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-6 border-b border-border">
        <h1 className="font-display text-5xl md:text-6xl text-ink tracking-wide">
          {category ? category.toUpperCase() : search ? `"${search.toUpperCase()}"` : 'NOVIDADES'}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Filter + Sort bar */}
        <div className="flex items-center justify-between py-4 border-b border-border">

          {/* Category filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`flex-shrink-0 px-4 py-1.5 text-xs uppercase tracking-wider border transition-all duration-200 ${
                  category === cat.value
                    ? 'bg-ink text-white border-ink'
                    : 'bg-transparent text-muted border-border hover:border-ink hover:text-ink'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right: count + sort */}
          <div className="flex items-center gap-4 flex-shrink-0 ml-4">
            <span className="text-xs text-muted uppercase tracking-wider hidden md:block">
              {total} produto{total !== 1 ? 's' : ''}
            </span>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-ink border border-border px-3 py-1.5 hover:border-ink transition-colors"
              >
                {activeSort?.label}
                <ChevronDown size={12} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border shadow-md z-20">
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => { setSort(o.value); setSortOpen(false) }}
                      className={`block w-full text-left px-4 py-2.5 text-xs uppercase tracking-wider transition-colors ${
                        sort === o.value ? 'text-accent' : 'text-ink hover:bg-card'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active filter tag */}
        {(category || search) && (
          <div className="flex items-center gap-2 py-3">
            <span className="text-xs text-muted uppercase tracking-wider">Filtros:</span>
            <button
              onClick={() => setSearchParams(new URLSearchParams())}
              className="flex items-center gap-1.5 text-xs uppercase tracking-wider bg-ink text-white px-3 py-1 hover:bg-accent transition-colors"
            >
              {activeCat?.label || search}
              <X size={10} />
            </button>
          </div>
        )}

        {/* Product grid */}
        <div className="py-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[3/4] bg-card animate-pulse" />
                  <div className="h-3 bg-card animate-pulse w-3/4" />
                  <div className="h-3 bg-card animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <p className="font-display text-4xl text-muted">SEM PRODUTOS</p>
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                className="text-xs uppercase tracking-wider text-accent hover:underline"
              >
                Ver todos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
