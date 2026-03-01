import { Link } from 'react-router-dom'

const GRID = [
    {
        url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400516/IMG_2944_glj9hq.jpg',
        class: 'col-span-2 row-span-2',
    },
    {
        url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400521/IMG_2071_adebua.jpg',
        class: 'col-span-1 row-span-1',
    },
    {
        url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400518/IMG_2599_p0p7r0.jpg',
        class: 'col-span-1 row-span-1',
    },
    {
        url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400515/IMG_2816_iqcvjc.jpg',
        class: 'col-span-1 row-span-2',
    },
    {
        url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400517/IMG_2742_t3vbsi.jpg',
        class: 'col-span-1 row-span-1',
    },
    {
        url: 'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772400515/IMG_2736_ew6uoo.jpg',
        class: 'col-span-1 row-span-1',
    },
]

export default function LookbookSection() {
    return (
        <section className="bg-[#0A0A0A] py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="text-[#FF3B00] text-[10px] uppercase tracking-[0.4em] mb-2">Hayh Gang — 2025</p>
                        <h2 className="font-display text-5xl md:text-6xl text-white tracking-widest leading-none">LOOKBOOK</h2>
                    </div>
                    <Link to="/lookbook"
                        className="hidden md:flex items-center gap-2 text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors group">
                        Ver tudo
                        <span className="w-8 h-px bg-white/40 group-hover:bg-white group-hover:w-12 transition-all" />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[240px] gap-2">
                    {GRID.map((photo, i) => (
                        <Link key={i} to="/lookbook"
                            className={`${photo.class} relative overflow-hidden group bg-[#111]`}>
                            <img src={photo.url} alt=""
                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                        </Link>
                    ))}
                </div>

                {/* Mobile CTA */}
                <div className="md:hidden mt-6 text-center">
                    <Link to="/lookbook"
                        className="inline-block border border-white/20 text-white/60 px-8 py-3 text-xs uppercase tracking-widest hover:border-white hover:text-white transition-all">
                        VER LOOKBOOK COMPLETO
                    </Link>
                </div>
            </div>
        </section>
    )
}