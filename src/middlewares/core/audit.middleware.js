import sharedModels from "../../models/index.js";
import os from "os"
import { errorLogger, logger } from "../winston.js";

const auditDb = async(req, res, next) => {
    const start = process.hrtime();
    const {Audit} = sharedModels;
    const userAgentInfo = req.useragent;
    const {platform, browser, version} = userAgentInfo
    const deviceType = userAgentInfo.isMobile ? 'Mobile' : userAgentInfo.isTablet ? 'Tablet' : 'Desktop';
    
    res.on('finish', async() => {
        const end = process.hrtime(start);
        const responseTime = (end[0] * 1e3 + end[1] / 1e6).toFixed(2);
        const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
        const { method, user, originalUrl, body, query, params, ip } = req
        const { statusCode } = res;  

        if(httpMethods.includes(method) && user){
            const actionType = {
                POST: 'create',
                GET: 'Read',
                PUT: 'update',
                DELETE: 'delete'
            };

            try {
                const auditLog = await Audit.create({
                    user: user._id || user,
                    os: os.hostname(),
                    httpMethod: method,
                    route: originalUrl,              
                    action: actionType[req.method],               
                    reqBody: body || {},                
                    reqQuery: query || {},                
                    reqParams: params || {},
                    ip: ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                    device: deviceType,
                    platform,
                    browser: `${browser}/${version}`,
                    statusCode: statusCode,
                    responseTime: `${responseTime}ms`, 
                })
                logger.info(`Audit log saved: ${JSON.stringify(auditLog)}`);

            } catch (err) {
                errorLogger.error('Audit log error:', err.message);
            }
        }
    });

    next();
}

export default auditDb;