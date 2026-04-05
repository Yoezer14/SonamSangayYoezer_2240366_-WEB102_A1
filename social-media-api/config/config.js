require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  /** 127.0.0.1 avoids IPv6-only :: binding issues on Windows; use HOST=0.0.0.0 for LAN */
  host:
    process.env.HOST === '' || process.env.HOST === undefined
      ? '127.0.0.1'
      : process.env.HOST,
  /** If PORT is busy, try this many higher ports (3001, 3002, …). Set PORT_FALLBACK_MAX=0 to disable. */
  portFallbackMax: Math.min(50, Math.max(0, Number(process.env.PORT_FALLBACK_MAX) || 15)),
};
