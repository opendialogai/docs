# Experiments Evaluations API

## Overview

The Experiments Evaluations API allows third-party applications to retrieve feature-flag evaluation data from OpenDialog. Each evaluation record captures which variant a user was assigned for a given feature flag within a scenario, along with the reason for that assignment.

This is useful for exporting A/B testing and feature-flag analytics data to external systems for further analysis and reporting.

## Endpoint

**GET** `{base_url}/public/api/flag-evaluations`

`{base_url}` is the fully qualified domain name of your OpenDialog workspace. For example:

```
https://your-workspace.cloud.opendialog.ai/public/api/flag-evaluations
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

| Parameter    | Type    | Required | Description                                                                                                      |
|--------------|---------|----------|------------------------------------------------------------------------------------------------------------------|
| `scenario_id`| string  | **Yes**  | The ID of the scenario to retrieve flag evaluations for.                                                          |
| `start_date` | string  | No       | Filter evaluations created on or after this date. Format: `YYYY-MM-DD` (e.g. `2026-01-01`).                       |
| `end_date`   | string  | No       | Filter evaluations created on or before this date. Must be equal to or after `start_date`. Format: `YYYY-MM-DD`.  |
| `per_page`   | integer | No       | Number of records per page. Minimum: `1`, maximum: `1000`. Default: `500`.                                        |
| `page`       | integer | No       | Page number to retrieve. Minimum: `1`. Default: `1`.                                                              |

### Example Request

```
GET https://your-workspace.cloud.opendialog.ai/public/api/flag-evaluations?scenario_id=my-scenario&start_date=2026-01-01&end_date=2026-01-31&per_page=100
```

```bash
curl -X GET \
  "https://your-workspace.cloud.opendialog.ai/public/api/flag-evaluations?scenario_id=my-scenario&start_date=2026-01-01&end_date=2026-01-31&per_page=100" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer {access_token}"
```

## Response

### HTTP Status Codes

| Code | Description                                                                                     |
|------|-------------------------------------------------------------------------------------------------|
| 200  | **Success.** The response body contains the requested flag evaluation data.                     |
| 401  | **Unauthorized.** The request does not include a valid access token.                            |
| 422  | **Unprocessable Entity.** Validation failed — check the request parameters (see error response).|
| 429  | **Too Many Requests.** Rate limit exceeded. Wait and retry.                                     |

### Response Body

The response uses **offset-based pagination**. Each page contains a `data` array and pagination metadata.

### Response Fields — `data[]`

| Field                | Type           | Description                                                                                  |
|----------------------|----------------|----------------------------------------------------------------------------------------------|
| `scenario_id`        | string         | The scenario this evaluation belongs to.                                                     |
| `flag_name`          | string         | The name of the feature flag that was evaluated.                                             |
| `anonymous_user_id`  | string         | The anonymous identifier of the user who received the evaluation.                            |
| `chatbot_user_id`    | string         | The chatbot user ID mapped to this anonymous user (empty string if no mapping exists).       |
| `variant_assigned`   | string         | The variant the user was assigned (e.g. `control`, `variant_a`).                             |
| `evaluation_context` | object or array| Contextual data that was present at the time of evaluation.                                  |
| `reason`             | string         | The reason for the variant assignment (e.g. `RULE_MATCH`, `DEFAULT`).                        |
| `created_at`         | string         | ISO 8601 timestamp of when the evaluation was recorded.                                      |

### Pagination Fields

| Field            | Type        | Description                                                              |
|------------------|-------------|--------------------------------------------------------------------------|
| `current_page`   | integer     | The current page number.                                                 |
| `last_page`      | integer     | The last available page number.                                          |
| `per_page`       | integer     | The number of records per page.                                          |
| `total`          | integer     | The total number of records matching the query.                          |
| `from`           | integer|null| The index of the first record on the current page (`null` if empty).     |
| `to`             | integer|null| The index of the last record on the current page (`null` if empty).      |
| `path`           | string      | The base URL of the endpoint.                                            |
| `first_page_url` | string      | Full URL to fetch the first page.                                        |
| `last_page_url`  | string      | Full URL to fetch the last page.                                         |
| `next_page_url`  | string|null | Full URL to fetch the next page. `null` when on the last page.           |
| `prev_page_url`  | string|null | Full URL to fetch the previous page. `null` when on the first page.      |

### Sample Success Response

```json
{
    "data": [
        {
            "scenario_id": "my-scenario",
            "flag_name": "onboarding_flow_v2",
            "anonymous_user_id": "anon-abc-123",
            "chatbot_user_id": "chatbot-user-456",
            "variant_assigned": "control",
            "evaluation_context": {
                "key": "value"
            },
            "reason": "RULE_MATCH",
            "created_at": "2026-01-15T12:00:00.000000Z"
        },
        {
            "scenario_id": "my-scenario",
            "flag_name": "onboarding_flow_v2",
            "anonymous_user_id": "anon-def-789",
            "chatbot_user_id": "",
            "variant_assigned": "variant_a",
            "evaluation_context": {},
            "reason": "DEFAULT",
            "created_at": "2026-01-15T14:30:00.000000Z"
        }
    ],
    "current_page": 1,
    "last_page": 1,
    "per_page": 500,
    "total": 2,
    "from": 1,
    "to": 2,
    "path": "https://your-workspace.cloud.opendialog.ai/public/api/flag-evaluations",
    "first_page_url": "https://your-workspace.cloud.opendialog.ai/public/api/flag-evaluations?page=1",
    "last_page_url": "https://your-workspace.cloud.opendialog.ai/public/api/flag-evaluations?page=1",
    "next_page_url": null,
    "prev_page_url": null
}
```

### Sample Empty Response

When no evaluations match the given filters:

```json
{
    "data": [],
    "current_page": 1,
    "last_page": 1,
    "per_page": 500,
    "total": 0,
    "from": null,
    "to": null,
    "path": "https://your-workspace.cloud.opendialog.ai/public/api/flag-evaluations",
    "first_page_url": "https://your-workspace.cloud.opendialog.ai/public/api/flag-evaluations?page=1",
    "last_page_url": "https://your-workspace.cloud.opendialog.ai/public/api/flag-evaluations?page=1",
    "next_page_url": null,
    "prev_page_url": null
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

This endpoint uses **offset-based pagination** for paging through large datasets.

1. Make an initial request with the desired `per_page` value (defaults to `500`, maximum `1000`).
2. If the response contains a non-null `next_page_url`, increment the `page` query parameter in the next request.
3. Repeat until `next_page_url` is `null` (i.e. `current_page` equals `last_page`), indicating that all records have been retrieved.

### Example: Iterating Through Pages

**First request (page 1):**

```
GET /public/api/flag-evaluations?scenario_id=my-scenario&per_page=100
```

**Second request (page 2):**

```
GET /public/api/flag-evaluations?scenario_id=my-scenario&per_page=100&page=2
```

Continue incrementing `page` until `next_page_url` is `null`.

## Rate Limiting

This endpoint is rate-limited. The default limit is **30 requests per minute** per authenticated user and IP address combination. If you exceed this limit, the API returns a `429 Too Many Requests` response. Wait before retrying.

