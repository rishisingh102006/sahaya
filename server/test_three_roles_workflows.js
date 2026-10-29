const API_BASE = 'http://localhost:5000/api';

async function runRoleWorkflowTests() {
  console.log('🧪 Starting 3-Role Workflow & Security Verification...\n');

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

  let ngoToken, volToken, seniorToken;
  let createdRequestId, volunteerId;

  // --- 1. NGO ROLE WORKFLOW ---
  await test('NGO: Login and retrieve profile', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@sahaya.demo', password: 'Sahaya@123', role: 'ngo' }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    ngoToken = json.data.token;
    if (json.data.user.role !== 'ngo') throw new Error(`Role mismatch: ${json.data.user.role}`);

    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${ngoToken}` },
    });
    const meJson = await meRes.json();
    if (!meRes.ok || meJson.data.role !== 'ngo') throw new Error('Failed to retrieve NGO profile');
  });

  await test('NGO: View requests and volunteer roster', async () => {
    const reqRes = await fetch(`${API_BASE}/requests`, {
      headers: { Authorization: `Bearer ${ngoToken}` },
    });
    const reqJson = await reqRes.json();
    if (!reqRes.ok || !Array.isArray(reqJson.data)) throw new Error('Failed to list requests');

    const volRes = await fetch(`${API_BASE}/volunteers`, {
      headers: { Authorization: `Bearer ${ngoToken}` },
    });
    const volJson = await volRes.json();
    if (!volRes.ok || !Array.isArray(volJson.data) || volJson.data.length === 0) throw new Error('Failed to list volunteers');
    volunteerId = volJson.data[0].id;
  });

  await test('NGO: Verify volunteer and perform administrative assignment', async () => {
    const verifyRes = await fetch(`${API_BASE}/volunteers/${volunteerId}/verify`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${ngoToken}` },
    });
    const verifyJson = await verifyRes.json();
    if (!verifyRes.ok) throw new Error(verifyJson.message);
  });

  // --- 2. OLD AGE USER (SENIOR) WORKFLOW ---
  await test('Senior: Login and retrieve profile', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@sahaya.demo', password: 'Sahaya@123', role: 'senior' }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    seniorToken = json.data.token;
    if (json.data.user.role !== 'senior') throw new Error(`Role mismatch: ${json.data.user.role}`);
  });

  await test('Senior: Create welfare assistance request', async () => {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${seniorToken}`,
      },
      body: JSON.stringify({
        type: 'medical',
        title: '[Role Test] Doctor appointment escort',
        description: 'Need assistance visiting clinic on Saturday',
        priority: 'urgent',
        city: 'Mumbai',
        state: 'Maharashtra',
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    createdRequestId = json.data.id;
    if (!createdRequestId) throw new Error('Request ID was not returned');
  });

  await test('Senior: Calculate welfare scheme eligibility', async () => {
    const res = await fetch(`${API_BASE}/schemes/eligibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${seniorToken}`,
      },
      body: JSON.stringify({
        age: 68,
        gender: 'female',
        income: 120000,
        state: 'Maharashtra',
      }),
    });
    const json = await res.json();
    if (!res.ok || typeof json.data.eligibleCount !== 'number') throw new Error('Eligibility calculation failed');
  });

  // --- 3. VOLUNTEER WORKFLOW & COLLABORATION ---
  await test('NGO assigns volunteer to Senior request', async () => {
    const res = await fetch(`${API_BASE}/requests/${createdRequestId}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ngoToken}`,
      },
      body: JSON.stringify({ volunteerId }),
    });
    const json = await res.json();
    if (!res.ok || json.data.status !== 'assigned') throw new Error(json.message || 'Assignment failed');
  });

  await test('Volunteer: Login and view assigned tasks', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'volunteer@sahaya.demo', password: 'Sahaya@123', role: 'volunteer' }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    volToken = json.data.token;
    if (json.data.user.role !== 'volunteer') throw new Error(`Role mismatch: ${json.data.user.role}`);

    const tasksRes = await fetch(`${API_BASE}/requests/${createdRequestId}`, {
      headers: { Authorization: `Bearer ${volToken}` },
    });
    const tasksJson = await tasksRes.json();
    if (!tasksRes.ok || !tasksJson.data) throw new Error('Failed to retrieve task');
  });

  await test('Volunteer: Update status to in_progress, add note, and complete task', async () => {
    // 1. In Progress
    const inProgRes = await fetch(`${API_BASE}/requests/${createdRequestId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${volToken}`,
      },
      body: JSON.stringify({ status: 'in_progress' }),
    });
    if (!inProgRes.ok) throw new Error('Failed to set in_progress');

    // 2. Add Note
    const noteRes = await fetch(`${API_BASE}/requests/${createdRequestId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${volToken}`,
      },
      body: JSON.stringify({ text: 'Reached clinic, escorting patient to physician desk' }),
    });
    const noteJson = await noteRes.json();
    if (!noteRes.ok || !noteJson.data.volunteerNotes?.length) throw new Error('Failed to append volunteer note');

    // 3. Complete Task
    const compRes = await fetch(`${API_BASE}/requests/${createdRequestId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${volToken}`,
      },
      body: JSON.stringify({ status: 'completed' }),
    });
    if (!compRes.ok) throw new Error('Failed to complete request');
  });

  await test('Senior: Submit feedback on completed request', async () => {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${seniorToken}`,
      },
      body: JSON.stringify({
        requestId: createdRequestId,
        rating: 5,
        comment: 'Outstanding assistance, very punctual and caring!',
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
  });

  // --- 4. CROSS-ROLE AUTHORIZATION BOUNDARIES ---
  await test('Cross-role security: Volunteer CANNOT trigger NGO database reset', async () => {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${volToken}` },
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
  });

  await test('Cross-role security: Senior CANNOT assign volunteers to requests', async () => {
    const res = await fetch(`${API_BASE}/requests/${createdRequestId}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${seniorToken}`,
      },
      body: JSON.stringify({ volunteerId }),
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
  });

  console.log(`\n================================`);
  console.log(`Role Workflow Tests: ${passed} Passed, ${failed} Failed`);
  console.log(`================================\n`);

  if (failed > 0) process.exit(1);
}

runRoleWorkflowTests().catch((err) => {
  console.error('Fatal Role Test Error:', err);
  process.exit(1);
});
