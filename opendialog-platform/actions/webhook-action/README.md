# Webhook action

{% hint style="success" %}
This is the recommended way to call an external API with OpenDialog.
{% endhint %}

Webhook actions allows you to make calls to an external APIs via HTTP protocol.&#x20;

You can create new webhook action by visiting your scenario -> Integreate -> Actions -> Create webhook integration:

<div><figure><img src="../../../.gitbook/assets/image (2).png" alt="" width="188"><figcaption></figcaption></figure> <figure><img src="../../../.gitbook/assets/image (1) (1).png" alt="" width="375"><figcaption></figcaption></figure></div>

## Configuring webhook action

### Overview

<figure><img src="../../../.gitbook/assets/image (2) (1).png" alt=""><figcaption><p>New webhook page</p></figcaption></figure>

1. **Action Name**: Enter a descriptive action name.
2. **Description** (optional): Add contextual information to clarify the function and necessity of this action.
3. **HTTP Verb Selection**: Choose an HTTP method for the URL (GET, POST, PUT, DELETE, PATCH).
4. **URL**: Enter the complete URL, including the scheme, domain, path, and parameters.
5. **Headers**: Specify the headers to send with your request.
6. **Request Body**: Set up the request payload if required. Currently only `application/json` is supported (the `Content-Type: application/json` header is added automatically).
7. **Response**: Define how to process response payload. Only mapping for `application/json` responses is supported for now.
8. **Testing Panel**: You can test your webhook once the name, method, and URL are configured.

### Basic configuration

<figure><img src="../../../.gitbook/assets/image (3).png" alt=""><figcaption><p>Example of basic configurations of webhook action</p></figcaption></figure>

* **Name**
  * Required;
  * Up to 60 characetrs;
* **Description**
  * Optional;
  * Up to 120 characters;
* **HTTP Method**
  * Single-choice select with options GET, POST, PUT, DELETE, PATCH
* **URL**
  * Must be a valid URL to your API resource
  * It supports OD attribute syntax [like in messages](../../conversation-designer/message-design/using-attributes-in-messages.md) with context and filters. You can use it to parametrise host name, path segment or query parameters. Resulting value is automatically URL encoded. Fore example:\
    `https://yourapi.com/api/{api_version}/users?userId={user_id}`

### Headers configuration

<figure><img src="../../../.gitbook/assets/image (4).png" alt=""><figcaption><p>Example of headers configuration of webhook action</p></figcaption></figure>

Configure key-value pairs for your headers. Value field also supports the OD attribute syntax, allowing users to insert dynamically resolved data into the header value, offering powerful flexibility for authentication, correlation tracking, or transmitting system-specific metadata within the webhook call.

### Request configuration

<figure><img src="../../../.gitbook/assets/image (5).png" alt=""><figcaption><p>Example of payload configuration for webhook action </p></figcaption></figure>

Put a JSON payload which should be sent with your request.&#x20;

OD attribute syntax is supported, but you have to put them in double-quotes.

{% columns %}
{% column %}
:white\_check\_mark: Do

```json
{
    "firstName": "{first_name}"
}
```


{% endcolumn %}

{% column %}
:x: Don't

```
{
    "firstName": {first_name}
}
```
{% endcolumn %}
{% endcolumns %}

Attribute types are preserved when the action is executing, so your number, boolean etc. attributes will be sent accordingly.

### Response configuration

<figure><img src="../../../.gitbook/assets/image (601).png" alt=""><figcaption><p>Example of response configuration for webhook action</p></figcaption></figure>

In the "Status and Response Mapping" section, configure how to store and map output from the webhook. Each mapping is grouped by status code categories:

* **1xx**: Status codes from 100 to 199;
* **2xx**: Status codes from 200 to 299;
* **3xx**: Status codes from 300 to 399;
* **4xx**: Status codes from 400 to 499;
* **5xx**: Status codes from 500 to 599.

Within each group, configure the following individually:

**action\_success**

Determines what constitutes a successful execution of your action. This sets the attribute `<action_name>_action_success`.

Value must be set to one of the following:

* `TRUE`
* `FALSE`
* JMESPath expression pointing to a boolean property from a JSON payload.

Default values:

* `TRUE` for groups 1xx, 2xx, 3xx;
* `FALSE` for groups 4xx, 5xx.

{% hint style="info" %}
Note: Webhook actions will not automatically follow redirects in response to 3xx status codes.
{% endhint %}

**Output attribute mapping**

Under the `action_success` mapping, you can specify output attributes for your webhook action. These attributes are populated into the `user` context by default and can be accessed in your conversation design using the `{attribute_name}` or `{user.attribute_name}` syntax.&#x20;

