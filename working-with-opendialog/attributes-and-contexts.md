---
description: Introduction to attributes and contexts in OpenDialog
---

# Attributes and Contexts

{% hint style="warning" %}
Warning - you are browsing the documentation for an older version of OpenDialog. Please check out the latest version. 
{% endhint %}

## What are attributes

Attributes are the way OpenDialog describes different things in the domain that the conversational application operates in. They can range from `first_name` or `last_name` for a user to the `price` for a specific item or a description of the user type \(e.g. `novice`, `intermediate`, `expert`\)

Attributes have a type and a value.

The [Core OpenDialog package](https://github.com/opendialogai/core/tree/develop/src/Attribute) provides some attribute types \(`String`, `Int`, `Array`, `Float`, `Boolean`, `Timestamp`\) but developers can add additional types based on their needs.

Attributes are used in conversations and messages to provide relevant information for subsequent conversational reasoning or message construction. They can also be used to indicate expected entities that should be extracted from user utterances.

### Storing and retrieving attributes

Attributes are stored in _contexts_. Contexts are _information stores_ that conform to a specific way of behaving \(the `Context` interface\) and provide a generic way for the ConversationEngine and the ResponseEngine to store or retrieve attributes.

In order to identify in what context an attribute should be stored in, or retrieved from we namespace attribute names. The format is `context_name.attribute_name`. Whenever OpenDialog encounters an attribute it will extract the attribute name and _resolve_ it - i.e. it will determine what type \(Int, String, etc\) is the attribute and then it will use the ContextManager to store or retrieve the attribute from an appropriate context.

#### Core Contexts

"Out of the box" OpenDialog supports the following contexts

* `user` - the user context stores attributes against the user node in Dgraph. As such attributes stored in the user context will persist across requests.
* `session` - the session context is an in-memory context valid for a single request. It is a convenient context to store application specific attributes that are only required within the space of a single request.
* `conversation` - the conversation context is also an in-memory context and it stores information relevant to the conversation. Currently you can access:
  * `interpreted_intent` - a string with the id of the intent following interpretation of an incoming user utterance
  * `current_scene` - a string with the id of the current scene \(i.e. the scene that has been selected following interpretation of the incoming intent\)
  * `current_intent` - a string with the id of the current intent
  * `next_intents` - an array that holds the next intent that the conversation engine selected, given the current incoming intent.
* `_intent` - this context stores information that was a result of the interpretation of an incoming utterance, such as attributes \(entities\) that were contained within the utterance.

#### Custom Contexts

Developers can create custom contexts to store and retrieve relevant information.

