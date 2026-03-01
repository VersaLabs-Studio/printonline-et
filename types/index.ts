import { Database } from "./database";
export * from "./database";

export type ProjectTables = Database["public"]["Tables"];

// Auth
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  phone?: string;
  tin?: string;
  company?: string;
}
