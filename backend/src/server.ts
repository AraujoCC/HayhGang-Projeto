import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth'
import productRoutes from './routes/products'
import orderRoutes from './routes/orders'

dotenv.config()

const app = express()
app.use(cors({
  origin: ['https://hayh-gang-projeto-emww.vercel.app', 'http://localhost:5173'],
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

const PORT = process.env.PORT || 3000

app.get('/api/seed', async (req, res) => {
  const Product = require('./models/Product').default
  await Product.deleteMany({})
  await Product.insertMany([
    {
      name: 'Camiseta Revival', slug: 'camiseta-revival',
      description: 'Faith Reborn Through Love and Grace. Oversized, 100% algodão fio 30.1.',
      price: 149.90, category: 'camiseta', sizes: ['P','M','G','GG'],
      stock: 10, featured: true, tag: 'NOVO',
      images: [
        'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.53_1_srnxgp.jpg',
        'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.53_lc9hwm.jpg',
      ],
    },
    {
      name: 'Camiseta Culture', slug: 'camiseta-culture',
      description: 'Streetwear com identidade. Estampa reflective no peito.',
      price: 159.90, category: 'camiseta', sizes: ['P','M','G','GG'],
      stock: 10, featured: true, tag: 'NOVO',
      images: [
        'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.53_2_xd44ki.jpg',
        'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.53_3_gxypyj.jpg',
      ],
    },
    {
      name: 'Camiseta Heaven', slug: 'camiseta-heaven',
      description: 'Anjos e chamas. Drop limitado. Oversized, estampa full back exclusiva.',
      price: 169.90, category: 'camiseta', sizes: ['P','M','G','GG'],
      stock: 10, featured: true, tag: 'LIMITADO',
      images: [
        'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_exz4f0.jpg',
        'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_3_fmieun.jpg',
      ],
    },
    {
      name: 'Camiseta Noble Empire', slug: 'camiseta-noble-empire',
      description: 'Legacy of Honor. Estampa nobiliárquica. Cor bordô exclusiva.',
      price: 179.90, category: 'camiseta', sizes: ['P','M','G','GG'],
      stock: 10, featured: true, tag: 'NOVO',
      images: [
        'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_1_u3l9ks.jpg',
        'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_2_er7bly.jpg',
      ],
    },
    {
      name: 'Camiseta OPLAN', slug: 'camiseta-oplan',
      description: 'Logo minimal na frente, arte clássica no verso.',
      price: 149.90, category: 'camiseta', sizes: ['P','M','G','GG'],
      stock: 10, featured: true,
      images: [
        'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.54_4_ncfwr2.jpg',
        'https://res.cloudinary.com/dnwa5ur7x/image/upload/v1772282745/WhatsApp_Image_2026-02-28_at_09.21.55_ufqlkg.jpg',
      ],
    },
  ])
  res.json({ ok: true, message: '5 produtos inseridos!' })
})

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('✅ MongoDB conectado!')
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`))
  })
  .catch((err) => console.error('❌ Erro ao conectar MongoDB:', err))
