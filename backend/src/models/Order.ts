import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, image: String, price: Number, size: String, quantity: Number,
  }],
  shippingAddress: {
    name: String, street: String, number: String, complement: String,
    neighborhood: String, city: String, state: String, zipCode: String,
  },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'pix' },
  status: { type: String, default: 'pendente', enum: ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'] },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
