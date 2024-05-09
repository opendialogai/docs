---
description: >-
  List messages allow for multiple messages to be combined into a single message
  for the user that is displayed as a carousel that users can scroll between.
  These are good for displaying multiple search
---

# List Message

## When to use list messages

A list message is a message that essentially looks like a carousel. Within this carousel you can have multiple different items, like a list, that contain information. List messages work well together with rich messages but can be used as a wrapper for any messages types.

A carousel list message in your OpenDialog chatbot can be quite useful for various purposes. For example, if you're running an e-commerce chatbot, a carousel can display multiple products at once, allowing users to browse through a selection and choose what interests them. They add visual interest to the conversation, making interactions more engaging and intuitive for users.

<figure><img src="../../../.gitbook/assets/Screenshot 2024-04-29 at 07.48.11.png" alt="" width="180"><figcaption><p>Example of a list message </p></figcaption></figure>

## How to create a list message

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Select `list-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](list-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2024-04-29 at 07.50.45.png" alt=""><figcaption><p>How to create a list message via the custom message editor</p></figcaption></figure>

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}

#### Properties

The only option available for list messages is `view-type`. This can either be `vertical` (default) or `horizontal`

Within each item of your list message, you can also add a [rich message](rich-message.md). See the rich message page for more information

#### XML Snippet

```
<list-message list_type="horizontal">
    <item><text-message>{text_message}</text-message></item>
    <item><image-message>{image_message}</image-message></item>
    <item><rich-message>{rich_message}</rich-message></item>
</list-message>
```

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}
