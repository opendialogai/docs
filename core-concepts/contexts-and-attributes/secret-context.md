---
description: >-
  Store and manage sensitive information like API keys, passwords, and
  certificates securely within OpenDialog.
---

# Secret Context

The Secret Context is a secure, centralised store for sensitive information that your AI agent needs to interact with external services. It's designed to hold values that should never be exposed in logs, messages, or debugging tools — such as API keys, passwords, signing keys, and client certificates.

## Why use the Secret Context?

When integrating with 3rd party APIs, you'll often need to provide credentials like API keys, OAuth client secrets, or client certificates. The Secret Context gives you a dedicated, secure place to store these values with built-in protections:

- **Encryption at rest** — All secret values are encrypted in the database
- **Automatic masking** — Secrets appear as `••••••••` in logs, messages, and debug outputs
- **Controlled decryption** — Secret values are only decrypted where they're needed: within Webhook V2 authentication configurations

{% hint style="info" %}
The Secret Context is different from the [Global Context](contexts.md#global-context). While global attributes are useful for non-sensitive configuration values (like company names or feature flags), the Secret Context is specifically designed for credentials and other sensitive data that must be protected.
{% endhint %}

## Managing secrets

You can manage secrets through the OpenDialog admin interface. Navigate to the Secret Management page (accessed from the 3 dot menu by your username in the sidebar) to view, create, and manage your secrets.

<figure><img src="../../.gitbook/assets/secret managemnet.png" alt="Secret Management page showing a list of secrets and certificates with their types, dates, and expiration"><figcaption><p>The Secret Management page shows all your stored secrets and certificates</p></figcaption></figure>

### Access control

Access to the Secret Context is restricted based on user role:

| Role    | Access                                                              |
| ------- | ------------------------------------------------------------------- |
| Admin   | Full access — can create, edit, and delete secrets and certificates |
| Editor  | Can view a list of secret names only                                |
| Others  | No access — the Secret Context is not visible                       |

{% hint style="info" %}
For more information on user roles, see [Managing Users](../../core-concepts/the-opendialog-workspace/opendialog-account-management/create-and-manage-users.md).
{% endhint %}

### Adding a secret string

Secret strings are for storing sensitive text values like API keys, passwords, and tokens.

{% stepper %}
{% step %}
### Navigate to the Secret Context

Open the Secret Management page from the three-dot menu next to your username in the sidebar.
{% endstep %}
{% step %}
### Create a new entry

Click the button to add a new secret and select **Secret String** as the type.
{% endstep %}
{% step %}
### Enter the details

- **Name** — A descriptive name for your secret (e.g. `api_key`, `hmac_signing_key`). This is how you'll reference it: `{secret.api_key}`
- **Value** — The sensitive value to store. Once saved, this value will be encrypted and won't be visible again.
{% endstep %}
{% step %}
### Save

Save your secret. It's now available to use in your Webhook V2 authentication configurations.
{% endstep %}
{% endstepper %}


### Adding a certificate

Certificates are for storing client certificates used in mTLS authentication. OpenDialog supports multiple certificate formats: P12, PFX, PEM, CER, CRT, and KEY.

{% stepper %}
{% step %}
### Navigate to the Secret Context

Open the Secret Management page from the three-dot menu next to your username in the sidebar.
{% endstep %}
{% step %}
### Create a new entry

Click the button to add a new secret and select **Certificate** as the type.
{% endstep %}
{% step %}
### Upload your certificate

- **Name** — A descriptive name (e.g. `mtls_certificate`). This is how you'll reference it: `{secret.mtls_certificate}`
- **Certificate file** — Upload your certificate file (P12, PFX, PEM, CER, CRT, or KEY format)
- **Password** — If your certificate is password-protected (e.g. P12/PFX files), select an existing secret string from the Secret Context that holds the password. You'll need to create the password as a secret string first.
{% endstep %}
{% step %}
### Review and save

After uploading, OpenDialog extracts and displays certificate metadata including the fingerprint, subject, and expiration date. Review these details and save.
{% endstep %}
{% endstepper %}

<figure><img src="../../.gitbook/assets/certificate management.png" alt="Certificate detail page showing metadata including format, fingerprint, subject CN, expiration date, and validity status"><figcaption><p>Certificate detail view showing extracted metadata</p></figcaption></figure>

## Using secrets in webhook authentication

Secrets are referenced using the syntax `{secret.your_secret_name}` within Webhook V2 authentication configurations. Here's how they work with each authentication method.

### In Header Authentication

Use secrets as header values or in authentication variables:

```json
{
  "variables": {
    "signing_key": "{secret.hmac_signing_key}",
    "signature": "hmac-sha256({_webhook.body}, {_auth.signing_key})"
  },
  "headers": {
    "Authorization": "Bearer {secret.api_key}",
    "X-Signature": "{_auth.signature}"
  }
}
```

### In mTLS Authentication

Reference a certificate and its password from the Secret Context:

```
Certificate: {secret.mtls_certificate}
Password:    {secret.cert_password}
```

### In OAuth2 Client Credentials

Use a secret for the client secret field:

```
Token URL:     https://auth.example.com/oauth2/token
Client ID:     {global.oauth_client_id}
Client Secret: {secret.oauth_client_secret}
Scope:         api.read api.write
```

## Security model

{% hint style="warning" %}
Secret values can **only** be decrypted within Webhook V2 authentication configurations — Header Authentication, mTLS, and OAuth2. This is by design. If you reference a secret outside of these contexts (for example, in a message template, a condition, or the webhook URL or body), the value will appear as `••••••••`.
{% endhint %}

This controlled decryption model means:

- **Secrets in authentication headers** — Decrypted and sent as plaintext to the target API
- **Secrets in message templates** — Displayed as `••••••••` (masked)
- **Secrets in webhook URL or body** — Displayed as `••••••••` (masked)
- **Secrets in logs** — Always displayed as `••••••••` (masked)

This ensures that sensitive values are only ever exposed where they're genuinely needed — in the outgoing HTTP request to your API.

## Related pages

{% content-ref url="contexts.md" %}
[contexts.md](contexts.md)
{% endcontent-ref %}

{% content-ref url="about-attributes.md" %}
[about-attributes.md](about-attributes.md)
{% endcontent-ref %}

{% content-ref url="../../../opendialog-platform/actions/webhook-action/" %}
[Webhook action](../../../opendialog-platform/actions/webhook-action/)
{% endcontent-ref %}
