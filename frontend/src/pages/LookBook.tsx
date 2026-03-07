import { useState } from 'react'
import { X, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'

const PHOTOS = [
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400513/IMG_3010_ufsmbs.jpg', tag: 'DROP 01', title: 'Oplan Club — Worldwide Authority' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400521/IMG_2071_adebua.jpg', tag: 'COLEÇÃO', title: 'Oplan Club Worldwide' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400512/IMG_2897_nrneii.jpg', tag: 'TRIPSIDL', title: 'Streetwear Diferenciado' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400516/IMG_2944_glj9hq.jpg', tag: 'DROP 01', title: 'Gang — Salvador, Bahia' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400515/IMG_2816_iqcvjc.jpg', tag: 'ORIGINAL', title: 'Original E Marginal' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400518/IMG_2599_p0p7r0.jpg', tag: 'BLESSED', title: 'Blessed Beyond Measure' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400519/IMG_2582_tt543j.jpg', tag: 'ANGEL', title: 'Camiseta Angel Drop' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400520/IMG_2552_rcjaun.jpg', tag: 'ANGEL', title: 'Angel — Back Print' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400518/IMG_2263_lumsie.jpg', tag: 'ORIGINAL', title: 'Original E Marginal — Frente' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400518/IMG_2269_pokcaz.jpg', tag: 'COLEÇÃO', title: 'Coleção Completa' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400517/IMG_2742_t3vbsi.jpg', tag: 'SHORTS', title: 'Cargo Flame — Tripsidl' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400517/IMG_2684_k2tsg2.jpg', tag: 'GANG', title: 'Hayh Gang — Salvador' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400515/IMG_2774_dpekec.jpg', tag: 'BLESSED', title: 'Blessed — Back' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400515/IMG_2736_ew6uoo.jpg', tag: 'CALÇA', title: 'Calça Lightning Tripsidl' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400521/IMG_2016_t8oxsb.jpg', tag: 'CAMPANHA', title: 'Campanha Drop 01' },
    { url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400520/IMG_2202_tbgzv3.jpg', tag: 'DROP 01', title: 'Drop 01 — Hayh Gang' },
]

export default function LookBook() {
    const [selected, setSelected] = useState<typeof PHOTOS[0] | null>(null)

    return (
        <main className="min-h-screen bg-[#0A0A0A]">

            {/* Header */}
            <div className="border-b border-white/10 px-6 md:px-16 py-10 md:py-16">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="text-[#FF3B00] text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2">Hayh Gang — 2025</p>
                        <h1 className="font-display text-5xl md:text-8xl text-white tracking-widest leading-none">LOOKBOOK</h1>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                        <a href="https://instagram.com/hayhgang" target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors">
                            <Instagram size={14} />
                            @hayhgang
                        </a>
                        <Link to="/shop"
                            className="bg-[#FF3B00] text-white px-5 md:px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                            COMPRAR
                        </Link>
                    </div>
                </div>
            </div>

            {/* Grid uniforme — aspect-ratio 3/4 em todas as fotos, sem corte */}
            <div className="max-w-7xl mx-auto px-3 md:px-8 py-8 md:py-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                    {PHOTOS.map((photo, i) => (
                        <div
                            key={i}
                            className="relative overflow-hidden group cursor-pointer bg-[#111] aspect-[3/4]"
                            onClick={() => setSelected(photo)}
                        >
                            <img
                                src={photo.url}
                                alt={photo.title}
                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Overlay hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300" />
                            <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                <span className="text-[#FF3B00] text-[9px] md:text-[10px] uppercase tracking-[0.25em] mb-1">{photo.tag}</span>
                                <p className="text-white text-[10px] md:text-xs uppercase tracking-wider leading-tight">{photo.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="border-t border-white/10 py-14 md:py-20 text-center px-4">
                <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] mb-4">Coleção disponível</p>
                <h2 className="font-display text-4xl md:text-7xl text-white tracking-widest mb-8">VISTA A GANG</h2>
                <Link to="/shop"
                    className="inline-block bg-[#FF3B00] text-white px-10 py-4 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                    VER TODOS OS PRODUTOS
                </Link>
            </div>

            {/* Lightbox */}
            {selected && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-8"
                    onClick={() => setSelected(null)}
                >
                    <button className="absolute top-4 right-4 md:top-6 md:right-6 text-white/60 hover:text-white transition-colors z-10 p-2">
                        <X size={22} />
                    </button>
                    <div className="max-w-sm md:max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selected.url}
                            alt={selected.title}
                            className="w-full max-h-[70vh] object-contain"
                        />
                        <div className="mt-4 flex items-center justify-between gap-4">
                            <div>
                                <span className="text-[#FF3B00] text-[10px] uppercase tracking-[0.3em]">{selected.tag}</span>
                                <p className="text-white text-xs md:text-sm uppercase tracking-wider mt-1">{selected.title}</p>
                            </div>
                            <Link to="/shop" onClick={() => setSelected(null)}
                                className="flex-shrink-0 bg-[#FF3B00] text-white px-4 md:px-5 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                                COMPRAR
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}