async function runSecurityAndEdgeCaseTests() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('🧪 Starting Security, Auth & Edge Case Verification against', BASE_URL);

  let passed = 0;
  let failed = 0;
  const results = [];

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
      results.push({ name, status: 'PASS' });
    } catch (err) {
      console.error(`❌ FAIL: ${name} ->`, err.message);
      failed++;
      results.push({ name, status: 'FAIL', error: err.message });
    }
  }

  // Tokens
  let seniorToken = '';
  let ngoToken = '';
  let volunteerToken = '';

  // Setup tokens
  const sRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@sahaya.demo', password: 'Sahaya@123', role: 'senior' })
  });
  const sJson = await sRes.json();
  seniorToken = sJson.data?.token;

  const nRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@sahaya.demo', password: 'Sahaya@123', role: 'ngo' })
  });
  const nJson = await nRes.json();
  ngoToken = nJson.data?.token;

  const vRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'volunteer@sahaya.demo', password: 'Sahaya@123', role: 'volunteer' })
  });
  const vJson = await vRes.json();
  volunteerToken = vJson.data?.token;

  // 1. Invalid password
  await test('POST /auth/login - Invalid Password returns 401', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@sahaya.demo', password: 'WrongPassword123' })
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    const json = await res.json();
    if (json.success) throw new Error('Expected success=false');
  });

  // 2. Unregistered email
  await test('POST /auth/login - Unregistered Email returns 401', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@test.com', password: 'Sahaya@123' })
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 3. Role mismatch - Senior trying to login as NGO
  await test('POST /auth/login - Role mismatch should reject and not leak private details', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@sahaya.demo', password: 'Sahaya@123', role: 'ngo' })
    });
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
    const json = await res.json();
    // Check if error message leaks actual role
    if (json.message && json.message.includes('User account role (senior)')) {
      throw new Error(`LEAK: Error message reveals user role: "${json.message}"`);
    }
  });

  // 4. Registration with invalid role
  await test('POST /auth/register - Reject invalid/unauthorized roles', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `hacker_${Date.now()}@test.com`,
        password: 'Password@123',
        name: 'Malicious User',
        role: 'superadmin'
      })
    });
    if (res.status !== 400) {
      throw new Error(`Expected 400 Bad Request for invalid role, got ${res.status}`);
    }
  });

  // 5. Registration with duplicate email
  await test('POST /auth/register - Reject duplicate email with 409', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@sahaya.demo',
        password: 'Password@123',
        name: 'Duplicate User',
        role: 'senior'
      })
    });
    if (res.status !== 409) throw new Error(`Expected 409 Conflict, got ${res.status}`);
  });

  // 6. Security: Unauthenticated POST /reset
  await test('POST /reset - Unauthenticated call must be blocked with 401', async () => {
    const res = await fetch(`${BASE_URL}/reset`, {
      method: 'POST'
    });
    if (res.status === 200) {
      throw new Error('SECURITY VULNERABILITY: Unauthenticated POST /reset succeeded! Database reset by guest.');
    }
    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected 401 or 403, got ${res.status}`);
    }
  });

  // 7. Security: Non-NGO attempting POST /reset
  await test('POST /reset - Senior/Volunteer token must be rejected with 403', async () => {
    const res = await fetch(`${BASE_URL}/reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${seniorToken}` }
    });
    if (res.status !== 403) {
      throw new Error(`Expected 403 Forbidden for senior user, got ${res.status}`);
    }
  });

  // 8. Security: Unauthenticated request assignment
  await test('PATCH /requests/:id/assign - Unauthenticated assignment must be rejected', async () => {
    const reqsRes = await fetch(`${BASE_URL}/requests`);
    const reqs = await reqsRes.json();
    const reqId = reqs.data[0].id;
    const res = await fetch(`${BASE_URL}/requests/${reqId}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volunteerId: 'vol-1' })
    });
    if (res.status === 200) {
      throw new Error('SECURITY VULNERABILITY: Unauthenticated request assignment succeeded!');
    }
    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected 401 or 403, got ${res.status}`);
    }
  });

  // 9. Security: Volunteer assigning request (should be NGO only)
  await test('PATCH /requests/:id/assign - Volunteer cannot assign volunteer (NGO only)', async () => {
    const reqsRes = await fetch(`${BASE_URL}/requests`);
    const reqs = await reqsRes.json();
    const reqId = reqs.data[0].id;
    const res = await fetch(`${BASE_URL}/requests/${reqId}/assign`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${volunteerToken}`
      },
      body: JSON.stringify({ volunteerId: 'vol-1' })
    });
    if (res.status === 200) {
      throw new Error('SECURITY VULNERABILITY: Volunteer was permitted to assign volunteer!');
    }
    if (res.status !== 403) {
      throw new Error(`Expected 403 Forbidden, got ${res.status}`);
    }
  });

  // 10. Security: Unauthenticated volunteer deletion
  await test('DELETE /volunteers/:id - Unauthenticated delete must be blocked', async () => {
    const res = await fetch(`${BASE_URL}/volunteers/vol-1`, {
      method: 'DELETE'
    });
    if (res.status === 200) {
      throw new Error('SECURITY VULNERABILITY: Unauthenticated DELETE /volunteers/:id succeeded!');
    }
    if (res.status !== 401 && res.status !== 403) {
      throw new Error(`Expected 401 or 403, got ${res.status}`);
    }
  });

  // 11. Request ID collision test (200 sequential generations)
  await test('ID Generator collision test - 200 generated IDs must all be unique', async () => {
    const { generateRequestId } = await import('./src/utils/idGenerator.js');
    const ids = new Set();
    for (let i = 0; i < 200; i++) {
      const id = generateRequestId();
      if (ids.has(id)) {
        throw new Error(`COLLISION DETECTED: ID ${id} was generated more than once in 200 iterations!`);
      }
      ids.add(id);
    }
  });

  // 12. Authorized NGO reset succeeds
  await test('POST /reset - Authorized NGO reset succeeds with 200', async () => {
    const res = await fetch(`${BASE_URL}/reset`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ngoToken}` }
    });
    if (res.status !== 200) {
      throw new Error(`Expected 200 OK for authorized NGO reset, got ${res.status}`);
    }
    const json = await res.json();
    if (!json.success) throw new Error('Expected success=true for NGO reset');
  });

  console.log(`\n================================`);
  console.log(`Security & Edge Cases: ${passed} Passed, ${failed} Failed`);
  console.log(`================================`);
}

runSecurityAndEdgeCaseTests().catch(console.error);
