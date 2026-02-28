import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  images: [{ type: String }],
  category: { type: String, required: true, enum: ['camiseta', 'moletom', 'calca', 'bone', 'acessorio'] },
  sizes: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  featured: { type: Boolean, default: false },
  tag: { type: String },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true })

export default mongoose.model('Product', productSchema)
