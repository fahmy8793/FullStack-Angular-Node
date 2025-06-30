export interface UserData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}
