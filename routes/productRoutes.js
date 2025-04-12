import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Apply auth middleware where needed
router.post('/', verifyToken, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

export { router as productRoutes };