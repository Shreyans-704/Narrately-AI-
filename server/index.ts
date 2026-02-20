import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleSignup } from "./routes/signup";
import { handleAdminLogin } from "./routes/admin-login";
import { handleGetAdminUsers } from "./routes/admin-users";
import { handleUpdateCredits, handleUpdateRole, handleDeleteUser, handleUpdateAvatarGroup } from './routes/admin-manage';

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/signup", handleSignup);
  app.post("/api/admin-login", handleAdminLogin);

  // Admin management routes (protected by admin-login flow)
  app.get("/api/admin/users", handleGetAdminUsers);
  app.patch("/api/admin/users/:id/credits", handleUpdateCredits);
  app.patch("/api/admin/users/:id/role", handleUpdateRole);
  app.patch("/api/admin/users/:id/avatar-group", handleUpdateAvatarGroup);
  app.delete("/api/admin/users/:id", handleDeleteUser);

  return app;
}
