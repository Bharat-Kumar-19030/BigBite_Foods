// Network Diagnostic Utility
// Use this to test connectivity from affected devices

export const runNetworkDiagnostic = async () => {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: '',
  };

  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const apiUrl = import.meta.env.VITE_API_URL;

  console.log('🔍 Starting Network Diagnostic...');
  console.log('Server URL:', serverUrl);
  console.log('API URL:', apiUrl);

  // Test 1: DNS Resolution (basic fetch)
  try {
    console.log('\n📡 Test 1: Testing basic connectivity...');
    const startTime = Date.now();
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      mode: 'cors',
    });
    const latency = Date.now() - startTime;
    const data = await response.json();
    
    results.tests.push({
      name: 'Basic Connectivity',
      status: 'PASS',
      latency: `${latency}ms`,
      details: data,
    });
    console.log('✅ Basic connectivity: PASS', data);
  } catch (error) {
    results.tests.push({
      name: 'Basic Connectivity',
      status: 'FAIL',
      error: error.message,
      details: {
        type: error.name,
        message: error.message,
      },
    });
    console.error('❌ Basic connectivity: FAIL', error);
  }

  // Test 2: CORS with credentials
  try {
    console.log('\n📡 Test 2: Testing CORS with credentials...');
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    
    results.tests.push({
      name: 'CORS with Credentials',
      status: 'PASS',
      details: data,
    });
    console.log('✅ CORS with credentials: PASS');
  } catch (error) {
    results.tests.push({
      name: 'CORS with Credentials',
      status: 'FAIL',
      error: error.message,
    });
    console.error('❌ CORS with credentials: FAIL', error);
  }

  // Test 3: Check if server is Railway
  try {
    console.log('\n📡 Test 3: Checking server details...');
    const response = await fetch(`${apiUrl}/health`);
    const headers = {
      server: response.headers.get('server'),
      via: response.headers.get('via'),
      xPoweredBy: response.headers.get('x-powered-by'),
    };
    
    results.tests.push({
      name: 'Server Headers',
      status: 'PASS',
      details: headers,
    });
    console.log('✅ Server headers:', headers);
  } catch (error) {
    results.tests.push({
      name: 'Server Headers',
      status: 'FAIL',
      error: error.message,
    });
    console.error('❌ Server headers: FAIL', error);
  }

  // Test 4: Socket.IO endpoint
  try {
    console.log('\n📡 Test 4: Testing Socket.IO endpoint...');
    const response = await fetch(`${serverUrl}/socket.io/`, {
      method: 'GET',
    });
    
    results.tests.push({
      name: 'Socket.IO Endpoint',
      status: response.ok ? 'PASS' : 'FAIL',
      statusCode: response.status,
    });
    console.log(`${response.ok ? '✅' : '❌'} Socket.IO endpoint: ${response.status}`);
  } catch (error) {
    results.tests.push({
      name: 'Socket.IO Endpoint',
      status: 'FAIL',
      error: error.message,
    });
    console.error('❌ Socket.IO endpoint: FAIL', error);
  }

  // Test 5: Network info
  const networkInfo = {
    userAgent: navigator.userAgent,
    online: navigator.onLine,
    connection: navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData,
    } : 'Not available',
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
  };

  results.tests.push({
    name: 'Network Information',
    status: 'INFO',
    details: networkInfo,
  });
  console.log('\nℹ️ Network Information:', networkInfo);

  // Generate summary
  const passCount = results.tests.filter(t => t.status === 'PASS').length;
  const failCount = results.tests.filter(t => t.status === 'FAIL').length;
  
  if (failCount === 0) {
    results.summary = '✅ All tests passed! Your network should work fine.';
  } else if (passCount === 0) {
    results.summary = '❌ All tests failed! Your network cannot reach the server.';
  } else {
    results.summary = `⚠️ ${passCount} passed, ${failCount} failed. Partial connectivity.`;
  }

  console.log('\n' + '='.repeat(60));
  console.log(results.summary);
  console.log('='.repeat(60));

  return results;
};

// Quick diagnostic for console
export const quickDiag = () => {
  console.log('🔍 Quick Diagnostic');
  console.log('Server URL:', import.meta.env.VITE_SERVER_URL);
  console.log('API URL:', import.meta.env.VITE_API_URL);
  console.log('Online:', navigator.onLine);
  console.log('Cookies:', navigator.cookieEnabled);
  console.log('\nRun runNetworkDiagnostic() for full test');
};

// Export for console use
if (typeof window !== 'undefined') {
  window.networkDiag = runNetworkDiagnostic;
  window.quickDiag = quickDiag;
}
