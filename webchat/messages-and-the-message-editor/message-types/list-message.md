---
description: This page describes where to use and find a list message type
---

# List Message

## What is a list message?

List messages allow for multiple messages to be combined into a single message for the user that is displayed as a carousel that users can scroll between. These are good for displaying multiple search.

A list message is a message that essentially looks like a carousel. Within this carousel you can have multiple different items, like a list, that contain information. List messages work well together with rich messages but can be used as a wrapper for any messages types.

## When to use list messages

A carousel list message in your OpenDialog chatbot can be quite useful for various purposes. For example, if you're running an e-commerce chatbot, a carousel can display multiple products at once, allowing users to browse through a selection and choose what interests them. They add visual interest to the conversation, making interactions more engaging and intuitive for users.

<figure><img src="../../../.gitbook/assets/Screenshot 2024-04-29 at 07.48.11.png" alt="" width="180"><figcaption><p>Example of a list message </p></figcaption></figure>

## How to create a list message

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Select `list-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](list-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../.gitbook/assets/Group 16.png" alt=""><figcaption><p>How to create a list message via the custom message editor</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'list message' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

#### XML Snippet

```
<list-message>
    <item><text-message>{text_message}</text-message></item>
    <item><image-message>{image_message}</image-message></item>
    <item><rich-message>{rich_message}</rich-message></item>
</list-message>
```

#### Properties

Within each item of your list message, you can also add a [rich message](rich-message.md). See the rich message page for more information

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}

## How to use a list message

A tutorial video will be available soon.

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

## How to construct a list message

When structuring a message, you are able to use multiple different message blocks together to create the message that you are looking for. However, when it comes to ordering and structing these, there are some rules that need to be followed. To learn more about this, please head to the [Constructing Messages ](../constructing-messages.md)page for more information.

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}
