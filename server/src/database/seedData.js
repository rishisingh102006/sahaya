import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'mockData.json'), 'utf8'));

// Standard demo password for all seeded accounts
const DEMO_PASSWORD = 'Sahaya@123';
const hashedPassword = bcrypt.hashSync(DEMO_PASSWORD, 10);

export const getSeedData = () => {
  return {
    meta: {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      appName: 'Sahaya Backend API',
    },
    users: [],
    volunteers: [],
    requests: [],
    schemes: Array.isArray(mockData.schemes) ? mockData.schemes : [],
    notifications: [],
    feedback: []
  };
};
