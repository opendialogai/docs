---
title: Progress Bar Message
description: This page describes where to use and find a progress bar message type
---

## What is a progress bar message

Progress bar messages can give the user a sense of how far they have advanced through the interaction.

## When to use progress bar messages

For some interactions it is important to give the user information about the conversation itself to keep them engaged or reassure them that they are making progress towards completing their task with the chat bot.

This can be especially useful for conversations that involve answering a longer string of questions when we are collecting data from the user or for tasks that are made up of multiple steps e.g. giving identifying information, then filling out a form and finally uploading documents.

![](~/assets/screenshot-2023-12-20-at-14-19-39-1.png)

## How to create a progress bar message

### Via the custom message in Message Editor

Navigate to the [Message Editor](/opendialog-platform/conversation-designer/message-design/message-editor)[ ](/opendialog-platform/conversation-designer/message-design/message-editor)and create a _Custom Message._ Copy the [XML snippet](/opendialog-platform/conversation-designer/message-design/message-types/meta-messages/progress-bar-message#xml-snippet) at the bottom of this page into the black box and your chat message will appear in the Preview panel.

Fill in the template with the [properties](/opendialog-platform/conversation-designer/message-design/message-types/meta-messages/progress-bar-message#properties) of your particular message and when you are happy with it make sure to save your message and test it in the Test Preview chat window.

![](~/assets/group-21.png)

*How to create a progress bar message in the custom message block*

:::tip
* Open your OpenDialog application
* Select the Scenario that you wish to edit
* Select Design from the left hand panel and select Messages
* Go into the message that you want to add a message block to
* Add a 'Custom Message' block
* Select 'Progress bar' from the drop down
* Add in your own text to the fields you want to customise
* To preview your message, go to the Preview section
:::

#### XML Snippet

So, for example, the snippet below would show that the Claim Process is 10% complete.

<pre><code>&#x3C;meta-message>
  &#x3C;data name="progressPercent">10%&#x3C;/data>
  &#x3C;data name="progressText">Claim Process Completion&#x3C;/data>
<strong>&#x3C;/meta-message>
</strong></code></pre>

#### Properties

\
`< data name=` this is the 'title' of the data you are presenting.\
`<data>` this is the value you would like that data to display at this point in the conversation

:::caution
If you change your mind and select a different message type after generating the XML code, the new message code will be appended in the same window so make sure to delete the old message code.
:::

## How to use a progress bar message

<figure class="od-embed">
<div class="od-embed-frame">
<iframe src="https://www.loom.com/embed/6b9e1179b4504ea282e8663c5574cde6" title="Embedded video" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
</figure>

:::tip
**Saving a message:** Always remember to hit 'Save Message' before closing or navigating away from the edit screen.
:::

## How to construct a progress bar message

:::note
For all message types, a key element to take into consideration is **Accessibility**, especially for messages that include customisation with multimedia types such as buttons, images and links. For all information on accessibility within OpenDialog, please click [here](/opendialog-platform/conversation-designer/designing-accessible-chatbots).
:::
