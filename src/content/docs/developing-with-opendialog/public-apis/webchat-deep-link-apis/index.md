---
title: Webchat Deep Link APIs
---

The Webchat Deep Link API allows you to generate personalized webchat URLs with pre-populated user attributes. This enables seamless user experiences by creating direct links to conversations with context already established, perfect for personalized marketing campaigns, support tickets, or authenticated user flows.

### Generate Webchat Deep Link

Create personalized webchat URLs for one or more users with pre-populated attributes.

**Endpoint:** `POST /public/api/generate-webchat-deep-link`

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

**Request Body:**

```json
{
  "scenario_id": "customer_support",
  "dataset": [
    {
      "user_id": "user_12345",
      "attributes": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "account_type": "premium",
        "support_tier": "gold"
      }
    },
    {
      "user_id": "user_67890",
      "attributes": {
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "account_type": "standard",
        "support_tier": "silver"
      }
    }
  ]
}
```

**Request Parameters:**

* `scenario_id` (required, string) - The scenario ID for the webchat conversation
* `dataset` (required, array) - Array of user configurations (max limit configurable)
  * `user_id` (optional, string) - Unique identifier for the user. If not provided, a UUID will be generated automatically
  * `attributes` (required, object) - Key-value pairs of user attributes to pre-populate in the conversation context

**Response:**

```json
[
  {
    "user_id": "user_12345",
    "url": "https://short.url/abc123"
  },
  {
    "user_id": "user_67890",
    "url": "https://short.url/def456"
  }
]
```

**Response Fields:**

* `user_id` (string) - The user identifier (provided or auto-generated)
* `url` (string) - The shortened deep link URL for this user

### How It Works

When you generate a webchat deep link:

1. **User Context Creation**: The system creates a persistent user context with the provided user ID (or generates a new UUID)
2. **Attribute Population**: All provided attributes are added to the user's context
   * Scalar attributes (strings, numbers) are stored directly
   * Collection attributes (arrays) are processed appropriately
   * Composite collection attributes are not currently supported
3. **Deep Link Generation**: A fullpage webchat URL is created with:
   * The specified scenario ID
   * The user ID
   * The appropriate app key/access token for the scenario
4. **URL Shortening**: The deep link is shortened to create a user-friendly URL
5. **Persistent Context**: When a user clicks the link, their context is loaded with all pre-populated attributes, enabling personalized conversations from the first message

### Supported Attribute Types

#### Scalar Attributes

Simple key-value pairs stored as strings or numbers:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "account_id": "12345",
  "vip_status": "true"
}
```

#### Collection Attributes (Arrays)

Attributes that accept multiple values:

```json
{
  "interests": ["sports", "technology", "travel"],
  "preferred_languages": ["en", "es"],
  "product_ids": ["PROD-001", "PROD-002", "PROD-003"]
}
```

Arrays can also be provided as comma-separated strings:

```json
{
  "interests": "sports,technology,travel"
}
```

#### Unsupported Types

* Composite collection attributes are currently not supported
* Complex nested objects beyond simple arrays

### Use Cases

#### Personalized Marketing Campaigns

Generate unique links for email campaigns with customer context:

```json
{
  "scenario_id": "sales_campaign",
  "dataset": [
    {
      "user_id": "customer_001",
      "attributes": {
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "campaign_id": "SPRING2024",
        "discount_code": "SAVE20",
        "customer_segment": "high_value"
      }
    }
  ]
}
```

#### Support Ticket Integration

Create pre-contextualized support conversations:

```json
{
  "scenario_id": "customer_support",
  "dataset": [
    {
      "user_id": "ticket_12345",
      "attributes": {
        "name": "Bob Williams",
        "email": "bob@example.com",
        "ticket_id": "TKT-12345",
        "issue_type": "billing",
        "priority": "high",
        "account_number": "ACC-98765"
      }
    }
  ]
}
```

#### Authenticated User Sessions

Seamlessly transition authenticated users to chat:

```json
{
  "scenario_id": "member_portal",
  "dataset": [
    {
      "user_id": "auth_user_789",
      "attributes": {
        "name": "Carol Davis",
        "email": "carol@example.com",
        "member_id": "MEM-789",
        "subscription_tier": "platinum",
        "preferences": ["email_notifications", "sms_alerts"]
      }
    }
  ]
}
```

#### Bulk Link Generation

Generate links for multiple users in a single request:

```json
{
  "scenario_id": "onboarding",
  "dataset": [
    {
      "attributes": {
        "name": "User One",
        "email": "user1@example.com",
        "cohort": "january_2024"
      }
    },
    {
      "attributes": {
        "name": "User Two",
        "email": "user2@example.com",
        "cohort": "january_2024"
      }
    },
    {
      "attributes": {
        "name": "User Three",
        "email": "user3@example.com",
        "cohort": "january_2024"
      }
    }
  ]
}
```

### Error Responses

**404 Not Found - Fullpage Disabled**

```json
{
  "message": "Fullpage webchat routes are not enabled."
}
```

**422 Unprocessable Entity - Validation Errors**

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "scenario_id": ["The scenario_id field is required."],
    "dataset": ["The dataset field is required."],
    "dataset.0.attributes": ["The attributes field is required."],
    "dataset.1.user_id": ["User id must be a string"]
  }
}
```

