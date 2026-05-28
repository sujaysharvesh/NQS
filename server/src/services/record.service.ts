import { Types } from 'mongoose';
import { Record, IRecord } from '../models/Record.model';
import { User } from '../models/User.model';
import { CreateRecordDto } from '../dto/record.dto';

interface RecordFilters {
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: Types.ObjectId;
}

export class RecordService {
  async getAllRecords(): Promise<{ records: IRecord[]; count: number }> {
    const records = await Record
      .find()
      .populate('assignedTo', 'userId name department role')
      .sort({ createdAt: -1 });

    return {
      records,
      count: records.length
    };
  }

  async getUserRecords(
    email: string, 
    filters: RecordFilters
  ): Promise<{ records: IRecord[]; count: number }> {
    const owner = await User.findOne({ email });
    
    if (!owner) {
      throw new Error('User profile not found');
    }

    const filter: Record<string, unknown> = {
      assignedTo: owner._id,
    };

    if (filters.status) filter['status'] = filters.status;
    if (filters.priority) filter['priority'] = filters.priority;
    if (filters.category) filter['category'] = filters.category;

    const records = await Record.find(filter)
      .populate('assignedTo', 'userId name department role')
      .sort({ createdAt: -1 });

    return {
      records,
      count: records.length
    };
  }

  async getRecordById(recordId: string): Promise<IRecord | null> {
    const record = await Record
      .findById(recordId)
      .populate('assignedTo', 'userId name department role');

    return record;
  }

  async createRecord(recordData: CreateRecordDto): Promise<IRecord> {

    const record = new Record({
      ...recordData,
    });
    await record.save();
    
    await record.populate('assignedTo', 'userId name department role');
    
    return record;
  }

  async updateRecord(
    recordId: string, 
    updateData: Partial<IRecord>
  ): Promise<IRecord | null> {
    const record = await Record
      .findByIdAndUpdate(
        recordId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      .populate('assignedTo', 'userId name department role');

    return record;
  }

  async deleteRecord(recordId: string): Promise<boolean> {
    const result = await Record.findByIdAndDelete(recordId);
    return !!result;
  }

  async getRecordsByStatus(status: string): Promise<IRecord[]> {
    const records = await Record
      .find({ status })
      .populate('assignedTo', 'userId name department role')
      .sort({ createdAt: -1 });
    
    return records;
  }

  async getRecordsByPriority(priority: string): Promise<IRecord[]> {
    const records = await Record
      .find({ priority })
      .populate('assignedTo', 'userId name department role')
      .sort({ createdAt: -1 });
    
    return records;
  }

  async getRecordsByCategory(category: string): Promise<IRecord[]> {
    const records = await Record
      .find({ category })
      .populate('assignedTo', 'userId name department role')
      .sort({ createdAt: -1 });
    
    return records;
  }

  async getOverdueRecords(): Promise<IRecord[]> {
    const records = await Record
      .find({ 
        dueDate: { $lt: new Date() },
        status: { $ne: 'Completed' }
      })
      .populate('assignedTo', 'userId name department role')
      .sort({ dueDate: 1 });
    
    return records;
  }

  async updateRecordProgress(
    recordId: string, 
    progress: number
  ): Promise<IRecord | null> {
    const record = await Record
      .findByIdAndUpdate(
        recordId,
        { 
          progress, 
          updatedAt: new Date(),
          ...(progress === 100 && { status: 'Completed' })
        },
        { new: true, runValidators: true }
      )
      .populate('assignedTo', 'userId name department role');
    
    return record;
  }
}

export default new RecordService();