import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { userService } from '../services/user.service';

export class UserController {
  async getAll(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await userService.getAll();
      res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
      console.error('[users/getAll]', err);
      res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await userService.getById(req.params['id']);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      console.error('[users/getById]', err);
      res.status(500).json({ success: false, message: 'Failed to fetch user' });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (err) {
      console.error('[users/create]', err);
      const message = err instanceof Error ? err.message : 'Failed to create user';
      res.status(400).json({ success: false, message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await userService.update(req.params['id'], req.body);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (err) {
      console.error('[users/update]', err);
      res.status(500).json({ success: false, message: 'Failed to update user' });
    }
  }

  async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (req.user?.id === req.params['id']) {
        res.status(400).json({
          success: false,
          message: 'You cannot delete your own account',
        });
        return;
      }
      console.log('[users/delete] Deleting user with ID:', req.params['id']);
      await userService.remove(req.params['id']);
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
      console.error('[users/delete]', err);
      res.status(500).json({ success: false, message: 'Failed to delete user' });
    }
  }
}

export default new UserController();