import admin from '../utils/firebaseAdmin.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach decoded token (like uid, email, etc.) to req
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
