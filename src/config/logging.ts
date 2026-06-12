import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logDirectory = path.join(process.cwd(), "storage/logs");
const isProduction = process.env.NODE_ENV === "production";

const filterOnly = (level: string) => {
  return winston.format((info) => {
    return info.level === level ? info : false;
  })();
};

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.json(),
);

const transports: winston.transport[] = [];

if (isProduction) {
  transports.push(
    new DailyRotateFile({
      level: "error",
      dirname: logDirectory,
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: fileFormat,
    }),
    new DailyRotateFile({
      level: "warn",
      dirname: logDirectory,
      filename: "warn-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: winston.format.combine(filterOnly("warn"), fileFormat),
    }),
    new DailyRotateFile({
      level: "info",
      dirname: logDirectory,
      filename: "info-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: winston.format.combine(filterOnly("info"), fileFormat),
    }),
  );
}

if (!isProduction) {
  transports.push(
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

const logging = winston.createLogger({
  levels: winston.config.npm.levels,
  transports: transports,
});

export { logging };
