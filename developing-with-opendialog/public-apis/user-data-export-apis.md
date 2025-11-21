# User Data Export APIs

The User Data Export API allows you to retrieve comprehensive user data stored in OpenDialog. This enables third-party applications to access user information, attributes, and complete conversation histories for analysis, compliance, and integration purposes.

### Overview

The User Data Export endpoint provides access to all user data collected during interactions with your conversational application, including:

* User profile information and attributes
* Complete conversation history with timestamps
* Message metadata and interaction details
* Request/response logs for audit trails

The endpoint returns paginated results, allowing you to retrieve large datasets in manageable chunks. All requests are secured with API token authentication and protected by rate limiting.

### Export User Data

Retrieve comprehensive user data within a specified date range with optional pagination.

**Endpoint:** `GET /public/api/user-data-export`

**Authentication:** API Token required

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
Accept: application/json
```

**Query Parameters:**

* `from` (optional, string) - Start date for the export range (format: `YYYY-MM-DD HH:MM:SS`). Required if `to` is provided.
* `to` (optional, string) - End date for the export range (format: `YYYY-MM-DD HH:MM:SS`). Required if `from` is provided.
* `exportType` (required, string) - Export format type. Currently only `json` is supported.
* `perPage` (optional, integer) - Number of records per page (default: 20)
* `page` (optional, integer) - Page number for pagination (default: 1)

**Example Request:**

```
GET /public/api/user-data-export?from=2023-03-01%2000:00:00&to=2023-03-01%2023:59:59&exportType=json&perPage=100&page=1
```

**Response:**

```json
{
  "data": [
    {
      "user_12345": {
        "chatbot_user_data": {
          "first_name": "John",
          "last_name": "Doe",
          "email": "john.doe@example.com",
          "external_id": "ext_123",
          "ip_address": "192.168.1.100",
          "country": "United States",
          "browser_language": "en-US",
          "os": "Windows",
          "browser": "chrome 112.0.0",
          "timezone": "America/New_York",
          "custom": {
            "selected_scenario": "customer_support",
            "language": "en"
          }
        },
        "user_attributes": [
          {
            "name": "first_seen",
            "type": "attribute.core.timestamp",
            "value": {
              "scalar_value": 1683037966
            }
          },
          {
            "name": "last_seen",
            "type": "attribute.core.timestamp",
            "value": {
              "scalar_value": 1683037966
            }
          }
        ],
        "interactions": [
          {
            "author": "them",
            "type": "text",
            "date": "2023-05-02T14:32:50.000000Z",
            "text": "Hello! How can I help you today?",
            "data": {
              "text": "Hello! How can I help you today?",
              "disable_text": false,
              "internal": false,
              "hidetime": false,
              "hideavatar": false,
              "time": "02:32 PM",
              "date": "Tue 2 May",
              "attribute_name": null,
              "meta": []
            },
            "request": {
              "url": "https://workspace.cloud.opendialog.ai/incoming/webchat",
              "source_ip": "192.168.1.100"
            },
            "response": {
              "http_status": 200,
              "request_length": "0.760402"
            }
          },
          {
            "author": "user_12345",
            "type": "text",
            "date": "2023-05-02T14:32:55.000000Z",
            "text": "I need help with my order",
            "data": {
              "text": "I need help with my order"
            },
            "request": {
              "url": "https://workspace.cloud.opendialog.ai/incoming/webchat",
              "source_ip": "192.168.1.100"
            },
            "response": {
              "http_status": 200,
              "request_length": "0.521048"
            }
          }
        ]
      }
    }
  ],
  "meta": {
    "pagination": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 20,
      "to": 1,
      "total": 1
    },
    "filters": {
      "exportType": "json",
      "perPage": "20",
      "page": "1",
      "from": "2023-03-01T00:00:00.000000Z",
      "to": "2023-03-01T23:59:59.000000Z"
    }
  }
}
```

**Response Structure:**

The response contains two main sections:

**data** - Array of user objects:

* Each object key is the user ID
* **chatbot\_user\_data** - User profile information collected by the chatbot:
  * Basic info: first\_name, last\_name, email, external\_id
  * Device/location: ip\_address, country, browser\_language, os, browser, timezone
  * Custom attributes: scenario-specific attributes
* **user\_attributes** - Built-in OpenDialog attributes and scenario-specific attributes:
  * Each attribute has: name, type, and value
  * Includes timestamps for first\_seen and last\_seen
* **interactions** - Complete conversation history:
  * author: "them" (bot) or user\_id (user message)
  * type: Message type (text, button\_response, form\_response, etc.)
  * date: ISO 8601 timestamp
  * text: Message content
  * data: Additional interaction metadata
  * request: Request details (URL, source IP)
  * response: Response details (HTTP status, request length)

**meta** - Pagination and filter metadata:

* **pagination**: Current page info, total pages, total records
* **filters**: Applied request filters for reference

### Query Parameters Details

#### Date Filtering

Both `from` and `to` parameters must be provided together to filter by date:

```
GET /public/api/user-data-export?from=2024-01-01%2000:00:00&to=2024-01-31%2023:59:59&exportType=json
```

Date format: `YYYY-MM-DD HH:MM:SS` (24-hour format)

#### Pagination

Use `perPage` and `page` parameters to control pagination:

```
GET /public/api/user-data-export?exportType=json&perPage=50&page=2
```

* Default `perPage`: 20
* Default `page`: 1
* Maximum recommended `perPage`: 100-500 (depending on data volume)

#### Export Type

Currently only JSON export is supported:

```
GET /public/api/user-data-export?exportType=json
```

### Use Cases

#### GDPR and Data Compliance Requests

Export user data for data subject access requests:

```
GET /public/api/user-data-export?from=2024-01-01%2000:00:00&to=2024-01-31%2023:59:59&exportType=json&perPage=100&page=1
```

#### Conversation Analytics

Analyze user interactions and conversation patterns:

```
GET /public/api/user-data-export?from=2024-01-15%2000:00:00&to=2024-01-16%2023:59:59&exportType=json&perPage=200
```

#### Quality Assurance

Review conversations for training and quality monitoring:

```
GET /public/api/user-data-export?exportType=json&perPage=50
```

#### System Integration

Export data for CRM, data warehouse, or analytics platform integration:

```
GET /public/api/user-data-export?from=2024-01-01%2000:00:00&to=2024-12-31%2023:59:59&exportType=json&perPage=100
```

#### User Data Portability

Provide users with their complete data history:

```
GET /public/api/user-data-export?exportType=json
```

### Error Responses

**400 Bad Request**

```json
{
  "message": "Invalid date format. Expected format: YYYY-MM-DD HH:MM:SS"
}
```

**401 Unauthorized**

```json
{
  "message": "Unauthenticated."
}
```

**422 Unprocessable Entity - Missing Required Parameters**

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "exportType": ["The export type field is required."],
    "to": ["The to field is required when from is present."]
  }
}
```

