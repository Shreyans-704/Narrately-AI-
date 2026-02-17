import { RequestHandler } from 'express';

interface AdminLoginRequest {
  username: string;
  password: string;
}

// Admin credentials
const ADMIN_USERNAME = 'Admin@Narrately';
const ADMIN_PASSWORD = 'Admin@2026';

export const handleAdminLogin: RequestHandler = (req, res) => {
  const { username, password } = req.body as AdminLoginRequest;

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password required' });
    return;
  }

  // Validate credentials
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ 
      success: true, 
      user: {
        username,
        role: 'admin',
        message: 'Admin authenticated successfully'
      }
    });
    return;
  }

  res.status(401).json({ error: 'Invalid admin credentials' });
};
