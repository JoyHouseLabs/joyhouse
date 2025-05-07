import { Router, Request, Response, NextFunction } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import multer from "multer";
import { ulid } from "ulid";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import YAML from "yaml";

const router = Router();

// 读取 JWT 密钥
let configPath = path.join(__dirname, "../config.yaml");
let config = {} as any;
try {
  config = YAML.parse(fs.readFileSync(configPath, "utf-8"));
} catch {}
const jwtSecret = config.apiAuth?.token || 'joyhouse-jwt-secret';

// JWT 鉴权中间件
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供有效的 JWT Token' });
  }
  const token = auth.substring(7);
  try {
    const payload = jwt.verify(token, jwtSecret) as any;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'JWT Token 无效或已过期' });
  }
}

const userRepo = () => AppDataSource.getRepository(User);

// 文件上传设置
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: 用户注册
 *     tags:
 *       - 用户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               nickname:
 *                 type: string
 *     responses:
 *       200:
 *         description: 注册成功
 */
router.post("/register", async (req, res) => {
  const { username, password, nickname } = req.body;
  if (!username || !password) return res.status(400).json({ error: "用户名和密码必填" });
  if (await userRepo().findOneBy({ username })) return res.status(409).json({ error: "用户名已存在" });
  const hash = await bcrypt.hash(password, 10);
  const user = userRepo().create({ id: ulid(), username, password: hash, nickname });
  await userRepo().save(user);
  res.json({ success: true });
});

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: 用户登录（JWT）
 *     tags:
 *       - 用户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登录成功，返回JWT
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await userRepo().findOneBy({ username });
  if (!user) return res.status(401).json({ error: "用户名或密码错误" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "用户名或密码错误" });
  const payload = { id: user.id, username: user.username };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar, remark: user.remark } });
});

// 云端登录（JWT）

/**
 * @openapi
 * /api/users/jwt-login:
 *   post:
 *     summary: 云端用户登录（JWT）
 *     tags:
 *       - 用户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登录成功，返回JWT
 */
router.post("/jwt-login", async (req, res) => {
  const { username, password } = req.body;
  const user = await userRepo().findOneBy({ username });
  if (!user) return res.status(401).json({ error: "用户名或密码错误" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "用户名或密码错误" });
  const payload = { id: user.id, username: user.username };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
  res.json({ success: true, token, user: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar, remark: user.remark } });
});

// 退出
/**
 * @openapi
 * /api/users/logout:
 *   post:
 *     summary: 用户登出
 *     tags:
 *       - 用户
 *     responses:
 *       200:
 *         description: 登出成功
 */
router.post("/logout", (req, res) => {
  if (req.session) req.session.userId = null;
  res.json({ success: true });
});

// 获取当前用户信息
/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: 获取当前用户信息（需JWT）
 *     tags:
 *       - 用户
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 当前用户信息
 */
router.get("/me", authMiddleware, async (req: any, res) => {
  const userId = req.user.id;
  const user = await userRepo().findOneBy({ id: userId });
  if (!user) return res.status(404).json({ error: "用户不存在" });
  res.json({ user: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar, remark: user.remark } });
});

// 更改昵称
/**
 * @openapi
 * /api/users/nickname:
 *   post:
 *     summary: 更改昵称
 *     tags:
 *       - 用户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *     responses:
 *       200:
 *         description: 更改成功
 */
router.post("/nickname", authMiddleware, async (req: any, res) => {
  const userId = req.user.id;
  const { nickname } = req.body;
  await userRepo().update(userId, { nickname });
  res.json({ success: true });
});

// 设置备注
/**
 * @openapi
 * /api/users/remark:
 *   post:
 *     summary: 设置备注
 *     tags:
 *       - 用户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               remark:
 *                 type: string
 *     responses:
 *       200:
 *         description: 设置成功
 */
router.post("/remark", authMiddleware, async (req: any, res) => {
  const userId = req.user.id;
  const { remark } = req.body;
  await userRepo().update(userId, { remark });
  res.json({ success: true });
});

// 上传头像
/**
 * @openapi
 * /api/users/avatar:
 *   post:
 *     summary: 上传头像
 *     tags:
 *       - 用户
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 上传成功
 */
router.post("/avatar", authMiddleware, upload.single('avatar'), async (req: any, res) => {
  const userId = req.user.id;
  const file = req.file;
  if (!file) return res.status(400).json({ error: "未上传文件" });
  // 可扩展：图片处理、重命名等
  await userRepo().update(userId, { avatar: `/uploads/${file.filename}` });
  res.json({ success: true, avatar: `/uploads/${file.filename}` });
});

export default router;
