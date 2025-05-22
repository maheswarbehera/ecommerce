// middlewares/auditMiddleware.js
import { setAuditContext } from '../utils/auditLog.js';

export function auditContextMiddleware(req, res, next) {
  const context = {
    userId: req.user?._id,
    ip: req.ip,
    route: req.originalUrl
  };
//   console.log("Setting audit context:", context);
  setAuditContext(context);
  next();
}
