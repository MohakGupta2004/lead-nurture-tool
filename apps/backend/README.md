# RealtyGenieNewBackend

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Clerk Configuration
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/realtygenie

# Server Configuration
PORT=3000
```

### 3. Get Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or select existing one
3. Go to API Keys section
4. Copy the Publishable Key and Secret Key
5. Add them to your `.env` file

### 4. Start the Server

```bash
bun run index.ts
```

## Authentication Flow

1. **Frontend Integration**: Your frontend should use Clerk's client SDK to handle authentication
2. **JWT Tokens**: Clerk automatically handles JWT token generation and validation
3. **Protected Routes**: All routes under `/api/*` require authentication
4. **User Creation**: Users are automatically created in the database when they first authenticate

## API Endpoints

### Authentication
All API routes require a valid Clerk JWT token in the Authorization header:
```
Authorization: Bearer <your-clerk-jwt-token>
```

**Getting Clerk JWT Token:**

### Frontend Integration

1. **Install Clerk**: `npm install @clerk/nextjs`

2. **Setup ClerkProvider** in your app layout with your publishable key

3. **Get JWT Token** in your components:
```tsx
import { useAuth } from '@clerk/nextjs'

const { getToken } = useAuth()
const token = await getToken()
```

4. **Make API Calls** with the token:
```tsx
const response = await fetch('/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

For complete setup instructions, visit [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs).

### User Management

#### Get Current User Profile
```http
GET /api/users/me
Authorization: Bearer <clerk-jwt-token>
```

**Response (Not Onboarded):**
```json
{
  "id": "67595e8f123abc456def7890",
  "clerkUserId": "user_2abcd1234efgh5678",
  "username": "john@example.com",
  "email": "john@example.com",
  "profileImageUrl": "https://img.clerk.com/preview.png",
  "isOnboarded": false,
  "createdAt": "2025-12-11T10:30:00.000Z"
}
```

**Response (Onboarded Realtor):**
```json
{
  "id": "67595e8f123abc456def7890",
  "clerkUserId": "user_2abcd1234efgh5678",
  "username": "john@example.com",
  "email": "john@example.com",
  "profileImageUrl": "https://img.clerk.com/preview.png",
  "isOnboarded": true,
  "phNo": "+1234567890",
  "brokerageName": "Premium Realty Group",
  "professionalEmail": "john@premiumrealty.com",
  "yearsInBusiness": 8,
  "markets": ["New York", "Brooklyn", "Manhattan"],
  "realtorType": "Individual",
  "calendlyLink": "https://calendly.com/john-realtor",
  "signatureImageUrl": "https://example.com/signature.png",
  "brandLogoUrl": "https://example.com/logo.png",
  "brokerageLogoUrl": "https://example.com/brokerage-logo.png",
  "subscriptionPlan": "free",
  "createdAt": "2025-12-11T10:30:00.000Z"
}
```

#### Complete Onboarding (Create/Update Realtor Profile)
```http
POST /api/users/onboarding
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json

{
  "phNo": "+1234567890",
  "brokerageName": "Premium Realty Group",
  "professionalEmail": "john@premiumrealty.com",
  "yearsInBusiness": 8,
  "markets": ["New York", "Brooklyn", "Manhattan"],
  "realtorType": "Individual",
  "calendlyLink": "https://calendly.com/john-realtor",
  "signatureImageUrl": "https://example.com/signature.png",
  "brandLogoUrl": "https://example.com/logo.png",
  "brokerageLogoUrl": "https://example.com/brokerage-logo.png",
  "profileImageUrl": "https://example.com/profile.jpg",
  "subscriptionPlan": "pro"
}
```

**Response:**
```json
{
  "success": true
}
```

### Campaign Management

#### Get All Campaigns
```http
GET /api/campaigns/all
Authorization: Bearer <clerk-jwt-token>
```

**Response:**
```json
[
  {
    "id": "67595f8a123def456ghi7890",
    "name": "Summer Buyer Outreach",
    "totalLeads": 124,
    "createdAt": "2025-12-11T09:15:30.000Z",
    "status": "active",
    "objective": "Generate leads for summer home buyers",
    "targetPersona": "Young professionals looking for first homes",
    "description": "Email campaign targeting millennials interested in starter homes"
  },
  {
    "id": "67595f8a123def456ghi7891",
    "name": "Luxury Home Campaign",
    "totalLeads": 67,
    "createdAt": "2025-12-10T14:22:10.000Z",
    "status": "active",
    "objective": "Target high-end buyers",
    "targetPersona": "High-income families seeking luxury properties",
    "description": "Showcase premium listings to affluent clients"
  }
]
```

#### Create New Campaign
```http
POST /api/campaigns/create
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json

{
  "name": "Winter Holiday Campaign",
  "objective": "End-of-year property sales push",
  "targetPersona": "Families wanting to move before new year",
  "description": "Holiday-themed campaign with special incentives"
}
```

**Response:**
```json
{
  "success": true
}
```

#### Update Campaign Status
```http
PATCH /api/campaigns/update-status
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json

{
  "campaignId": "67595f8a123def456ghi7890",
  "status": "Paused"
}
```

**Response:**
```json
{
  "success": true
}
```

#### Update Campaign Details
```http
PATCH /api/campaigns/update
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json

{
  "campaignId": "67595f8a123def456ghi7890",
  "name": "Updated Summer Campaign",
  "objective": "Updated objective for summer buyers",
  "targetPersona": "Updated target persona",
  "description": "Updated campaign description"
}
```

**Response:**
```json
{
  "success": true
}
```

#### Delete Campaign
```http
DELETE /api/campaigns/delete
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json

{
  "campaignId": "67595f8a123def456ghi7890"
}
```

**Response:**
```json
{
  "success": true
}
```

### Lead Management

#### Get All Leads
```http
GET /api/leads/all
Authorization: Bearer <clerk-jwt-token>
```

**Response:**
```json
[
  {
    "_id": "67596012345abc678def9012",
    "name": "John Smith",
    "email": "john.smith@email.com",
    "phNo": "1234567890",
    "address": "123 Main St, New York, NY 10001",
    "realtorId": "67595e8f123abc456def7890",
    "campaignId": {
      "_id": "67595f8a123def456ghi7890",
      "campaignName": "Summer Buyer Outreach"
    },
    "createdAt": "2025-12-11T11:45:20.000Z",
    "updatedAt": "2025-12-11T11:45:20.000Z"
  },
  {
    "_id": "67596012345abc678def9013",
    "name": "Sarah Johnson",
    "email": "sarah.j@email.com",
    "phNo": "9876543210",
    "address": "456 Oak Ave, Brooklyn, NY 11201",
    "realtorId": "67595e8f123abc456def7890",
    "campaignId": {
      "_id": "67595f8a123def456ghi7890",
      "campaignName": "Summer Buyer Outreach"
    },
    "createdAt": "2025-12-11T12:30:15.000Z",
    "updatedAt": "2025-12-11T12:30:15.000Z"
  }
]
```

#### Get Leads by Campaign
```http
GET /api/leads/?campaignId=67595f8a123def456ghi7890
Authorization: Bearer <clerk-jwt-token>
```

**Response:**
```json
[
  {
    "_id": "67596012345abc678def9012",
    "name": "John Smith",
    "email": "john.smith@email.com",
    "phNo": "1234567890",
    "address": "123 Main St, New York, NY 10001",
    "realtorId": "67595e8f123abc456def7890",
    "campaignId": "67595f8a123def456ghi7890",
    "createdAt": "2025-12-11T11:45:20.000Z",
    "updatedAt": "2025-12-11T11:45:20.000Z"
  }
]
```

#### Create Single Lead
```http
POST /api/leads/create
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json

{
  "name": "Michael Brown",
  "email": "michael.brown@email.com",
  "phone": "5551234567",
  "address": "789 Pine St, Queens, NY 11375",
  "campaignId": "67595f8a123def456ghi7890"
}
```

**Response:**
```json
{
  "success": true
}
```

#### Create Multiple Leads (Batch)
```http
POST /api/leads/create/batch
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json

{
  "campaignId": "67595f8a123def456ghi7890",
  "leads": [
    {
      "name": "Emily Davis",
      "email": "emily.davis@email.com",
      "phone": "5559876543",
      "address": "321 Elm St, Manhattan, NY 10014"
    },
    {
      "name": "Robert Wilson",
      "email": "robert.wilson@email.com",
      "phone": "5555555555",
      "address": "654 Cedar Ave, Bronx, NY 10451"
    },
    {
      "name": "Lisa Garcia",
      "email": "lisa.garcia@email.com",
      "phone": "5551112222",
      "address": "987 Maple Dr, Staten Island, NY 10301"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "createdCount": 3
}

### Mail Management

The Mail API provides endpoints for generating AI-powered email sequences, managing email campaigns, previewing templates, and handling unsubscribe requests. All endpoints require Clerk JWT authentication except the unsubscribe endpoint.

---

#### 1. Generate AI Email Sequence

Generates a 4-step AI-powered email sequence based on the realtor's profile information.

**Endpoint:**
```http
POST /api/mail/generate
```

**Authentication:** Required (Clerk JWT Token)

**Headers:**
```http
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json
```

**Response (Success - 200):**
```json
{
  "success": true,
  "mails": [
    {
      "mail": {
        "mailNo": 1,
        "subject": "Welcome to Your Property Journey",
        "body": "I'm excited to help you find your dream home..."
      }
    },
    {
      "mail": {
        "mailNo": 2,
        "subject": "Current Market Insights",
        "body": "Here are the latest market trends in your area..."
      }
    },
    {
      "mail": {
        "mailNo": 3,
        "subject": "Personalized Recommendations",
        "body": "Based on your preferences, here are some properties..."
      }
    },
    {
      "mail": {
        "mailNo": 4,
        "subject": "Next Steps in Your Home Search",
        "body": "Let's schedule a time to discuss your options..."
      }
    }
  ]
}
```

**Response (Error - 400):**
```json
{
  "error": "Recipient email (to) is required"
}
```

**Response (Error - 403):**
```json
{
  "error": "Realtor access required"
}
```

**Response (Error - 500):**
```json
{
  "error": "Failed to generate emails"
}
```

**Email Generation Topics:**
1. Introduction and initial contact
2. Market insights and property updates
3. Personalized recommendations
4. Follow-up and next steps

**Frontend Example:**
```typescript
const generateEmails = async (recipientEmail: string) => {
  const { getToken } = useAuth();
  const token = await getToken();
  
  const response = await fetch('/api/mail/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: recipientEmail
    })
  });
  
  const data = await response.json();
  return data.mails;
};
```

---

#### 2. Confirm and Queue Emails

Confirms the email sequence and queues it for automated delivery to all active leads in a campaign.

**Endpoint:**
```http
POST /api/mail/confirm
```

**Authentication:** Required (Clerk JWT Token)

**Headers:**
```http
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "campaignId": "67595f8a123def456ghi7890",
  "templateStyle": "professional",
  "mails": [
    {
      "mail": {
        "subject": "Welcome to Your Property Journey",
        "body": "I'm excited to help you find your dream home..."
      }
    },
    {
      "mail": {
        "subject": "Current Market Insights", 
        "body": "Here are the latest market trends..."
      }
    }
  ]
}
```

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `campaignId` | string | Yes | MongoDB ObjectId of the campaign |
| `templateStyle` | string | No | Template style: `basic`, `branded`, `professional`, `modern` (default: `basic`) |
| `mails` | array | Yes | Array of mail objects with `mail.subject` and `mail.body` |

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Successfully queued emails for 45 leads",
  "totalLeads": 45,
  "totalEmailsQueued": 90
}
```

**Response (Error - 400 - Invalid Mails):**
```json
{
  "error": "Mails array is required"
}
```

**Response (Error - 400 - Campaign Not Active):**
```json
{
  "error": "Campaign is not active"
}
```

**Response (Error - 400 - No Active Leads):**
```json
{
  "error": "No active leads found in this campaign"
}
```

**Response (Error - 403 - Template Access Denied):**
```json
{
  "error": "Template access denied",
  "message": "The 'professional' template requires a higher subscription plan.",
  "allowedTemplates": ["basic", "branded"],
  "currentPlan": "pro",
  "upgradeRequired": true
}
```

**Response (Error - 404):**
```json
{
  "message": "Campaign not found"
}
```

**Email Delivery Schedule:**
- **Step 0 (First email):** Immediate delivery
- **Step 1:** 5 days delay
- **Step 2:** 10 days delay
- **Step 3:** 15 days delay
- Each subsequent step adds 5 more days

**Batch Processing:**
- Emails are processed in batches of 50 leads
- Each batch is queued separately for optimal performance
- Unsubscribed leads are automatically filtered out

**Frontend Example:**
```typescript
const confirmEmails = async (campaignId: string, mails: any[], template: string) => {
  const { getToken } = useAuth();
  const token = await getToken();
  
  const response = await fetch('/api/mail/confirm', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      campaignId,
      templateStyle: template,
      mails
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    if (error.upgradeRequired) {
      // Handle subscription upgrade prompt
      console.log(`Upgrade required to ${error.allowedTemplates}`);
    }
    throw new Error(error.error);
  }
  
  return await response.json();
};
```

---

#### 3. Email Template Preview

Generates a preview of the email with the selected template style.

**Endpoint:**
```http
GET /api/mail/preview
```

**Authentication:** Required (Clerk JWT Token)

**Headers:**
```http
Authorization: Bearer <clerk-jwt-token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `subject` | string | Yes | Email subject line |
| `body` | string | Yes | Email body content (can include HTML) |
| `templateStyle` | string | No | Template: `basic`, `branded`, `professional`, `modern` (default: `basic`) |

**Example Request:**
```http
GET /api/mail/preview?subject=Welcome&body=Hello%20there&templateStyle=branded
Authorization: Bearer <clerk-jwt-token>
```

**Response (Success - 200):**
Returns styled HTML email preview (Content-Type: text/html)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Preview</title>
</head>
<body>
  <!-- Fully rendered email template with styles -->
  ...
</body>
</html>
```

**Response (Error - 400):**
```json
{
  "error": "Subject and body are required as query parameters"
}
```

**Response (Error - 403 - Template Access Denied):**
```json
{
  "error": "Template access denied",
  "message": "The 'professional' template requires a higher subscription plan.",
  "allowedTemplates": ["basic", "branded"],
  "currentPlan": "pro",
  "upgradeRequired": true
}
```

**Available Template Styles:**
- `basic` - Simple, clean design (Free plan)
- `branded` - Corporate branding with logos (Pro plan)
- `professional` - Elegant with signatures and credentials (Premium plan)
- `modern` - Contemporary design with gradients and stats (Enterprise plan)

**Unsubscribe Link:**
All templates include a placeholder unsubscribe link (`#`) in preview mode. In actual emails, this is replaced with a secure tokenized unsubscribe URL.

**Frontend Example:**
```typescript
const getEmailPreview = async (subject: string, body: string, template: string) => {
  const { getToken } = useAuth();
  const token = await getToken();
  
  const params = new URLSearchParams({
    subject,
    body,
    templateStyle: template
  });
  
  const response = await fetch(`/api/mail/preview?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  // Returns HTML that can be displayed in an iframe
  const html = await response.text();
  return html;
};

// Usage in React component:
const PreviewComponent = () => {
  const [previewHtml, setPreviewHtml] = useState('');
  
  useEffect(() => {
    getEmailPreview('Welcome', 'Hello there', 'branded')
      .then(html => setPreviewHtml(html));
  }, []);
  
  return <iframe srcDoc={previewHtml} style={{width: '100%', height: '600px'}} />;
};
```

---

#### 4. Get Mails by Campaign ID

Retrieves all email sequences associated with a specific campaign.

**Endpoint:**
```http
GET /api/mail/getMailsByCampaignId/:campaignId
```

**Authentication:** Required (Clerk JWT Token)

**Headers:**
```http
Authorization: Bearer <clerk-jwt-token>
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `campaignId` | string | Yes | MongoDB ObjectId of the campaign |

**Example Request:**
```http
GET /api/mail/getMailsByCampaignId/67595f8a123def456ghi7890
Authorization: Bearer <clerk-jwt-token>
```

**Response (Success - 200):**
```json
[
  {
    "_id": "67596123456def789abc0123",
    "campaignId": "67595f8a123def456ghi7890",
    "templateStyle": "professional",
    "unsubscribed": false,
    "steps": [
      {
        "stepId": "uuid-1234-5678-abcd",
        "step": 0,
        "subject": "Welcome to Your Property Journey",
        "body": "I'm excited to help you find your dream home...",
        "_id": "67596123456def789abc0124"
      },
      {
        "stepId": "uuid-5678-9012-efgh",
        "step": 1,
        "subject": "Current Market Insights",
        "body": "Here are the latest market trends...",
        "_id": "67596123456def789abc0125"
      }
    ],
    "createdAt": "2025-12-11T14:30:00.000Z",
    "updatedAt": "2025-12-11T14:30:00.000Z"
  }
]
```

**Response (Empty - 200):**
```json
[]
```

**Response (Error - 403 - Realtor Access):**
```json
{
  "error": "Realtor access required"
}
```

**Response (Error - 403 - Campaign Access):**
```json
{
  "error": "Realtor access denied"
}
```

**Response (Error - 404):**
```json
{
  "error": "Campaign not found"
}
```

**Response (Error - 500):**
```json
{
  "error": "Failed to fetch mails by campaign ID"
}
```

**Frontend Example:**
```typescript
const getCampaignMails = async (campaignId: string) => {
  const { getToken } = useAuth();
  const token = await getToken();
  
  const response = await fetch(`/api/mail/getMailsByCampaignId/${campaignId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  const mails = await response.json();
  return mails;
};
```

---

#### 5. Unsubscribe from Emails

Public endpoint that allows leads to unsubscribe from email campaigns using a secure token.

**Endpoint:**
```http
GET /api/mail/unsubscribe
```

**Authentication:** Not required (uses secure token)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | string | Yes | Secure JWT token containing mailId and lead email |

**Example Request:**
```http
GET /api/mail/unsubscribe?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Payload:**
The token is a signed JWT containing:
```json
{
  "mailId": "67596123456def789abc0123",
  "email": "lead@example.com"
}
```

**Response (Success - 200):**
Returns HTML page confirming unsubscription:
```html
<html>
  <body style="font-family:Arial;text-align:center;padding:40px">
    <h2>You're unsubscribed</h2>
    <p>You will no longer receive emails from RealtyGenie.</p>
    <p style="font-size:12px;color:#777">
      If this was a mistake, you can contact support.
    </p>
  </body>
</html>
```

**Response (Error - 400 - Invalid Token):**
```html
Invalid unsubscribe link
```

**Response (Error - 400 - Expired Token):**
```html
Invalid or expired unsubscribe link
```

**Response (Error - 500):**
```html
Something went wrong
```

**How Unsubscribe Works:**
1. Each email sent contains an unsubscribe link with a secure token
2. Token includes the mail ID and lead's email address
3. When clicked, the lead's `unsubscribed` status is set to `true` in the database
4. Future emails to this lead are automatically filtered out
5. Unsubscription is permanent and affects all future campaigns

**Token Generation (Backend):**
The token is generated using the `verifyUnsubscribeToken` utility. It's automatically included in all emails sent through the system.

**Frontend Note:**
This endpoint is typically accessed directly via email links, not through frontend API calls. However, you may want to provide a support link for users who accidentally unsubscribed.

---

#### 6. Festive Email Trigger

Configure automated festive email campaigns that trigger on specific dates (Christmas, New Year, etc.).

**Endpoint:**
```http
POST /api/mail/festiveTrigger
```

**Authentication:** Required (Clerk JWT Token)

**Headers:**
```http
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json
```

**Request Body (Enable Trigger):**
```json
{
  "festival": "christmas",
  "enabled": true
}
```

**Request Body (Disable Trigger):**
```json
{
  "festival": "newyear",
  "enabled": false
}
```

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `festival` | string | Yes | Festival identifier: `christmas`, `newyear` |
| `enabled` | boolean | No | Enable/disable trigger (default: `true`) |

**Supported Festivals:**
| Festival | Date | Identifier |
|----------|------|------------|
| Christmas | December 25, 2025 | `christmas` |
| New Year | January 1, 2026 | `newyear` |

**Response (Success - Enabled - 200):**
```json
{
  "success": true,
  "festival": "christmas",
  "runAt": "2025-12-25T00:00:00.000Z"
}
```

**Response (Success - Disabled - 200):**
```json
{
  "success": true,
  "message": "Festive trigger disabled"
}
```

**Response (Error - 400 - Missing Festival):**
```json
{
  "error": "Festival is required"
}
```

**Response (Error - 400 - Unsupported Festival):**
```json
{
  "error": "Unsupported festival"
}
```

**Response (Error - 403):**
```json
{
  "error": "Realtor access required"
}
```

**Response (Error - 500):**
```json
{
  "error": "Failed to configure festive trigger"
}
```

**How Festive Triggers Work:**
1. **Scheduling Logic:**
   - If festival date is more than 72 hours away, job is queued 48 hours before the festival
   - If festival date is within 72 hours, job is queued immediately
   - This ensures compliance with Resend's maximum scheduling window

2. **Trigger States:**
   - `pending` - Waiting to be executed
   - `processing` - Currently sending emails
   - `completed` - Successfully sent all emails
   - `failed` - Encountered an error

3. **Job Processing:**
   - Jobs are queued with unique IDs: `festival-trigger:{realtorId}:{festival}`
   - Duplicate triggers for the same realtor+festival are automatically replaced
   - Completed jobs are removed from the queue

**Frontend Example:**
```typescript
const configureFestiveTrigger = async (festival: 'christmas' | 'newyear', enabled: boolean) => {
  const { getToken } = useAuth();
  const token = await getToken();
  
  const response = await fetch('/api/mail/festiveTrigger', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      festival,
      enabled
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return await response.json();
};

// Usage examples:
// Enable Christmas emails
await configureFestiveTrigger('christmas', true);

// Disable New Year emails
await configureFestiveTrigger('newyear', false);
```

---

### Subscription Plans

| Plan | Template Access | Features |
|------|-----------------|----------|
| **Free** | Basic | Basic email templates |
| **Pro** | Basic + Branded | Corporate branding, logos |
| **Premium** | Basic + Branded + Professional | Signatures, credentials, profile images |
| **Enterprise** | All Templates | Modern design, stats, full customization |

**Template Access Control:**
All template endpoints validate subscription access. Attempting to use premium templates without proper subscription returns:

```json
{
  "error": "Template access denied",
  "message": "The 'professional' template requires a higher subscription plan.",
  "allowedTemplates": ["basic", "branded"],
  "currentPlan": "pro",
  "upgradeRequired": true
}
```

### Public Endpoints
- `GET /` - Health check
- `GET /health` - Server status

