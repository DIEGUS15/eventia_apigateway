import dotenv from "dotenv";

dotenv.config();

export const SERVICES = {
  AUTH: {
    url: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    prefix: "/api/auth",
  },
  USERS: {
    url: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    prefix: "/api/users",
  },
};
