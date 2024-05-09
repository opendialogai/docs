---
description: >-
  A rich message is a card type message that can include lots of different
  multimedia elements such as titles, text, images, links and more.
---

# Rich Message

## When to use rich messages

Rich messages can be used within your OpenDialog chatbot in various scenarios to enhance user engagement and improve the overall user experience.&#x20;

They are great for when you need to convey information that is better communicated through visuals, such as product images. For guiding users through complex processes or workflows, rich messages can break down steps visually and provide clear instructions at each stage. When users need to make choices or selections from a list of options, buttons or quick reply options, rich messages can streamline the process and make it more user-friendly.

Rich messages allow for more control around message content and how it is displayed to the user. They can be thought of like 'card' style messages and contain any of the following elements in combination:

* Title
* Subtitle
* Text
* Image
* Buttons

<figure><img src="../../../.gitbook/assets/Screenshot 2024-04-28 at 10.15.32.png" alt="" width="179"><figcaption><p>Example of a rich message</p></figcaption></figure>

## How to create a rich message

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Select `rich-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](rich-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2024-04-28 at 10.21.03.png" alt=""><figcaption><p>How to create a rich message via the custom message editor</p></figcaption></figure>

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}

#### Properties

`<title>` Write the text here that you would like to see as your rich message title

`<subtitle>` Write the text here that you would like to see as your rich message subtitle

`<text>` Write the text you would like to display in your message here. Emojis can be inserted here too. For instructions see [no-code text message](rich-message.md#via-the-no-code-text-message-in-message-editor)

`<image>` Write in here the link to the image that you would like to see displayed in your rich message&#x20;

#### XML Snippet

Basic snippet:

```xml
<rich-message>
    <title>Title</title>
    <subtitle>Subtitle</subtitle>
    <text>Text</text>
    <image>
        <src>image_src</src>
        <url new_tab="true|false">www.example.com</url>
    </image>
</rich-message>
```

More advanced snippet:

```xml
<rich-message>
    <title>title</title>
    <subtitle>subtitle</subtitle>
    <text>text</text>
    <callback>callback</callback>
    <callback_value>callbackValue</callback_value>
    <link>https://docs.opendialog.ai</link>
    <button>
      <text>Button text</text>
      <link new_tab="true">linkUrl</link>
      <value>attribute.value</value>
      <callback>button_callback</callback>
    </button>
    <image>
      <src>https://gblobscdn.gitbook.com/spaces%2F-MOzV9Wk3YsltjoDUyen%2Favatar-1608658264352.png?alt=media</src>
      <url new_tab="true">https://docs.opendialog.ai</url>
    </image>
</rich-message>
```

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}
