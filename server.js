import app from './src/app.js';
import { validateRuntimeEnv } from './src/config/runtime.js';
import { logError, logInfo } from './src/utils/logger.js';

const port = Number(process.env.PORT || 3000);

try {
  validateRuntimeEnv();
  app.listen(port, () => {
    logInfo('server.started', { port });
  });
} catch (error) {
  logError('server.start_failed', { error: error.message });
  process.exit(1);
}