**422 Unprocessable Entity - Too Many Users**

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "dataset": ["Maximum number of users is 100"]
  }
}
```

**422 Unprocessable Entity - Invalid Scenario**

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "scenario_id": ["The selected scenario does not exist."]
  }
}
```

**401 Unauthorized**

```json
{
  "message": "Unauthenticated."
}
```

**500 Internal Server Error**

```json
{
  "error": "An error occurred while generating the deep link."
}
```

### Best Practices

#### Security Considerations

1. **User ID Management**:
   * Use unpredictable user IDs for security
   * Avoid exposing sensitive internal IDs
   * Consider using UUIDs (auto-generated if not provided)
2. **Attribute Privacy**:
   * Don't include sensitive data that shouldn't persist in user context
   * Be mindful of data retention and privacy regulations
   * Ensure attributes comply with your privacy policy
3. **Rate Limiting**:
   * Be aware of any rate limits on link generation
   * Cache generated links when possible
   * Batch user link generation when feasible

#### Performance Optimization

1. **Bulk Generation**:
   * Generate multiple user links in a single request
   * Respect the maximum users per request limit
   * Process large user sets in batches
2. **Attribute Efficiency**:
   * Only include necessary attributes
   * Keep attribute values concise
   * Avoid large array values when possible

#### Integration Tips

1. **Link Expiration**:
   * Consider implementing link expiration on your side
   * Track link usage for analytics
   * Regenerate links for expired campaigns
2. **User Experience**:
   * Test links before sending to users
   * Provide fallback URLs if links fail
   * Monitor link click-through rates
3. **Attribute Naming**:
   * Use consistent attribute naming conventions
   * Document required vs. optional attributes
   * Ensure attribute names match your scenario configuration

### Example Usage

#### Python Example

```python
import requests
import json

# Configuration
base_url = "https://your-workspace.cloud.opendialog.ai/public/api"
api_token = "YOUR_API_TOKEN"
headers = {
    "Authorization": f"Bearer {api_token}",
    "Content-Type": "application/json"
}

# Generate deep links
payload = {
    "scenario_id": "customer_support",
    "dataset": [
        {
            "user_id": "user_12345",
            "attributes": {
                "name": "John Doe",
                "email": "john.doe@example.com",
                "support_tier": "premium"
            }
        },
        {
            "attributes": {  # user_id will be auto-generated
                "name": "Jane Smith",
                "email": "jane.smith@example.com",
                "support_tier": "standard"
            }
        }
    ]
}

response = requests.post(
    f"{base_url}/generate-webchat-deep-link",
    headers=headers,
    json=payload
)

if response.status_code == 200:
    links = response.json()
    for link in links:
        print(f"User {link['user_id']}: {link['url']}")
else:
    print(f"Error: {response.status_code}")
    print(response.json())
```

#### cURL Example

```bash
curl -X POST \
  https://your-workspace.cloud.opendialog.ai/public/api/generate-webchat-deep-link \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "scenario_id": "customer_support",
    "dataset": [
      {
        "user_id": "user_12345",
        "attributes": {
          "name": "John Doe",
          "email": "john.doe@example.com",
          "product_interest": "enterprise_plan"
        }
      }
    ]
  }'
```

#### JavaScript Example

```javascript
const generateDeepLinks = async () => {
  const baseUrl = 'https://your-workspace.cloud.opendialog.ai/public/api';
  const apiToken = 'YOUR_API_TOKEN';
  
  const payload = {
    scenario_id: 'customer_support',
    dataset: [
      {
        user_id: 'user_12345',
        attributes: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          account_type: 'premium'
        }
      }
    ]
  };
  
  try {
    const response = await fetch(`${baseUrl}/generate-webchat-deep-link`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      const links = await response.json();
      links.forEach(link => {
        console.log(`User ${link.user_id}: ${link.url}`);
      });
    } else {
      console.error('Error:', response.status);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};

generateDeepLinks();
```

### Integration Workflow

A typical integration workflow might look like:

1. **Prepare User Data**: Gather user information from your CRM, database, or application
2. **Build Request**: Format the data according to the API specification
3. **Generate Links**: Call the API to generate personalized deep links
4. **Store Links**: Save the generated URLs with user records
5. **Distribute Links**: Send links via email, SMS, or display in your application
6. **Monitor Usage**: Track link clicks and conversation starts
7. **Analyze Results**: Review conversation outcomes and user engagement

This creates a seamless bridge between your existing systems and OpenDialog's conversational capabilities, enabling personalized, context-aware user experiences at scale.
