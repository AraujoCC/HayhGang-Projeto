import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import FeaturedProducts from '../components/home/FeaturedProducts'
import PromoStrip from '../components/home/PromoStrip'

export default function Home() {
  return (
    <main className="bg-bg">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">Nova Coleção — 2025</p>
            <h1 className="font-display text-[clamp(5rem,14vw,11rem)] leading-none text-ink">
              HAYH GANG
            </h1>
            <p className="text-sm text-muted mt-4 max-w-xs leading-relaxed">
              Streetwear nacional com identidade. Camisetas, calças, tênis e acessórios.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 mt-8 bg-ink text-white px-8 py-4 text-xs uppercase tracking-widest font-medium hover:bg-accent transition-colors group"
            >
              Ver Coleção
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Hero image */}
          <div className="relative aspect-[3/4] md:aspect-auto md:h-[70vh] bg-card overflow-hidden">
            <img
              src="https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_exz4f0.jpg"
              alt="Hayh Gang"
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm text-ink text-xs uppercase tracking-widest px-3 py-1.5">
                Camiseta Heaven — R$ 169,90
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Strip */}
      <PromoStrip />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted mb-2">Em destaque</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink">NOVIDADES</h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors hidden md:flex items-center gap-1.5"
          >
            Ver tudo <ArrowRight size={12} />
          </Link>
        </div>
        <FeaturedProducts />
        <div className="mt-8 md:hidden">
          <Link to="/shop" className="text-xs uppercase tracking-wider text-muted hover:text-ink transition-colors flex items-center gap-1.5">
            Ver tudo <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* Category grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-20">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-4xl md:text-5xl text-ink">CATEGORIAS</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Camisetas', slug: 'camiseta', img: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.53_1_srnxgp.jpg' },
            { name: 'Heaven', slug: 'camiseta', img: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_exz4f0.jpg' },
            { name: 'Noble Empire', slug: 'camiseta', img: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_1_u3l9ks.jpg' },
            { name: 'Culture', slug: 'camiseta', img: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.53_2_xd44ki.jpg' },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden aspect-[3/4] bg-card"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink/60 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="font-display text-2xl text-white tracking-wider">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* VIP Banner */}
      <section className="bg-ink py-20 px-4 text-center">
        <p className="text-white/40 text-xs uppercase tracking-[0.4em] mb-3">@hayhgang</p>
        <h2 className="font-display text-[clamp(3rem,8vw,7rem)] text-white leading-none mb-4">GRUPO VIP</h2>
        <p className="text-white/50 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
          Entre no nosso grupo VIP e fique por dentro de tudo — drops, promoções e lançamentos exclusivos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/7192055641" target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-ink px-8 py-4 text-xs uppercase tracking-widest font-medium hover:bg-accent hover:text-white transition-colors"
          >
            Entrar no Grupo
          </a>
          <a
            href="https://www.instagram.com/hayhgang/" target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-xs uppercase tracking-widest hover:border-white transition-colors"
          >
            Seguir no Instagram
          </a>
        </div>
      </section>

    </main>
  )
}
