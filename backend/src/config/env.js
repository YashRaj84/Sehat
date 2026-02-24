import dotenv from "dotenv";
import path from "path";

const loadEnv = () => {
  dotenv.config({
    path: path.resolve(process.cwd(), ".env")
  });
};

export default loadEnv;
