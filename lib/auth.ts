import bcrypt from "bcryptjs";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

// In-memory user store (replace with a real database in production)
const users: User[] = [
  {
    id: "1767901476705",
    email: "preview@gmail.com",
    password: "$2b$10$U5jzEmSeG/vsroX1wc5S0ePKtaQuMHCXOuKBZO5TcUYul9UuBDZWC",
    name: "Artemii Dovhopolyi",
    createdAt: new Date(),
  },
  {
    id: "1767901476706",
    email: "preview2@gmail.com",
    password: "$2b$10$U5jzEmSeG/vsroX1wc5S0ePKtaQuMHCXOuKBZO5TcUYul9UuBDZWC",
    name: "Not Dovhopolyi",
    createdAt: new Date(),
  }
];

export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<User> {
  // Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user: User = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    createdAt: new Date(),
  };

  users.push(user);
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.find((u) => u.email === email) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  return users.find((u) => u.id === id) || null;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

