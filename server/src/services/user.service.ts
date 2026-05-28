import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { User, IUser } from '../models/User.model';

export class UserService {
  async getAll(): Promise<IUser[]> {
    return User.find().select('-password').sort({ createdAt: -1 }) as Promise<IUser[]>;
  }

  async getById(id: string): Promise<IUser | null> {
    return User.findById(id).select('-password') as Promise<IUser | null>;
  }

  async getByUserId(userId: string): Promise<IUser | null> {
    return User.findOne({ userId }).select('-password') as Promise<IUser | null>;
  }

  async create(dto: CreateUserDto): Promise<IUser> {
    const exists = await User.findOne({ email: dto.email });
    if (exists) {
      throw new Error('Email already in use');
    }
    const user = new User(dto);
    return user.save() as Promise<IUser>;
  }

  async update(id: string, dto: UpdateUserDto): Promise<IUser | null> {
    return User.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true, runValidators: true }
    ).select('-password') as Promise<IUser | null>;
  }

  async remove(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }
}

export const userService = new UserService();