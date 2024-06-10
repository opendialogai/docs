# Attributes

## What are attributes?

Attributes are what OpenDialog calls the pieces of information that are stored during interaction with a user.&#x20;

For example, a user's `first_name` or `last_name,`the `price` for a specific item or a description of the user type (e.g. `novice`, `intermediate`, `expert`)

Attributes have a type, a name and a value. The type might be something like `String` , the name might be `first_name` and the specific value would be `John.`

Attributes are used in conversations and messages to provide relevant information for subsequent conversational reasoning (through conditions and actions) or message construction.&#x20;

Pretty much anything you store and manipulate through the OpenDialog conversation engine is stored as an attribute.&#x20;

## What attribute types are available?

boolean: True or False, Yes or No, 1 or 0. Binary decisions.

float: Numbers with decimal values (fractions must be converted to decimals) (EX: 1.25, 23.4678)

int: Whole numbers without fractions or decimal values (EX: 1, 5, 25)

string: used for text based variables like words (EX: Small size, Medium size, Large size)

timestamp: an attribute type for storing unix timestamps. Can be used in comparison condition operations such as greater than and less than. For example, `last_seen` and `first_seen` in the user context are `timestamp` attributes. &#x20;

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

## How are attributes defined and managed?

To define and use attributes, you can check detailed instructions in the [Attribute Management](attribute-management.md) section of this documentation.

## How are attributes stored and retrieved?

Attributes are stored in _contexts_. For more information on contexts, check out the dedicated Contexts page.



{% content-ref url="contexts.md" %}
[contexts.md](contexts.md)
{% endcontent-ref %}

In order to identify in what context an attribute should be stored in, or retrieved from we namespace attribute names. The format is `context_name.attribute_name`. Whenever OpenDialog encounters an attribute it will extract the attribute name and _resolve_ it - i.e. it will determine what type (Int, String, etc) is the attribute and whether it is a supported attribute and then it will use the ContextManager to store or retrieve the attribute from an appropriate context.

#### Core Contexts

"Out of the box" OpenDialog supports the following contexts

* `user` - the user context stores attributes against the user node in Dgraph. As such attributes stored in the user context will persist across requests.
* `session` - the session context is an in-memory context valid for a single request-response exchange. It is a convenient context to store application specific attributes that are only required within the space of a single request. We use the session context to store messages coming back from external NLU interpreters, for example, so that they can be embedded within a message and displayed to the user.
* `global` - the global context is a persistent context that can be managed through the UI. By visiting `admin/global-contexts` you can add attributes to the global context. These attributes will then be available throughout your application by referencing `global.attribute_name`&#x20;

#### Custom Contexts

Developers can create custom contexts to store and retrieve relevant information.

For video lessons and hands-on practice with these concepts, consider signing up for the OpenDialog Academy lessons by emailing academy@opendialog.ai.&#x20;
