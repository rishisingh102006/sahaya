import app from './app.js';
import { env } from './config/env.js';
import { db } from './database/db.js';

const PORT = env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  // Ensure database initialization
  db.ensureInitialized();
  db.syncFromSupabase().catch(() => {});

  console.log(`
==================================================
  SAHAYA BACKEND SERVER
==================================================
  Status:      Running
  Port:        ${PORT}
  API Base:    http://localhost:${PORT}/api
  Health:      http://localhost:${PORT}/api/health
  Database:    JSON File Persistence (Atomic)
  Environment: ${env.NODE_ENV}
==================================================
  DEMO ACCOUNTS:
  User:        user@sahaya.demo       / Sahaya@123
  Volunteer:   volunteer@sahaya.demo  / Sahaya@123
  Admin:       admin@sahaya.demo      / Sahaya@123
==================================================
`);
});
