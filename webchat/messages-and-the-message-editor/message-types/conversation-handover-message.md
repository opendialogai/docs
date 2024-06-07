---
description: This page describes where to use and find a conversation handover message type
---

# Conversation Handover message

## What is a conversation handover message?

In OpenDialog webchat, using a conversation handover message means that new messages sent by the user are not sent to the `incoming/webchat` endpoint, but are handled by an external system.

Hand to system messages contain a number of `data` elements that have a unique name specifying what they are for. This way, any custom data payload can be sent with hand to system messages

## When to use a conversation handover message

Conversation handover messages are intended to be used to inform OpenDialog that the handling of chat has been taken over by another channel (typically a human).

## How to create a conversation handover message

### Via the no-code conversation handover message in Message Editor

<figure><img src="../../../.gitbook/assets/Group 14.png" alt=""><figcaption><p>How to create a conversation handover message in the no code message editor</p></figcaption></figure>

Navigate to the [Message Editor](../message-editor.md) and create a conversation handover block by clicking the _Add conversation handover block_ icon in the Layout section.&#x20;

From here you can fill out the text you want your message to initially read, link your message to a specific handover integration, and then set any text you want to display should your customer be passed back from the live agent to your OpenDialog chatbot.

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Conversation Handover' message block
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

### Via the custom message in Message Editor

<figure><img src="../../../.gitbook/assets/Group 15.png" alt=""><figcaption><p>How to create a conversation handover message in the XML snippet</p></figcaption></figure>

Navigate to the [Message Editor](../message-editor.md) and create a conversation message\`_._ Select `hand-to-system-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](conversation-handover-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'Conversation Handover' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

#### XML Snippet

```xml
 <hand-to-system-message system="chatwoot">
    <data name="handover_text">You are now connected to a live agent. They will be with you shortly.</data>
    <data name="handover_id">my_configured_handover_id</data>
    <data name="handover_return_text">Thanks for chatting with our agent. Is there anything else we can help you with today?</data>
 </hand-to-system-message>
```

## How to use a conversation handover message

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

## How to construct a conversation handover message

When structuring a message, you are able to use multiple different message blocks together to create the message that you are looking for. However, when it comes to ordering and structing these, there are some rules that need to be followed. To learn more about this, please head to the [Constructing Messages ](../constructing-messages.md)page for more information.

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}

