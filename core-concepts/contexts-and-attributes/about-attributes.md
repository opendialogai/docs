# Attributes

## What are attributes?

Attributes are what OpenDialog calls the pieces of information that are stored during interaction with a user. For example, a user's `first_name` or `last_name,`the `price` for a specific item or a description of the user type (e.g. `novice`, `intermediate`, `expert`).

Attributes are used throughout the conversation in Conditions, Messages, Actions and Intents to provide relevant information for subsequent conversational reasoning  or message construction.

{% hint style="info" %}
See the [Attribute Management](attribute-management.md) section on how to access attributes and create new ones.
{% endhint %}

Attributes have a type, a name and a value. The type might be something like `String` , the name might be `first_name` and the specific value would be `John.`

Attributes can be scalars (hold a single value), collections (hold multiple values of the same type) or composites (a combination of other attributes that can be scalars, collections or even other composites).&#x20;

{% hint style="info" %}
Other than more advanced use cases conversation, designers will be defining scalar and collection attributes. When interacting with an external API, however, it may be useful to have a Composite type defined in code that represents the structure of the incoming API message.&#x20;
{% endhint %}

Attributes are stored in contexts. Different contexts can be used to separate different types of information as described in the [Contexts](contexts.md) page.&#x20;

## What attribute types are available?

### Generic Attribute Types

Generic attribute types are the ones you will typically use to capture specific values in your application.  They are meant to cover a broad range of use cases to enable you to flexibly handle data in your application.&#x20;

#### Single Value Attribute Types (scalar)

* **String**: used for text based variables like words (EX: Small size, Medium size, Large size)&#x20;

{% hint style="info" %}
If an attribute type is not defined it will default to string.&#x20;
{% endhint %}

* **Boolean**: Used for binary decisions.&#x20;
  * Valid values are: True or False, Yes or No, 1 or 0. Any other values will evaluate to False.&#x20;
* **Decimal** (float): Numbers with decimal values (fractions must be converted to decimals)
  * Examples: 1.25, 23.456, 0.4
* **Whole number** (int): Whole numbers without fractions or decimal values&#x20;
  * Examples: 1, 2, 5, 403023
* **Timestamp**: an attribute type for storing unix timestamps. Can be used in comparison condition operations such as greater than and less than. For example, `last_seen` and `first_seen` in the user context are `timestamp` attributes. &#x20;

#### Multiple-value Attribute Types - Collections and Composites

**Collections**

* **String Collection:** A string collection is a collection of ... strings.&#x20;
  * Example: Assume you have a collection of names called `FavouriteNames` .  The structure would be `["Asterix", "Obelix", "Getafix"]` and you can access them through `FavouriteNames[0]` which would return Asterix, etc.&#x20;
  *   In a message you could access it as shown below&#x20;

      <figure><img src="../../.gitbook/assets/image (530).png" alt=""><figcaption><p>Using a collection attribute in messages</p></figcaption></figure>

and this would provide the output&#x20;

<figure><img src="../../.gitbook/assets/image (531).png" alt="" width="236"><figcaption><p>Outcome of collection attribute in chat.</p></figcaption></figure>

Typically you would set the values of a collection attribute through an Action API call but you could also set it explicitly through the chat test panel to test the above example

<figure><img src="../../.gitbook/assets/image (532).png" alt="" width="375"><figcaption></figcaption></figure>

