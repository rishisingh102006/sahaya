import { getSupabase } from './src/database/supabaseClient.js';
import { db } from './src/database/db.js';

const API_BASE = 'http://localhost:5000/api';

async function runLivePersistenceTest() {
  console.log('🧪 Starting Live Data Persistence Test...\n');
  const results = {
    step1_health: null,
    step2_auth: null,
    step3_api_create: null,
    step4_supabase_query: null,
    step5_api_readback: null,
    step6_cleanup: null,
  };

  // 1. Health & Provider Status
  try {
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthJson = await healthRes.json();
    results.step1_health = healthJson.data;
    console.log('1. Health Check:');
    console.log(`   - Reported Provider: ${healthJson.data.database.provider}`);
    console.log(`   - Supabase Connected: ${healthJson.data.database.supabase.connected}`);
    if (healthJson.data.database.supabase.error) {
      console.log(`   - Supabase Notice: ${healthJson.data.database.supabase.error} (Code: ${healthJson.data.database.supabase.code})`);
    }
  } catch (err) {
    console.error('1. Health Check Failed:', err.message);
    return;
  }

  // 2. Authenticate as Senior User
  let token = null;
  try {
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@sahaya.demo',
        password: 'Sahaya@123',
        role: 'senior',
      }),
    });
    const loginJson = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginJson.message || 'Login failed');
    token = loginJson.data.token;
    results.step2_auth = { success: true, userId: loginJson.data.user.id };
    console.log(`2. Authentication: Logged in as ${loginJson.data.user.name} (${loginJson.data.user.role})`);
  } catch (err) {
    console.error('2. Authentication Failed:', err.message);
    return;
  }

  // 3. Create an Isolated Test Record via Backend REST API
  const testMarker = `TEST-RECORD-${Date.now()}`;
  let createdRecord = null;
  try {
    const createRes = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'grocery',
        title: `[${testMarker}] Daily essentials assistance`,
        description: 'Automated test record verifying database persistence flow',
        priority: 'routine',
        city: 'Mumbai',
        state: 'Maharashtra',
        landmark: 'Near Sahaya Test Center',
        preferredTiming: 'Morning 10 AM',
      }),
    });
    const createJson = await createRes.json();
    if (!createRes.ok) throw new Error(createJson.message || 'Creation failed');
    createdRecord = createJson.data;
    const lastOp = db.getLastOperation();
    results.step3_api_create = {
      recordId: createdRecord.id,
      title: createdRecord.title,
      destination: lastOp.destination,
      supabaseError: lastOp.supabaseError,
    };
    console.log(`3. API Record Creation: Created request ID '${createdRecord.id}'`);
    console.log(`   - Write Destination: ${lastOp.destination}`);
    if (lastOp.supabaseError) {
      console.log(`   - Supabase Reason: ${lastOp.supabaseError}`);
    }
  } catch (err) {
    console.error('3. Record Creation Failed:', err.message);
    return;
  }

  // 4. Query Actual Supabase Database Directly for the Test Record
  try {
    const supabase = getSupabase();
    if (!supabase) {
      console.log('4. Supabase Direct Query: Client not initialized (credentials missing)');
      results.step4_supabase_query = { success: false, reason: 'Client uninitialized' };
    } else {
      const { data, error, status } = await supabase
        .from('requests')
        .select('*')
        .eq('id', createdRecord.id);

      if (error) {
        console.log(`4. Supabase Direct Query Result:`);
        console.log(`   - Status Code: ${status}`);
        console.log(`   - Error Code: ${error.code}`);
        console.log(`   - Error Message: ${error.message}`);
        results.step4_supabase_query = {
          success: false,
          status,
          code: error.code,
          message: error.message,
        };
      } else if (data && data.length > 0) {
        console.log(`4. Supabase Direct Query Result: SUCCESS! Record found in Supabase!`);
        results.step4_supabase_query = { success: true, count: data.length, record: data[0] };
      } else {
        console.log(`4. Supabase Direct Query Result: Record NOT found in Supabase table (stored in local JSON fallback).`);
        results.step4_supabase_query = { success: false, reason: 'Record not present in Supabase table' };
      }
    }
  } catch (err) {
    console.error('4. Supabase Direct Query Exception:', err.message);
  }

  // 5. Read Record Back via Normal API
  try {
    const readRes = await fetch(`${API_BASE}/requests/${createdRecord.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const readJson = await readRes.json();
    if (!readRes.ok) throw new Error(readJson.message || 'Read back failed');
    console.log(`5. API Read-Back: Successfully read back request '${readJson.data.id}' (${readJson.data.title})`);
    results.step5_api_readback = { success: true, status: readJson.data.status };
  } catch (err) {
    console.error('5. API Read-Back Failed:', err.message);
  }

  // 6. Clean Up Test Record
  try {
    const deleted = await db.deleteById('requests', createdRecord.id);
    console.log(`6. Test Record Cleanup: Deleted test record '${createdRecord.id}' -> ${deleted ? 'SUCCESS' : 'NOT FOUND'}`);
    results.step6_cleanup = { success: deleted, cleanedId: createdRecord.id };
  } catch (err) {
    console.error('6. Test Record Cleanup Failed:', err.message);
  }

  console.log('\n================================');
  console.log('PERSISTENCE TEST SUMMARY:');
  console.log(JSON.stringify(results, null, 2));
  console.log('================================\n');
}

runLivePersistenceTest().catch(console.error);
