---
description: >-
  Autocomplete messages allow us to capture accurate and form valid data from
  users efficiently. These messages can perform automatic look-ups based on
  partial user inputs.
---

# Autocomplete Message

## When to use autocomplete messages

Autocomplete messages come in handy when we need to collect accurate information from users by reducing the chance of human error while improving user experience.&#x20;

For example with an **address look-up message** users can input partial information such as their postcode and select their address from a list of suggested matches.

## How to create an autocomplete message

Navigate to the [Message Editor](broken-reference) and create a _Custom Message._ Select `autocomplete-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties](autocomplete-message.md#properties) of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2023-12-20 at 10.55.48.png" alt=""><figcaption></figcaption></figure>

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}

#### Properties

`<title>` is the title that appears at the top of the text input box.\
`<callback>` defines the user intent that is triggered when the user clicks the submit button.\
`<submit_text>` defines the text that appears on the button that advances the conversation.\
`<options-endpoint>`\
`<params>`\
`<attribute_name>` defines the attribute in which the user's input is stored.

#### XML Snippet

The autocomplete message is used to create an input that will offer suggestions to a user as they start typing. This message is supported by an API that should accept a query string and respond with an array of items to show in the JSON format below:

```
[
  {
    "name": "item1"
  },
  {
    "name": "item2"
  },
  {
    ...
  }
]
```

The message XML accepts a number of options that help the webchat component know how to construct the query to send to the API:

* `options-endpoint.url` - The URL of the API to hit. This can be relative or absolute. It is often a good idea to create a local API proxy route in your OD application to be able to format responses from external sources.
* `options-endpoint.params` - Each param in here will be added to the API url as query parameters in the format `?{name}={value}`.
* `options-endpoint.query-param-name` - This field specifies the name to be used for the `query` query param. The value of the query param will be all characters that the user has started typing in the auto-complete box.

So in the example below, each time the user entered a character into the input field, the following GET request would is made to fetch the next set of suggestions

```
    /api/v4/products?name=value&query={}
```

There are 2 text type fields `text` which will appear when the message starts showing and `placeholder` which shows in the message input box before a user starts typing

```
  <autocomplete-message>
   <title>{text}</title>
   <callback>{callback}</callback>
   <submit_text>Submit</submit_text>
    <options-endpoint>
      <url>/api/v4/products</url>
      <params>
        <param name="name" value="value" />
      </params>
      <query-param-name>query</query-param-name>
    </options-endpoint>
    <attribute_name>ProductName</attribute_name>
    <placeholder>Start typing</placeholder>
  </autocomplete-message>
```

Autocomplete closed

![](<../../../.gitbook/assets/image (526).png>)

Autocomplete With Suggestions

![](<../../../.gitbook/assets/image (160).png>)

```
<autocomplete-message>

-- THIS MUST BE THE LAST MESSAGE IN THE LIST TO WORK AS EXPECTED -->
  <title>Title</title>
 <callback>callback.id</callback>
 <submit_text>Submit</submit_text>
  <options-endpoint>
    <params>
      <param name="name" value="value" />
    </params>
    <query-param-name>name</query-param-name>
  </options-endpoint>
  <attribute_name>some_attribute_name</attribute_name>
</autocomplete-message>
```

#### Interaction with other message types

Autocomplete messages should come last in in your authored messages as the `<submit_text>` button advances the conversation. They can be combined with text, image and audio messages.&#x20;
