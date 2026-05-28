import mongoose, { Document, Schema } from 'mongoose';


export type RecordStatus   = 'Active' | 'Pending' | 'Closed' | 'Archived';
export type RecordPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface IRecord extends Document {
  title      : string;
  description: string;
  status     : RecordStatus;
  priority   : RecordPriority;
  assignedTo : mongoose.Types.ObjectId;   
  category   : string;
  dueDate    : Date;
  progress   : number;                    
  createdAt  : Date;
  updatedAt  : Date;
}


const RecordSchema = new Schema<IRecord>(
  {
    title      : { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status     : { type: String, enum: ['Active','Pending','Closed','Archived'], default: 'Pending' },
    priority   : { type: String, enum: ['Low','Medium','High','Critical'],       default: 'Medium' },
    assignedTo : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category   : { type: String, default: 'General' },
    dueDate    : { type: Date },
    progress   : { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

export const Record = mongoose.model<IRecord>('Record', RecordSchema);
