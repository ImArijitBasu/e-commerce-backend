import express from 'express';
import { User } from '../models/User.js';
import { verifyToken } from '../middleware/verifyToken.js'; // ✅ import middleware

const router = express.Router();

router.post('/login', (req, res) => {
  res.send('Login route');
});

// ✅ Protected route to store/update user
router.post('/storeUser', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { displayName, email, photoURL } = req.body;

    if (!displayName || !email) {
      return res.status(400).json({ error: 'Missing required user data' });
    }

    let userDoc = await User.findOne({ uid });
    if (!userDoc) {
      userDoc = new User({
        uid,
        name: displayName,
        email,
        photoURL,
      });
      await userDoc.save();
      return res.status(201).json({ message: 'User created successfully', user: userDoc });
    } else {
      userDoc.name = displayName || userDoc.name;
      userDoc.email = email || userDoc.email;
      userDoc.photoURL = photoURL || userDoc.photoURL;
      await userDoc.save();
      return res.status(200).json({ message: 'User updated successfully', user: userDoc });
    }
  } catch (error) {
    console.error('Error in /storeUser:', error);
    return res.status(500).json({ error: error.message });
  }
});

export { router as authRoutes };
