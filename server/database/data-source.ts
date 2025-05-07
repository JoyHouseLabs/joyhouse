import "reflect-metadata";
import { DataSource } from "typeorm";
import { Note } from "../entities/Note";
import { User } from "../entities/User";
import path from "path";
import fs from "fs";
import YAML from "yaml";

// 读取 YAML 配置文件
let configPath = path.join(__dirname, "../config.yaml");
let config = {} as any;
if (fs.existsSync(configPath)) {
  config = YAML.parse(fs.readFileSync(configPath, "utf-8"));
}

const dbType = config.dbType || process.env.DB_TYPE || "sqlite";
const dbName = config.dbName || process.env.DB_NAME || "local.db";
const dbHost = config.dbHost || process.env.DB_HOST;
const dbPort = config.dbPort || process.env.DB_PORT;
const dbUser = config.dbUser || process.env.DB_USER;
const dbPass = config.dbPass || process.env.DB_PASS;

// 配置校验
function validateConfig() {
  if (!["sqlite", "postgres", "mysql"].includes(dbType)) {
    throw new Error(`配置错误: dbType 必须为 'sqlite'、'postgres' 或 'mysql', 当前为 '${dbType}'`);
  }
  if (!dbName) {
    throw new Error("配置错误: dbName 不能为空");
  }
  if (dbType === "postgres" || dbType === "mysql") {
    if (!dbHost) throw new Error(`配置错误: dbHost 不能为空 (${dbType})`);
    if (!dbPort) throw new Error(`配置错误: dbPort 不能为空 (${dbType})`);
    if (!dbUser) throw new Error(`配置错误: dbUser 不能为空 (${dbType})`);
    if (!dbPass) throw new Error(`配置错误: dbPass 不能为空 (${dbType})`);
  }
}
validateConfig();

export const AppDataSource = new DataSource({
  type: dbType === "postgres" ? "postgres" : dbType === "mysql" ? "mysql" : "sqlite",
  database: dbName,
  host: dbType === "postgres" || dbType === "mysql" ? dbHost : undefined,
  port: dbType === "postgres" || dbType === "mysql" ? Number(dbPort) : undefined,
  username: dbType === "postgres" || dbType === "mysql" ? dbUser : undefined,
  password: dbType === "postgres" || dbType === "mysql" ? dbPass : undefined,
  entities: [Note, User],
  synchronize: true,
});
