import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import routes from "./src/routes/gatewayRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use("/", routes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
  console.log(`Proxying requests to microservices...`);
});
