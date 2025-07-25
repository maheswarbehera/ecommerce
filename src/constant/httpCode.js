
const HttpMethod = {
  GET: 'GET',           // Retrieve data
  POST: 'POST',         // Create new resource
  PUT: 'PUT',           // Replace existing resource
  PATCH: 'PATCH',       // Partially update resource
  DELETE: 'DELETE',     // Remove resource
  OPTIONS: 'OPTIONS',   // Describe communication options
  HEAD: 'HEAD'          // Same as GET but only headers
};

const HttpStatusCodesMessage = {
  // 1xx: Informational
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  103: 'Early Hints',

  // 2xx: Success
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',

  // 3xx: Redirection
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',

  // 4xx: Client Errors
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: 'I\'m a teapot', // (Easter egg from RFC 2324)
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',

  // 5xx: Server Errors
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required',
};


const HttpStatusCodes = {
  // 2xx: Success
  OK: 200,                    // Request succeeded
  CREATED: 201,               // Resource created successfully
  ACCEPTED: 202,              // Request accepted but not completed
  NO_CONTENT: 204,            // Request succeeded but no content to return

  // 3xx: Redirection
  MOVED_PERMANENTLY: 301,     // Resource moved permanently
  FOUND: 302,                 // Resource found at a different URL temporarily
  NOT_MODIFIED: 304,          // Resource not modified (cache related)
  TEMPORARY_REDIRECT: 307,    // Temporary redirect to another URL
  PERMANENT_REDIRECT: 308,    // Permanent redirect to another URL


  // 4xx: Client Errors
  BAD_REQUEST: 400,           // Invalid request syntax or parameters
  UNAUTHORIZED: 401,          // Authentication required or failed
  FORBIDDEN: 403,             // Authenticated but not authorized
  NOT_FOUND: 404,             // Resource not found
  METHOD_NOT_ALLOWED: 405,    // HTTP method not supported for resource
  CONFLICT: 409,              // Conflict in request (e.g., duplicate resource)
  UNPROCESSABLE_ENTITY: 422,  // Validation failed on input data
  TOO_MANY_REQUESTS: 429,     // Rate limit exceeded

  // 5xx: Server Errors
  INTERNAL_SERVER_ERROR: 500, // Generic server error
  NOT_IMPLEMENTED: 501,       // Feature not implemented
  BAD_GATEWAY: 502,           // Invalid response from upstream server
  SERVICE_UNAVAILABLE: 503,   // Server overloaded or down for maintenance
  GATEWAY_TIMEOUT: 504        // Upstream server timed out
};

export { HttpStatusCodesMessage, HttpStatusCodes, HttpMethod };
