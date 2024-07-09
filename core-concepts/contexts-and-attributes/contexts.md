# Contexts

## What are contexts in OpenDialog?

Contexts are _information stores_ that conform to a specific way of behaving (the `Context` interface) and provide a generic way for the ConversationEngine and the ResponseEngine to store or retrieve attributes.&#x20;

We support persistent contexts that will be automatically stored together with user information and retrieved as required. This enabes you to store information across multiple interactions.

## What type of contexts can you use?

OpenDialog supports a set of contexts out of the box, also know as 'core contexts'. It is also possible to create your own custom contexts.

#### Core Contexts

"Out of the box" OpenDialog supports the following contexts

* `user` : The user context stores attributes in the database. As such attributes stored in the user context will persist across requests.
* `session` : The session context is an in-memory context valid for a single request-response exchange. It is a convenient context to store application-specific attributes that are only required within the space of a single request. We use the session context to store messages coming back from external NLU interpreters, for example, so that they can be embedded within a message and displayed to the user.
* `global` : The global context is a read-only, persistent context that can be managed through the UI. By visiting `admin/global-contexts` you can add attributes to the global context. These attributes will then be available throughout your application by referencing `global.attribute_name`. The Global context is useful for any values that won't change during a conversation and are applied to all scenarios within your workspace, such as a company name or phone number.
* `conversation` : The conversation context is a read-only context that contains the current conversational state. Each attribute is a Conversation Object attribute which can be used with the `select` [filter](../../opendialog-platform/conversation-designer/message-design/using-attributes-in-messages.md#available-filters). The context has the following attributes:
  * `current_conversation`
  * `current_scene`
  * `current_turn`
  * `current_intent`
  * `current_message_template`
* `history` : The history context is a read-only context that contains attributes related the conversation history. The context has the following attributes:
  * `transcript`: A string attribute that represents a transcript of the conversation history.
  * `intents`: A string collection attribute that contains all user and application intents in the conversation history. This can be used with the `where` [filter](../../opendialog-platform/conversation-designer/message-design/using-attributes-in-messages.md#available-filters).
  * `utterances`: A string collection attribute that contains all user utterances and application messages in the conversation history. This can be used with the `where` [filter](../../opendialog-platform/conversation-designer/message-design/using-attributes-in-messages.md#available-filters).

#### Custom Contexts

Developers can create custom contexts to store and retrieve relevant information.
