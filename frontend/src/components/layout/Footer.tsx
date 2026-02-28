import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-bg border-t border-border">

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">

        <div className="col-span-2 md:col-span-1">
          <h3 className="font-display text-2xl text-ink tracking-widest mb-4">HAYH GANG</h3>
          <p className="text-xs text-muted leading-relaxed mb-4">
            Streetwear nacional com identidade. Entre no grupo VIP e fique por dentro de tudo.
          </p>
          <a
            href="https://wa.me/7192055641" target="_blank" rel="noreferrer"
            className="inline-block text-xs uppercase tracking-widest text-white bg-accent px-4 py-2.5 hover:bg-ink transition-colors"
          >
            Grupo VIP
          </a>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-ink font-medium mb-4">Produtos</h4>
          <ul className="space-y-2.5">
            {[
              { label: 'Novidades', to: '/shop' },
              { label: 'Camisetas', to: '/shop?category=camiseta' },
              { label: 'Calças', to: '/shop?category=calca' },
              { label: 'Acessórios', to: '/shop?category=acessorio' },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-xs text-muted hover:text-ink transition-colors uppercase tracking-wider">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-ink font-medium mb-4">Ajuda</h4>
          <ul className="space-y-2.5">
            {['Trocas e devoluções', 'Guia de tamanhos', 'Rastrear pedido'].map((l) => (
              <li key={l}>
                <span className="text-xs text-muted uppercase tracking-wider">{l}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-ink font-medium mb-4">Contato</h4>
          <ul className="space-y-2.5">
            <li>
              <a href="https://www.instagram.com/hayhgang/" target="_blank" rel="noreferrer"
                className="text-xs text-muted hover:text-ink transition-colors uppercase tracking-wider">
                Instagram — @hayhgang
              </a>
            </li>
            <li>
              <a href="https://wa.me/7192055641" target="_blank" rel="noreferrer"
                className="text-xs text-muted hover:text-ink transition-colors uppercase tracking-wider">
                WhatsApp VIP
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-border py-5 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-[11px] text-muted uppercase tracking-widest">
          © 2025 Hayh Gang. Todos os direitos reservados.
        </p>
        <p className="text-[11px] text-muted uppercase tracking-widest">
          Parcele em até 6x sem juros · 5% OFF no PIX
        </p>
      </div>

    </footer>
  )
}