For a simple use case, just put the property name from your response JSON next to the desired OD attribute name. To store a nested property, use dot notation (e.g., `user.profile.name`).&#x20;

For more complex mapping and response transformations, use [JMESPath](using-jmespath-expressions.md).

**Store raw response**

You can store the whole response as a string by toggling "Store raw response" and selecting a string attribute to contain this value.

### Testing your webhook

<figure><img src="../../../.gitbook/assets/image (602).png" alt=""><figcaption><p>Use testing panel on the left to run a test for your webhook</p></figcaption></figure>

Once you fill in your action name, URL, and HTTP method, the testing panel will become available, allowing you to run a test execution of your action.

**Inputs block**

<figure><img src="../../../.gitbook/assets/image (603).png" alt="" width="372"><figcaption></figcaption></figure>

Any input attributes in the URL, headers, and request body sections will become available to fill in. These temporary values will be used during your tests.

**Outputs & Attributes block**

<figure><img src="../../../.gitbook/assets/image (604).png" alt="" width="373"><figcaption></figcaption></figure>

You can see if your action worked as expected in the Outputs section. A green check will indicate if the action was executed successfully, and the response status code will be displayed next to it. In the Attributes section, you will see three default output attributes plus any output attributes you've defined in the "Response" tab:

* `<action_name>_action_success`: A true/false value indicating whether your action was successful or not. You can customise this value in the "Response" tab for each status code group.
* `action_success`: Same as above; this is a reusable default attribute which will be overridden by the next action you have in your actions pipeline.
* `<action_name>_status_code`: An integer value with the HTTP response status code.

**Response block**

<div><figure><img src="../../../.gitbook/assets/image (605).png" alt="" width="374"><figcaption></figcaption></figure> <figure><img src="../../../.gitbook/assets/image (606).png" alt=""><figcaption></figcaption></figure></div>

Use this section to view detailed information about your response, including exact values of your headers, URL, and body that were sent. Additionally, it shows the response headers and raw response body received by the webhook.

Use the pop-out icon next to the "Response" section to view this in a full-page modal for more convenience.

## Authentication configuration

Webhook V2 Actions support three authentication methods: **Header Authentication**, **Mutual TLS (mTLS)**, and **OAuth2 Client Credentials**. Authentication is configured per webhook action, within the action configuration itself.

<figure><img src="../../../.gitbook/assets/authentication_selection.png" alt="Authentication method selection showing Header, mTLS, and OAuth2 options"><figcaption><p>Select an authentication method for your webhook action</p></figcaption></figure>

{% hint style="info" %}
All authentication methods are **secret-aware**. You can reference secrets from the [Secret Context](../../../core-concepts/contexts-and-attributes/secret-context.md) using `{secret.your_secret_name}` in your authentication configuration. Secret values are automatically decrypted during authentication and never appear in logs.
{% endhint %}

### Header Authentication

Header Authentication lets you build dynamic authentication headers for your webhook requests. It supports two configuration blocks:

- **`variables`**: A JSON object of named values that are resolved lazily and can reference each other, OD attributes, and built-in `_auth` values.
- **`headers`**: A JSON object of header key-value pairs to be added to the request.

Both blocks support the full OD attribute syntax, including `_auth` context references, `_webhook` context references (for request body or URL), and standard user/global/secret attributes.

<figure><img src="../../../.gitbook/assets/authenticaton_headers.png" alt="Header Authentication configuration"><figcaption><p>Header Authentication configuration</p></figcaption></figure>

#### Using secrets in headers

Header Authentication is secret-aware — you can reference secrets from the [Secret Context](../../../core-concepts/contexts-and-attributes/secret-context.md) in your header values and variables. When the authentication executes, secret values are automatically decrypted and included in the outgoing request.

{% hint style="warning" %}
Secrets can only be decrypted within Webhook V2 authentication configurations. If you reference a secret attribute outside of authentication (for example, in a message template or the webhook URL), the value will appear as `••••••••`.
{% endhint %}

#### Example: API key from the Secret Context

```json
{
  "headers": {
    "Authorization": "Bearer {secret.api_key}",
    "X-Request-ID": "{_auth.uuid}"
  }
}
```

#### Built-in \_auth variables

The following variables are automatically available in every Header Authentication configuration without any setup:

| Variable              | Description                                  |
| --------------------- | -------------------------------------------- |
| `{_auth.uuid}`        | A unique UUID generated per request          |
| `{_auth.timestamp}`   | Current Unix timestamp in seconds            |
| `{_auth.timestamp_micro}` | Current Unix timestamp in microseconds   |

