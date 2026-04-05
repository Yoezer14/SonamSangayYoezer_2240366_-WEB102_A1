require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  /** Default 127.0.0.1 matches “open http://localhost:PORT” in the lab; set HOST=0.0.0.0 for LAN */
  host:
    process.env.HOST === '' || process.env.HOST === undefined
      ? '127.0.0.1'
      : process.env.HOST,
  /** If PORT is busy, try up to this many higher ports (3001, 3002, …) */
  portFallbackMax: Math.min(50, Math.max(0, Number(process.env.PORT_FALLBACK_MAX) || 15)),
};
