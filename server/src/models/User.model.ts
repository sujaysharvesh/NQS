import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';


export type UserRole = 'General User' | 'Admin';

export interface IUser extends Document {
  name     : string;
  email    : string;
  password : string;      
  role     : UserRole;   
  isActive : boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(plain: string): Promise<boolean>;
}


const UserSchema = new Schema<IUser>(
  {
    name      : { type: String, required: true, trim: true },
    email     : { type: String, required: true, unique: true, lowercase: true, trim: true },
    password  : { type: String, required: true, minlength: 4, select: false },
    role      : { type: String, enum: ['General User', 'Admin'], default: 'General User' },
    isActive  : { type: Boolean, default: true },
  },
  { timestamps: true }
);


UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


UserSchema.methods.comparePassword = function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
