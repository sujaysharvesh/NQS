import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import recordService from '../services/record.service';

export class RecordController {
  async getAllRecords(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { records, count } = await recordService.getAllRecords();

      res.status(200).json({ 
        success: true, 
        count, 
        data: records 
      });
    } catch (err) {
      console.error('[records/getAll]', err);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch records' 
      });
    }
  }

  async getRecords(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, priority, category } = req.query;

      if (!req.user?.email) {
        res.status(401).json({ 
          success: false, 
          message: 'Unauthorized' 
        });
        return;
      }

      const { records, count } = await recordService.getUserRecords(
        req.user.email,
        {
          status: status as string,
          priority: priority as string,
          category: category as string
        }
      );

      res.status(200).json({ 
        success: true, 
        count, 
        data: records 
      });
    } catch (err) {
      console.error('[records/getUserRecords]', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch records';
      
      if (errorMessage === 'User profile not found') {
        res.status(404).json({ 
          success: false, 
          message: errorMessage 
        });
        return;
      }

      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch records' 
      });
    }
  }

  async getRecordById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recordId = req.params['id'];
      
      if (!recordId) {
        res.status(400).json({ 
          success: false, 
          message: 'Record ID is required' 
        });
        return;
      }

      const record = await recordService.getRecordById(recordId);

      if (!record) {
        res.status(404).json({ 
          success: false, 
          message: 'Record not found' 
        });
        return;
      }

      res.status(200).json({ 
        success: true, 
        data: record 
      });
    } catch (err) {
      console.error('[records/getById]', err);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch record' 
      });
    }
  }

  async createRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recordData = req.body;
    
      if (!recordData.title || !recordData.assignedTo) {
        res.status(400).json({ 
          success: false, 
          message: 'Title and assignedTo are required' 
        });
        return;
      }

      const record = await recordService.createRecord(recordData);

      res.status(201).json({ 
        success: true, 
        message: 'Record created successfully',
        data: record 
      });
    } catch (err) {
      console.error('[records/create]', err);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create record' 
      });
    }
  }

  async updateRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recordId = req.params['id'];
      const updateData = req.body;

      if (!recordId) {
        res.status(400).json({ 
          success: false, 
          message: 'Record ID is required' 
        });
        return;
      }

      const record = await recordService.updateRecord(recordId, updateData);

      if (!record) {
        res.status(404).json({ 
          success: false, 
          message: 'Record not found' 
        });
        return;
      }

      res.status(200).json({ 
        success: true, 
        message: 'Record updated successfully',
        data: record 
      });
    } catch (err) {
      console.error('[records/update]', err);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to update record' 
      });
    }
  }

  async deleteRecord(req: AuthRequest, res: Response): Promise<void> {
    try {
      const recordId = req.params['id'];

      if (!recordId) {
        res.status(400).json({ 
          success: false, 
          message: 'Record ID is required' 
        });
        return;
      }

      const deleted = await recordService.deleteRecord(recordId);

      if (!deleted) {
        res.status(404).json({ 
          success: false, 
          message: 'Record not found' 
        });
        return;
      }

      res.status(200).json({ 
        success: true, 
        message: 'Record deleted successfully' 
      });
    } catch (err) {
      console.error('[records/delete]', err);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete record' 
      });
    }
  }

  
}

export default new RecordController();