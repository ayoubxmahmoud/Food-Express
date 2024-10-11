interface Address {
  city?: string;
  country?: string;
}

export interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // In a real application, you probably wouldn't expose this
  avatar?: string; // Avatar URL
  address?: Address;
  phone?: string;
  createdAt?: string;
  [key: string]: unknown;
}
