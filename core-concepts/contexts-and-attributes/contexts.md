# Contexts

## What are contexts in OpenDialog?

Contexts are _information stores_ that conform to a specific way of behaving (the `Context` interface) and provide a generic way for the ConversationEngine and the ResponseEngine to store or retrieve attributes.&#x20;

We support persistent contexts that will be automatically stored together with user information and retrieved as required. This enabes you to store information across multiple interactions.

## What type of contexts can you use?

OpenDialog supports a set of contexts out of the box : core contexts, and also allows you to create your own custom contexts.

#### Core Contexts

"Out of the box" OpenDialog supports the following contexts

* `user` - the user context stores attributes against the user node in Dgraph. As such attributes stored in the user context will persist across requests.
* `session` - the session context is an in-memory context valid for a single request-response exchange. It is a convenient context to store application specific attributes that are only required within the space of a single request. We use the session context to store messages coming back from external NLU interpreters, for example, so that they can be embedded within a message and displayed to the user.
* `global` - the global context is a persistent context that can be managed through the UI. By visiting `admin/global-contexts` you can add attributes to the global context. These attributes will then be available throughout your application by referencing `global.attribute_name`&#x20;
* `conversation` - the conversation context is a  context that can be managed through the UI.&#x20;
* `session` - the session context is a  context that can be managed through the UI. &#x20;

#### Custom Contexts

Developers can create custom contexts to store and retrieve relevant information.
