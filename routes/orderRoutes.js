import express from 'express';

const router = express.Router();

// Example route
router.post('/', (req, res) => {
  res.send('Order created');
});

export { router as orderRoutes };