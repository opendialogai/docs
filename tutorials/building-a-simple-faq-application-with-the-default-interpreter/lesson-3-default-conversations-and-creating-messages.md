---
description: The third and final lesson of the Simple FAQ Application tutorial
---

# Lesson 3: Default Conversations & Creating Messages

Let's recap where we are so far.

* You've created a our 'Simple FAQ' scenario&#x20;
* You've created a 'FAQ Conversation' within our scenario
* You've created scenes within our conversation
* You've created the turns within our scenes
* You've created your intents for your turns
* You've added transitions to your intents

## Overview

In this lesson we'll cover:

1. Adjusting the 'Welcome Conversation'
2. Editing the Welcome Message
3. Previewing your Application

## Step 1: Adjust the 'Welcome Conversation'

In OpenDialog, every scenario comes with a 'Welcome Conversation' out of the box. You need to edit and personalise this welcome conversation, depending on what you want to achieve.

In order to do so, in the Designer, navigate to:

Welcome Conversation > Welcome Scene > Welcome Turn > Intent Overview

![Welcome turn - Intent overview](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (24).png>)

What we expect of this turn is that the Application says hello to the user, then the Application listens for a user request from the 'FAQ conversation'.

There is both a request and a response intent, and if you click on either of them, neither transitions or completes - meaning we are going to be stuck in this turn indefinitely.&#x20;

![The infinite loop](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (25).png>)

👉In our example, we are using a user-driven pattern - meaning that the welcome conversation (_which is naturally app-driven)_ needs to be adapted to reflect that.

Let's fix that by first deleting the response intent (we don't need it as we handle user responses in the FAQ conversation).

Click on the response intent and then click on the trash can to delete it.&#x20;

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (26).png>)

Now, let's fix the request intent. We want it to transition to the FAQ conversation so that the conversation engine will consider the FAQ conversation as the next component.&#x20;

To do this, click on the application's initial request intent to edit it.  Set up this intent _(called intent.app.welcomeresponseforsimplefaq)_ to transition to the 'FAQ Conversation'.

![Setting transitions for the request intent.](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (27).png>)

You're almost there! You can now test your conversational flow in the conversation simulator and it should now be working properly. If not, make sure that you saved your previous changes.

![Testing the conversation in the conversation player.](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (29).png>)

## Step 2: Edit the Welcome Message

In order to reflect these changes, and also do some nice word-smithing, you can edit all the outgoing messages in the message editor.

[Messages](../../messages/) are associated with what we call 'outgoing intents' - these are intents that the application has. They are sent to the user, but, the user does not receive an intent they actually receive a message that carries the application's intent. Just as the application receives a message and attempts to map it to an intent. The relationship is mirrored, which makes it consistent and coherent.&#x20;

Now navigate to [the message editor](../../messages/) - either from the sidebar menu or directly from within the designer from the intent you wish to edit the message for - using the 'bubble with a pen inside' icon in top right of the screen.

![Message editor](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (28).png>)

You can do a lot of interesting things with messages - give them a specific name, add conditions,...

👉Let's keep it simple for this first example, and edit the 'intent.app.welcomeresponseforsimplefaq' message, to be an open-ended question.  For example: "Hello, how can I help you?" - inviting the user to ask their FAQ-question.&#x20;

Start by selecting the edit icon of the auto generated message.

![Message view with the message editor](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (30).png>)

Give the message a specific name, for example 'General Welcome Message'. Delete the button block with the optional text that was auto generated, then add a text block with your application's greeting as shown below.

![Message editor](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (32).png>)

Almost done! Make sure to click on 'Save Message' before navigating back to the Designer!

## Step 3: Preview the Application

To test your application navigate to the 'Preview' section of your scenario. You should then see WebChat appear with the welcome response you created.

![Preview view.](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (33).png>)

{% hint style="info" %}
Remember when testing the NLU simulation it needs to exactly match what you set up as the intent name e.g "how can I return my purchase".

👉  intent names are case sensitive!&#x20;
{% endhint %}

Congratulations! You just created your first quick FAQ prototype simulating NLU. Your next step will be to integrate some actual NLU and start designing some more complex conversations!&#x20;

### Recap

Let's recap the main points:

* You start by creating a new scenario
* Setup the conversations to be had
* Design your scenes and turns, taking care around what is a starting scene and starting or open turns
* Check your conversations flows to make sure it all behaves as you would expect.
* Finalise your messages with the right tone of voice.
* Test the real thing in Preview before [launching to your website](../../launching-your-application.md).&#x20;

While the default callback interpreter is essential for button-driven interaction and can help with simple prototyping, for actual NLU we need to use an [NLU interpreter which we discuss here](../../interpreters-and-natural-language-understanding/). You are now ready to build even more [complex conversations](../building-the-power-of-opendialog-conversational-app/) which will teach you even more incredible things that you can do with OpenDialog.
