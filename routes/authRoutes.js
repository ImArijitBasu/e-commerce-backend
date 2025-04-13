import express from 'express';
import { User } from '../models/User.js';
import { verifyToken } from '../middleware/verifyToken.js'; // ✅ import middleware

const router = express.Router();

router.post('/login', (req, res) => {
  res.send('Login route');
});

router.post('/storeUser', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { displayName, email, photoURL } = req.body;

    if (!displayName || !email) {
      return res.status(400).json({ error: 'Missing required user data' });
    }

    // ✅ Try finding the user by UID or email
    let userDoc = await User.findOne({ $or: [{ uid }, { email }] });

    if (!userDoc) {
      // ✅ No existing user found — safe to create
      userDoc = new User({
        uid,
        name: displayName,
        email,
        photoURL,
      });
      await userDoc.save();
      return res.status(201).json({ message: 'User created successfully', user: userDoc });
    }

    // ✅ If user exists, check if any changes needed
    const isSame =
      userDoc.name === displayName &&
      userDoc.email === email &&
      userDoc.photoURL === photoURL;

    if (isSame) {
      return res.status(200).json({ message: 'User already exists. No update needed.', user: userDoc });
    }

    // ✅ Update only if needed
    userDoc.name = displayName;
    userDoc.email = email;
    userDoc.photoURL = photoURL;
    await userDoc.save();

    return res.status(200).json({ message: 'User updated successfully', user: userDoc });
  } catch (error) {
    console.error('Error in /storeUser:', error);
    return res.status(500).json({ error: error.message });
  }
});


// GET /api/users/role?email=user@example.com
router.get("/role", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});



export { router as authRoutes };
