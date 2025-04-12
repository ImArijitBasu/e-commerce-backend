import express from 'express';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { User } from '../models/User.js'; // Corrected import

const router = express.Router();
dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)),
  });
}

// Example route
router.post('/login', (req, res) => {
  res.send('Login route');
});

router.post('/storeUser', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid authorization header' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid } = decodedToken;
    if (!uid) {
      return res.status(401).json({ error: 'Invalid token' });
    }

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