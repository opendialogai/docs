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

![Navigate to the Welcome Intents in order to edit them](../.gitbook/assets/capture-de-cran-2021-06-29-a-08.37.56.png)

What we want to accomplish is the following :

* Application says hello to the user
* Application then listens for a user request from the 'FAQ conversation'

To do so, delete the user response intent as this is not what is expected.  Then, click on the application's initial request intent to edit it.  Set up this intent \(called intent.app.welcomeresponseforsimplefaq\) to transition to the 'FAQ Conversation'.

![Set up the transition from the &apos;Welcome request intent&apos; to the &apos;FAQ conversation&apos;](../.gitbook/assets/capture-de-cran-2021-06-29-a-08.39.00.png)

### Edit the Welcome Message

You're almost there!  In order to reflect these changes, and also do some nice wordsmithing, you can edit all the outgoing messages in the message editor!

Messages are associated with what we call "outgoing intents". Outgoing intents are intents that the application has. They are sent to the user, but of course, the user does not receive an intent. The user receives a message that carries the application's intent. Just as the application receives a message and attempts to map it to an intent. The relationship is mirrored, which makes it consistent and coherent. 

Navigate to [the message editor](../messages.md) - either from the sidebar menu or directly from within the designer and the intent you wish to edit the message for - using the 'bubble with pen inside' icon in the navigation bar.

![Use the &apos;Edit Message&apos; icon in the navigation bar to edit outgoing messages](../.gitbook/assets/capture-de-cran-2021-06-29-a-08.36.26.png)

You can do a lot of interesting things with messages - give them a specific name, add conditions,...

👉Let's keep it simple for this first example, and edit the 'intent.app.welcomeresponseforsimplefaq' message, to be an open-ended question.  For example: "Hello, how can I help you?" - inviting the user to ask their FAQ-question. Give the message a specific name, for example 'General Welcome Message'.

![Edit a message in the Message Editor view](../.gitbook/assets/capture-de-cran-2021-06-28-a-18.59.42.png)

Almost done! Make sure to Save your message before navigating back to the Designer!

### Activate your scenario

Navigate to the designer and find your scenario in the list. Click on the slider to active your Scenario \(it should now be green\). You're Scenario is now active! You're ready to test it.

![Scenario overview - use to navigate to a specific scenario or activate a scenario with its toggle](../.gitbook/assets/capture-de-cran-2021-06-28-a-19.04.49.png)

To test your application navigate to the preview section and select your Scenario from the drop-down menu. You should then see WebChat appear with the welcome response you created.

![](../.gitbook/assets/capture-de-cran-2021-06-29-a-08.46.25.png)

{% hint style="info" %}
Remember when testing the NLU simulation it needs to exactly match what you set up as the intent name e.g "how can I return my purchase" -

👉 To be noted: intent names are case sensitive! 
{% endhint %}

Congratulations! You just created your first quick FAQ prototype simulating NLU. Our next step will be to integrate some actual NLU and start designing some more complex conversations! 

Let's recap the main points:

* You start by creating a new scenario
* Setup the conversations to be had
* Design your scenes and turns, taking care around what is a starting scene and starting or open turns
* Check your conversations flows to make sure it all behaves as you would expect.
* Finalise your messages with the right tone of voice.
* Activate your scenario and test the real thing in Preview before [launching to your website](../launching-your-application.md). 

While the default callback interpreter is essential for button-driven interaction and can help with simple prototyping,  for actual NLU we need to use an [NLU interpreter which we discuss here](../interpreters-and-natural-language-understanding/dialogflow-interpreter.md). 





