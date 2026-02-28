import { Router } from 'express'
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController'
import { protect, adminOnly } from '../middlewares/authMiddleware'

const router = Router()
router.post('/', protect, createOrder)
router.get('/my', protect, getMyOrders)
router.get('/', protect, adminOnly, getAllOrders)
router.put('/:id/status', protect, adminOnly, updateOrderStatus)
export default router
