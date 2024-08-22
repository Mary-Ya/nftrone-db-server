export const logger = {
  log: (message: string, scope = 'DEBUG', data?: unknown) => console.log(`[${scope}}: ${message}`, data),
  getScopedLogger: (scope: string) => (message: string, data?: unknown) => logger.log(message, scope, data)
};