#### Variable chaining

Variables in the `variables` block can reference other variables defined in the same block, enabling you to build up values step by step. Resolution is lazy — each variable is only resolved when it is needed.

#### Example: HMAC signature with a secret

```json
{
  "variables": {
    "secret": "{secret.hmac_signing_key}",
    "signature": "hmac-sha256({_webhook.body}, {_auth.secret})"
  },
  "headers": {
    "X-Request-ID": "{_auth.uuid}",
    "X-Signature": "{_auth.signature}",
    "X-Timestamp": "{_auth.timestamp}"
  }
}
```

### Mutual TLS (mTLS) Authentication

mTLS authentication establishes a two-way TLS handshake between OpenDialog and your API. You provide a client certificate which is presented to the server during the TLS negotiation.

<figure><img src="../../../.gitbook/assets/authentication_mtls.png" alt="mTLS Authentication configuration"><figcaption><p>mTLS Authentication configuration</p></figcaption></figure>

**Configuration fields:**

| Field              | Required | Description                                                            |
| ------------------ | -------- | ---------------------------------------------------------------------- |
| Certificate        | Yes      | A certificate attribute from the Secret Context (e.g. `{secret.my_cert}`) |
| Password           | Yes      | The password for the certificate — can be a secret (e.g. `{secret.cert_password}`) |
| CA Certificate     | No       | Base64-encoded PEM CA certificate for verifying the server certificate |

mTLS is secret-aware. The **Certificate** field expects a reference to a certificate stored in the [Secret Context](../../../core-concepts/contexts-and-attributes/secret-context.md). Certificates can be uploaded in P12, PFX, PEM, CER, CRT, or KEY formats. The **Password** field can also reference a secret, keeping your certificate passphrase protected.

#### Example: using certificates and secrets from the Secret Context

```
Certificate: {secret.mtls_certificate}
Password:    {secret.cert_password}
CA Cert:     {global.mtls_ca_cert}
```

{% hint style="info" %}
To learn how to upload certificates and create secrets, see the [Secret Context](../../../core-concepts/contexts-and-attributes/secret-context.md) documentation.
{% endhint %}

### OAuth2 Client Credentials

OAuth2 Client Credentials authentication is designed for server-to-server integrations where your webhook needs to authenticate with an OAuth2-protected API. It implements the [OAuth2 Client Credentials Grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.4), which exchanges a client ID and client secret for an access token.

<figure><img src="../../../.gitbook/assets/oauth2 config.png" alt="OAuth2 Client Credentials configuration showing token URL, client ID, client secret with a secret reference, and scope"><figcaption><p>OAuth2 Client Credentials configuration</p></figcaption></figure>

**Configuration fields:**

| Field         | Required | Supports secrets | Description                                          |
| ------------- | -------- | ---------------- | ---------------------------------------------------- |
| Token URL     | Yes      | No               | The OAuth2 token endpoint URL                        |
| Client ID     | Yes      | No               | Your application's client identifier                 |
| Client Secret | Yes      | Yes              | Your application's client secret — can be a secret attribute (e.g. `{secret.oauth_client_secret}`) |
| Scope         | No       | No               | Space-separated list of scopes to request            |

#### How it works

When your webhook action executes:

1. OpenDialog sends a token request to the **Token URL** with the client credentials
2. The token endpoint returns an access token
3. OpenDialog adds the token as a `Bearer` token in the `Authorization` header of your webhook request

#### Token caching

To avoid requesting a new token on every webhook call, OpenDialog automatically caches access tokens. Cached tokens are reused across follow-up calls to the same API. When a cached token is close to expiring, OpenDialog will request a fresh one.

{% hint style="info" %}
Each unique combination of client credentials and scope gets its own cached token. If you change the client ID, client secret, or scope, a new token will be requested.
{% endhint %}

#### Example

```
Token URL:     https://auth.example.com/oauth2/token
Client ID:     {global.oauth_client_id}
Client Secret: {secret.oauth_client_secret}
Scope:         api.read api.write
```

## Using your webhook in conversation

Once you've saved your webhook action, it will appear on the "Actions" page. For convenience, a small chip with the HTTP method will be displayed in the bottom-left corner of the action card. Legacy webhook actions will be displayed with the subtitle "Legacy Webhook Action" and can be used as usual.

<figure><img src="../../../.gitbook/assets/image (607).png" alt=""><figcaption></figcaption></figure>

Attach your webhook action as usual to an intent in the conversation designer.

<figure><img src="../../../.gitbook/assets/image (608).png" alt=""><figcaption></figcaption></figure>

When the conversation reaches this intent, all your defined actions will be executed.









































