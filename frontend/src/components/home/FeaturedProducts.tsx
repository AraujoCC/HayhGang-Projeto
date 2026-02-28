import { useEffect, useState } from 'react'
import { productService } from '../../services/api'
import ProductCard from '../ui/ProductCard'

type Product = {
  _id: string; name: string; description: string; price: number
  originalPrice?: number; images: string[]; category: string
  sizes: string[]; stock: number; featured: boolean; tag?: string
  slug: string; createdAt: string
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService.getAll({ featured: true, limit: 4 })
      .then((res) => setProducts(res.data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="aspect-[3/4] bg-card animate-pulse" />
          <div className="h-3 bg-card animate-pulse w-3/4" />
          <div className="h-3 bg-card animate-pulse w-1/2" />
        </div>
      ))}
    </div>
  )

  if (products.length === 0) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
