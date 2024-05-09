---
description: >-
  With image messages we can display an image in the chat window with an
  optional embedded clickable link.
---

# Image Message

## When to use image messages

We can use image messages in any part of the conversation we would like to lend visual expression. If we would like to help them identify important documents they need to complete their task or punctuate certain milestones during their interaction we can do so with images.

<div align="center">

<figure><img src="../../../.gitbook/assets/Screenshot 2024-01-02 at 17.29.30.png" alt="" width="188"><figcaption><p>Image message - example 1</p></figcaption></figure>

 

<figure><img src="../../../.gitbook/assets/Screenshot 2024-01-02 at 15.31.22 (1).png" alt="" width="188"><figcaption><p>Image message - example 2</p></figcaption></figure>

</div>

## How to create an image message

To add an image you will need to first host the image somewhere external from OpenDialog; either on your website or in an Amazon S3 bucket, then paste in the URL to the _Image Source_ field. See the example below.

### Via the no-code image message in Message Editor

<figure><img src="../../../.gitbook/assets/Screenshot 2023-12-20 at 13.39.18.png" alt=""><figcaption><p>How to create an image message in the no-code image message block</p></figcaption></figure>

Optionally, you can add a link in the _URL_ field. This will allow users to be redirected to the referenced website if they click the image directly within the chat window. If you would like the website to open in a new tab, be sure to tick the _Link opens in a new tab_ box at the bottom of the message block. &#x20;

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Select `image-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](image-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2023-12-20 at 13.36.45.png" alt=""><figcaption><p>How to create an image message in the custom message block</p></figcaption></figure>

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}

#### Properties

`<src>` a url link to the website where your audio file is being hosted.\
`<url>` is the link that you would like to embed in the image as a clickable link.\
`<url new_tab` a boolean that, if set to true, opens the linked website in a new tab.

#### XML Snippet

Displays an image message. Optionally, the image can also be a link that can optionally open in a new tab if the `url` property is included.

```
<message>
    <image-message>
        <src>{img_src}</src>
        <url new_tab="{true|false}">{url}</url>
    </image-message>
</message>
```

**Example**

```
<message>
    <image-message> 
      <src>https://docs.opendialog.ai/img/od-logo-with-credit.jpg</src>
      <url new_tab="true">https://docs.opendialog.ai</url>
    </image-message>
</message
```
