# Lesson 1: Conversational Map Design

{% embed url="https://youtu.be/_FeQZsRItnk" %}
Conversational Map Design | Build A Simple Button-Driven Bot #2
{% endembed %}

## Overview

In this lesson we will take a look at:

1. Creating a scenario
2. Creating conversations
3. Creating scenes
4. Creating turns

## Step 1: Create A Scenario

{% hint style="info" %}
A **scenario** is meant to encapsulate a set of related conversations focused on helping the user achieve a specific high-level goal.
{% endhint %}

The first step is to create a new scenario. We will call it "My first button-driven scenario".

![Default Conversations](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (3).png>)

## Step 2: Create Conversations

{% hint style="info" %}
**Conversations** capture the exchanges for smaller specific goals on the way to the larger scenario goal.
{% endhint %}

We will start by setting up the conversational flow we expect to have with different turns and intents.&#x20;

If you watch the clip at the start you can see that there are three distinct conversations.&#x20;

* The Welcome Conversation (which we already have)
* The Button Driven Conversation
* The NLU Conversation (don't worry we will not need to setup NLU interpreters - we will use OpenDialog's easy way to fake NLU interaction for prototyping)

Let's go ahead and edit our existing scenario to reflect this structure.&#x20;

### Button-Driven Conversation  <a href="#2-1-create-the-button-driven-conversation" id="2-1-create-the-button-driven-conversation"></a>

* Go to the top-level of the scenario and click on the "+" button to add a conversation.
* Call it "Button-driven conversation"
* Make it a starting conversation (we will explain later why it needs to be a starting conversation)

![Creating a conversation](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (4).png>)

### NLU Conversation

Now repeat the process to add the NLU conversation. Make sure to make this one a starting conversation as well.&#x20;

![NLU Conversation](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (5).png>)

We have the conversation level components in place, now we can think about the interactions that will happen within them.&#x20;

## Step 3: Create Scenes <a href="#3-button-driven-conversation-conversation-flow" id="3-button-driven-conversation-conversation-flow"></a>

{% hint style="info" %}
**Scenes** focus on even smaller aspects of a conversation containing different stages of a single conversation.
{% endhint %}

The user will _enter_ the button-driven conversation by clicking on the "Drive with a button" option. So we will add a welcome scene to this conversation to _capture_ that intent and then provide a response from the bot.&#x20;

### Welcome To Buttons Scene

Click on the Button-driven Conversation and create a Scene called "Welcome to Buttons" - set the scene behaviour as 'starting' as we will want the conversation engine to consider this scene as the entry point to the button-driven conversation.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (6).png>)

### Welcome To NLU Scene

Now let's dive into our NLU conversation where we are going to allow the user **or** the application to start the conversation. When the user, coming from the 'Welcome To Buttons!' conversation asks for the NLU interactions we will transition them to the NLU conversation and have the application reply in a starting turn. Later on we will also cater for the conversation to be started by the user.

{% hint style="warning" %}
When we switch the _cadence_ like this we describe it as having the application take the _initiative_ in a conversation.
{% endhint %}

Navigate to the NLU conversation and add a NLU welcome scene (as a starting scene).

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (10).png>)

## Step 4: Create Turns

{% hint style="info" %}
**Turns** capture single exchanges and consist of the user and application exchanging intents.
{% endhint %}

### Welcome To Buttons Scene

This scene has three turns.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (11).png>)

#### Button Welcome Turn

Now add a starting turn that will contain the first interaction we will have in this conversation. Make sure to add the starting behaviour to the turn (the open behaviour is set by default and we will keep that so that we can re-enter the turn even after the initial interaction).&#x20;

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (7).png>)

Save the turn and you will be back at the scene level.

#### More Buttons Turn

Now we will add another turn to handle more button clicking:

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (8).png>)

#### Coming From NLU Turn

We also need to add a turn there that will be ready to welcome our user in a contextually-appropriate way, in this particular case, after the user is coming from the NLU conversation.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (9).png>)

### Welcome To NLU Scene

This scene has four turns.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (16).png>)

#### App Welcome Turn

Now let's add a starting turn

![Adding a starting turn to the NLU starting scene](<../../.gitbook/assets/image (343).png>)

#### User Welcome Turn

Then we will add another starting turn with a user initiative - this will give us the other possible way into the conversation.



![](<../../.gitbook/assets/image (329).png>)

#### NLU Lyrics Turn

Ok, now that we have the two possible ways to enter the conversation let's add the intent to handle a response to the "radio ga ga". If you rewatch the video you will notice that our "NLUish" interaction is the bot inviting the user to sing with them - the user will say "radio ga ga" and the ap responds "radio goo goo" (a tribute to the song Radio Ga Ga of the band Queen for those wondering!)

So let's add a turn that is called "NLU Lyrics" in our welcome scene to capture these possible interactions.&#x20;

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (14).png>)

![Create the NLU Lyrics turn](<../../.gitbook/assets/image (376).png>)

#### Back To Buttons Turn

Finally, we will add one more turn that captures the possibility that our user will ask to go back to button-driven interaction (i.e. move to button-driven conversation)

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (15).png>)

And that's it; you've just completed a high-level design of the 'My first button-driven scenario' bot, giving our bot an essential aspect of conversational context. Next let's build out the intents.
