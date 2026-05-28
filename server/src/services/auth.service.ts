import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { IUser, UserRole } from '../models/User.model';

const JWT_SECRET = process.env.JWT_SECRET || 'dummy_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

interface LoginData {
  email: string;
  password: string;
}

interface TokenPayload {
  id: string;
  role: UserRole;
  email: string;
}

export class AuthService {
  private makeToken(id: string, role: UserRole, email: string): string {
    return jwt.sign({ id, role, email }, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES 
    } as jwt.SignOptions);
  }

  async login(loginData: LoginData): Promise<{
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      isActive: boolean;
    };
  }> {
    const { email, password } = loginData;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const token = this.makeToken(
      String(user._id),
      user.role as UserRole,
      user.email
    );

    return {
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        isActive: user.isActive,
      },
    };
  }

  async getMe(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId).select('-password');
    return user;
  }

  async logout(): Promise<void> {
    return Promise.resolve();
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();