import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    img: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400513/IMG_3010_ufsmbs.jpg',
    tag: 'DROP 01',
    title: 'STREETWEAR\nDIFERENCIADO',
    sub: 'Salvador, Bahia — 2025',
  },
  {
    img: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400521/IMG_2071_adebua.jpg',
    tag: 'OPLAN CLUB',
    title: 'WORLDWIDE\nAUTHORITY',
    sub: 'Made in Brazil',
  },
  {
    img: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400515/IMG_2816_iqcvjc.jpg',
    tag: 'NOVA COLEÇÃO',
    title: 'ORIGINAL E\nMARGINAL',
    sub: 'Ngm Cuenta',
  },
  {
    img: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400518/IMG_2599_p0p7r0.jpg',
    tag: 'HAYH GANG',
    title: 'BLESSED\nBEYOND MEASURE',
    sub: 'Coleção Exclusiva',
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => goTo((current + 1) % SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [current])

  const goTo = (idx: number) => {
    if (animating) return
    setAnimating(true)
    setTimeout(() => { setCurrent(idx); setAnimating(false) }, 300)
  }

  const s = SLIDES[current]

  return (
    <section className="relative w-full h-[92vh] min-h-[600px] overflow-hidden bg-black">
      {/* Background image */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        <img src={s.img} alt="" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-16 px-6 md:px-16 max-w-7xl mx-auto">
        <div className={`transition-all duration-500 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <span className="inline-block text-[#FF3B00] text-xs uppercase tracking-[0.3em] mb-4 border border-[#FF3B00] px-3 py-1">
            {s.tag}
          </span>
          <h1 className="font-display text-6xl md:text-8xl text-white leading-none tracking-widest mb-4 whitespace-pre-line">
            {s.title}
          </h1>
          <p className="text-white/50 text-sm uppercase tracking-widest mb-8">{s.sub}</p>
          <div className="flex gap-4">
            <Link to="/shop"
              className="bg-white text-black px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-[#FF3B00] hover:text-white transition-all duration-300">
              COMPRAR AGORA
            </Link>
            <Link to="/lookbook"
              className="border border-white/40 text-white px-8 py-4 text-xs uppercase tracking-widest hover:border-white transition-all duration-300">
              VER LOOKBOOK
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-16 right-6 md:right-16 flex items-center gap-4">
          <button onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
            className="w-10 h-10 border border-white/30 text-white flex items-center justify-center hover:border-white hover:bg-white/10 transition-all">
            <ChevronLeft size={16} />
          </button>
          <span className="text-white/40 text-xs uppercase tracking-widest">
            {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>
          <button onClick={() => goTo((current + 1) % SLIDES.length)}
            className="w-10 h-10 border border-white/30 text-white flex items-center justify-center hover:border-white hover:bg-white/10 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-8 left-6 md:left-16 flex gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`transition-all duration-300 ${i === current ? 'w-8 h-1 bg-[#FF3B00]' : 'w-2 h-1 bg-white/30 hover:bg-white/60'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}