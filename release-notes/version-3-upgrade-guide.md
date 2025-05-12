# Version 3 Upgrade Guide

The latest release of OpenDialog introduces new security features and updates several Webchat API endpoints that may require action on your part. This page outlines what’s changed and helps you decide if you need to do anything.

### What has changed

The changes fall into two categories:

1. **API definition updates**
2. **Configurable security features** you can enable for existing scenarios

> **NB:** If you use the OpenDialog Webchat widget or the ChatUI SDK, no changes are required. Only custom applications that call the OpenDialog Chat API directly will be affected.

### Schedule

We’ve split the updates into two releases to give you time to adapt:

* **2.17.0 “Jabbah”** — 22 May 2025
  * Supports both old and new API endpoints
  * Does _not_ include security features
* **3.0.0 “Jishui”** — 12 June 2025
  * Removes old-style Chat API endpoints
  * Enforces new required headers (see below)

### API changes

> **Note:** Only direct Chat API integrations are affected. Webchat embeds and ChatUI SDK users can ignore these changes.

#### 1. Updated endpoint names

You must update your application calls as follows (request bodies and parameters are unchanged):

| Old endpoint                   | New endpoint              |
| ------------------------------ | ------------------------- |
| `/incoming/chatApi`            | `/chat-api/message`       |
| `/chatApi-config`              | `/chat-api/configuration` |
| `/user/{user_id}/history`      | `/chat-api/history`       |
| `/user/{user_id}/history/file` | `/chat-api/transcript`    |

#### 2. New required headers

All Chat API calls now require two headers. Missing headers will trigger HTTP 422 responses with error details.

* `OPENDIALOG-USER-ID`
* `OPENDIALOG-SCENARIO-ID`

(The request body stays the same; for `/chat-api/message` you still need `selected_scenario`, `author` and `user_id` in the JSON.)

#### 3. Mandatory authorization header

Starting in **3.0.0**, every Chat API endpoint must include the same authorization header used by `/incoming/chatApi`. By default (unless you enable additional security options), this is your `appKey` as documented in the Chat API guide.

***

### Security Features (v3.0.0+)

Starting in **3.0.0**, we’re rolling out several opt-in security controls across all Chat API endpoints to tighten up your users’ interactions with OpenDialog. See **Security Settings** on the Webchat Interface Settings page for full details.

> **Note:**
>
> * **Existing** scenarios must opt in per feature.
> * **New** scenarios have these enabled by default.
> * This guide is split by integration type. If you’re unsure which applies, contact support.

***

#### 1. Embedded Webchat Widget

If you embed via the snippet on the Webchat Interface Settings page:

* **CORS**\
  When enabled, whitelist **all** page URLs hosting the widget by adding them in the security settings tab in Webchat interface settings&#x20;
* **Anonymous auth & CSRF**\
  Handled automatically by the widget; no action needed.

***

#### 2. ChatUI SDK

For applications built with the OpenDialog ChatUI SDK:

1. **CORS**\
   Whitelist your page URLs when CORS protection is turned on by adding them in the security settings tab in Webchat interface settings
2. **CSRF**
   * Requires browser-accessible cookies.
   * You must map a **custom domain** to your OpenDialog tenant.  To set this up, please coordinate DNS + tenant mapping with OpenDialog support
   * We recommend leaving CSRF **off** during development whilst any custom domain mapping is set up

***

#### 3. Direct Chat API Integration

If you call the Chat API directly, update your code as follows:

**a) Anonymous Authentication**

* On first request, the API returns a per-user JWT in a cookie named\
  `opendialog_anonymous_authentication_token`.
* **All subsequent requests** must include that cookie.

**b) Anti-CSRF**

* CSRF is a browser-only threat. Disable it in your scenario settings if you aren’t in a browser context.

**c) CORS**

* Browser-only protection. Ignore for server-to-server integrations.

***

### Python Example: Managing the Anonymous-Auth Cookie

```python
import requests

# 1) Start a session so cookies persist
session = requests.Session()

# 2) First call: receive anonymous-auth cookie
first_resp = session.post(
    "https://your-tenant.cloud.opendialog.ai/chat-api/message",
    json={
        ...
    }
)
first_resp.raise_for_status()

# Cookie 'opendialog_anonymous_authentication_token' is now stored

# 3) Subsequent calls auto-include the cookie
followup_resp = session.post(
    "https://your-tenant.cloud.opendialog.ai/chat-api/message",
    json={
        ...
    }
)
followup_resp.raise_for_status()

print("Bot replied:", followup_resp.json())
```

If you need to manually handle the cookie, you can grab it from the session as follows

```python
token = session.cookies["opendialog_anonymous_authentication_token"]
resp = requests.post(
    "https://your-tenant.cloud.opendialog.ai/chat-api/message",
    json=payload,
    cookies={"opendialog_anonymous_authentication_token": token}
)

```





