---
description: The second lesson of the Simple FAQ Application tutorial
---

# Lesson 2: Building Intents

Let's recap where we are so far.

* You've created a our 'Simple FAQ' scenario&#x20;
* You've created a 'FAQ Conversation' within our scenario
* You've created scenes within our conversation
* You've created the turns within our scenes

## Overview

In this lesson we'll cover:

1. Creating Intents
2. Adding Transitions

## Step 1: Create Intents

Now is the time to start adding our question and answer pairs to the information architecture we have set up.  We will do this using [request and response intents.](../../turns-and-intents.md#intents-in-turns)

👉 Our FAQ conversation is a user-driven conversation.  This means that the participant submitting the request is the User (versus bot-driven conversation where the app is the one submitting the request). As so, the request intent is the user's question and the response intent the application's answer to that particular question.&#x20;

Within the 'Return purchase' turn, set up the request intent and response intent.

In our example, the request intent is the user's question and the response intent the application's answer to that particular question. Within the 'Purchase return' turn, now set up a request intent and a response intent.

You can set up an intent by clicking on the + symbol in the navigation bar, or directly in the Request Intent box.  A third panel will open in your browser, allowing you to add information to your intent.

Set your participant as the 'User' then add a sample utterance (what the user might say), add an intent name (the exact thing you expect a user to ask - at least for this basic tutorial - _See note below_), and save your request intent.

{% hint style="info" %}
In further applications, you can name your intent more systematically as you will be using an NLU interpreter - allowing for more flexibility in your model.  For quick prototyping, using the Default Interpreter - you need to use the exact wording you want to work with. To be noted: The Default interpreter is case sensitive.
{% endhint %}

![How can I return my purchase intent creation](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (12).png>)

Now add your response intent from the application, indicating in your sample utterance what the application will reply to the user. &#x20;

💡Name your intent so that you can easily recognise it later.  Each response intent has an outgoing message tied to it.  Good naming will allow you to easily find your messages in the message editor!

![Adding response intent.](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (13).png>)

## Step 2: Add Transitions

Your response intent ends that specific turn, and you need to tell the conversation engine what to consider next in the application's scenario - using [a transition](../../turns-and-intents.md#transitions). &#x20;

👉 Because we only have one main conversation in this example, we will ask the conversational application to transition to the top of that 'FAQ conversation' so that it can consider other topics (scenes), or question-answer pairs (turns) the user might want to enquire about.

![Setting the transition for the response intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (14).png>)

Set up a few more scenes, turns, and intents for different question-answer pairs as shown below.

![Gift card returns turn](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (15).png>)

![Gift card returns turn - response intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (16).png>)

![shoe size turn - request intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (18).png>)

![shoe size turn - response intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (19).png>)

![view my account turn - request intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (21).png>)

![view my account turn - response intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (22).png>)

And that's it; you've just built intents for the turns within your scenes of the conversation that give you the ability to build our simple FAQ application. In the third and final lesson, we look at adjusting the default conversation and editing the messages that are sent by the application.
