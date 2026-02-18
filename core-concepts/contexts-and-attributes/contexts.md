# Contexts

## What are contexts in OpenDialog?

Contexts are _information stores_ that hold attributes during a conversation. They provide a consistent way for OpenDialog to read and write data across different parts of the conversation engine — from message templates and conditions to actions and authentication.

Think of contexts as different "scopes" of memory. Some persist forever, some last only for the current turn, and some are read-only snapshots of what's happening right now.

## What type of contexts can you use?

OpenDialog supports the following contexts. Here's a quick reference:

| Context | Scope | Read/write | Notes |
| ------- | ----- | ---------- | ----- |
| `user` | Persistent | Read/write | Default context; data survives across all sessions |
| `global` | Persistent | Read-only | Workspace-wide values, managed via the UI |
| `conversation` | Per-request, from persistent state | Read-only | Reflects current position in the conversation flow |
| `history` | Per-request, from persistent data | Read-only | Transcript, intents, and utterances built from stored messages |
| `message_history` | Per-request, from persistent data | Read-only | Full formatted message history for the user across all sessions |
| `session` | Per-request, in-memory | Read/write | Lost after each turn; not persisted |
| `interpretation` | Per-request, in-memory | Read-only | Moderation results from the Language Service |
| `_intent` | Per-intent evaluation | Read-only | Attributes from the intent currently being evaluated |
| `_webhook` | Per-webhook execution | Read-only | Outgoing request data for the current Webhook V2 Action |
| `_auth` | Per-authentication execution | Read-only | Variables for resolving authentication headers |

#### user

The `user` context is the primary store for persistent data about each user. Attributes stored here survive across multiple conversations and sessions — they stay with the user until explicitly changed.

- **Reference:** `{user.attribute_name}`
- **Persistence:** Stored in the database — survives across sessions and conversations
- **Read/write:** Read and write

The `user` context is the default. If an attribute reference doesn't include a context prefix — for example `{first_name}` rather than `{user.first_name}` — OpenDialog will resolve it against the `user` context.

{% hint style="info" %}
Use the `user` context to remember things about your users over time — their name, preferences, or answers they've already given. This avoids asking them the same questions again in future sessions.
{% endhint %}

**Common uses:**

- Storing a customer's name after they've introduced themselves
- Remembering a user's preferred contact method or language
- Tracking whether a user has completed onboarding or accepted terms

---

#### session

The `session` context is an in-memory store valid only for a single request-response exchange. Once the turn is complete, session attributes are gone.

- **Reference:** `{session.attribute_name}`
- **Persistence:** Not persisted — lost after each request
- **Read/write:** Read and write

OpenDialog uses the session context internally to pass data between components within a single turn — for example, to carry interpreter results so they can be embedded in a message template.

{% hint style="info" %}
Use the `session` context for temporary data that's only relevant to the current turn — intermediate values, flags that control message logic, or data from a webhook that you don't need to keep long-term.
{% endhint %}

**Common uses:**

- Temporarily holding a value returned by a webhook instead of writing it to the `user` context
- Storing NLU interpreter results to use in a response message
- Passing data between actions that run within the same turn

{% hint style="warning" %}
Note - Session attributes do not persist beyond the current turn. If you need data to be available in a future conversation, save it to the `user` context instead.
{% endhint %}

---

#### global

The `global` context is a persistent, read-only store for workspace-wide values that apply across all scenarios. You manage it through the OpenDialog UI.

- **Reference:** `{global.attribute_name}`
- **Persistence:** Stored in the database — persists indefinitely
- **Read/write:** Read-only (managed via the UI)

{% hint style="success" %}
**To manage global context attributes:**

- Go to your workspace overview
- Select **Settings** from the left-hand navigation
- Choose **Global Contexts**
- Add, edit, or remove attributes as needed
{% endhint %}

**Common uses:**

- Company name or brand referenced across all messages
- A support phone number or email address used in multiple conversations
- Workspace-wide flags or configuration values

{% hint style="info" %}
Because global context values apply to all scenarios in a workspace, they're ideal for stable, shared information that would otherwise need to be duplicated in every scenario.
{% endhint %}

---

#### conversation

The `conversation` context is a read-only snapshot of where the user currently is within the conversation flow. It's re-computed on every turn.

- **Reference:** `{conversation.attribute_name}`
- **Persistence:** Not persisted — reflects the current turn only
- **Read/write:** Read-only

It contains the following attributes:

