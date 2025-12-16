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

#### Generate AI Email Sequence
```http
POST /api/mail/generate
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json

{
  "to": "lead@example.com"
}
```

**Response:**
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

#### Confirm and Queue Emails
```http
POST /api/mail/confirm
Authorization: Bearer <clerk-jwt-token>
Content-Type: application/json

{
  "to": "lead@example.com",
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

**Response:**
```json
{
  "success": true,
  "mailId": "67596123456def789abc0123",
  "message": "Successfully queued 2 emails for delivery",
  "steps": [
    {
      "stepId": "uuid-step-1",
      "step": 0,
      "delayDays": 0
    },
    {
      "stepId": "uuid-step-2",
      "step": 1, 
      "delayDays": 5
    }
  ]
}
```

**Email Schedule:**
- First email: Immediate delivery
- Subsequent emails: Every 5 days

#### Email Template Preview
```http
GET /api/mail/preview?subject=Welcome&body=Hello%20there&templateStyle=branded
Authorization: Bearer <clerk-jwt-token>
```

**Response:** Returns styled HTML email preview

**Available Template Styles:**
- `basic` - Simple, clean design (Free plan)
- `branded` - Corporate branding with logos (Pro plan)
- `professional` - Elegant with signatures and credentials (Premium plan)
- `modern` - Contemporary design with gradients and stats (Enterprise plan)

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

