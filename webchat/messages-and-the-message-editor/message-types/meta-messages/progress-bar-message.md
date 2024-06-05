---
description: This page describes where to use and find a progress bar message type
---

# Progress Bar Message

## What is a progress bar message

Progress bar messages can give the user a sense of how far they have advanced through the interaction.

## When to use progress bar messages

For some interactions it is important to give the user information about the conversation itself to keep them engaged or reassure them that they are making progress towards completing their task with the chat bot.&#x20;

This can be especially useful for conversations that involve answering a longer string of questions when we are collecting data from the user or for tasks that are made up of multiple steps e.g. giving identifying information, then filling out a form and finally uploading documents.&#x20;

<figure><img src="../../../../.gitbook/assets/Screenshot 2023-12-20 at 14.19.39 (1).png" alt=""><figcaption></figcaption></figure>

## How to create a progress bar message

### Via the custom message in Message Editor

Navigate to the [Message Editor](../../message-editor.md)[ ](../../message-editor.md)and create a _Custom Message._ Copy the [XML snippet](progress-bar-message.md#xml-snippet) at the bottom of this page into the black box and your chat message will appear in the Preview panel.&#x20;

Fill in the template with the [properties](progress-bar-message.md#properties) of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.&#x20;

<figure><img src="../../../../.gitbook/assets/Group 21.png" alt=""><figcaption><p>How to create a progress bar message in the custom message block</p></figcaption></figure>

{% hint style="success" %}
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'Progress bar' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
{% endhint %}

#### XML Snippet

<pre><code>&#x3C;meta-message>
  &#x3C;data name="progressPercentage">any%&#x3C;/data>
<strong>&#x3C;/meta-message>
</strong></code></pre>

#### Properties

\
`< data name=` this is the 'title' of the data you are presenting.\
`<data>` this is the value you would like that data to display at this point in the conversation

{% hint style="warning" %}
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
{% endhint %}

## How to use a progress bar message

Insert loom

{% hint style="success" %}
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
{% endhint %}

## How to construct a progress bar message

{% hint style="info" %}
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](../../../designing-accessible-chatbots.md).
{% endhint %}
