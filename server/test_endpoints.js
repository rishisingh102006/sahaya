async function runTests() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('🧪 Starting API Verification against', BASE_URL);

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

  // 1. Health check
  await test('GET /health', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const json = await res.json();
    if (!json.success || json.data.status !== 'healthy') throw new Error('Health check failed');
  });

  // 2. Auth login
  let userToken = '';
  let adminToken = '';
  let volunteerToken = '';

  await test('POST /auth/login (Senior user)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@sahaya.demo', password: 'Sahaya@123' })
    });
    const json = await res.json();
    if (!json.success || !json.data.token) throw new Error(json.message || 'Login failed');
    userToken = json.data.token;
  });

  await test('POST /auth/login (Admin user)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@sahaya.demo', password: 'Sahaya@123' })
    });
    const json = await res.json();
    if (!json.success || !json.data.token) throw new Error(json.message || 'Login failed');
    adminToken = json.data.token;
  });

  await test('POST /auth/login (Volunteer user)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'volunteer@sahaya.demo', password: 'Sahaya@123' })
    });
    const json = await res.json();
    if (!json.success || !json.data.token) throw new Error(json.message || 'Login failed');
    volunteerToken = json.data.token;
  });

  // 3. Auth Me
  await test('GET /auth/me', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    const json = await res.json();
    if (!json.success || json.data.email !== 'user@sahaya.demo') throw new Error('Profile fetch failed');
  });

  // 4. Requests List
  await test('GET /requests', async () => {
    const res = await fetch(`${BASE_URL}/requests`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) throw new Error('Requests list empty');
  });

  // 5. Create Request
  let createdRequestId = '';
  await test('POST /requests', async () => {
    const res = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({
        title: 'Need Medicine Pickup from Apollo Pharmacy',
        description: 'Need blood pressure medications picked up from Apollo Pharmacy near FC Road.',
        type: 'medical',
        priority: 'urgent',
        city: 'Pune',
        state: 'Maharashtra',
        landmark: 'Opposite Good Luck Cafe',
        preferredTiming: 'Today before 6 PM'
      })
    });
    const json = await res.json();
    if (!json.success || !json.data.id) throw new Error('Failed to create request');
    createdRequestId = json.data.id;
  });

  // 6. Get Request by ID
  await test('GET /requests/:id', async () => {
    const res = await fetch(`${BASE_URL}/requests/${createdRequestId}`);
    const json = await res.json();
    if (!json.success || json.data.id !== createdRequestId) throw new Error('Failed to fetch request by ID');
  });

  // 7. Volunteers List
  let volunteerId = '';
  await test('GET /volunteers', async () => {
    const res = await fetch(`${BASE_URL}/volunteers`);
    const json = await res.json();
    if (!json.success || !json.data.length) throw new Error('Failed to fetch volunteers');
    volunteerId = json.data[0].id;
  });

  // 8. Assign Volunteer
  await test('PATCH /requests/:id/assign', async () => {
    const res = await fetch(`${BASE_URL}/requests/${createdRequestId}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ volunteerId })
    });
    const json = await res.json();
    if (!json.success || json.data.status !== 'assigned') throw new Error('Failed to assign volunteer');
  });

  // 9. Update Status to In-Progress
  await test('PATCH /requests/:id/status (in_progress)', async () => {
    const res = await fetch(`${BASE_URL}/requests/${createdRequestId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${volunteerToken}`
      },
      body: JSON.stringify({ status: 'in_progress', note: 'Heading to pharmacy now.' })
    });
    const json = await res.json();
    if (!json.success || json.data.status !== 'in_progress') throw new Error('Failed to update status');
  });

  // 10. Add Volunteer Note
  await test('POST /requests/:id/notes', async () => {
    const res = await fetch(`${BASE_URL}/requests/${createdRequestId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${volunteerToken}`
      },
      body: JSON.stringify({ text: 'Medicines collected and verified against prescription.' })
    });
    const json = await res.json();
    if (!json.success || !json.data.volunteerNotes?.length) throw new Error('Failed to add note');
  });

  // 11. Update Status to Completed
  await test('PATCH /requests/:id/status (completed)', async () => {
    const res = await fetch(`${BASE_URL}/requests/${createdRequestId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${volunteerToken}`
      },
      body: JSON.stringify({ status: 'completed', note: 'Delivered medicines safely to senior.' })
    });
    const json = await res.json();
    if (!json.success || json.data.status !== 'completed') throw new Error('Failed to complete request');
  });

  // 12. Submit Feedback
  await test('POST /feedback', async () => {
    const res = await fetch(`${BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`
      },
      body: JSON.stringify({
        requestId: createdRequestId,
        rating: 5,
        comment: 'Outstanding and prompt support. The medicines were delivered on time!'
      })
    });
    const json = await res.json();
    if (!json.success) throw new Error('Failed to submit feedback');
  });

  // 13. Schemes List & Eligibility
  await test('GET /schemes', async () => {
    const res = await fetch(`${BASE_URL}/schemes`);
    const json = await res.json();
    if (!json.success || !json.data.length) throw new Error('Failed to fetch schemes');
  });

  await test('POST /schemes/eligibility', async () => {
    const res = await fetch(`${BASE_URL}/schemes/eligibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age: 72, gender: 'male', state: 'Maharashtra', income: 100000 })
    });
    const json = await res.json();
    if (!json.success || !json.data.eligibleCount) throw new Error('Eligibility check failed');
  });

  // 14. Notifications
  let notifId = '';
  await test('GET /notifications', async () => {
    const res = await fetch(`${BASE_URL}/notifications`);
    const json = await res.json();
    if (!json.success || !json.data.length) throw new Error('Notifications empty');
    notifId = json.data[0].id;
  });

  await test('PATCH /notifications/:id/read', async () => {
    const res = await fetch(`${BASE_URL}/notifications/${notifId}/read`, {
      method: 'PATCH'
    });
    const json = await res.json();
    if (!json.success || !json.data.read) throw new Error('Failed to mark read');
  });

  // 15. Stats
  await test('GET /stats', async () => {
    const res = await fetch(`${BASE_URL}/stats`);
    const json = await res.json();
    if (!json.success || typeof json.data.totalRequests !== 'number') throw new Error('Failed to fetch stats');
  });

  console.log(`\n================================`);
  console.log(`Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`================================`);
}

runTests().catch(console.error);
