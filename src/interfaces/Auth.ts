export interface Auth {
  id: string;
  userName?: string;
  password?: string;
  plainPassword: string;
  role: "admin" | "superAdmin";
}

export interface TokenPayload {
  role: "admin" | "superAdmin";
}
