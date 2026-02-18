# Contexts

## What are contexts in OpenDialog?

Contexts are _information stores_ that provide a generic way for the ConversationEngine and the ResponseEngine to store or retrieve attributes. Each context defines its own persistence and visibility rules — some survive across sessions, others exist only for the duration of a single request or a specific processing step.

Attribute references use the format `{context_name.attribute_name}`. When no context prefix is given, OpenDialog defaults to the `user` context.

## Quick reference

| Context         | Scope                                 | Read/Write             |
| --------------- | ------------------------------------- | ---------------------- |
| `user`          | Persistent                            | Read & write           |
| `session`       | Per-request, in-memory                | Read & write           |
| `global`        | Persistent                            | Read only              |
| `conversation`  | Per-request, from persistent state    | Read only              |
| `history`       | Per-request, from persistent data     | Read only              |
| `message_history` | Persistent                          | Read only              |
| `interpretation`| Per moderation evaluation             | Read only              |
| `_intent`       | Per-intent condition evaluation       | Read only              |
| `_webhook`      | Per Webhook V2 Action execution       | Read only              |
| `_auth`         | Per Header Authentication execution   | Read & write           |

## User context

**Reference syntax:** `{user.attribute_name}` or `{attribute_name}` (default)

**Persistence:** Persistent — stored in the database and available across requests and sessions.

**Read/Write:** Read and write.

The user context is the primary store for conversation data. Any attribute without an explicit context prefix is automatically resolved against the user context. Attributes written here survive across multiple sessions and are associated with the end user's record.

**Common uses:**

- Storing information collected during a conversation (e.g. `first_name`, `email`, `account_id`)
- Carrying data between separate conversations or sessions
- Persisting webhook response data for use later in the conversation

## Session context

**Reference syntax:** `{session.attribute_name}`

**Persistence:** Per-request, in-memory — cleared after each request-response cycle.

**Read/Write:** Read and write.

The session context is a short-lived store scoped to a single request. It is useful for passing data between components within the same processing cycle without persisting that data to the database.

**Common uses:**

- Temporarily holding a value before deciding whether to write it to the user context
- Passing data from an interpreter to a message template within the same request
- Storing intermediate values during complex action pipelines

## Global context

**Reference syntax:** `{global.attribute_name}`

**Persistence:** Persistent — managed through the UI at `/admin/global-contexts`.

**Read/Write:** Read only at runtime.

The global context holds workspace-wide values that remain constant across all scenarios and users. You manage these through the admin UI. Unlike the user context, global attributes cannot be written to during a conversation — they are configured in advance.

**Common uses:**

- Company name, phone number, or support email referenced in messages
- Feature flags or configuration values shared across scenarios
- Any constant that applies to all users regardless of their state

## Conversation context

**Reference syntax:** `{conversation.attribute_name}`

**Persistence:** Per-request — populated from the persistent conversation state for the current request, then discarded.

**Read/Write:** Read only.

