---
description: >-
  A text message is a plain message with only text and are the primary message
  block we use to communicate with the user.
---

# Text Message

## When to use text messages

A text message is a plain message with only text. They are used to plainly convey information conversationally and as preambles to user choices using buttons, form and other message types. &#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2023-12-14 at 23.06.39.png" alt="" width="188"><figcaption></figcaption></figure>

## How to create a text message

### Via the no-code text message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a text block by clicking the _Add text block_ icon in the Layout section. You can add as many text blocks to your message as required.&#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2023-12-20 at 12.56.54.png" alt=""><figcaption></figcaption></figure>

If you would like to include a link in your text message, you can do this by pasting in the full URL in the message box. This will then be shown as a clickable link in OpenDialog's web chat Preview.

To use emojis in your text, you can copy and paste from a website such as [https://emojihub.org/](https://emojihub.org/). If you are on a Mac, you can bring up an emoji keyboard with control + command + space.

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Select `text-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](text-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2023-12-20 at 14.33.27.png" alt=""><figcaption><p>How to create a text message via the custom message editor</p></figcaption></figure>

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}

#### Properties

`<text-message>` Write the text you would like to display in your message here. Emojis can be inserted here too. For instructions see [no-code text message](text-message.md#via-the-no-code-text-message-in-message-editor).

#### XML Snippet

A plain message with only text. Specially formatted links can also be included in the text body

```
<message>
<text-message>{message-text}</text-message>
</message>
```

**Example:**

```
<message>
  <text-message> 
    Hello, this is a text message.
  </text-message>
</message>

```

Messages can also contain URLs in the text - that will be linkified. Links like `greenshootlabs.com` in the message text will be turned to links.

```
<message>
    <text-message> 
      You can have a link straing in text like this: hey go to greenshootlabs.com or you can do this:
  </text-message>
</message>
```

There is no support at the moment for any other formatting such as bold, italics etc
