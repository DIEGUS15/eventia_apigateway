import express from "express";
import { SERVICES } from "../config/services.js";
import { proxyRequest } from "../middlewares/proxyMiddleware.js";
import {
  authRateLimiter,
  generalRateLimiter,
} from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API Gateway is running",
    timestamp: new Date().toISOString(),
  });
});

router.use(
  SERVICES.AUTH.prefix,
  authRateLimiter,
  proxyRequest(SERVICES.AUTH.url)
);

router.use(
  SERVICES.USERS.prefix,
  authRateLimiter,
  proxyRequest(SERVICES.USERS.url)
);

export default router;
