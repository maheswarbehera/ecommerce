import { auditLogger } from "../middlewares/winston.js";
  
export default function auditDbLog(schema, modelName) {
    schema.pre('save', function (next) {
        const context = this._audit || {};
        const event = this.isNew ? `${modelName}_CREATED` : `${modelName}_UPDATED`;

        auditLogger.info({
            event,
            userId: context.userId || 'unknown',
            ip: context.ip || 'unknown',
            route: context.route || 'unknown',
            document: this.toObject()
        });
        next();
    });
    schema.pre('findOneAndUpdate', async function (next) {
        const doc = await this.model.findOne(this.getQuery());
        const context = this.get('_audit') || {};
        const update = this.getUpdate();

        if (doc) {
        auditLogger.info({
            event: `${modelName}_UPDATED`,
            userId: context.userId || 'unknown',
            ip: context.ip || 'unknown',
            route: context.route || 'unknown',
            before: doc.toObject(),
            update: update
        });
        }
        next();
    });
    schema.post('save', function (doc) {
        const context = this._audit || {};
        auditLogger.info({
            event: `${modelName}_SAVED`,
            userId: context.userId || 'unknown',
            ip: context.ip || 'unknown',
            route: context.route || 'unknown',
            document: doc.toObject()
        });   
    });
    schema.pre('remove', function (next) {
        const context = this._audit || {};
        auditLogger.info({
          event: `${modelName}_DELETED`,
          userId: context.userId || 'unknown',
          ip: context.ip || 'unknown',
          route: context.route || 'unknown',
          document: this.toObject()
        });
        next();
    });
      
    schema.pre('findOneAndDelete', async function (next) {
        const context = this.get('_audit') || {};
        const doc = await this.model.findOne(this.getQuery());
        if (doc) {
            auditLogger.info({
            event: `${modelName}_DELETED`,
            userId: context.userId || 'unknown',
            ip: context.ip || 'unknown',
            route: context.route || 'unknown',
            document: doc.toObject()
            });
        }
        next();
    });
    
    schema.pre('deleteOne', { document: false, query: true }, async function (next) {
        const context = this.get('_audit') || {};
        const doc = await this.model.findOne(this.getQuery());
        if (doc) {
            auditLogger.info({
            event: `${modelName}_DELETED`,
            userId: context.userId || 'unknown',
            ip: context.ip || 'unknown',
            route: context.route || 'unknown',
            document: doc.toObject()
            });
        }
        next();
    });

}

export function attachAuditContext(modelInstance, req) {
    if (!req || !req.user) return;
  
    const auditData = {
      userId: req.user.id,
      ip: req.ip,
      route: req.originalUrl
    };
  
    // Works for both Mongoose documents and queries
    if (typeof modelInstance.set === 'function') {
      // Query (e.g., findOneAndUpdate)
      modelInstance.set('_audit', auditData);
    } else {
      // Mongoose document
      modelInstance._audit = auditData;
    }
}
  