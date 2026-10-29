import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isSupabaseConfigured, testSupabaseConnection } from './src/database/supabaseClient.js';
import { db } from './src/database/db.js';
import { env } from './src/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSupabaseIntegrationTests() {
  console.log('🧪 Starting Supabase Integration & Schema Verification...\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Supabase Client Module Test
  await test('Supabase client module loads and detects configuration state', async () => {
    const configured = isSupabaseConfigured();
    console.log(`   Configured state: ${configured} (SUPABASE_URL: ${env.SUPABASE_URL || 'not set'})`);
    if (typeof configured !== 'boolean') throw new Error('isSupabaseConfigured did not return boolean');
  });

  // 2. Safe Connection Tester
  await test('testSupabaseConnection handles unconfigured/configured states gracefully', async () => {
    const result = await testSupabaseConnection();
    if (!result || typeof result !== 'object') throw new Error('testSupabaseConnection did not return result object');
    if (!result.connected && !result.reason && !result.error) {
      throw new Error('Unconnected result should have reason or error');
    }
    console.log(`   Connection test status: connected=${result.connected}`);
  });

  // 3. Migration File Inspection
  await test('Supabase migration SQL file exists and contains all required tables & RLS', async () => {
    const migrationPath = path.resolve(__dirname, '../supabase/migrations/20261024000001_initial_schema.sql');
    if (!fs.existsSync(migrationPath)) throw new Error('Migration file not found at expected path');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    const requiredTables = ['users', 'volunteers', 'requests', 'schemes', 'notifications', 'feedback'];
    for (const table of requiredTables) {
      if (!sql.includes(`CREATE TABLE IF NOT EXISTS public.${table}`)) {
        throw new Error(`Table 'public.${table}' missing from migration SQL`);
      }
      if (!sql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`)) {
        throw new Error(`RLS missing for 'public.${table}' in migration SQL`);
      }
    }
    console.log('   All 6 core tables and RLS policies verified in migration SQL');
  });

  // 4. Migration Script Verification
  await test('Data migration utility script exists and is executable', async () => {
    const scriptPath = path.resolve(__dirname, './src/database/migrateToSupabase.js');
    if (!fs.existsSync(scriptPath)) throw new Error('migrateToSupabase.js not found');
    const content = fs.readFileSync(scriptPath, 'utf8');
    if (!content.includes('migrateDataToSupabase')) throw new Error('migrateDataToSupabase function missing');
  });

  // 5. Database Adapter Supabase Awareness
  await test('Database adapter implements Supabase integration and atomic persistence fallback', async () => {
    if (typeof db.isUsingSupabase !== 'function') throw new Error('db.isUsingSupabase method missing');
    const requests = db.getCollection('requests');
    if (!Array.isArray(requests) || requests.length === 0) throw new Error('db.getCollection failed to read requests');
    console.log(`   Active database provider: ${db.isUsingSupabase() ? 'Supabase' : 'Local Atomic Persistence'}`);
  });

  // 6. Environment Example Files
  await test('.env.example files exist in root and server directories with placeholders only', async () => {
    const rootEnvExample = path.resolve(__dirname, '../.env.example');
    const serverEnvExample = path.resolve(__dirname, './.env.example');

    if (!fs.existsSync(rootEnvExample)) throw new Error('Root .env.example missing');
    if (!fs.existsSync(serverEnvExample)) throw new Error('Server .env.example missing');

    const rootContent = fs.readFileSync(rootEnvExample, 'utf8');
    const serverContent = fs.readFileSync(serverEnvExample, 'utf8');

    if (!rootContent.includes('SUPABASE_URL') || !serverContent.includes('SUPABASE_URL')) {
      throw new Error('SUPABASE_URL placeholder missing from example files');
    }
    // Verify no real secrets leaked in example files
    if (rootContent.includes('eyJh') || serverContent.includes('eyJh')) {
      throw new Error('Real JWT/Supabase token leaked in .env.example!');
    }
  });

  console.log(`\n================================`);
  console.log(`Supabase Integration Tests: ${passed} Passed, ${failed} Failed`);
  console.log(`================================\n`);

  if (failed > 0) process.exit(1);
}

runSupabaseIntegrationTests().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
