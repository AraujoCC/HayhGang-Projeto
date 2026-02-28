import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Instagram } from 'lucide-react'

export default function HeroBanner() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1600&q=80"
          alt="Hayh Gang"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="max-w-xl animate-fadeInUp">

          {/* Eyebrow */}
          <p className="text-[#FF3B00] font-display text-sm tracking-[0.3em] mb-4 uppercase">
            Streetwear Nacional
          </p>

          {/* Headline */}
          <h1 className="font-display text-[clamp(4rem,12vw,9rem)] leading-none text-white mb-4">
            HAYH GANG
          </h1>

          {/* Sub */}
          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-3 max-w-sm">
            Camisetas, calças, tênis e acessórios com identidade própria.
          </p>

          {/* VIP strip */}
          <a
            href="https://wa.me/7192055641"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-[#FF3B00]/60 text-[#FF3B00] px-4 py-2 text-xs font-display tracking-widest mb-8 hover:bg-[#FF3B00]/10 transition-colors"
          >
            <MessageCircle size={12} />
            ENTRE NO GRUPO VIP — FIQUE POR DENTRO DE TUDO
          </a>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 bg-[#FF3B00] text-white px-8 py-4 font-display text-xl tracking-widest hover:bg-[#e03500] transition-colors group"
            >
              VER COLEÇÃO
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://www.instagram.com/hayhgang/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 border border-white/30 text-white px-8 py-4 font-display text-xl tracking-widest hover:border-white/70 transition-colors"
            >
              <Instagram size={18} />
              @HAYHGANG
            </a>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </div>

    </section>
  )
}
