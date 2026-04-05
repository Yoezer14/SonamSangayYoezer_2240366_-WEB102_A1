/**
 * Content negotiation: supports application/json (default) and application/xml.
 */
function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function valueToXml(value, tagName = 'item') {
  if (value === null || value === undefined) {
    return `<${tagName} />`;
  }
  if (Array.isArray(value)) {
    return value.map((v) => valueToXml(v, tagName)).join('');
  }
  if (typeof value === 'object') {
    const inner = Object.entries(value)
      .map(([k, v]) => {
        const safeKey = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k) ? k : 'field';
        return valueToXml(v, safeKey);
      })
      .join('');
    return `<${tagName}>${inner}</${tagName}>`;
  }
  return `<${tagName}>${escapeXml(value)}</${tagName}>`;
}

function objectToXml(obj) {
  const body = Object.entries(obj)
    .map(([k, v]) => valueToXml(v, k))
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><response>${body}</response>`;
}

function formatResponse(req, res, next) {
  const originalJson = res.json.bind(res);

  res.sendPayload = (payload, statusCode = 200) => {
    const accept = req.get('Accept') || '';
    const wantsXml =
      accept.includes('application/xml') || accept.includes('text/xml');

    res.status(statusCode);
    if (wantsXml) {
      res.type('application/xml');
      return res.send(objectToXml(payload));
    }
    return originalJson(payload);
  };

  next();
}

module.exports = formatResponse;
