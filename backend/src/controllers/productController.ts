import { Request, Response } from 'express'
import Product from '../models/Product'

// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, featured, search, page = 1, limit = 12 } = req.query

    const query: any = {}
    if (category) query.category = category
    if (featured) query.featured = true
    if (search) query.name = { $regex: search, $options: 'i' }

    const skip = (Number(page) - 1) * Number(limit)
    const total = await Product.countDocuments(query)
    const products = await Product.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 })

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos', error })
  }
}

// GET /api/products/:slug
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produto', error })
  }
}

// POST /api/products (admin)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, originalPrice, images, category, sizes, stock, featured, tag } = req.body

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')

    const product = await Product.create({
      name, description, price, originalPrice, images, category, sizes, stock, featured, tag, slug,
    })

    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto', error })
  }
}

// PUT /api/products/:id (admin)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar produto', error })
  }
}

// DELETE /api/products/:id (admin)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Produto não encontrado' })
    res.json({ message: 'Produto removido' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover produto', error })
  }
}
