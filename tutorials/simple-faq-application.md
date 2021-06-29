---
description: A quick tutorial to set up a simple FAQ Application using OpenDialog.
---

# Simple FAQ Application

{% embed url="https://youtu.be/R\_tRCQFE6jk" %}



### Setting up your scenario

Head on over to the 'Designer' and start [creating your 'Simple FAQ' scenario](../getting-started-1/getting-started-with-opendialog/creating-a-scenario.md): give your scenario a name, as well as a description.

Think about what Conversations there are to be had.  OpenDialog comes with a few conversations out of the box: a Trigger conversation \(for the user to trigger the conversational application\), a Welcome conversation \(in which the application welcomes the user\), and a No-match conversation \(in case the user request is misunderstood or unhandled by the conversational engine\).

![Set up a new scenario - &apos;Simple FAQ&apos;](../.gitbook/assets/capture-de-cran-2021-06-28-a-18.10.49.png)

For our use case, we will also need an FAQ conversation to hold all our question-answer pairs.

### Create your FAQ conversation

[Add another conversation](../adding-conversations.md), by hitting the + button in the navigation bar below.

You are now asked to name your conversation - in our case 'FAQ Conversation'.  You can also set an interpreter, a behaviour and add conditions.  In our case, we will be using the [Default Interpreter.](../interpreters-and-natural-language-understanding/default-interpretor.md)  No need to worry about conditions or behaviours quite yet. You can go ahead and save your 'FAQ Conversation'

![Create an FAQ conversation](../.gitbook/assets/capture-de-cran-2021-06-28-a-18.12.21.png)

### Add scenes, turns and intents

Within your FAQ conversation, you will want to cover different topics like for example returns, account management, product information, ...

Each subtopic in OpenDialog can be set up as [a scene](../scenes.md).  Within the FAQ conversation, go ahead and create a few scenes for each subtopic you would like to cover in your FAQ conversation.

Give each scene ****[**a starting behaviour**](https://app.gitbook.com/@opendialog/s/opendialog-development-and-deployment/~/drafts/-Mcnkn9hX19zDpH0QXXK/scenes#scene-behaviours)**,** so that the conversation engine will consider them all as 'conversation starters’.  For more in-depth information on behaviour, check out the linked article!

Finally, [**Turns**](../turns-and-intents.md) capture single exchanges. In our FAQ application, these are our question-answer pairs.  Make sure to give each turn [a starting behaviour](../turns-and-intents.md#starting-turns), so that the conversation engine considers them when entering their parent component: the scene.

👉 In our example: Within the FAQ conversation - set up a 'Returns' scene, with a 'Return purchase' turn.

Now is the time to start adding our questions and answers in the information architecture we have set up.  We will do this using [request and response intents.](../turns-and-intents.md#intents-in-turns)

![Intent overview with Request intents and Response intents](../.gitbook/assets/capture-de-cran-2021-06-28-a-18.24.57.png)

👉Our FAQ conversation is a user-driven conversation.  This means that the participant submitting the request is the User \(versus bot-driven conversation where the app is the one submitting the request\).

In our example, the request intent is the user's question and the response intent the application's answer to that particular question.  Within the 'Return purchase' turn, now set up a request intent and a response intent.

You can set up an intent by clicking on the + symbol in the navigation bar, or directly in the Request Intent box.  A third panel will open in your browser, allowing you to add information to your intent.

Add a sample utterance \(what the user might say\), add an intent name \(the exact thing you expect a user to ask - at least for this basic tutorial\*\), and save your request intent.

{% hint style="info" %}
In further applications, you can name your intent more systematically as you will be using an NLU interpreter - allowing for more flexibility in your model.  For quick prototyping, using the Default Interpreter - you need to use the exact wording \(case-sensitive!\) you want to work with.
{% endhint %}

![Setting up a request intent for a user participant, using &apos;Default Interpreter&apos;](../.gitbook/assets/capture-de-cran-2021-06-28-a-18.34.07.png)

Now add your response intent from the application, indicating in your sample utterance what the application will reply to the user.  

💡Name your intent so that you can easily recognize it later.  Each response intent has an outgoing message tied to it.  Good naming will allow you to easily find your messages in the message editor!

Your response intent ends that specific turn, and you need to tell the conversation engine what to consider next in the application's scenario - using [a transition](../turns-and-intents.md#transitions).  

👉Because we only have one main conversation in this example, we will ask the conversational application to transition to the top of that 'FAQ conversation' so that it can consider other topics \(scenes\), or question-answer pairs \(turns\) the user might want to enquire about.

Set up a few more scenes, turns, and intents for different question-answer pairs.

### Edit the 'Welcome Conversation'

In OpenDialog, every scenario comes with a 'Welcome Conversation' out of the box.  You need to edit and personalize this welcome conversation, depending on what you want to achieve.

👉In our example, we are using a user-driven pattern - meaning that the welcome conversation \(which is naturally app-driven\) needs to be adapted to reflect that.

In order to do so, in the Designer, navigate to :

Welcome Conversation &gt; Welcome Scene &gt; Welcome Turn &gt; Intent Overview

What we want to accomplish is the following :

* Application says hello to the user
* Application then listens for a user request from the 'FAQ conversation'

To do so, delete the user response intent as this is not what is expected.  Then, click on the application's initial request intent to edit it.  Set up this intent \(called intent.app.welcomeresponseforsimplefaq\) to transition to the 'FAQ Conversation'.

### Edit the Welcome Message

You're almost there!  In order to reflect these changes, and also do some nice wordsmithing, you can edit all the outgoing messages in the message editor!

Navigate to [the message editor](../messages.md) - either from the sidebar menu or directly from within the designer and the intent you wish to edit the message for.

You can do a lot of interesting things with messages - give them a specific name, add conditions,...

👉Let's keep it simple for this first  example, and edit the intent.app.welcomeresponseforsimplefaq message, to be an open-ended question.  For example: "Hello, how can I help you?" - inviting the user to ask their FAQ-question. Give the message a specific name, for example 'General Welcome Message'.

![Edit a message in the Message Editor view](../.gitbook/assets/capture-de-cran-2021-06-28-a-18.59.42.png)

Almost done! Make sure to Save your message before navigating back to the Designer!

### Activate your scenario

Once you're happy with your outgoing messages, you can now activate your scenario using the activation toggle in the scenario overview box.

![Scenario overview - use to navigate to a specific scenario or activate a scenario with its toggle](../.gitbook/assets/capture-de-cran-2021-06-28-a-19.04.49.png)

Congratulations! You can now test your scenario using the 'Preview' from the sidebar!





