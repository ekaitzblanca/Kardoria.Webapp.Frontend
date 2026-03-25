export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id_user: number;
  name: string;
  email: string;
  username: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
}
