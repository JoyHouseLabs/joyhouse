import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./database/data-source";
import userRouter from "./routes/user";
import path from "path";
import fs from "fs";
import YAML from "yaml";
import http from "http";
import https from "https";
import cors from "cors";
import { Logger } from "./logger";
import rateLimit from "express-rate-limit";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// 读取 config.yaml
let configPath = path.join(__dirname, "./config.yaml");
let config = {} as any;
if (fs.existsSync(configPath)) {
  config = YAML.parse(fs.readFileSync(configPath, "utf-8"));
}
const serverHost = config.serverHost || "0.0.0.0";
const serverPort = config.serverPort || 3002;

// 日志初始化
const logger = new Logger(config.log?.level || 'info', config.log?.file);
logger.info('云端服务器启动配置: ' + JSON.stringify({ ...config, apiAuth: !!config.apiAuth?.enabled, log: undefined }));

const app = express();
app.use(express.json());

// Swagger/OpenAPI 文档
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JoyHouse Cloud Note API",
      version: "1.0.0",
    },
  },
  apis: [
    path.join(__dirname, "./routes/*.ts"),
    path.join(__dirname, "./routes/*.js"),
  ],
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 限流中间件
if (config.rateLimit && config.rateLimit.enabled) {
  app.use(rateLimit({
    windowMs: config.rateLimit.windowMs || 60000,
    max: config.rateLimit.max || 100,
    handler: (req, res) => {
      logger.warn(`限流: ${req.ip} ${req.method} ${req.url}`);
      res.status(429).json({ error: '请求过于频繁，请稍后再试' });
    }
  }));
}

// 记录所有请求
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.url} from ${req.ip}`);
  next();
});

// CORS 支持
if (config.cors && config.cors.enabled) {
  app.use(cors({
    origin: config.cors.origin || '*',
    credentials: !!config.cors.credentials,
  }));
}

// API Token 鉴权中间件（仅保护部分接口）
if (config.apiAuth && config.apiAuth.enabled && config.apiAuth.token) {
  app.use('/api/users', (req, res, next) => {
    // 跳过无需 Token 的接口
    if (
      req.method === 'POST' &&
      (
        req.path === '/register' ||
        req.path === '/login' ||
        req.path === '/jwt-login'
      )
    ) {
      return next();
    }
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
      logger.warn(`鉴权失败: 未提供有效的 API Token (${req.method} ${req.url})`);
      return res.status(401).json({ error: '未提供有效的 API Token' });
    }
    const token = auth.substring(7);
    if (token !== config.apiAuth.token) {
      logger.warn(`鉴权失败: Token 错误 (${req.method} ${req.url})`);
      return res.status(401).json({ error: 'API Token 错误' });
    }
    next();
  });
}

// 只挂载云端接口（如 JWT 登录、注册、用户资料等）
app.use("/api/users", userRouter);

// 静态资源
if (config.staticDir) {
  const staticPath = path.isAbsolute(config.staticDir)
    ? config.staticDir
    : path.join(__dirname, config.staticDir);
  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));
  }
}

AppDataSource.initialize().then(() => {
  // HTTPS 支持
  if (config.https && config.https.enabled) {
    const keyPath = path.isAbsolute(config.https.key)
      ? config.https.key
      : path.join(__dirname, config.https.key);
    const certPath = path.isAbsolute(config.https.cert)
      ? config.https.cert
      : path.join(__dirname, config.https.cert);
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      logger.error("HTTPS 启用但证书或私钥文件不存在");
      throw new Error("HTTPS 启用但证书或私钥文件不存在");
    }
    const options = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
    https.createServer(options, app).listen(serverPort, serverHost, () => {
      logger.info(`Cloud HTTPS Server running at https://${serverHost}:${serverPort}`);
    });
  } else {
    http.createServer(app).listen(serverPort, serverHost, () => {
      logger.info(`Cloud HTTP Server running at http://${serverHost}:${serverPort}`);
    });
  }
}).catch((err) => {
  logger.error("Error during Data Source initialization: " + err?.stack || err);
  console.error("Error during Data Source initialization:", err);
});
