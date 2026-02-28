import { Request, Response } from 'express'
import Order from '../models/Order'

// POST /api/orders
export const createOrder = async (req: any, res: Response) => {
  try {
    const { items, shippingAddress, total, paymentMethod } = req.body

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      total,
      paymentMethod,
    })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pedido', error })
  }
}

// GET /api/orders/my
export const getMyOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos', error })
  }
}

// GET /api/orders (admin)
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos', error })
  }
}

// PUT /api/orders/:id/status (admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: 'Pedido não encontrado' })
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pedido', error })
  }
}
