# About attributes

## What are attributes

Attributes are similar to variables. xxxx

For example, a user's `first_name` or `last_name,`the `price` for a specific item or a description of the user type (e.g. `novice`, `intermediate`, `expert`)

Attributes have a type and a value.

Attributes are used in conversations and messages to provide relevant information for subsequent conversational reasoning (through conditions and actions) or message construction.&#x20;

They can also be used to indicate expected entities that should be extracted from user utterances and stored in contexts.

## Attribute types

\[list types and what that means, which values those can have]

boolean: True or False, Yes or No, 1 or 0. Binary decisions.

float: Numbers with decimal values (fractions must be converted to decimals) (EX: 1.25, 23.4678)

int: Whole numbers without fractions or decimal values (EX: 1, 5, 25)

string: used for text based variables like words (EX: Small size, Medium size, Large size)

timestamp: an attribute which allows you have the Current time&#x20;

user: each user has a unique identifier. This is a User's unique ID for identification purposes.

utterance

formData

arrayData

boolean\[]: Allows for multiple True/False statements to be included in the attribute. (Small size "True" and Cotton "True". Therefore, the boolean\[] attribute's value is "True")

float\[]

int\[]

string\[]

timestamp\[]

composite\[]

conversation\_state

composite

inferred\_composite

The [Core OpenDialog package](https://github.com/opendialogai/core/tree/develop/src/Attribute) provides some attribute types but developers can add additional types based on their needs.

## Defining attributes

To define and use attributes, you can check detailed instructions in the [Attribute Management](attribute-management.md) section of this documentation.

## Storing and retrieving attributes

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

For video lessons and hands-on practice with these concepts, consider signing up for the OpenDialog Academy lessons by emailing academy@opendialog.ai.&#x20;
