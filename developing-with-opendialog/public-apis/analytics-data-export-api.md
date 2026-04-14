# Analytics Data Export API (Clickstream)

## Overview

The Analytics Data Export API allows third-party applications to retrieve clickstream analytics data from OpenDialog. The endpoint merges data from three sources — **events**, **pages**, and **user identifications** — into a single, chronologically ordered clickstream.

Optionally, experiment (feature-flag evaluation) data can be included alongside the clickstream, scoped to the users present on the current page of results.

This is useful for exporting behavioural analytics and A/B testing data to external systems for further analysis and reporting.

## Endpoint

**GET** `{base_url}/public/api/analytics-data-export`

`{base_url}` is the fully qualified domain name of your OpenDialog workspace. For example:

```
https://your-workspace.cloud.opendialog.ai/public/api/analytics-data-export
```

## Authentication

The endpoint uses token-based authentication via the `public_api` guard. An API access token must be provided in the `Authorization` header as a Bearer token.

You can generate (or regenerate) your API access token in the OpenDialog application under **Identity & Security → API Authorization**.

### Request Headers

| Header          | Value                    | Required |
|-----------------|--------------------------|----------|
| `Accept`        | `application/json`       | Yes      |
| `Authorization` | `Bearer {access_token}`  | Yes      |

## Query Parameters

| Parameter         | Type    | Required | Description                                                                                                      |
|-------------------|---------|----------|------------------------------------------------------------------------------------------------------------------|
| `scenario_id`     | string  | **Yes**  | The ID of the scenario to retrieve clickstream data for.                                                          |
| `start_date`      | string  | No       | Filter data on or after this date. Format: `YYYY-MM-DD` (e.g. `2026-01-01`).                                     |
| `end_date`        | string  | No       | Filter data on or before this date. Must be equal to or after `start_date`. Format: `YYYY-MM-DD`.                 |
| `chatbot_user_id` | string  | No       | Filter by chatbot user ID. Resolves to anonymous user IDs via identity mapping. Max length: 384 characters.        |
| `include_flag_data`| boolean| No       | Set to `1` or `true` to include experiment (flag evaluation) data for users on the current page.                  |
| `per_page`        | integer | No       | Number of records per page. Minimum: `1`, maximum: `1000`. Default: `50`.                                         |
| `page`            | integer | No       | Page number to retrieve. Minimum: `1`. Default: `1`.                                                              |

### Example Request

```
GET https://your-workspace.cloud.opendialog.ai/public/api/analytics-data-export?scenario_id=my-scenario&start_date=2026-01-01&end_date=2026-01-31&per_page=100
```

```bash
curl -X GET \
  "https://your-workspace.cloud.opendialog.ai/public/api/analytics-data-export?scenario_id=my-scenario&start_date=2026-01-01&end_date=2026-01-31&per_page=100" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer {access_token}"
```

## Response

### HTTP Status Codes

| Code | Description                                                                                     |
|------|-------------------------------------------------------------------------------------------------|
| 200  | **Success.** The response body contains the requested clickstream data.                         |
| 401  | **Unauthorized.** The request does not include a valid access token.                            |
| 403  | **Forbidden.** The Flag Configurations feature is not enabled for this tenant.                   |
| 422  | **Unprocessable Entity.** Validation failed — check the request parameters (see error response).|
| 429  | **Too Many Requests.** Rate limit exceeded. Wait and retry.                                     |

### Response Body

The response uses **simple pagination** (no total count, which avoids expensive count queries on large datasets). The top-level object contains a `clickstream` key with paginated data and metadata. When `include_flag_data=1` is provided, an additional `experiments` key is included.

### Response Fields — `clickstream.data[]`

Each record in the clickstream represents one of three types:

| Field          | Type   | Description                                                                                  |
|----------------|--------|----------------------------------------------------------------------------------------------|
| `type`         | string | The record type: `event`, `page`, or `identify`.                                             |
| `scenario_id`  | string | The scenario this record belongs to.                                                         |
| `anonymous_id` | string | The anonymous identifier of the user.                                                        |
| `user_id`      | string | The user ID (empty string if not available).                                                 |
| `event`        | string | The event name (only populated for `event` type records).                                    |
| `name`         | string | The page name (only populated for `page` type records).                                      |
| `properties`   | string | JSON-encoded properties associated with the record.                                          |
| `traits`       | string | JSON-encoded user traits (only populated for `identify` type records).                       |
| `context`      | string | JSON-encoded context data including the scenario ID.                                         |
| `message_id`   | string | The unique message identifier for this record.                                               |
| `timestamp`    | string | The timestamp of the record (format: `YYYY-MM-DD HH:MM:SS`).                                |

### Record Types

- **`event`** — A tracked user action (e.g. button click, form submission). The `event` field contains the event name and `properties` contains event-specific data.
- **`page`** — A page view. The `name` field contains the page name and `properties` contains page-specific data.
- **`identify`** — A user identification record. The `traits` field contains user traits (e.g. email, name).

### Pagination Fields — `clickstream`

