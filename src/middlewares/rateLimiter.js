import rateLimit from "express-rate-limit";

export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: "Too many request from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const authRateLimiter = createRateLimiter(15 * 60 * 1000, 20);

export const generalRateLimiter = createRateLimiter(15 * 60 * 100, 100);
