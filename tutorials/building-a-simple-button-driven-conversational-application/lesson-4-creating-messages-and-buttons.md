# Lesson 4: Creating Messages and Buttons

{% embed url="https://youtu.be/FTGlb9b0l9Q" %}
Creating Messages & Buttons | Build A Simple Button-Driven Bot #5
{% endembed %}

## Overview <a href="#7-message-editor" id="7-message-editor"></a>

Let's recap where we are so far.

* We have a Welcome conversation that can take us to the Button-driven conversation.,
* The Button-driven conversation can leads us to the NLU Conversation.
* The NLU Conversation can take us back to the button conversation.
* Adjusted the default conversation so that we can trigger the application, move to the welcome conversation and the flow from button-driven to NLU and back without issues.&#x20;

In this lesson we'll cover:

1. Creating Messages
2. Previewing the Application
3. Recap

## Step 1: Create Messages

Messages are associated with what we call "outgoing intents". Outgoing intents are intents that the application has _(these can be with request or response intents)_. They are sent to the user, but of course, the user does not receive an intent - The user actually receives a message that carries the application's intent. Just as the application receives a message and attempts to map it to an intent. The relationship is mirrored, which makes it consistent and coherent. More information on messages can be found [here](../../getting-started-1/getting-started-with-opendialog/messages.md).

### Welcome Conversation

Let's start with the welcome conversation. Click on the welcome conversation and then click on the bubble with a pen inside to go to the message editor for messages within the welcome conversation.

You should see just one message, click on it so we can start editing it.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (6).png>)

As you can see it already has a button associated with it. We are going to change it to drive us to the various conversation we want to get to. Click the edit button to go into the message and replace the "Ok" with "Drive with a button". Then in the button functionality we want to "Simulate user intent".

Then select the "requestButtonDriving" intent from within the Button-Driven Conversation.

Also add a second button that will take us to the NLU conversation and save the message.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (8).png>)

When the user clicks either of those buttons we will find ourselves at the top of the scenario looking for _open_ conversations we could enter. Because further up we set our conversations, scenes and turns are open we will find our way through to one of those two conversations based on the button we press.&#x20;

Great. That takes care of the welcome conversation let us move to the button-driven conversation. Go back to the designer, navigate to the Button-driven conversation and click on the message editor for that conversation.&#x20;

You should see three messages that we need to deal with here.&#x20;

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (9).png>)

The first one is the welcome message that will then invite us to "Click away" with a button, the second will invite us to either switch or stick to buttons and the third will welcome us back to buttons after the NLU conversation. Let's dive into each one.

For the first one we removed the text block (click on the "X" next to the message) and added a button block with the same text but then a button called "Click away" and a simulated intent of "Click away".

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (10).png>)

Save and then navigate back to message overview and select the "Welcome To Buttons" scene in the breadcrumbs menu to get the three messages.

Select the "buttonConfirmation" message, this message will give us the choice to stick to buttons or switch to NLU.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (11).png>)

As you can see the "Stick to buttons" button just simulates the "Click away" intent once more while the "Switch to NLU" button will simulate the "Switch to NLU" intent that is within the Button-driven conversation.&#x20;

Ok. You should be getting the hand of this by now. Last one to go. The welcome back to buttons message. This one will also give us a button to click away.&#x20;

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (12).png>)

We are done with the Button-driven conversation so let's head to the NLU one and fix messages there.

### NLU Conversation

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (13).png>)

Just two messages to content with here. The fist one we want to enhance so that it invites the user to sing!

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (14).png>)

The second one gives us the choice to go back to the button-driven conversation or sing again.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (16).png>)

There you have it. All that is left now is to review the application in the Preview player or deploy it on a website.&#x20;

## Step 2: Preview Application

To test your application navigate to the preview section and select your Scenario from the drop-down menu. You should then see WebChat appear with the welcome response you created.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (17).png>)

{% hint style="info" %}
Remember when testing the NLU simulation it needs to exactly match what you setup as the intent name e.g "radio ga ga"
{% endhint %}

Congratulations! You've now made your first ever button-driven bot and even simulated some NLU.

## Recap

Let's recap the main points:

* You start by creating a new scenario
* Setup the conversations to be had
* Design your scenes and turns, taking care around what is a starting scene and starting or open turns
* Check your conversations flows to make sure it all behaves as you would expect.
* Finalise your messages with the right tone of voice.
* Activate your scenario and test the real thing in Preview before [launching to your website](../../launching-your-application.md).&#x20;

While the default callback interpreter is essential for button-driven interaction and can help with simple prototyping, but for actual NLU we need to use an [NLU interpreter which we discuss here](../../interpreters-and-natural-language-understanding/dialogflow-interpreter/).&#x20;
