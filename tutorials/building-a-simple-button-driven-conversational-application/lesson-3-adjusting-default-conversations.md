# Lesson 3: Adjusting Default Conversations

{% embed url="https://youtu.be/tJ4k9vJoqcs" %}

Let's recap where we are so far.

* We have a Welcome conversation that can take us to the Button-driven conversation.,
* The Button-driven conversation can leads us to the NLU Conversation.
* The NLU Conversation can take us back to the button conversation.

## Overview

In this lesson we'll cover:

1. Testing the conversational flow
2. Adjusting the welcome conversation&#x20;
3. Retesting the conversation

## Step 1: Test Conversational Flow

We can test the conversation we've setup so far _(Which does not include any messages - This is the next lesson!)_ this is done by going to the top of the scenario and hitting the play button to activate the conversation player and trying out various flows.

Let's try... while quite a few options show up, the first event we need to select will be the "intent.core.welcome" - if we select that we will see that we get the default welcome message as an option and after we select that we get the user's first response as an option... and that is it?&#x20;

Hold on! We are stuck between those two messages!

![](../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin.png)

Oops! That's not quite right, is it? We can't actually get out of the welcome conversation yet. Come to think of it we haven't adjusted our welcome conversation at all! Let's click in and see what changes we would need to make.&#x20;

## Step 2: Adjust the 'Welcome Conversation'In&#x20;

In the Welcome conversation, there is both a request and a response intent, and if you click on either of them, neither of them transitions or completes. That means we are going to be stuck in this turn indefinitely.&#x20;

Let's fix that by first deleting the response intent (we don't need it as we handle user responses in other conversations).

Click on the response intent and then click on the trash can to delete it.&#x20;

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (1).png>)

Now, let's fix the request intent. We want it to complete the conversation so that the conversation engine will move back to the top of the scenario and consider all the other conversations (such as the button-driven one or the NLU one).&#x20;

Tick the "Intent completes conversation" checkbox for this.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (2).png>)

## Step 3: Retest Conversational Flows <a href="#6-checking-the-conversational-flow" id="6-checking-the-conversational-flow"></a>

Ok, now let's go back to the conversation player and check the conversation flow.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (4).png>)

That is much better, isn't it. We can trigger the application, move to the welcome conversation and the flow from button-driven to NLU and back without issues.&#x20;

With the conversational flow in place as we would like it, it is time to work on our messages. The Conversation Player uses the sample messages but for our final application we want to insert those buttons and do so much more! Time to move start using the message editor.
