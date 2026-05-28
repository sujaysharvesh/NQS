import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import authService from '../services/auth.service';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;


      if (!email || !password) {
        res.status(400).json({ 
          success: false, 
          message: 'Email and password are required' 
        });
        return;
      }

      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (err) {
      console.error('[auth/login]', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Server error';
      
      if (errorMessage === 'Invalid credentials') {
        res.status(401).json({ success: false, message: errorMessage });
        return;
      }
      
      if (errorMessage === 'Account is deactivated') {
        res.status(403).json({ success: false, message: errorMessage });
        return;
      }

      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ 
          success: false, 
          message: 'User not authenticated' 
        });
        return;
      }

      const user = await authService.getMe(userId);
      
      if (!user) {
        res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
        return;
      }

      res.status(200).json({ 
        success: true, 
        data: user 
      });
    } catch (err) {
      console.error('[auth/me]', err);
      res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      await authService.logout();
      
      res.status(200).json({ 
        success: true, 
        message: 'Logout successful. Please delete your token on the client.' 
      });
    } catch (err) {
      console.error('[auth/logout]', err);
      res.status(500).json({ 
        success: false, 
        message: 'Server error during logout' 
      });
    }
  }
}

export default new AuthController();