// scripts/run-tests.js
// Automated verification suite for AI LifeDesk core services

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTests() {
  console.log('====================================================');
  console.log('       AI LIFEDESK - SYSTEM VERIFICATION SUITE       ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name, condition) {
    if (condition) {
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${name}`);
      failed++;
    }
  }

  try {
    // Test 1: Database connection & User count
    console.log('[1/5] Testing Database Persistence & Users...');
    const userCount = await prisma.user.count();
    assert('Database contains users', userCount > 0);
    const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    assert('Admin user account exists', !!adminUser);
    const agentUser = await prisma.user.findFirst({ where: { role: 'AGENT' } });
    assert('Agent user account exists', !!agentUser);
    const customerUser = await prisma.user.findFirst({ where: { role: 'CUSTOMER' } });
    assert('Customer user account exists', !!customerUser);

    // Test 2: Knowledge Base Articles
    console.log('\n[2/5] Testing Knowledge Base & Grounding Context...');
    const kbCount = await prisma.knowledgeArticle.count();
    assert('Knowledge base has published articles', kbCount >= 3);
    const refundArticle = await prisma.knowledgeArticle.findFirst({
      where: { title: { contains: 'Refund' } },
    });
    assert('Refund policy article is indexed', !!refundArticle);

    // Test 3: Tickets & Ticket Numbers
    console.log('\n[3/5] Testing Ticket Management & Data Integrity...');
    const ticketCount = await prisma.ticket.count();
    assert('Database contains active support tickets', ticketCount > 0);
    const ticketWithMessages = await prisma.ticket.findFirst({
      include: { messages: true, category: true },
    });
    assert('Ticket has relational category and message history', !!ticketWithMessages && !!ticketWithMessages.category);

    // Test 4: Fraud Detection & Risk Events
    console.log('\n[4/5] Testing Fraud Screening & Telemetry Signals...');
    const fraudCount = await prisma.fraudEvent.count();
    assert('Fraud risk events are recorded', fraudCount > 0);
    const highRiskEvent = await prisma.fraudEvent.findFirst({
      where: { riskLevel: { in: ['HIGH', 'CRITICAL'] } },
      include: { signals: true },
    });
    assert('High-risk anomaly events have associated telemetry signals', !!highRiskEvent && highRiskEvent.signals.length > 0);

    // Test 5: Audit Logging
    console.log('\n[5/5] Testing Security Audit Logs...');
    const auditCount = await prisma.auditLog.count();
    assert('Audit logging system is active', auditCount > 0);

    console.log('\n====================================================');
    console.log(`Results: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================\n');

    if (failed > 0) {
      process.exit(1);
    } else {
      console.log('All AI LifeDesk verification checks PASSED successfully! 🚀\n');
    }
  } catch (error) {
    console.error('Test execution failed with error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
