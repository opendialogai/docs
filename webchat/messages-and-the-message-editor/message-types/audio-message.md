---
description: >-
  Audio messages enable users to interact by listening to audio recordings of
  spoken language or sounds.
---

# Audio Message

## When to use audio messages

Audio messages have many applications:

* **Hands-Free Interaction**: In scenarios where users need a hands-free experience, such as multi-tasking or on the go, audio output provides a convenient alternative.
* **Accessibility**: For users with visual impairments, audio messages offer a more accessible means of interacting.
* **Audio Descriptions:** Playable audio clips can be used in place of descriptions when diagnosing a problem ( e.g. "Does your car engine sound like this? 🔉")&#x20;

<div align="left">

<figure><img src="../../../.gitbook/assets/Screenshot 2023-12-19 at 10.43.40.png" alt="" width="200"><figcaption><p>Audio messages can be played and paused using the play and pause button to the left and downloaded using the button to the right of each audio message directly within in the chat window. </p></figcaption></figure>

</div>

## How to create an audio message

### Via the custom message in Message Editor

Navigate to the [Message Editor](broken-reference) and create a _Custom Message._ Select `audio-message` from the message type drop down menu and the XML Snippet field will automatically be populated with a code template.

Fill in the template with the [properties ](audio-message.md#properties)of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<div>

<figure><img src="../../../.gitbook/assets/audio_message-1 (1).png" alt=""><figcaption></figcaption></figure>

 

<figure><img src="../../../.gitbook/assets/audio_message-2 (1).png" alt=""><figcaption></figcaption></figure>

</div>

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

`<title>` is the title of your audio clip that appears directly above the message.\
`<url>` a url link to the website where your audio file is being hosted.

#### XML Snippet

```
<audio-message>
  <title>Audio Title</title>
  <url>https://samplelib.com/lib/preview/mp3/sample-9s.mp3</url>
</audio-message>
```

#### Interaction with other message types

Audio messages can be combined with all other message blocks. The only condition is that messages that require a user action be placed last in the message editor. For example button blocks should come after your audio message.