| Field            | Type    | Description                                                        |
|------------------|---------|--------------------------------------------------------------------|
| `per_page`       | integer | The number of records per page.                                    |
| `current_page`   | integer | The current page number.                                           |
| `has_more_pages` | boolean | Whether there are more pages of results after the current page.    |

### Response Fields — `experiments[]` (optional)

Only present when `include_flag_data=1` is passed. Contains flag evaluations scoped to the anonymous users on the current page.

| Field                | Type           | Description                                                                                  |
|----------------------|----------------|----------------------------------------------------------------------------------------------|
| `scenario_id`        | string         | The scenario this evaluation belongs to.                                                     |
| `flag_name`          | string         | The name of the feature flag that was evaluated.                                             |
| `anonymous_user_id`  | string         | The anonymous identifier of the user who received the evaluation.                            |
| `chatbot_user_id`    | string         | The chatbot user ID mapped to this anonymous user (empty string if no mapping exists).       |
| `variant_assigned`   | string         | The variant the user was assigned (e.g. `control`, `variant_a`).                             |
| `evaluation_context` | object or array| Contextual data that was present at the time of evaluation.                                  |
| `reason`             | string         | The reason for the variant assignment (e.g. `RULE_MATCH`, `DEFAULT`).                        |
| `created_at`         | string         | Timestamp of when the evaluation was recorded.                                               |

### Sample Success Response

```json
{
    "clickstream": {
        "data": [
            {
                "type": "event",
                "scenario_id": "my-scenario",
                "anonymous_id": "anon-abc-123",
                "user_id": "user-456",
                "event": "button_clicked",
                "name": "",
                "properties": "{\"button\":\"checkout\"}",
                "traits": "",
                "context": "{\"scenarioId\":\"my-scenario\",\"page\":\"/cart\"}",
                "message_id": "msg-001",
                "timestamp": "2026-01-15 10:01:00"
            },
            {
                "type": "page",
                "scenario_id": "my-scenario",
                "anonymous_id": "anon-abc-123",
                "user_id": "",
                "event": "",
                "name": "Checkout Page",
                "properties": "{\"url\":\"/checkout\"}",
                "traits": "",
                "context": "{\"scenarioId\":\"my-scenario\"}",
                "message_id": "msg-002",
                "timestamp": "2026-01-15 10:02:00"
            }
        ],
        "per_page": 50,
        "current_page": 1,
        "has_more_pages": false
    }
}
```

### Sample Response With Experiments

```json
{
    "clickstream": {
        "data": [
            {
                "type": "event",
                "scenario_id": "my-scenario",
                "anonymous_id": "anon-abc-123",
                "user_id": "",
                "event": "button_clicked",
                "name": "",
                "properties": "{\"button\":\"checkout\"}",
                "traits": "",
                "context": "{\"scenarioId\":\"my-scenario\"}",
                "message_id": "msg-001",
                "timestamp": "2026-01-15 10:01:00"
            }
        ],
        "per_page": 50,
        "current_page": 1,
        "has_more_pages": false
    },
    "experiments": [
        {
            "scenario_id": "my-scenario",
            "flag_name": "onboarding_flow_v2",
            "anonymous_user_id": "anon-abc-123",
            "chatbot_user_id": "",
            "variant_assigned": "variant_a",
            "evaluation_context": {},
            "reason": "RULE_MATCH",
            "created_at": "2026-01-15 10:00:00"
        }
    ]
}
```

### Sample Empty Response

When no records match the given filters:

```json
{
    "clickstream": {
        "data": [],
        "per_page": 50,
        "current_page": 1,
        "has_more_pages": false
    }
}
```

### Sample Validation Error Response

Request missing the required `scenario_id`:

```json
{
    "message": "The scenario id field is required.",
    "errors": {
        "scenario_id": [
            "The scenario id field is required."
        ]
    }
}
```

Request where `end_date` is before `start_date`:

```json
{
    "message": "The end date must be a date after or equal to start date.",
    "errors": {
        "end_date": [
            "The end date must be a date after or equal to start date."
        ]
    }
}
```

## Pagination

This endpoint uses **simple pagination** — it does not return a total record count, which avoids expensive count queries on large datasets.

1. Make an initial request with the desired `per_page` value (defaults to `50`, maximum `1000`).
2. The response includes `has_more_pages` (boolean) to indicate if more data exists.
3. To fetch subsequent pages, increment the `page` query parameter (e.g. `page=2`, `page=3`).
4. Continue until `has_more_pages` is `false`.

### Example: Iterating Through Pages

**First request:**

```
GET /public/api/analytics-data-export?scenario_id=my-scenario&per_page=100
```

Response includes `"current_page": 1, "has_more_pages": true`.

**Second request:**

```
GET /public/api/analytics-data-export?scenario_id=my-scenario&per_page=100&page=2
```

Response includes `"current_page": 2, "has_more_pages": true`.

**Third (final) request:**

```
GET /public/api/analytics-data-export?scenario_id=my-scenario&per_page=100&page=3
```

Response includes `"current_page": 3, "has_more_pages": false` — all records have been retrieved.

## Rate Limiting

This endpoint is rate-limited. If you exceed the limit, the API returns a `429 Too Many Requests` response. Wait before retrying.

