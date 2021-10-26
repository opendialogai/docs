---
description: Introduction to attributes and contexts in OpenDialog
---

# Attributes and Contexts

## What are attributes

Attributes are the way OpenDialog describes different things in the domain that the conversational application operates in. They can range from `first_name` or `last_name` for a user to the `price` for a specific item or a description of the user type (e.g. `novice`, `intermediate`, `expert`)

Attributes have a type and a value.

Attributes can be _scalar _(store just one value), or they can be _composite._ Composite attributes store multiple attributes within them.

{% hint style="info" %}
Roadmap: Currently only OpenDialog core makes use of composite attributes but it will be possible to access them through the interface as well in the future.
{% endhint %}

The [Core OpenDialog package](https://github.com/opendialogai/core/tree/develop/src/Attribute) provides some attribute types (`String`, `Int`, `Array`, `Float`, `Boolean`, `Timestamp`) but developers can add additional types based on their needs.

Attributes are used in conversations and messages to provide relevant information for subsequent conversational reasoning (through conditions and actions) or message construction. They can also be used to indicate expected entities that should be extracted from user utterances and stored in contexts.

### Storing and retrieving attributes

Attributes are stored in _contexts_. Contexts are _information stores_ that conform to a specific way of behaving (the `Context` interface) and provide a generic way for the ConversationEngine and the ResponseEngine to store or retrieve attributes.&#x20;

We support persistent contexts that will be automatically stored together with user information and retrieved as required. This enabes you to store information across multiple interactions.

In order to identify in what context an attribute should be stored in, or retrieved from we namespace attribute names. The format is `context_name.attribute_name`. Whenever OpenDialog encounters an attribute it will extract the attribute name and _resolve_ it - i.e. it will determine what type (Int, String, etc) is the attribute and whether it is a supported attribute and then it will use the ContextManager to store or retrieve the attribute from an appropriate context.

#### Core Contexts

"Out of the box" OpenDialog supports the following contexts

* `user` - the user context stores attributes against the user node in Dgraph. As such attributes stored in the user context will persist across requests.
* `session` - the session context is an in-memory context valid for a single request-response exchange. It is a convenient context to store application specific attributes that are only required within the space of a single request. We use the session context to store messages coming back from external NLU interpreters, for example, so that they can be embedded within a message and displayed to the user.
* `global` - the global context is a persistent context that can be managed through the UI. By visiting `admin/global-contexts` you can add attributes to the global context. These attributes will then be available throughout your application by referencing `global.attribute_name`&#x20;

#### Custom Contexts

Developers can create custom contexts to store and retrieve relevant information.
