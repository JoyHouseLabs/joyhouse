import fs from 'fs';
import path from 'path';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class Logger {
  private level: LogLevel;
  private logFile?: string;
  private stream?: fs.WriteStream;

  constructor(level: LogLevel = 'info', logFile?: string) {
    this.level = level;
    if (logFile) {
      const absPath = path.isAbsolute(logFile) ? logFile : path.join(__dirname, logFile);
      this.logFile = absPath;
      this.stream = fs.createWriteStream(absPath, { flags: 'a' });
    }
  }

  private format(level: LogLevel, msg: string) {
    return `[${new Date().toISOString()}] [${level.toUpperCase()}] ${msg}\n`;
  }

  private shouldLog(level: LogLevel) {
    return levelPriority[level] >= levelPriority[this.level];
  }

  log(level: LogLevel, msg: string) {
    if (!this.shouldLog(level)) return;
    const line = this.format(level, msg);
    if (this.stream) {
      this.stream.write(line);
    }
    if (level !== 'debug') {
      // 控制台只输出非debug日志
      console.log(line.trim());
    }
  }

  debug(msg: string) { this.log('debug', msg); }
  info(msg: string) { this.log('info', msg); }
  warn(msg: string) { this.log('warn', msg); }
  error(msg: string) { this.log('error', msg); }
}
