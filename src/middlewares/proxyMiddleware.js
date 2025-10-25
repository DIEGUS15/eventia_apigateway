import axios from "axios";

export const proxyRequest = (serviceUrl) => {
  return async (req, res) => {
    try {
      const { method, body, query, params, headers } = req;

      const targetUrl = `${serviceUrl}${req.baseUrl}${req.path}`;

      const forwardHeaders = { ...headers };
      delete forwardHeaders.host;
      delete forwardHeaders["content-length"];

      const config = {
        method: method,
        url: targetUrl,
        headers: forwardHeaders,
        params: query,
        timeout: 30000,
      };

      if (method !== "GET" && method !== "HEAD") {
        config.data = body;
      }

      const response = await axios(config);

      res.status(response.status).json(response.data);
    } catch (error) {
      console.error(`Error proxying request to ${serviceUrl}:`, error.message);

      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      } else if (error.code === "ECONNREFUSED") {
        return res.status(503).json({
          success: false,
          message: "Service temporarily unavailable",
          service: serviceUrl,
        });
      } else if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
        return res.status(504).json({
          success: false,
          message: "Service timeout",
          service: serviceUrl,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Internal gateway error",
          error: error.message,
        });
      }
    }
  };
};
