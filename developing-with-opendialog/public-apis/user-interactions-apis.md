# User Interactions APIs

The User Interactions APIs enable you to retrieve user interaction data from your OpenDialog workspace. These endpoints provide access to conversation messages for analysis, reporting, and compliance purposes.

### User Interactions

#### Get User Interactions

Retrieve user interactions (messages) within a specified date range, with optional filtering by user ID and other user attributes.

**Endpoint:** `GET /public/api/user-interactions`

**Authentication:** API Token required

**Headers:**

```
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

**Query Parameters:**

* `from` (required) - Start date for the interaction range (format: `YYYY-MM-DD HH:MM:SS`)
* `to` (required) - End date for the interaction range (format: `YYYY-MM-DD HH:MM:SS`)
* `user_id` (optional) - Filter by specific user ID
* `selected_scenario` (optional) - Filter by scenario ID
* `browser` (optional) - Filter by browser attribute
* Other custom user attributes (optional) - See "Allowed Filters" section

**Allowed Filters:**

You can filter interactions using the following system-registered filter names:

* `ip_address` - User's IP address
* `country` - User's country
* `browser_language` - Browser language setting
* `os` - Operating system
* `browser` - Browser name and version
* `timezone` - User's timezone
* `email` - User's email address
* `platform` - Platform identifier
* `selected_scenario` - Scenario ID

**Example Request:**

```
GET /public/api/user-interactions?from=2024-01-01%2000:00:00&to=2024-01-31%2023:59:59&user_id=user_12345&selected_scenario=customer_support
```

**Response:**

```json
{
  "data": [
    {
      "user_12345": {
        "chatbot_user_data": {
          "id": "user_12345",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "from": "2024-01-15T00:00:00.000000Z",
        "to": "2024-01-15T23:59:59.000000Z",
        "user_id": "user_12345",
        "selected_scenario": "customer_support",
        "browser": "chrome 105.0.0",
        "interactions": [
          {
            "type": "button",
            "date": "2024-01-15T10:30:00.000000Z",
            "text": "Help with my order",
            "data": {
              "name": "Order Help",
              "callback_id": "order_help_001"
            }
          },
          {
            "type": "text",
            "date": "2024-01-15T10:35:15.000000Z",
            "text": "I need help with my order",
            "data": null
          }
        ]
      }
    }
  ]
}
```

**Response Structure:**

The response groups interactions by user ID with the following structure:

* `chatbot_user_data` - User object with basic information
* `from` - Start date filter that was applied
* `to` - End date filter that was applied
* `user_id` - The user ID (as key and in data)
* `selected_scenario` - The scenario filter that was applied
* `browser` - The browser filter that was applied
* `interactions` - Array of interaction objects:
  * `type` - Type of interaction (e.g., "text", "button", "form", etc.)
  * `date` - ISO 8601 timestamp when the interaction occurred
  * `text` - The message text or interaction content
  * `data` - Additional interaction data (varies by type)

**Description:**

This endpoint retrieves all messages sent by users within the specified date range. Key behaviors:

* Only user-sent messages are returned
* Bot responses are excluded from results
* Results are grouped by user ID
* Multiple filters can be combined in a single request
* Custom attributes are matched using LIKE pattern matching
* Empty results return an empty array in the `data` field

**Filtering by Allowed Attributes:**

You can filter interactions by including any of the allowed filter names as query parameters. Multiple filters can be combined in a single request:

```
GET /public/api/user-interactions?from=2024-01-01%2000:00:00&to=2024-01-31%2023:59:59&email=user@example.com&browser=chrome
```

How filtering works:

* Attribute values are matched using LIKE pattern matching (case-insensitive, supports partial matches)
* Multiple filters can be combined with AND logic (all conditions must be met)
* Only filter names from the allowed filters list are accepted
* Attempting to use an invalid filter name will result in a 422 validation error

**Error Responses:**

* `401 Unauthorized` - API token is missing or invalid
* `422 Unprocessable Entity` - Missing required parameters or invalid filter names

**Example Error Response (Missing Required Parameters):**

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "from": ["The from field is required."],
    "to": ["The to field is required."]
  }
}
```

**Example Error Response (Invalid Filter):**

```json
{
  "message": "The filter 'invalid_param' is not allowed.",
  "errors": {
    "filters.invalid_param": [
      "The filter 'invalid_param' is not allowed."
    ]
  }
}
```

**Use Cases:**

* Analyze user engagement within specific time periods
* Track conversations for specific users
* Export interactions for quality assurance and training
* Generate conversation reports filtered by user segments
* Monitor browser and device usage patterns
* Filter interactions by geographic location or language
* Audit user interactions for compliance purposes

### Example Usage

#### Python Example

```python
import requests
from datetime import datetime

# Configuration
base_url = "https://your-workspace.cloud.opendialog.ai"
api_token = "YOUR_API_TOKEN"
headers = {
    "Authorization": f"Bearer {api_token}",
    "Content-Type": "application/json"
}

# Get user interactions for a specific date
params = {
    "from": "2024-01-01 00:00:00",
    "to": "2024-01-31 23:59:59",
    "user_id": "user_12345",
    "selected_scenario": "customer_support"
}

response = requests.get(
    f"{base_url}/public/api/user-interactions",
    headers=headers,
    params=params
)

if response.status_code == 200:
    interactions = response.json()
    print(f"Retrieved interactions: {interactions}")
else:
    print(f"Error: {response.status_code} - {response.text}")
```

#### cURL Example

```bash
# Get user interactions
curl -X GET \
  'https://your-workspace.cloud.opendialog.ai/public/api/user-interactions?from=2024-01-01%2000:00:00&to=2024-01-31%2023:59:59&user_id=user_12345' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json'

# Get user interactions with custom filters
curl -X GET \
  'https://your-workspace.cloud.opendialog.ai/public/api/user-interactions?from=2024-01-01%2000:00:00&to=2024-01-31%2023:59:59&browser=chrome&country=US' \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json'
```

### Notes

* Date format must be `YYYY-MM-DD HH:MM:SS` (24-hour format)
* Only messages sent by users are returned (bot messages are excluded)
* Filters are case-insensitive and use LIKE pattern matching
* Invalid filter names will result in a 422 validation error
* The API uses API token authentication via the `Authorization: Bearer` header
* Empty date ranges will return an empty data array without error
