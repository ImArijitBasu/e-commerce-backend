import express from 'express';

const router = express.Router();

// import {
//   createOrder,
//   getAllOrders,
//   getOrderById,
//   updateOrder,
//   deleteOrder,
// } from '../controllers/orderController.js';

// router.post('/orders', createOrder);
// router.get('/orders', getAllOrders);
// router.get('/orders/:id', getOrderById);
// router.put('/orders/:id', updateOrder);
// router.delete('/orders/:id', deleteOrder);

export { router as orderRoutes };