| Attribute | Description |
| --------- | ----------- |
| `current_conversation` | The conversation currently being processed |
| `current_scene` | The scene currently being processed |
| `current_turn` | The turn currently being processed |
| `current_intent` | The intent currently matched |
| `current_message_template` | The message template currently selected |

Each of these is a Conversation Object attribute and can be used with the `select` [filter](../../opendialog-platform/conversation-designer/message-design/using-attributes-in-messages.md#available-filters) to extract a specific field from the object.

**Filter examples:**

```
{conversation.current_intent | select name}
```
Returns the name of the intent currently matched — useful for including in webhook payloads or log messages.

```
{conversation.current_conversation | select name}
```
Returns the name of the conversation currently being processed.

```
{conversation.current_scene | select name}
```
Returns the name of the current scene.

**Common uses:**

- Including the current intent name in a webhook payload for logging or routing
- Conditionally showing a message based on which conversation the user is in
- Logging the user's position in the flow when they escalate to a human agent

---

#### history

The `history` context is a read-only store of the conversation so far within the current session. It gives you access to what the user has said and what the AI agent has responded with.

- **Reference:** `{history.attribute_name}`
- **Persistence:** Not persisted beyond the current session
- **Read/write:** Read-only

It contains the following attributes:

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| `transcript` | String | A full text transcript of the conversation so far |
| `intents` | String collection | All user and application intents in the conversation history |
| `utterances` | String collection | All user utterances and application messages so far |

The `intents` and `utterances` attributes are string collections and support the full range of [collection filters](../../core-concepts/contexts-and-attributes/attribute-filters.md).

**Filter examples:**

```
{history.utterances | where participant user}
```
Returns only the user's utterances, filtering out the AI agent's responses.

```
{history.intents | count}
```
Returns the total number of intents matched so far in the conversation.

```
{history.utterances | last}
```
Returns the most recent utterance or message in the conversation.

```
{history.intents | range -3 3}
```
Returns the last three intents — useful for providing recent context without the full history.

**Common uses:**

- Passing `{history.transcript}` to an LLM Action so it has full conversation context
- Checking whether a user has previously expressed a specific intent
- Including the conversation history in a handoff payload to a human agent

{% hint style="info" %}
The `history` context is especially powerful when working with LLM Actions. Passing `{history.transcript}` as part of a prompt gives the model the full context of what's been discussed, enabling more coherent and contextually appropriate responses.
{% endhint %}

---

#### message_history

The `message_history` context provides access to the user's complete message history across all their conversations — not just the current session. It queries the database directly, so it reflects everything the user has ever said and received.

- **Reference:** `{message_history.attribute_name}`
- **Persistence:** Persistent — reads from the database
- **Read/write:** Read-only

It contains the following attribute:

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| `all` | String | The full message history for the user, formatted as `Bot: ...\nUser: ...` |

{% hint style="info" %}
This is different from the `history` context, which only covers the current session. Use `message_history` when you need the user's full history across all past interactions.
{% endhint %}

**Common uses:**

- Providing complete conversation history to an LLM for long-running or multi-session interactions
- Including the full history in a handoff payload to a human agent

---

#### interpretation

The `interpretation` context is an ephemeral store populated by the Language Service interpreter when content moderation is triggered. It gives you access to moderation results so you can act on them in conditions or conversation routing.

- **Reference:** `{interpretation.attribute_name}`
- **Persistence:** Not persisted — cleared after each request
- **Read/write:** Read-only (populated internally by the Language Service)

It contains the following attributes:

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| `flagged_moderation` | Boolean | `true` if the user's utterance was flagged by content moderation |
| `flagged_moderation_categories` | Collection | The moderation categories that triggered the flag |

**Common uses:**

- Adding a condition to check `{interpretation.flagged_moderation}` before processing a user's request
- Routing flagged utterances to a different conversation path or escalating to a human agent

---

#### _intent

The `_intent` context is a read-only, transient store populated during condition evaluation on intents. When the conversation engine evaluates whether an intent matches, it populates `_intent` with the attributes that the interpreter placed on that intent — such as entities extracted from the user's utterance. It's refreshed for each intent being evaluated.

- **Reference:** `{_intent.attribute_name}`
- **Persistence:** Not persisted — refreshed for each intent evaluated
- **Read/write:** Read-only
- **Populated by:** ConversationEngine during intent condition checking

The attributes available in `_intent` depend on the interpreter in use. NLU interpreters typically set extracted entities; the OpenDialog interpreter sets form values and other structured input.

**Common uses:**

- Writing conditions on intents that reference extracted entities (e.g., a slot value from an NLU interpreter)
- Checking interpreter-specific attributes before confirming an intent match

---

#### _webhook

The `_webhook` context is a read-only, transient store that's automatically populated just before a Webhook V2 Action makes its HTTP request. It exposes the fully prepared request — after all attribute placeholders have been resolved — so that other parts of the request configuration (particularly authentication headers) can reference the outgoing call's own data.

- **Reference:** `{_webhook.attribute_name}`
- **Persistence:** Not persisted — cleared after each webhook execution
- **Read/write:** Read-only
- **Populated by:** Webhook V2 Actions, automatically

It contains the following attributes:

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| `url` | String | The fully prepared URL, including resolved query parameters |
| `body` | String | The request body as it will be sent |
| `method` | String | The HTTP method (e.g. `GET`, `POST`, `PUT`) |
| `headers` | Composite | The prepared request headers |
| `content_type` | String | The content type of the request (e.g. `application/json`) |
| `query_params` | Composite | The parsed query parameters from the URL |

The `headers` and `query_params` attributes are composite — you can access their nested values using bracket notation. For example:

- `{_webhook.headers['Authorization']}`
- `{_webhook.query_params['page']}`

{% hint style="warning" %}
Note - The `_webhook` context is only available during the execution of a Webhook V2 Action. It isn't accessible in message templates or other parts of the conversation flow.
{% endhint %}

**Common uses:**

- Referencing the request URL or body when building an authentication signature
- Including the HTTP method as part of a signed request header
- Composing authentication values that depend on what's actually being sent

{% hint style="info" %}
The `_webhook` context is designed to work alongside the `_auth` context. Because `_webhook` is populated _before_ authentication headers are resolved, your auth configuration can reference outgoing request data — such as the request body or URL — when computing signatures or tokens.
{% endhint %}

---

#### _auth

The `_auth` context is a read-only, transient store used when resolving authentication headers in Webhook V2 Actions. It's configured during the authentication flow of a Webhook V2 and supports defining intermediate variables that can reference other attributes — including each other and values from `_webhook` — making it straightforward to build multi-step authentication schemes.

- **Reference:** `{_auth.variable_name}`
- **Persistence:** Not persisted — cleared after each authentication execution
- **Read/write:** Read-only
- **Populated by:** Header Authentication configurations

**Auto-provided variables**

Every authentication execution automatically has access to the following values, without any configuration:

| Variable | Type | Description |
| -------- | ---- | ----------- |
| `uuid` | String | A unique UUID v4, freshly generated for each request |
| `timestamp` | Integer | The current Unix timestamp in seconds |
| `timestamp_micro` | Float | The current Unix timestamp with microsecond precision |

These are useful for replay protection, request signing, and idempotency keys.

**User-defined variables**

In addition to the auto-provided values, you can define your own variables in the Header Authentication configuration. These support the full attribute template syntax — you can reference any context (`user`, `session`, `_webhook`, etc.) and you can reference other `_auth` variables, which are resolved lazily as needed.

**Example: Adding a Bearer token from the user context**

The simplest use case — including a stored token as an Authorization header:

```
Headers:
  Authorization: Bearer {user.api_token}
```

**Example: Using auto-provided values for replay protection**

Add a request ID and timestamp to every outgoing webhook, without any configuration:

```
Headers:
  X-Request-Id: {_auth.uuid}
  X-Timestamp:  {_auth.timestamp}
```

**Example: Composing a value from multiple sources**

You can build up authentication values step by step using `_auth` variables. Each variable can reference other contexts and other `_auth` variables:

```
Variables:
  app_id:    {user.app_id}
  nonce:     {_auth.uuid}
  message:   {_auth.app_id}:{_auth.nonce}:{_webhook.url}

Headers:
  X-App-Id:  {_auth.app_id}
  X-Nonce:   {_auth.nonce}
  X-Message: {_auth.message}
```

In this example, `message` is computed from `app_id`, `nonce`, and the outgoing webhook URL — all resolved at the moment authentication runs.

{% hint style="warning" %}
Note - The `_auth` context is only available during authentication execution. It's not accessible in message templates or other parts of the conversation flow.
{% endhint %}

{% hint style="danger" %}
**NB**

Circular references between `_auth` variables will cause an error. For example, if `var_a` references `{_auth.var_b}` and `var_b` references `{_auth.var_a}`, authentication will fail. Keep your variable chains linear.
{% endhint %}
