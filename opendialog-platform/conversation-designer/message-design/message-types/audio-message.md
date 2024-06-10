---
description: This page describes where to use and find an audio message type
---

# Audio Message

## What is an audio message?

An audio message involves sending a sound file to the user as part of the conversation. This type of message can be an effective way to convey information, emotions, or instructions in a manner that text or images might not achieve as effectively.

Generally, these types of messages consist of a recorded sound file, such as a voice recording, music, sound effect, or any other type of audio, delivered within a chatbot interaction. Users can play the audio message directly within the chat interface, providing an immersive and engaging experience.

## When to use audio messages

Audio messages have many applications:

* **Hands-Free Interaction**: In scenarios where users need a hands-free experience, such as multi-tasking or on the go, audio output provides a convenient alternative.
* **Accessibility**: For users with visual impairments, audio messages offer a more accessible means of interacting.
* **Audio Descriptions:** Playable audio clips can be used in place of descriptions when diagnosing a problem ( e.g. "Does your car engine sound like this? 🔉")&#x20;

<div align="left">

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-06-04 at 10.38.15.png" alt="" width="207"><figcaption><p>Audio messages can be played and paused using the play and pause button to the left and downloaded using the button to the right of each audio message directly within in the chat window. </p></figcaption></figure>

</div>

## How to create an audio message

### Via the custom message in Message Editor

Navigate to the [Message Editor](../message-editor.md) and create a _Custom Message._ Select `audio-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](audio-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../../.gitbook/assets/Group 9.png" alt=""><figcaption><p>How to create an audio message in the custom message block</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'audio message' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

#### XML Snippet

```
<audio-message>
  <title>Audio Title</title>
  <url>https://samplelib.com/lib/preview/mp3/sample-9s.mp3</url>
</audio-message>
```

#### Properties

`<title>` is the title of your audio clip that appears directly above the message.\
`<url>` a url link to the website where your audio file is being hosted.

#### Interaction with other message types

Audio messages can be combined with all other message blocks. The only condition is that messages that require a user action be placed last in the message editor. For example button blocks should come after your audio message.

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}

## How to use an audio message

{% embed url="https://www.loom.com/share/b68beddac70c4e4ba22273403712f552?sid=185748d0-927d-4b75-b530-61731a267f08" %}

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

## How to construct an audio message

When structuring a message, you are able to use multiple different message blocks together to create the message that you are looking for. However, when it comes to ordering and structing these, there are some rules that need to be followed. To learn more about this, please head to the [Constructing Messages ](../constructing-messages.md)page for more information.

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../designing-accessible-chatbots.md).
{% endhint %}