* **Boolean Collection**: Allows for multiple True/False statements to be included in the attribute. (Small size "True" and Cotton "True". Therefore, the boolean\[] attribute's value is "True").
* **Decimal Collection**: A collection of decimals.
* **Whole Number Collection**: A collection of whole numbers.
* **Timestamp Collection**: A collection of timestamps.

**Composites**

* **Composite**: A composite attribute is an attribute made up of other attributes. These are attributes that are explicitly defined in code and have a specific schema. Examples of existsing composite attributes are **Utterance, Location.**

{% hint style="warning" %}
If you are defining new attributes through the interface it is unlikely that you will be defining a composite attribute on the fly. It usually will be something a developer defines in code and then makes available for use in the user interface. We will see examples of this later with Utterance and Location
{% endhint %}

* **JSON Inferred Composite**: A JSON inferred composite attribute is a way to dynamically create a composite attribute based on a JSON object (typically received through an Action API call). OpenDialog will do a best effort to interpret the structure and provide something that can be accessed as usual via OpenDialog. This provides a way to deal with more complex data structures without having to create a dedicated Composite type through code avoiding development work.&#x20;
  * Example
    * For example assume that the Action API returns the following JSON response

```json
{
  "successful": true,
  "output_data": {
    "attributes": {
      "userPreferences": {
        "theme": "dark",
        "chat_preferences": {
          "tone": "casual",
          "information_length": "verbose",
          "role_optimisation": "expert"
        },
        "language": "English"
      }
    }
  }
}
```

userPreferences has a composite structure that we want to use in our conversation. We can define a new attribute called `userPreferences` and give it a type of JSON Inferred Composite

When the Action is called it will read the data and attempt to infer appropriate attribute types or match to existing attribute types of the components of the Inferred Composite Attribute.&#x20;

For the example above we will then be able to access information using the syntax

`{user.userPreferences['chat_preferences']['tone']}` or `{user.userPreferences['theme']['dark']}`

### Specific Attribute Types

In addition to the types described above OpenDialog has a number of more specific attribute types

#### Utterance Attribute Type

The Utterance Attribute type is used by the conversation engine to hold information about what a user said and the user who said it.&#x20;

It has the following attributes:

*   `utterance_user` - this composite attribute holds a number of pieces of information about the user that uttered the utterance.&#x20;

    * `user_id`
    * `country`
    * `os`
    * `browser`
    * `timezone`

    Each one of the above attributes can be access in the following way

    * `user.utterance['utterance_user'][<attribute_name>]`
      * `e.g. user.utterance['utterance_user']['user_id']`
    * `custom`-  custom (which is an attribute of type Form Data) contains any attributes that were defined in the custom section of the chatAPI call or in the custom section of the chat widget embed code.

{% hint style="info" %}
You don't need to access information in Custom throught the Utterance attribute - for convenience the OpenDialog conversation engine makes any attributes in `['utterance_user']['custom']` accessible direclty through the user context and visible in the Context panel in preview.&#x20;
{% endhint %}

* `utterance_platform` - the platform through which the utterance was uttered. This is an indication of the conversational interface used. It will typically be ChatAPI but can be used to indicate different provenance platforms such as Alexa, WhatsApp, etc.&#x20;
  * This can be accessed using `user.utterance['utterance_platform']`&#x20;
* `utterance_type` - the type of utterance (text, button, etc)
* `utterance_text` - the actual text the user typed&#x20;
  * This is also directly accessible as  {`user.utterance_text}` without having to refer to the utterance composite attribute.&#x20;
* `utterance_user_id` - the user id
* `callback_id` - the intent name



#### Location attribute

The Location attribute is a composite attribute that is used in map and other location functionality. If you want to store an address collected via a Location message you need to define a location attribute (otherwise OpenDialog will use a default Location attribute already available)

* Location
  * `formatted_address`
  * `postal_code`
  * `line_1`
  * `line_2`
  * `locality`
  * `province`
  * `country`
  * `lat`
  * `lng`

#### Form Data

The Form Data attribute type is used to store form data and it is not typically used for new attribute types. If you generate a form in a Message the data will be stored in a form attribute and then will be made available as scalar attributes in the user context for each access.&#x20;

#### File Collection

The File Collection is a collection of composite File attributes that can hold information on files upload through the file upload widget. For each file we collect the following information

* `name` - the name of the file
* `url` - the URL from where the file can be accessed&#x20;
* `size` - the size of the file&#x20;
* `type` - the type of file

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