The conversation context exposes the current position of the conversation engine. Each attribute is a Conversation Object and supports the `select` [filter](../../opendialog-platform/conversation-designer/message-design/using-attributes-in-messages.md#available-filters).

**Attributes:**

- `current_conversation`
- `current_scene`
- `current_turn`
- `current_intent`
- `current_message_template`

**Filter examples:**

```
{conversation.current_scene | select('name')}
{conversation.current_turn | select('description')}
```

**Common uses:**

- Referencing the active scene or intent name in a message
- Logging or debugging the current conversation position
- Conditional logic based on where in the conversation the user is

## History context

**Reference syntax:** `{history.attribute_name}`

**Persistence:** Per-request — queries persistent message history from the database for the current request.

**Read/Write:** Read only.

The history context provides access to a structured view of the current conversation's history. It is rebuilt from the database on each request and supports filtering for targeted queries.

**Attributes:**

- `transcript`: A string representation of the full conversation so far.
- `intents`: A string collection of all user and application intent names in the conversation. Supports `where`, `count`, `last`, and `range` [filters](../../opendialog-platform/conversation-designer/message-design/using-attributes-in-messages.md#available-filters).
- `utterances`: A string collection of all user utterances and application messages. Supports `where`, `count`, `last`, and `range` filters.

**Filter examples:**

```
{history.utterances | last}
{history.intents | count}
{history.utterances | range(0, 3)}
{history.intents | where('value', 'BookAppointment')}
```

**Common uses:**

- Summarising the conversation history to pass to an LLM
- Detecting whether a specific intent has already occurred in this conversation
- Counting how many turns have taken place before applying a condition

## Message history context

**Reference syntax:** `{message_history.all}`

**Persistence:** Persistent — queries message data across all sessions from the database.

**Read/Write:** Read only.

The message history context provides a full cross-session transcript of the user's conversation history, formatted as a readable string. Unlike the `history` context, which is scoped to the current conversation, `message_history` spans all past interactions.

**Attributes:**

- `all`: A formatted string containing the full message history across sessions.

**Common uses:**

- Providing an LLM action with full context of prior conversations
- Personalising responses based on what has been discussed in previous sessions
- Auditing or summarising a user's interaction history

## Interpretation context

**Reference syntax:** `{interpretation.attribute_name}`

**Persistence:** Per moderation evaluation — populated when a Language Service triggers moderation checks, then discarded.

**Read/Write:** Read only.

The interpretation context is populated by the Language Service when content moderation is invoked. It provides the result of the moderation check for use in conditions and message templates.

**Attributes:**

- `flagged_moderation`: A boolean indicating whether the content was flagged.
- `flagged_moderation_categories`: A string collection of the category labels that were triggered.

**Common uses:**

- Branching the conversation when moderation flags a user message
- Logging or alerting on moderation category matches
- Displaying a contextual response when content is flagged

## \_intent context

**Reference syntax:** `{_intent.attribute_name}`

**Persistence:** Per-intent — refreshed each time conditions are evaluated for a given intent.

**Read/Write:** Read only.

The `_intent` context is a transient store populated by the interpreter during intent matching. It holds attributes placed there by interpreters (such as LLM classifiers or regex matchers) for use in conditions evaluated against that intent.

{% hint style="warning" %}
`_intent` attributes are overwritten each time an intent is interpreted. While they are technically accessible anywhere, they should not be used in message templates as their values will reflect the most recently interpreted intent, which may not be what you expect.
{% endhint %}

**Common uses:**

- Accessing classifier confidence scores in conditions
- Using interpreter-extracted entities in conditions without writing them to the user context
- Evaluating intent-level metadata that should not persist beyond condition resolution

## \_webhook context

**Reference syntax:** `{_webhook.attribute_name}`

**Persistence:** Per Webhook V2 Action execution — available only during the outbound HTTP request phase of a Webhook V2 Action.

**Read/Write:** Read only.

The `_webhook` context is populated just before a Webhook V2 Action makes its HTTP request. It exposes the resolved request parameters, allowing you to reference them in headers, URL, or body templates within the same action. This is particularly useful for computing derived values such as signatures or checksums.

{% hint style="warning" %}
`_webhook` attributes are only available during the execution of a Webhook V2 Action. They cannot be referenced in message templates, conditions, or any other part of the conversation design.
{% endhint %}

**Attributes:**

- `url`: The fully resolved request URL.
- `body`: The resolved JSON request body as a string.
- `method`: The HTTP method (GET, POST, etc.).
- `headers`: The resolved headers as a JSON string.
- `content_type`: The content type of the request.
- `query_params`: The resolved query parameters as a JSON string.

**Common uses:**

- Computing a request signature using the resolved body or URL (e.g. HMAC authentication)
- Logging or debugging the exact request that will be sent
- Including a hash of the request body as a header for integrity verification

## \_auth context

**Reference syntax:** `{_auth.attribute_name}`

**Persistence:** Per Header Authentication execution — populated during header authentication and resolved lazily.

**Read/Write:** Read and write (via the `variables` configuration block).

The `_auth` context is used exclusively during Webhook V2 Header Authentication. It supports lazy resolution, meaning attributes are only resolved when they are actually referenced. This enables variable chaining — you can define a variable that references another `_auth` variable, and the dependency will be resolved automatically.

{% hint style="warning" %}
`_auth` attributes are only available within the Header Authentication configuration of a Webhook V2 Action. They cannot be referenced in message templates, conditions, the webhook URL, body, or any other part of the conversation design outside of the authentication flow.
{% endhint %}

By default, the following attributes are always available without configuration:

- `uuid`: A freshly generated UUID for each request.
- `timestamp`: The current Unix timestamp (seconds).
- `timestamp_micro`: The current Unix timestamp (microseconds).

Custom variables are defined in the `variables` block of the Header Authentication configuration as a JSON object. Each key becomes an `_auth` attribute.

**Common uses:**

- Building an HMAC signature using `{_webhook.body}` and a secret stored in a user or global attribute
- Constructing an `Authorization` header value from multiple resolved parts
- Generating a unique request ID from `{_auth.uuid}` to include in request headers