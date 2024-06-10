---
description: This page describes where to use and find an image message type
---

# Image Message

## What is an image message?

With image messages we can display an image in the chat window with an optional embedded clickable link. An image message involves sending an image to the user as part of the interaction. An image message consists of a visual element—such as a photograph, illustration, graphic, or screenshot—delivered within a chatbot conversation. Images can convey information quickly and effectively, often more so than text alone.

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-06-04 at 10.18.10.png" alt="" width="209"><figcaption><p>Example of an image block message</p></figcaption></figure>

## When to use an image message?

We can use image messages in any part of the conversation we would like to lend visual expression. If we would like to help users to identify important documents that they need to complete their task, or to punctuate certain milestones during their interaction, we can do so with images.

## How to create an image message

To add an image you will need to first host the image somewhere external from OpenDialog; either on your website or in an Amazon S3 bucket, then paste in the URL to the _Image Source_ field. See the example below.

Optionally, you can add a link in the _URL_ field. This will allow users to be redirected to the referenced website if they click the image directly within the chat window. If you would like the website to open in a new tab, be sure to tick the _Link opens in a new tab_ box at the bottom of the message block. &#x20;

### Via the no-code image message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create an image block by clicking the _Add image block_ icon in the Layout section. &#x20;

<figure><img src="../../../../.gitbook/assets/Group 4 (1).png" alt=""><figcaption><p>How to create an image message in the no-code image message block</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add an 'image' message block
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Select `image-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](image-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../../.gitbook/assets/Group 5 (2).png" alt=""><figcaption><p>How to create an image message in the custom message block</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'Date Picker' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

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

#### Properties

`<src>` a url link to the website where your audio file is being hosted.\
`<url>` is the link that you would like to embed in the image as a clickable link.\
`<url new_tab` a boolean that, if set to true, opens the linked website in a new tab.

**Example**

```
<message>
    <image-message> 
      <src>https://docs.opendialog.ai/img/od-logo-with-credit.jpg</src>
      <url new_tab="true">https://docs.opendialog.ai</url>
    </image-message>
</message
```

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}

## How to use an image message

{% embed url="https://www.loom.com/share/674637e1927d4d9b902e12d51ca302cc?sid=b44c6386-9bd7-4c85-b054-1b7d1a89fcd8" %}

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

## How to construct an image message

When structuring a message, you are able to use multiple different message blocks together to create the message that you are looking for. However, when it comes to ordering and structing these, there are some rules that need to be followed. To learn more about this, please head to the [Constructing Messages ](../constructing-messages.md)page for more information.

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}
