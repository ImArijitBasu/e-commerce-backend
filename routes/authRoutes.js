import express from 'express';

const router = express.Router();

// Example route
router.post('/login', (req, res) => {
  res.send('Login route');
});

export { router as authRoutes };