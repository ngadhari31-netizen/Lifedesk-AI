const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AI LifeDesk database...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.fraudSignal.deleteMany();
  await prisma.fraudEvent.deleteMany();
  await prisma.aiAnalysis.deleteMany();
  await prisma.ticketAssignment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.knowledgeArticle.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Users (1 Admin, 5 Agents, 10 Customers)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Sarah Connor (Admin)',
      email: 'admin@lifedesk.ai',
      passwordHash,
      role: 'ADMIN',
      language: 'en',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  const agentsData = [
    { name: 'Alex Rivera (Billing Lead)', email: 'agent@lifedesk.ai', role: 'AGENT', language: 'en', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { name: 'David Kim (Technical Support)', email: 'david.kim@lifedesk.ai', role: 'AGENT', language: 'en', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { name: 'Priya Sharma (Security Ops)', email: 'priya.sharma@lifedesk.ai', role: 'AGENT', language: 'hi', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { name: 'Marcus Chen (Delivery Logistics)', email: 'marcus.chen@lifedesk.ai', role: 'AGENT', language: 'en', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { name: 'Sneha Patil (Customer Advocate)', email: 'sneha.patil@lifedesk.ai', role: 'AGENT', language: 'mr', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
  ];

  const agents = [];
  for (const a of agentsData) {
    agents.push(await prisma.user.create({ data: { ...a, passwordHash } }));
  }

  const customersData = [
    { name: 'Rahul Deshmukh', email: 'customer@lifedesk.ai', language: 'mr', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
    { name: 'Elena Rostova', email: 'elena.rostova@sample.com', language: 'en', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    { name: 'Amit Verma', email: 'amit.verma@sample.com', language: 'hi', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
    { name: 'Sophia Miller', email: 'sophia.m@sample.com', language: 'en', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
    { name: 'Liam Johnson', email: 'liam.j@sample.com', language: 'en', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
    { name: 'Ananya Roy', email: 'ananya.roy@sample.com', language: 'hi', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { name: 'Carlos Mendez', email: 'carlos.m@sample.com', language: 'en', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150' },
    { name: 'Tanvi Kulkarni', email: 'tanvi.k@sample.com', language: 'mr', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { name: 'Oliver Brown', email: 'oliver.b@sample.com', language: 'en', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
    { name: 'Zoe Zhang', email: 'zoe.z@sample.com', language: 'en', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
  ];

  const customers = [];
  for (const c of customersData) {
    customers.push(await prisma.user.create({ data: { ...c, role: 'CUSTOMER', passwordHash } }));
  }

  console.log(`Created ${agents.length + 1 + customers.length} users.`);

  // 2. Categories
  const categoryNames = [
    { name: 'Billing', description: 'Invoices, fees, charges, statements', icon: 'credit-card' },
    { name: 'Payments', description: 'Transaction processing, gateway errors, deductions', icon: 'wallet' },
    { name: 'Orders', description: 'Purchase modifications, cancellation, confirmations', icon: 'shopping-bag' },
    { name: 'Delivery', description: 'Shipments, courier delays, missing packages', icon: 'truck' },
    { name: 'Refunds', description: 'Reimbursements, returns, credit adjustments', icon: 'rotate-ccw' },
    { name: 'Account', description: 'Profile, login, credentials, email changes', icon: 'user' },
    { name: 'Security', description: 'Compromised accounts, suspicious activity, 2FA', icon: 'shield-alert' },
    { name: 'Technical Support', description: 'App bugs, crashes, error codes, sync problems', icon: 'wrench' },
    { name: 'Subscriptions', description: 'Plan changes, renewals, cancellation of tiers', icon: 'repeat' },
    { name: 'General', description: 'Miscellaneous customer support inquiries', icon: 'help-circle' },
  ];

  const categories = {};
  for (const cat of categoryNames) {
    categories[cat.name] = await prisma.category.create({ data: cat });
  }

  // 3. Knowledge Base (10+ articles grounded)
  const articlesData = [
    {
      title: 'Cancelled Orders with Deducted Payment Policy',
      category: 'Billing',
      tags: 'payment, deducted, cancelled, refund, billing',
      content: `When a customer's payment is deducted but an order fails or is cancelled, our system issues an automatic reversal within 2-4 hours. In standard banking networks, the bank authorization lock is released within 3-5 business days. If the funds do not reflect after 5 business days, support specialists can verify the payment gateway ARN (Acquirer Reference Number) and request manual reconciliation.`,
      status: 'PUBLISHED',
      views: 342,
      helpful: 88,
    },
    {
      title: 'How to Report Duplicate or Multiple Charges',
      category: 'Billing',
      tags: 'duplicate, multiple charges, double charged, payment error',
      content: `If you see more than one charge for the same transaction on your bank statement, please submit your transaction reference IDs or bank statement screenshot. Our risk engine automatically identifies potential gateway timeouts. Duplicate authorizations are automatically cleared by your card issuer within 48-72 hours.`,
      status: 'PUBLISHED',
      views: 215,
      helpful: 64,
    },
    {
      title: 'How to Reset Your Account Password Securely',
      category: 'Account',
      tags: 'password, reset, forgot password, security, login',
      content: `To reset your password:\n1. Navigate to the Login screen.\n2. Click "Forgot Password" below the credentials input.\n3. Enter your verified email address.\n4. Open the email and click the one-time secure link (valid for 15 minutes).\n5. Choose a password with at least 8 characters, including numbers and symbols.`,
      status: 'PUBLISHED',
      views: 520,
      helpful: 142,
    },
    {
      title: 'Tracking Delivery and Courier Delays',
      category: 'Delivery',
      tags: 'tracking, delay, shipment, courier, dispatch',
      content: `Standard delivery takes 2 to 4 business days. Priority express delivery arrives within 24 to 48 hours. If your tracking status has not updated for more than 48 hours, contact support with your tracking number #LD-TRK to initiate an active courier tracer.`,
      status: 'PUBLISHED',
      views: 180,
      helpful: 47,
    },
    {
      title: 'Refund Timeline and Processing Terms',
      category: 'Refunds',
      tags: 'refund, timeline, bank credit, return policy',
      content: `Approved refunds are credited to the original payment method: Credit cards take 3-7 business days; UPI / Net Banking take 24-48 hours; Store credits are instant. You will receive an automated confirmation email with the bank transaction reference number upon refund issuance.`,
      status: 'PUBLISHED',
      views: 412,
      helpful: 120,
    },
    {
      title: 'What to Do If You Suspect Your Account is Compromised',
      category: 'Security',
      tags: 'hacked, security, compromised, unauthorized, locked',
      content: `If you detect unauthorized logins, unexpected emails, or order attempts:\n1. Immediately report the issue to our 24/7 AI or security specialist.\n2. We will immediately terminate all active browser sessions.\n3. We will enforce password reset and identity verification. No charges will be processed during the review period.`,
      status: 'PUBLISHED',
      views: 290,
      helpful: 95,
    },
    {
      title: 'Managing Subscription Plans and Upgrades',
      category: 'Subscriptions',
      tags: 'subscription, upgrade, downgrade, cancel, annual',
      content: `You can upgrade, downgrade, or cancel your subscription anytime in Settings > Subscriptions. Upgrades take effect immediately with prorated billing. Downgrades take effect at the end of the current billing cycle.`,
      status: 'PUBLISHED',
      views: 110,
      helpful: 33,
    },
    {
      title: 'Resolving Mobile App Sync & Crash Errors',
      category: 'Technical Support',
      tags: 'app error, sync, crash, mobile, troubleshooting',
      content: `If experiencing sync errors:\n1. Clear the app cache in device settings.\n2. Ensure you are running the latest app version.\n3. If error code ERR-SYNC-401 persists, log out and log back in to refresh tokens.`,
      status: 'PUBLISHED',
      views: 95,
      helpful: 28,
    },
    {
      title: 'International Shipping Customs and Import Duties',
      category: 'Delivery',
      tags: 'international, customs, duty, taxes, global delivery',
      content: `For orders shipped outside the domestic territory, local import customs duties and VAT taxes may apply depending on country regulations. These fees are collected by the customs clearance partner upon arrival.`,
      status: 'PUBLISHED',
      views: 75,
      helpful: 19,
    },
    {
      title: 'Updating Billing Address and Payment Cards',
      category: 'Billing',
      tags: 'card update, billing address, credit card, payment methods',
      content: `You can securely add, edit, or remove debit/credit cards in your Customer Portal under "Payment Methods". All card credentials are tokenized through PCI-DSS Level 1 certified vaulting.`,
      status: 'PUBLISHED',
      views: 140,
      helpful: 52,
    },
  ];

  for (const article of articlesData) {
    await prisma.knowledgeArticle.create({ data: article });
  }

  console.log('Created Knowledge Base articles.');

  // 4. Seed 22+ Sample Tickets with AI Analyses, Messages, and Fraud events
  const ticketsData = [
    {
      ticketNumber: 'LD-1001',
      customerId: customers[0].id,
      assignedAgentId: agents[0].id,
      categoryId: categories['Billing'].id,
      subject: 'Payment was deducted but order was cancelled',
      description: 'I tried purchasing an annual plan. Rs. 2,499 was debited from my account but the order failed and shows cancelled. Please verify and refund.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      sentiment: 'frustrated',
      aiSummary: 'Customer reports Rs. 2,499 debited while checkout marked cancelled. Recommends payment ledger inspection.',
      messages: [
        { senderId: customers[0].id, senderType: 'CUSTOMER', content: 'My payment was deducted but my order was cancelled. Please check.' },
        { senderId: agents[0].id, senderType: 'AI', content: 'AI Analysis: Intent identified as payment_deducted_order_cancelled. Priority set to HIGH. Escalating to Billing Support with transaction verification check.' },
        { senderId: agents[0].id, senderType: 'AGENT', content: 'Hello Rahul, I have confirmed your payment reference with our gateway. The transaction did not attach to an order due to a gateway timeout. The refund has been released and will reflect in 3 business days.' },
      ],
    },
    {
      ticketNumber: 'LD-1002',
      customerId: customers[1].id,
      assignedAgentId: agents[0].id,
      categoryId: categories['Payments'].id,
      subject: 'I was charged three times for the same order',
      description: 'My invoice shows triple billing for Order #ORD-8812. Three charges of $79 appeared on my credit card statement within 2 minutes.',
      status: 'ESCALATED',
      priority: 'URGENT',
      sentiment: 'frustrated',
      aiSummary: 'Potential multiple payment anomaly detected. Customer claims 3 concurrent charges for single order. Human risk review required.',
      fraudRisk: {
        riskLevel: 'MEDIUM',
        riskScore: 64,
        eventType: 'duplicate_charge_claim',
        explanation: 'Potentially suspicious transaction pattern detected. Multiple charges were reported for a single order entity. Verification recommended prior to manual credit.',
        signals: ['Multiple related payment attempts reported within 120s', 'Verification needed against payment gateway ledger'],
      },
      messages: [
        { senderId: customers[1].id, senderType: 'CUSTOMER', content: 'I was charged three times for the same order! Please help!' },
        { senderId: agents[0].id, senderType: 'AI', content: 'AI LifeDesk: Flagged as duplicate charge claim. Attached risk screening telemetry and routed to Senior Billing Specialist.' },
      ],
    },
    {
      ticketNumber: 'LD-1003',
      customerId: customers[2].id,
      assignedAgentId: agents[2].id,
      categoryId: categories['Security'].id,
      subject: 'My account was hacked and I cannot access it',
      description: 'I received an email stating my password was changed from an unknown IP address in another country. I cannot log in anymore.',
      status: 'OPEN',
      priority: 'URGENT',
      sentiment: 'distressed',
      aiSummary: 'Critical security alert. Customer reports unauthorized credential compromise and lockout.',
      fraudRisk: {
        riskLevel: 'HIGH',
        riskScore: 88,
        eventType: 'account_takeover_signals',
        explanation: 'Potentially compromised account activity detected. Session termination and manual KYC verification recommended.',
        signals: ['Password change from anomalous geographic location', 'Sudden account lockout report'],
      },
      messages: [
        { senderId: customers[2].id, senderType: 'CUSTOMER', content: 'My account was hacked and I cannot access it.' },
      ],
    },
    {
      ticketNumber: 'LD-1004',
      customerId: customers[0].id,
      assignedAgentId: agents[4].id,
      categoryId: categories['Delivery'].id,
      subject: 'माझ्या ऑर्डरचे पैसे कट झाले पण ऑर्डर मिळाली नाही',
      description: 'काल मी औषधांची ऑर्डर केली होती. बँकेतून पैसे गेले पण ऑर्डर अद्याप पोहोचली नाही.',
      status: 'ASSIGNED',
      priority: 'HIGH',
      sentiment: 'frustrated',
      aiSummary: 'Customer submitted Marathi support request regarding delivery status and payment deduction.',
      messages: [
        { senderId: customers[0].id, senderType: 'CUSTOMER', content: 'माझ्या ऑर्डरचे पैसे कट झाले पण ऑर्डर मिळाली नाही.' },
        { senderId: agents[4].id, senderType: 'AI', content: 'AI LifeDesk: मराठी विनंती नोंदवली. बिलिंग व डिलिव्हरी तपासणी सुरू आहे.' },
      ],
    },
    {
      ticketNumber: 'LD-1005',
      customerId: customers[3].id,
      assignedAgentId: agents[1].id,
      categoryId: categories['Technical Support'].id,
      subject: 'Dashboard reports 403 forbidden error on analytics tab',
      description: 'Whenever I click on the analytics overview, the screen flashes 403 Forbidden even though I am on the Enterprise tier.',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      sentiment: 'neutral',
      aiSummary: 'Role permission cache sync issue on customer portal. Re-synced scopes.',
      messages: [
        { senderId: customers[3].id, senderType: 'CUSTOMER', content: 'Dashboard gives 403 on analytics tab.' },
        { senderId: agents[1].id, senderType: 'AGENT', content: 'We cleared your workspace permission cache. Please log out and back in.' },
        { senderId: customers[3].id, senderType: 'CUSTOMER', content: 'Works now, thank you!' },
      ],
      feedback: { rating: 5, isResolved: true, comment: 'Quick and effective support!' },
    },
    {
      ticketNumber: 'LD-1006',
      customerId: customers[4].id,
      assignedAgentId: agents[3].id,
      categoryId: categories['Delivery'].id,
      subject: 'Courier delayed for 5 days without tracking update',
      description: 'Tracking number #LD-TRK-9901 has been stuck at regional hub since last Friday. Need expedited delivery.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      sentiment: 'frustrated',
      aiSummary: 'Logistics delay. Package in transit hub beyond SLA.',
      messages: [
        { senderId: customers[4].id, senderType: 'CUSTOMER', content: 'Tracking is stuck for 5 days.' },
      ],
    },
    {
      ticketNumber: 'LD-1007',
      customerId: customers[5].id,
      assignedAgentId: agents[0].id,
      categoryId: categories['Refunds'].id,
      subject: 'Refund request for damaged package return',
      description: 'The item arrived damaged. Return package was delivered back to your warehouse 4 days ago. Please release refund.',
      status: 'WAITING_FOR_CUSTOMER',
      priority: 'MEDIUM',
      sentiment: 'neutral',
      aiSummary: 'Customer requested return refund status. Return package delivered to facility.',
      messages: [
        { senderId: customers[5].id, senderType: 'CUSTOMER', content: 'Item was returned. Awaiting refund.' },
        { senderId: agents[0].id, senderType: 'AGENT', content: 'Hi Ananya, our warehouse inspected the returned item. Could you confirm your last 4 digits of your bank account?' },
      ],
    },
    {
      ticketNumber: 'LD-1008',
      customerId: customers[6].id,
      assignedAgentId: null,
      categoryId: categories['Subscriptions'].id,
      subject: 'Need to downgrade from Pro to Basic tier',
      description: 'We are reducing our team size and would like to switch from Pro to Basic before the next monthly invoice.',
      status: 'OPEN',
      priority: 'LOW',
      sentiment: 'neutral',
      aiSummary: 'Subscription plan change request before renewal date.',
      messages: [
        { senderId: customers[6].id, senderType: 'CUSTOMER', content: 'How do I downgrade my subscription plan?' },
      ],
    },
    {
      ticketNumber: 'LD-1009',
      customerId: customers[7].id,
      assignedAgentId: agents[0].id,
      categoryId: categories['Payments'].id,
      subject: 'International wire transfer reference number missing',
      description: 'Sent wire transfer of $1,200 for enterprise seat onboarding. Need account balance credited.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      sentiment: 'neutral',
      aiSummary: 'Wire transfer payment verification pending manual SWIFT matching.',
      messages: [
        { senderId: customers[7].id, senderType: 'CUSTOMER', content: 'Wire transfer sent, awaiting credit.' },
      ],
    },
    {
      ticketNumber: 'LD-1010',
      customerId: customers[8].id,
      assignedAgentId: agents[1].id,
      categoryId: categories['General'].id,
      subject: 'Inquiry regarding API rate limits for webhook events',
      description: 'Could you clarify the maximum concurrent webhook deliveries supported on our custom integration?',
      status: 'RESOLVED',
      priority: 'LOW',
      sentiment: 'positive',
      aiSummary: 'Technical inquiry regarding webhook throughput quotas.',
      messages: [
        { senderId: customers[8].id, senderType: 'CUSTOMER', content: 'What is the webhook rate limit?' },
        { senderId: agents[1].id, senderType: 'AGENT', content: 'Webhook events support up to 500 events per second with automatic exponential retry.' },
      ],
      feedback: { rating: 5, isResolved: true, comment: 'Clear and concise answer.' },
    },
    {
      ticketNumber: 'LD-1011',
      customerId: customers[9].id,
      assignedAgentId: agents[0].id,
      categoryId: categories['Billing'].id,
      subject: 'Invoice tax breakdown missing GST / VAT identification',
      description: 'Our accounting department requires tax ID to be printed on invoice #INV-4412 for corporate deduction.',
      status: 'OPEN',
      priority: 'MEDIUM',
      sentiment: 'neutral',
      aiSummary: 'Invoice modification request to include corporate tax registration number.',
      messages: [
        { senderId: customers[9].id, senderType: 'CUSTOMER', content: 'Need tax ID added to invoice.' },
      ],
    },
    {
      ticketNumber: 'LD-1012',
      customerId: customers[1].id,
      assignedAgentId: agents[3].id,
      categoryId: categories['Orders'].id,
      subject: 'Change delivery address before shipment departs',
      description: 'I entered the wrong flat number in my shipping address. Order was placed 20 minutes ago.',
      status: 'RESOLVED',
      priority: 'HIGH',
      sentiment: 'urgent',
      aiSummary: 'Urgent address correction prior to logistics fulfillment dispatch.',
      messages: [
        { senderId: customers[1].id, senderType: 'CUSTOMER', content: 'Need to correct delivery address right away.' },
        { senderId: agents[3].id, senderType: 'AGENT', content: 'Address updated successfully to Flat 402 before courier pickup!' },
      ],
      feedback: { rating: 5, isResolved: true, comment: 'Saved my delivery! Amazing speed.' },
    },
    {
      ticketNumber: 'LD-1013',
      customerId: customers[2].id,
      assignedAgentId: agents[2].id,
      categoryId: categories['Security'].id,
      subject: 'Two-Factor Authentication device lost',
      description: 'I lost my phone that had the Google Authenticator app. Need backup security recovery codes.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      sentiment: 'distressed',
      aiSummary: 'MFA device recovery request requiring secondary identity verification.',
      messages: [
        { senderId: customers[2].id, senderType: 'CUSTOMER', content: 'Lost my 2FA phone, cannot access account.' },
      ],
    },
    {
      ticketNumber: 'LD-1014',
      customerId: customers[4].id,
      assignedAgentId: agents[1].id,
      categoryId: categories['Technical Support'].id,
      subject: 'CSV export failing on large customer report',
      description: 'Exporting 50,000 records times out with 504 Gateway error after 60 seconds.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      sentiment: 'neutral',
      aiSummary: 'Async report generation recommended for large volume datasets.',
      messages: [
        { senderId: customers[4].id, senderType: 'CUSTOMER', content: 'Report export times out.' },
      ],
    },
    {
      ticketNumber: 'LD-1015',
      customerId: customers[5].id,
      assignedAgentId: agents[0].id,
      categoryId: categories['Refunds'].id,
      subject: 'Cancel annual subscription auto-renewal',
      description: 'Please turn off the automatic card charge scheduled for next month.',
      status: 'RESOLVED',
      priority: 'LOW',
      sentiment: 'positive',
      aiSummary: 'Auto-renewal disabled as requested by subscriber.',
      messages: [
        { senderId: customers[5].id, senderType: 'CUSTOMER', content: 'Disable auto renewal please.' },
        { senderId: agents[0].id, senderType: 'AGENT', content: 'Auto-renewal has been successfully turned off.' },
      ],
      feedback: { rating: 4, isResolved: true, comment: 'Simple process.' },
    },
    {
      ticketNumber: 'LD-1016',
      customerId: customers[6].id,
      assignedAgentId: agents[3].id,
      categoryId: categories['Delivery'].id,
      subject: 'Received package was opened and missing item',
      description: 'The shipping box arrived with broken tamper seal. 1 out of 3 ordered items was missing.',
      status: 'ESCALATED',
      priority: 'HIGH',
      sentiment: 'frustrated',
      aiSummary: 'Tampered logistics box with partial missing contents claim.',
      messages: [
        { senderId: customers[6].id, senderType: 'CUSTOMER', content: 'Package had broken seal, item missing.' },
      ],
    },
    {
      ticketNumber: 'LD-1017',
      customerId: customers[7].id,
      assignedAgentId: null,
      categoryId: categories['General'].id,
      subject: 'Partnership inquiry for regional distribution',
      description: 'We are a logistics distributor in Western India interested in enterprise API integration.',
      status: 'OPEN',
      priority: 'LOW',
      sentiment: 'positive',
      aiSummary: 'Business development partnership lead.',
      messages: [
        { senderId: customers[7].id, senderType: 'CUSTOMER', content: 'Interested in partnering with AI LifeDesk.' },
      ],
    },
    {
      ticketNumber: 'LD-1018',
      customerId: customers[8].id,
      assignedAgentId: agents[0].id,
      categoryId: categories['Payments'].id,
      subject: 'Repeated payment gateway 502 bad gateway error',
      description: 'Checkout button gives 502 error when using Visa credit cards.',
      status: 'RESOLVED',
      priority: 'HIGH',
      sentiment: 'frustrated',
      aiSummary: 'Payment gateway upstream maintenance caused transient 502 errors.',
      messages: [
        { senderId: customers[8].id, senderType: 'CUSTOMER', content: 'Visa checkout failing with 502 error.' },
        { senderId: agents[0].id, senderType: 'AGENT', content: 'The upstream card network has resolved their gateway outage.' },
      ],
      feedback: { rating: 5, isResolved: true, comment: 'Thank you for following up promptly.' },
    },
    {
      ticketNumber: 'LD-1019',
      customerId: customers[9].id,
      assignedAgentId: agents[1].id,
      categoryId: categories['Technical Support'].id,
      subject: 'Mobile push notifications not received on Android 14',
      description: 'Ticket status updates are not popping up on notifications bar despite permissions enabled.',
      status: 'OPEN',
      priority: 'MEDIUM',
      sentiment: 'neutral',
      aiSummary: 'FCM push notification token registration troubleshooting.',
      messages: [
        { senderId: customers[9].id, senderType: 'CUSTOMER', content: 'No notifications received on mobile device.' },
      ],
    },
    {
      ticketNumber: 'LD-1020',
      customerId: customers[0].id,
      assignedAgentId: agents[0].id,
      categoryId: categories['Billing'].id,
      subject: 'Request for consolidated fiscal year billing statement',
      description: 'Our chartered accountant needs all monthly invoices from April 2025 to March 2026.',
      status: 'RESOLVED',
      priority: 'LOW',
      sentiment: 'positive',
      aiSummary: 'Annual invoice consolidated PDF requested and emailed.',
      messages: [
        { senderId: customers[0].id, senderType: 'CUSTOMER', content: 'Please provide full FY invoice bundle.' },
        { senderId: agents[0].id, senderType: 'AGENT', content: 'Sent consolidated PDF bundle to your registered email.' },
      ],
      feedback: { rating: 5, isResolved: true, comment: 'Extremely helpful and fast.' },
    },
    {
      ticketNumber: 'LD-1021',
      customerId: customers[3].id,
      assignedAgentId: agents[2].id,
      categoryId: categories['Security'].id,
      subject: 'Multiple failed login notifications received via SMS',
      description: 'I got 6 OTP SMS codes in 10 minutes that I did not request. Someone might be trying to brute force my account.',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      sentiment: 'distressed',
      aiSummary: 'Automated brute force login attempt signals detected. IP rate-limited.',
      fraudRisk: {
        riskLevel: 'HIGH',
        riskScore: 78,
        eventType: 'suspicious_login_burst',
        explanation: 'Multiple unauthorized OTP requests detected within short time window.',
        signals: ['Repeated failed SMS authentication challenges', 'Anomalous request burst rate'],
      },
      messages: [
        { senderId: customers[3].id, senderType: 'CUSTOMER', content: 'Receiving continuous unauthorized OTP messages.' },
      ],
    },
    {
      ticketNumber: 'LD-1022',
      customerId: customers[1].id,
      assignedAgentId: agents[4].id,
      categoryId: categories['General'].id,
      subject: 'Dark mode contrast feedback for accessibility',
      description: 'In dark mode, the secondary text badges have slightly low contrast. Would love an update for screen readers.',
      status: 'CLOSED',
      priority: 'LOW',
      sentiment: 'positive',
      aiSummary: 'Accessibility contrast improvement suggestion noted for design team.',
      messages: [
        { senderId: customers[1].id, senderType: 'CUSTOMER', content: 'Suggestions for dark mode contrast.' },
        { senderId: agents[4].id, senderType: 'AGENT', content: 'Thank you! We have updated the theme contrast tokens.' },
      ],
    },
  ];

  for (const t of ticketsData) {
    const createdTicket = await prisma.ticket.create({
      data: {
        ticketNumber: t.ticketNumber,
        customerId: t.customerId,
        assignedAgentId: t.assignedAgentId,
        categoryId: t.categoryId,
        subject: t.subject,
        description: t.description,
        status: t.status,
        priority: t.priority,
        sentiment: t.sentiment,
        aiSummary: t.aiSummary,
      },
    });

    // Messages
    if (t.messages) {
      for (const m of t.messages) {
        await prisma.message.create({
          data: {
            ticketId: createdTicket.id,
            senderId: m.senderId,
            senderType: m.senderType,
            content: m.content,
          },
        });
      }
    }

    // AI Analysis record
    await prisma.aiAnalysis.create({
      data: {
        ticketId: createdTicket.id,
        intent: t.subject.toLowerCase().replace(/\s+/g, '_').slice(0, 30),
        category: 'Support',
        priority: t.priority.toLowerCase(),
        sentiment: t.sentiment,
        confidence: 0.94,
        summary: t.aiSummary || t.description,
        suggestedAction: 'Review issue and proceed with relevant department protocol.',
        requiresHuman: t.priority === 'HIGH' || t.priority === 'URGENT',
      },
    });

    // Fraud risk if present
    if (t.fraudRisk) {
      const fraudEvent = await prisma.fraudEvent.create({
        data: {
          customerId: t.customerId,
          ticketId: createdTicket.id,
          riskLevel: t.fraudRisk.riskLevel,
          riskScore: t.fraudRisk.riskScore,
          eventType: t.fraudRisk.eventType,
          status: 'PENDING_REVIEW',
          explanation: t.fraudRisk.explanation,
          recommendedAction: 'Human review required by authorized supervisor',
        },
      });

      for (const sig of t.fraudRisk.signals) {
        await prisma.fraudSignal.create({
          data: {
            fraudEventId: fraudEvent.id,
            signal: sig,
            severity: t.fraudRisk.riskLevel,
          },
        });
      }
    }

    // Feedback if present
    if (t.feedback) {
      await prisma.feedback.create({
        data: {
          ticketId: createdTicket.id,
          customerId: t.customerId,
          rating: t.feedback.rating,
          isResolved: t.feedback.isResolved,
          comment: t.feedback.comment,
        },
      });
    }
  }

  // 5. Seed Notifications
  const sampleNotifications = [
    {
      userId: customers[0].id,
      type: 'TICKET_CREATED',
      title: 'Ticket #LD-1001 Created',
      message: 'Your payment inquiry ticket #LD-1001 was created and assigned to Billing Support.',
      link: '/tickets',
    },
    {
      userId: customers[0].id,
      type: 'AGENT_REPLIED',
      title: 'Agent Replied to Ticket #LD-1001',
      message: 'Alex Rivera sent a reply: "The refund has been released and will reflect in 3 business days."',
      link: '/tickets',
    },
    {
      userId: adminUser.id,
      type: 'FRAUD_ALERT',
      title: 'Potentially Suspicious Activity Flagged',
      message: 'Multiple transaction charges detected for ticket #LD-1002 (Medium Risk).',
      link: '/admin/fraud',
    },
  ];

  for (const n of sampleNotifications) {
    await prisma.notification.create({ data: n });
  }

  // 6. Seed Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'SYSTEM_INITIALIZATION',
      resource: 'System',
      resourceId: 'INIT-001',
      metadata: JSON.stringify({ environment: 'production-ready', seeded: true }),
    },
  });

  console.log('Database seeded successfully with demo data!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
