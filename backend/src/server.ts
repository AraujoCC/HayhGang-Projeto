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

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('✅ MongoDB conectado!')
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`))
  })
  .catch((err) => console.error('❌ Erro ao conectar MongoDB:', err))
