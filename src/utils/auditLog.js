import { auditLogger } from "../middlewares/winston.js";
  
export default function auditDbLog(schema, modelName) {

    function getContext() {
    const ctx = getAuditContext();
    // console.log("Context from AsyncLocalStorage:", ctx);
    return {
      userId: ctx.userId,
      ip: ctx.ip,
      route: ctx.route
    };
  }

    schema.pre('save', function (next) {
        const context = getContext();
        const event = this.isNew ? `${modelName}_CREATED` : `${modelName}_UPDATED`;

        auditLogger.info({
            event,
            ...context,
            document: this.toObject()
        });
        next();
    });
   schema.pre('findOneAndUpdate', async function (next) {
  try {
    const context = getContext();
    const query = this.getQuery();
    const update = this.getUpdate();
    const isUpsert = this.options.upsert;

    if (!isUpsert) {
      const doc = await this.model.findOne(query);
      if (doc && update && Object.keys(update).length) {
        auditLogger.info({
          event: `${modelName}_UPDATED`,
          ...context,
          before: doc.toObject(),
          update
        });
      }
    }
  } catch (err) {
    auditLogger.error({
      event: `${modelName}_UPDATE_AUDIT_FAILED`,
      error: err.message
    });
  }

  next();
});


    // schema.post('save', function (doc) {
    //     const context = getContext();
    //     auditLogger.info({
    //         event: `${modelName}_SAVED`,
    //         ...context,
    //         document: doc.toObject()
    //     });   
    // });
    schema.pre('remove', function (next) {
        const context = getContext();
        auditLogger.info({
          event: `${modelName}_DELETED`,
          ...context,
          document: this.toObject()
        });
        next();
    });
      
    schema.pre('findOneAndDelete', async function (next) {
        const context = getContext();
        const doc = await this.model.findOne(this.getQuery());
        if (doc) {
            auditLogger.info({
                event: `${modelName}_DELETED`,
            ...context,
            document: doc.toObject()
            });
        }
        next();
    });
    
    schema.pre('deleteOne', { document: false, query: true }, async function (next) {
        const context = getContext();
        const doc = await this.model.findOne(this.getQuery());
        if (doc) {
            auditLogger.info({
            event: `${modelName}_DELETED`,
            ...context,
            document: doc.toObject()
            });
        }
        next();
    });

}

// export function attachAuditContext(modelInstance, req) {
//     if (!req || !req.user) return;
  
//     const auditData = {
//       userId: req.user.id,
//       ip: req.ip,
//       route: req.originalUrl
//     };
  
//     // Works for both Mongoose documents and queries
//     if (typeof modelInstance.set === 'function') {
//       // Query (e.g., findOneAndUpdate)
//       modelInstance.set('_audit', auditData);
//     } else {
//       // Mongoose document
//       modelInstance._audit = auditData;
//     }
// }
  

import { AsyncLocalStorage } from 'async_hooks';

export const auditStorage = new AsyncLocalStorage();

export function setAuditContext(context) {
  auditStorage.enterWith(context);
}

export function getAuditContext() {
  return auditStorage.getStore() || {};
}