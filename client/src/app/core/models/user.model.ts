
export type UserRole = 'General User' | 'Admin';


export interface User {
  _id         : string;
  userId     : string;
  name       : string;
  email      : string;
  role       : UserRole;
  isActive   : boolean;
  createdAt? : string;
  updatedAt? : string;
}

export interface LoginRequest {
  email   : string;
  password : string;
}

export interface LoginResponse {
  success : boolean;
  message : string;
  data    : {
    token : string;
    user  : User;
  };
}

export interface CreateUserRequest {
  name       : string;
  email      : string;
  password   : string;
  role       : UserRole;
}

export interface UpdateUserRequest {
  name?      : string;
  email?     : string;
  isActive?  : boolean;
}

export interface ApiResponse<T> {
  success : boolean;
  message?: string;
  count?  : number;
  data    : T;
}