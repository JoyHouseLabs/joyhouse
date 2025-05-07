import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./database/data-source";
import noteRouter from "./routes/note";
import path from "path";
import fs from "fs";
import YAML from "yaml";
import http from "http";
import https from "https";
import cors from "cors";
import { Logger } from "./logger";
import rateLimit from "express-rate-limit";
import session from "express-session";
// import userRouter from "./routes/user";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// 读取 serverHost/serverPort/config 配置
let configPath = path.join(__dirname, "./config.yaml");
let config = {} as any;
if (fs.existsSync(configPath)) {
  config = YAML.parse(fs.readFileSync(configPath, "utf-8"));
}
const serverHost = config.serverHost || "127.0.0.1";
const serverPort = config.serverPort || 3001;

// 日志初始化
const logger = new Logger(config.log?.level || 'info', config.log?.file);
logger.info('服务器启动配置: ' + JSON.stringify({ ...config, apiAuth: !!config.apiAuth?.enabled, log: undefined }));

const app = express();
app.use(express.json());

// Swagger/OpenAPI 文档
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JoyHouse Local Note API",
      version: "1.0.0",
    },
  },
  apis: [
    path.join(__dirname, "./routes/*.ts"),
    path.join(__dirname, "./routes/*.js"),
  ],
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Session 支持
app.use(session({
  secret: config.apiAuth?.token || 'joyhouse-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // 若启用 https 可设为 true
}));

// 上传目录静态资源
import path from "path";
import fs from "fs";
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

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

// API Token 鉴权中间件
if (config.apiAuth && config.apiAuth.enabled && config.apiAuth.token) {
  app.use('/api', (req, res, next) => {
    // 跳过无需 Token 的接口
    if (
      req.method === 'POST' &&
      (
        req.path === '/users/register' ||
        req.path === '/users/login' ||
        req.path === '/users/jwt-login'
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

// CORS 支持
if (config.cors && config.cors.enabled) {
  app.use(cors({
    origin: config.cors.origin || '*',
    credentials: !!config.cors.credentials
  }));
}

// 静态资源目录支持
if (config.staticDir) {
  const staticDirPath = path.isAbsolute(config.staticDir)
    ? config.staticDir
    : path.join(__dirname, config.staticDir);
  if (fs.existsSync(staticDirPath)) {
    app.use(express.static(staticDirPath));
  }
}

app.use("/api/notes", noteRouter);
// 本地用户相关接口（不包含 /jwt-login）
import { Router } from "express";
import { AppDataSource } from "./database/data-source";
import { User } from "./entities/User";
import bcrypt from "bcryptjs";
import multer from "multer";

const userRouter = Router();
const userRepo = () => AppDataSource.getRepository(User);
const upload = multer({ dest: uploadDir });

userRouter.post("/register", async (req, res) => {
  const { username, password, nickname } = req.body;
  if (!username || !password) return res.status(400).json({ error: "用户名和密码必填" });
  if (await userRepo().findOneBy({ username })) return res.status(409).json({ error: "用户名已存在" });
  const hash = await bcrypt.hash(password, 10);
  const user = userRepo().create({ username, password: hash, nickname });
  await userRepo().save(user);
  res.json({ success: true });
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await userRepo().findOneBy({ username });
  if (!user) return res.status(401).json({ error: "用户名或密码错误" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "用户名或密码错误" });
  req.session = req.session || {};
  req.session.userId = user.id;
  res.json({ success: true, user: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar, remark: user.remark } });
});

userRouter.post("/logout", (req, res) => {
  if (req.session) req.session.userId = null;
  res.json({ success: true });
});

userRouter.get("/me", async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ error: "未登录" });
  const user = await userRepo().findOneBy({ id: userId });
  if (!user) return res.status(404).json({ error: "用户不存在" });
  res.json({ user: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar, remark: user.remark } });
});

userRouter.post("/nickname", async (req, res) => {
  const userId = req.session?.userId;
  const { nickname } = req.body;
  if (!userId) return res.status(401).json({ error: "未登录" });
  await userRepo().update(userId, { nickname });
  res.json({ success: true });
});

userRouter.post("/remark", async (req, res) => {
  const userId = req.session?.userId;
  const { remark } = req.body;
  if (!userId) return res.status(401).json({ error: "未登录" });
  await userRepo().update(userId, { remark });
  res.json({ success: true });
});

userRouter.post("/avatar", upload.single('avatar'), async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).json({ error: "未登录" });
  const file = req.file;
  if (!file) return res.status(400).json({ error: "未上传文件" });
  await userRepo().update(userId, { avatar: `/uploads/${file.filename}` });
  res.json({ success: true, avatar: `/uploads/${file.filename}` });
});

app.use("/api/users", userRouter);

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
      logger.info(`HTTPS Server running at https://${serverHost}:${serverPort}`);
    });
  } else {
    http.createServer(app).listen(serverPort, serverHost, () => {
      logger.info(`HTTP Server running at http://${serverHost}:${serverPort}`);
    });
  }
}).catch((err) => {
  logger.error("Error during Data Source initialization: " + err?.stack || err);
  console.error("Error during Data Source initialization:", err);
});
