export default function PromoStrip() {
  const items = [
    'HAYH GANG', '·', 'CAMISETAS', '·', 'NOVO DROP', '·',
    'GRUPO VIP NO WHATSAPP', '·', 'FRETE GRÁTIS ACIMA DE R$299', '·',
    '5% OFF NO PIX', '·', '@HAYHGANG', '·',
  ]

  return (
    <div className="bg-ink py-3 overflow-hidden border-y border-ink">
      <div className="flex whitespace-nowrap marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className={`text-xs tracking-widest mx-4 ${
            item === '·' ? 'text-white/30' : 'text-white/70 font-display text-sm'
          }`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
