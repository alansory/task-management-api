export class RegisterUserRequest {
  name?: string;
  email: string;
  username?: string;
  password: string;
}

export class UserResponse {
  id: number
  name: string;
  email: string;
  username: string;
  created_at: Date;
  updated_at: Date;
}

export class LoginUserRequest {
  email: string;
  password: string;
}

export class UpdateUserRequest {
  name?: string;
  password?: string;
}

export class SearchUserRequest {
  id?: number;
  name?: string;
  email?: string;
  username?: string;
  page?: number;
  per_page?: number;
}
