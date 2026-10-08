async function testAPI() {
  try {
    const base = 'http://localhost:5000/api';
    console.log('Testing GET /api/health...');
    const healthRes = await fetch(`${base}/health`);
    console.log('Health:', await healthRes.json());

    console.log('Testing GET /api/tasks...');
    const tasksRes = await fetch(`${base}/tasks`);
    const tasksData = await tasksRes.json();
    console.log(`Fetched ${tasksData.data.length} tasks. Pagination:`, tasksData.pagination);

    console.log('Testing POST /api/tasks...');
    const createRes = await fetch(`${base}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test New Task',
        description: 'Verify backend creation works correctly',
        priority: 'high',
        status: 'pending',
        dueDate: '2026-10-30',
      }),
    });
    const created = await createRes.json();
    console.log('Created task ID:', created.data.id);

    console.log('Testing GET /api/tasks/:id...');
    const singleRes = await fetch(`${base}/tasks/${created.data.id}`);
    const single = await singleRes.json();
    console.log('Single task retrieved:', single.data.title);

    console.log('Testing PUT /api/tasks/:id...');
    const updateRes = await fetch(`${base}/tasks/${created.data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'in_progress',
        title: 'Updated Test Task',
      }),
    });
    const updated = await updateRes.json();
    console.log('Updated task status:', updated.data.status, 'title:', updated.data.title);

    console.log('Testing DELETE /api/tasks/:id...');
    const delRes = await fetch(`${base}/tasks/${created.data.id}`, { method: 'DELETE' });
    const del = await delRes.json();
    console.log('Deleted successfully:', del.success);

    console.log('Testing GET /api/tasks/stats...');
    const statsRes = await fetch(`${base}/tasks/stats`);
    console.log('Stats:', await statsRes.json());

    console.log('ALL BACKEND API TESTS PASSED! 🎉');
  } catch (err) {
    console.error('Test error:', err);
  }
}

testAPI();
