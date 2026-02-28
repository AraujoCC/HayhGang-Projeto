import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product'

dotenv.config()

const products = [
  {
    name: 'Camiseta Revival', slug: 'camiseta-revival',
    description: 'Faith Reborn Through Love and Grace. Oversized, 100% algodão fio 30.1.',
    price: 149.90, category: 'camiseta', sizes: ['P', 'M', 'G', 'GG'],
    stock: 10, featured: true, tag: 'NOVO',
    images: [
      'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.53_1_srnxgp.jpg',
      'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.53_lc9hwm.jpg',
    ],
  },
  {
    name: 'Camiseta Culture', slug: 'camiseta-culture',
    description: 'Streetwear com identidade. Estampa reflective no peito. Oversized, algodão premium.',
    price: 159.90, category: 'camiseta', sizes: ['P', 'M', 'G', 'GG'],
    stock: 10, featured: true, tag: 'NOVO',
    images: [
      'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.53_2_xd44ki.jpg',
      'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.53_3_gxypyj.jpg',
    ],
  },
  {
    name: 'Camiseta Heaven', slug: 'camiseta-heaven',
    description: 'Anjos e chamas. Drop limitado. Oversized, estampa full back exclusiva.',
    price: 169.90, category: 'camiseta', sizes: ['P', 'M', 'G', 'GG'],
    stock: 10, featured: true, tag: 'LIMITADO',
    images: [
      'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_exz4f0.jpg',
      'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_3_fmieun.jpg',
    ],
  },
  {
    name: 'Camiseta Noble Empire', slug: 'camiseta-noble-empire',
    description: 'Legacy of Honor. Estampa nobiliárquica. Cor bordô exclusiva.',
    price: 179.90, category: 'camiseta', sizes: ['P', 'M', 'G', 'GG'],
    stock: 10, featured: true, tag: 'NOVO',
    images: [
      'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_1_u3l9ks.jpg',
      'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_2_er7bly.jpg',
    ],
  },
  {
    name: 'Camiseta OPLAN', slug: 'camiseta-oplan',
    description: 'Logo minimal na frente, arte clássica no verso. O básico que não é básico.',
    price: 149.90, category: 'camiseta', sizes: ['P', 'M', 'G', 'GG'],
    stock: 10, featured: true,
    images: [
      'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_4_ncfwr2.jpg',
      'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.55_ufqlkg.jpg',
    ],
  },
]

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string)
  console.log('✅ MongoDB conectado!')
  await Product.deleteMany({})
  console.log('🗑️  Produtos removidos')
  await Product.insertMany(products)
  console.log('✅ 5 produtos inseridos!')
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => { console.error(err); process.exit(1) })
