---
description: This page describes where to use and find a text message type
---

# Text Message

## What is a text message?

A text message is a plain message with only text and are the primary message block we use to communicate with the user. They are used to plainly convey information conversationally and as preambles to user choices using buttons, form and other message types. &#x20;

There are certain rules when it comes to using text messages. For example, when typing a text message it is important to stick to the character limit. We recommend a limit of 240 characters per text message, so that it is easy to scan and read through the information you are providing.

It is also important to break certain chunks of information up into different text messages. This will make it easier for users to read and digest what they are reading. For example, separating out informative messages from the actionable question in a separate text message

<figure><img src="../../../.gitbook/assets/Screenshot 2024-06-04 at 10.14.39.png" alt="" width="209"><figcaption><p>Example of a text message in action</p></figcaption></figure>

## When to use a text message?

Text messages are a fundamental component of chatbot interactions, serving a wide array of purposes. They can be used to convey many different things in different scenarios. For example, to display welcomes and greetings, to give instructions and guidance and also just for basic information sharing.

## How to create a text message

### Via the no-code text message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a text block by clicking the _Add text block_ icon in the Layout section. You can add as many text blocks to your message as required.&#x20;

<figure><img src="../../../.gitbook/assets/Group 2 (2).png" alt=""><figcaption><p>Where to find the text block button </p></figcaption></figure>

If you would like to include a link in your text message, you can do this by pasting in the full URL in the message box. This will then be shown as a clickable link in OpenDialog's web chat Preview.

To use emojis in your text, you can copy and paste from a website such as [https://emojihub.org/](https://emojihub.org/). If you are on a Mac, you can bring up an emoji keyboard with control + command + space.

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Text' message block
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Select `text-message` from the message type drop down menu and the[ XML Snippet](text-message.md#xml-snippet) field will automatically be populated with a code template.

Fill in the template with the [properties ](text-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../.gitbook/assets/Group 3 (1).png" alt=""><figcaption><p>Where to find the custom messages button and XML for text messages</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'Text message' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

#### XML Snippet

A plain message with only text. Specially formatted links can also be included in the text body

```
<message>
<text-message>{message-text}</text-message>
</message>
```

#### Properties

`<text-message>` Write the text you would like to display in your message here. Emojis can be inserted here too. For instructions see [no-code text message](text-message.md#via-the-no-code-text-message-in-message-editor).

**Example:**

```
<message>
  <text-message> 
    Hello, this is a text message.
  </text-message>
</message>

```

Messages can also contain URLs in the text - that will be linkified. Links like `opendialog.ai` in the message text will be turned to links.

```
<message>
    <text-message> 
      You can have a link straing in text like this: hey go to opendialog.ai or you can do this:
  </text-message>
</message>
```

There is no support at the moment for any other formatting such as bold, italics etc

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}

## How to use a text message

Insert loom

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

## How to construct a text message

When structuring a message, you are able to use multiple different message blocks together to create the message that you are looking for. However, when it comes to ordering and structing these, there are some rules that need to be followed. To learn more about this, please head to the [Constructing Messages ](../constructing-messages.md)page for more information.

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}
