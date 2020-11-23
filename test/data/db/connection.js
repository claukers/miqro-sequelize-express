const {loadConfig} = require("@miqro/core");
loadConfig();

["DB_DIALECT_SSL", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASS", "DB_HOST", "DB_DIALECT", "DB_POOL_MAX", "DB_POOL_MIN", "DB_POOL_ACQUIRE", "DB_POOL_IDDLE", "DB_STORAGE"].forEach((envName) => {
if (process.env[envName] === undefined) {
  throw new Error(`Env variable [${envName}!] not defined`);
}
});

module.exports = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  dialectOptions: {
    ssl: process.env.DB_DIALECT_SSL === "true"
  },
  pool: {
    acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10),
    idle: parseInt(process.env.DB_POOL_IDDLE, 10),
    max: parseInt(process.env.DB_POOL_MAX, 10),
    min: parseInt(process.env.DB_POOL_MIN, 10)
  },
  storage: process.env.DB_STORAGE
};
