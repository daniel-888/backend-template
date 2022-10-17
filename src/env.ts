import { config as configDotenv } from "dotenv";
import * as path from "path";
import * as fs from "fs";

const env: string = process.env.NODE_ENV;
enum EnvConstants {
  LOCAL = "local",
  PRODUCTION = "production",
  DEV = "dev",
  TEST = "test",
}

enum EnvFiles {
  LOCAL = ".env",
  PRODUCTION = ".env.prod",
  DEV = ".env",
  TEST = ".env.test",
}

const setEnvironment = (): void => {
  let envPath: string;
  const rootDir: string = path.resolve(__dirname, "../");

  switch (env) {
    case EnvConstants.PRODUCTION:
      envPath = path.resolve(rootDir, EnvFiles.PRODUCTION);
      break;
    case EnvConstants.TEST:
      envPath = path.resolve(rootDir, EnvFiles.TEST);
      break;
    case EnvConstants.LOCAL:
      envPath = path.resolve(rootDir, EnvFiles.LOCAL);
      break;
    default:
      envPath = path.resolve(rootDir, EnvFiles.LOCAL);
  }
  if (!fs.existsSync(envPath)) {
    throw new Error(".env file is missing in root directory");
  }
  configDotenv({ path: envPath });
};

export default setEnvironment;
