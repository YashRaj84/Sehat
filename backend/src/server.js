process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION 💥");
  console.error(err.stack);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE 💥");
  console.error(err.stack);
  process.exit(1);
});

import loadEnv from "./config/env.js";
import connectDB from "./config/db.js";
import app from "./app.js";

loadEnv();
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