**422 Unprocessable Entity - Invalid Parameter**

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "exportType": ["The export type must be json."],
    "perPage": ["The per page must be an integer."]
  }
}
```

**429 Too Many Requests**

```json
{
  "message": "Too many export requests. Please try again later."
}
```

**500 Internal Server Error**

```json
{
  "error": "An error occurred while processing your export request."
}
```

### Best Practices

#### Rate Limiting

* Be aware that the endpoint has rate limiting to prevent abuse
* Space out requests if making multiple exports
* Consider caching results to minimize repeated requests
* Batch export requests during off-peak hours for large datasets

#### Pagination Strategy

* Use reasonable `perPage` values (50-100 recommended)
* For large datasets, implement progressive pagination
* Monitor response times and adjust `perPage` accordingly
* Store pagination state to resume interrupted exports

#### Date Range Filtering

* Use narrow date ranges for faster queries
* Export data incrementally rather than all-at-once
* Schedule regular exports to keep data current
* Consider time zones when filtering by date

#### Data Privacy

* Access only data you need for your use case
* Implement proper access controls on exported data
* Comply with data protection regulations (GDPR, CCPA, etc.)
* Securely store and transmit exported data
* Delete data when no longer needed

### Example Usage

#### Python Example

```python
import requests
from datetime import datetime, timedelta

