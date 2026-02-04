/**
 * Editor Monitor - API Test Script
 *
 * Run: node test/run-tests.js [API_URL]
 * Example: node test/run-tests.js https://your-app.vercel.app
 */

const API_URL = process.argv[2] || 'http://localhost:3000';

console.log('\n========================================');
console.log('  EDITOR MONITOR - API TEST SUITE');
console.log('========================================');
console.log(`API URL: ${API_URL}\n`);

const tests = [
  {
    name: 'Aurapets + Dog Content (Should PASS)',
    apiKey: 'test_aurapets_admin_x9k2m5n8p3q7',
    tool: 'elevenlabs',
    prompt: 'My dog had cloudy eyes for years. AuraPets Nano Drops helped clear the cellular debris. Now he can see clearly again!',
    expectFlagged: false
  },
  {
    name: 'Aurapets + Weight Loss (Should FLAG)',
    apiKey: 'test_aurapets_admin_x9k2m5n8p3q7',
    tool: 'veo3',
    prompt: 'Lose 30 pounds in 30 days with our keto diet pills! Clinical trials show amazing results.',
    expectFlagged: true
  },
  {
    name: 'LuminEye + Human Eye Content (Should PASS)',
    apiKey: 'test_lumineye_admin_y4l7o0r3s6t9',
    tool: 'makeugc',
    prompt: 'I struggled with floaters and blurry vision. LuminEye drops helped improve my vision clarity within months.',
    expectFlagged: false
  },
  {
    name: 'LuminEye + Crypto Content (Should FLAG)',
    apiKey: 'test_lumineye_admin_y4l7o0r3s6t9',
    tool: 'elevenlabs',
    prompt: 'Make $10,000 per day trading Bitcoin! Our AI crypto bot has 99% accuracy.',
    expectFlagged: true
  },
  {
    name: 'Aurapets + Human Eye Content (Should FLAG - wrong brand)',
    apiKey: 'test_aurapets_admin_x9k2m5n8p3q7',
    tool: 'higgsfield',
    prompt: 'LuminEye helps people over 50 restore their vision. Our stem cell formula absorbs under your tongue.',
    expectFlagged: true
  },
  {
    name: 'Invalid API Key (Should REJECT)',
    apiKey: 'invalid_fake_key_12345',
    tool: 'veo3',
    prompt: 'Test content',
    expectFlagged: null,
    expectStatus: 401
  }
];

async function runTest(test, index) {
  process.stdout.write(`Test ${index + 1}: ${test.name}... `);

  try {
    const response = await fetch(`${API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': test.apiKey
      },
      body: JSON.stringify({
        tool: test.tool,
        prompt: test.prompt
      })
    });

    const data = await response.json();

    // Check for expected 401
    if (test.expectStatus === 401) {
      if (response.status === 401) {
        console.log('✅ PASSED (rejected invalid key)');
        return true;
      } else {
        console.log('❌ FAILED (should have rejected)');
        return false;
      }
    }

    // Check flagged status
    if (data.flagged === test.expectFlagged) {
      console.log(`✅ PASSED ${data.flagged ? '(flagged)' : '(clean)'}`);
      return true;
    } else {
      console.log(`❌ FAILED (expected ${test.expectFlagged ? 'flagged' : 'clean'}, got ${data.flagged ? 'flagged' : 'clean'})`);
      console.log(`   Detected: ${data.analysis?.detectedTopic}`);
      return false;
    }

  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  let passed = 0;
  let failed = 0;

  for (let i = 0; i < tests.length; i++) {
    const result = await runTest(tests[i], i);
    if (result) passed++;
    else failed++;

    // Small delay between tests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n========================================');
  console.log(`  RESULTS: ${passed}/${tests.length} passed`);
  console.log('========================================\n');

  if (failed > 0) {
    console.log('⚠️  Some tests failed. Check your API configuration.');
    process.exit(1);
  } else {
    console.log('✅ All tests passed! Ready to deploy.');
    process.exit(0);
  }
}

runAllTests();