# Configuration
base_url = "https://your-workspace.cloud.opendialog.ai"
api_token = "YOUR_API_TOKEN"
headers = {
    "Authorization": f"Bearer {api_token}",
    "Accept": "application/json"
}

# Export user data
params = {
    "from": "2024-01-01 00:00:00",
    "to": "2024-01-31 23:59:59",
    "exportType": "json",
    "perPage": 50,
    "page": 1
}

response = requests.get(
    f"{base_url}/public/api/user-data-export",
    headers=headers,
    params=params
)

if response.status_code == 200:
    data = response.json()
    users = data['data']
    pagination = data['meta']['pagination']
    
    print(f"Retrieved {len(users)} user(s)")
    print(f"Page {pagination['currentPage']} of {pagination['lastPage']}")
    
    for user_data in users:
        for user_id, user_info in user_data.items():
            print(f"User: {user_id}")
            print(f"Email: {user_info['chatbot_user_data'].get('email')}")
            print(f"Interactions: {len(user_info['interactions'])}")
else:
    print(f"Error: {response.status_code}")
    print(response.json())
```

#### cURL Example

```bash
# Export user data for a specific date range
curl -X GET \
  'https://your-workspace.cloud.opendialog.ai/public/api/user-data-export?from=2024-01-01%2000:00:00&to=2024-01-31%2023:59:59&exportType=json&perPage=50' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Accept: application/json'

# Export all user data (no date filter)
curl -X GET \
  'https://your-workspace.cloud.opendialog.ai/public/api/user-data-export?exportType=json&perPage=100&page=1' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Accept: application/json'

# Paginate through results
curl -X GET \
  'https://your-workspace.cloud.opendialog.ai/public/api/user-data-export?exportType=json&perPage=50&page=2' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Accept: application/json'
```

#### JavaScript Example

```javascript
const exportUserData = async () => {
  const baseUrl = 'https://your-workspace.cloud.opendialog.ai';
  const apiToken = 'YOUR_API_TOKEN';
  
  const params = new URLSearchParams({
    from: '2024-01-01 00:00:00',
    to: '2024-01-31 23:59:59',
    exportType: 'json',
    perPage: 50,
    page: 1
  });
  
  try {
    const response = await fetch(`${baseUrl}/public/api/user-data-export?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Users:', data.data);
      console.log('Pagination:', data.meta.pagination);
      
      // Process each user
      data.data.forEach(userObj => {
        Object.entries(userObj).forEach(([userId, userInfo]) => {
          console.log(`User: ${userId}`);
          console.log(`Interactions: ${userInfo.interactions.length}`);
        });
      });
    } else {
      console.error('Error:', response.status);
      console.error(await response.json());
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};

exportUserData();
```

### Data Export Workflow

A typical data export workflow:

1. **Prepare Request**: Define date ranges and pagination parameters
2. **Make Request**: Call the API with required parameters
3. **Handle Response**: Process the returned data
4. **Check Pagination**: Determine if additional pages exist
5. **Loop Through Pages**: Fetch remaining pages if needed
6. **Process Data**: Transform or store the exported data
7. **Audit Log**: Log the export for compliance purposes

### Notes

* The `last_seen` attribute may be filtered from responses for privacy
* Date format is strict: must be `YYYY-MM-DD HH:MM:SS` with spaces
* The `from` and `to` parameters work together for filtering
* Pagination metadata helps you determine how many requests are needed
* Rate limiting is applied to prevent abuse
* API token must have appropriate permissions to export data
