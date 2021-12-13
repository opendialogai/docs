---
description: >-
  A tutorial to guide you through the process of building a button-driven (or
  guided) conversation and a quick view of how you can test natural language
  conversations.
---

# Designing a basic flow and controlling with buttons

In this tutorial we are going to have a look at how we can:

* design a flow with multiple conversations
* move through that flow using buttons
* introduce natural language interactions for prototyping before we connect NLU interpreters.

For this tutorial we are going to create this conversation experience:

{% embed url="https://youtu.be/picC-Hgjamo" %}

### 1. Create a new scenario

The first step is to create a new scenario. We will call it "My first button-driven scenario".

![](<../.gitbook/assets/image (361).png>)

### 2. Setting up the top level conversations

We will start by setting up the conversational flow we expect to have with different turns and intents.&#x20;

If you watch the clip at the start you can see that there are three distinct conversations. The welcome conversation (which we already have), one around button-driven interaction and one with just NLU (don't worry we will not need to setup NLU interpreters - we will use OpenDialog's easy way to fake NLU interaction for prototyping).

Let's go ahead and edit our existing scenario to reflect this structure.&#x20;

#### 2.1 Create the button-driven conversation  <a href="#2-1-create-the-button-driven-conversation" id="2-1-create-the-button-driven-conversation"></a>

Go to the top-level of the scenario and click on the "+" button to add a conversation. Let's call it "Button-driven conversation" and make it a starting conversation (we will explain later why it needs to be a starting conversation).

![Creating a conversation](<../.gitbook/assets/image (335).png>)

#### 2.2 Create the NLU conversation

Now repeat the process to add the NLU conversation. Make sure to make this one a starting conversation as well.&#x20;

![](<../.gitbook/assets/image (348).png>)

We have the conversation level components in place, now we can think about the interactions that will happen within them.&#x20;

### 3. Button-driven conversation conversation flow <a href="#3-button-driven-conversation-conversation-flow" id="3-button-driven-conversation-conversation-flow"></a>

The user will _enter_ the button-driven conversation by clicking on the "Drive with a button" option. So we will add a welcome scene to this conversation to _capture_ that intent and then provide a response from the bot.&#x20;

#### 3.1 Create a scene

Click on the Button-driven Conversation and create a Scene called "Welcome to Buttons!" - set the scene behaviour as starting as we will want the conversation engine to consider this scene as the entry point to the button-driven conversation.

![](<../.gitbook/assets/image (333).png>)

#### 3.2 Add a starting turn

Now add a starting turn that will contain the first interaction we will have in this conversation. Make sure to add the starting behaviour to the turn (the open behaviour is set by default and we will keep that so that we can re-enter the turn even after the initial interaction).&#x20;

![](<../.gitbook/assets/image (368).png>)

Save the turn and you will be back at the scene level. Click into the turn so that we can add intents.

#### 3.3 Add intents

Ok, now we can click the yellow "+" button to add intents to our turn.&#x20;

![](<../.gitbook/assets/image (370).png>)

The request intent will be from the user, requesting button-driven interaction. Click the plus sign on the "Request Intents" block to add it.

![](<../.gitbook/assets/image (347).png>)

Once you hit save you should see the following:

![](<../.gitbook/assets/image (372).png>)

Now, let's add the application response intent. Click on the "+" sign in the response intents to add that.

![](<../.gitbook/assets/image (378).png>)

Great! That handles the introductory bit of the interaction for the button-driven conversation. However, we also want to be able to click again (so we need to capture that user intent) and we will also want to switch to natural language style interaction (rewatch the video for a reminder of the types of interactions we are after).&#x20;

We are going to create another turn for that bit of interaction.&#x20;

Navigate back to the scene level:

![](<../.gitbook/assets/image (345).png>)

Now we will add another turn to handle more button clicking:

![](<../.gitbook/assets/image (346).png>)

We will add three possible user intents to this turn - note that we've given all the intents the same value for sample phrase and intent name.&#x20;

* Click away&#x20;
* Stick to buttons
* Switch to NLU

![](<../.gitbook/assets/image (356).png>)

The first two intents we expect to keep us in this turn with the application replying that we are getting good at button clicking.&#x20;

So let's add that intent as a response intent. Click on the "+" button of response intents and add the intent as shown in the picture below. The sample utterance is "You are getting good at this" and the intent name is "buttonConfirmation".&#x20;

![](<../.gitbook/assets/image (344).png>)

Save and you should get a turn that looks like this:

![](<../.gitbook/assets/image (360).png>)

Onwards! The third intent "Switch to NLU" we want to take us to the NLU conversation. This means that we will need to insert a transition to the NLU conversation.

Click on the "Switch to NLU" intent and add a transition to the conversation.&#x20;

![](<../.gitbook/assets/image (350).png>)

We can transition to Conversations, Scene or Turns and the conversation engine will pick up things from there to figure out what intents will match. Add a transition to the NLU Conversation. Once you save the transition change you will see a link next to the transition and you can follow that to go to the conversation. When a user selects to Switch to NLU the conversation engine will take us at the _top_ of the NLU conversation and will look for a starting scene and turn that it can travel through down to an intent that could be a response from the application to the Switch to NLU intent.

![](<../.gitbook/assets/image (371).png>)

### 4. NLU Conversation

Based on the instructions above we are transitioning to the top of the NLU conversation, so we need to provide for a way for the application to respond.&#x20;

Let's dive into our NLU conversation to start designing that.&#x20;

Hold on here because we are about to get a bit "OpenDialoguey..."&#x20;

For the NLU conversation we are going to allow for the user **or** the application to start the conversation. When the user, coming from the Welcome To Buttons! conversation asks ,for NLU interactions we will transition to the NLU conversation and have the application reply in a starting turn. Later one we will also cater for the conversation to start by the user.

When we switch the _cadence_ like this we describe it as having the application take the _initiative_ in a conversation

#### 4.1 Create the NLU starting turn with application initiative

Navigate to the NLU conversation and add a NLU welcome scene (as a starting scene).

![Adding a starting scene in the NLU conversation](<../.gitbook/assets/image (337).png>)

Now let's add a starting turn

![Adding a starting turn to the NLU starting scene](<../.gitbook/assets/image (343).png>)

We can add the request intent, which will be from the application

First use the dropdown under participants in a turn to switch the Request participant to the application:

![Switching participants in a turn](<../.gitbook/assets/image (354).png>)

With the participants switched we can add the application message

![](<../.gitbook/assets/image (355).png>)

Save the intent.

![](<../.gitbook/assets/image (362).png>)

Then we will add another starting turn with a user initiative - this will give us the other possible way into the conversation.

![](<../.gitbook/assets/image (329).png>)

![User initiative welcome start](<../.gitbook/assets/image (349).png>)

Ok, now that we have the two possible ways to enter the conversation let's add the intent to handle a response to the "radio ga ga". If you rewatch the video you will notice that our "NLUish" interaction is the bot inviting the user to sing with them - the user will say "radio ga ga" and the ap responds "radio goo goo" (a tribute to the song Radio Ga Ga of the band Queen for those wondering!)

![](<../.gitbook/assets/image (339).png>)



Let's think it through first.&#x20;

So, we are in our NLU Welcome scene. We are expecting the user to say "radio ga ga" and we will reply with "radio goo goo" and then offer the chance to the user to repeat "radio ga ga" or to go back to button-driven interaction.&#x20;

So let's add a turn that is called "NLU Lyrics" in our welcome scene to capture these possible interactions.&#x20;

![Create the NLU Lyrics turn](<../.gitbook/assets/image (376).png>)

![Add a user intent called radio ga ga](<../.gitbook/assets/image (364).png>)

![And an application intent called radio goo goo](<../.gitbook/assets/image (352).png>)

Finally, we will add one more turn that captures the possibility that our user will ask to go back to button-driven interaction (i.e. move to button-driven conversation)

![](<../.gitbook/assets/image (338).png>)

Before we add the intent, however, we are going to go back to our button-driven conversation and add a turn there that will be ready to welcome our user in a contextually-appropriate way.

![](<../.gitbook/assets/image (365).png>)

So our "Welcome to Buttons" scene now actually has three turns

![](<../.gitbook/assets/image (374).png>)

Let's add an intent in that "Coming from NLU" turn.

![](<../.gitbook/assets/image (377).png>)

Nice. Now, back to our NLU conversation to add the intent that will take us to the turn we just created with a transition.

![](<../.gitbook/assets/image (357).png>)

And there you have it.&#x20;

Let's recap where we are so far.

* We have a Welcome conversation that can take us to the Button-driven conversation.,
* The Button-driven conversation can leads us to the NLU Conversation.
* The NLU Conversation can take us back to the button conversation.

We can test all this by going to the top of the scenario and hitting the play button to activate the conversation player and trying out various flows.

Let's try... while quite a few options show up the first event from the webchat will be the "intent.core.welcome" - if we select that we see that we get the default welcome message as an option and after we select that we get the user's first response as an option... and that is it? Hold on! We are stuck between those two messages!

![](<../.gitbook/assets/image (367).png>)

Oops! That's not quite right, is it? We can't actually get out of the welcome conversation yet. Come to think of it we haven't adjusted our welcome conversation at all! Let's click in and see what changes we would need to make.&#x20;

### 5. Adjusting the welcome conversation

Here is the Welcome turn of the Welcome conversation.

![](<../.gitbook/assets/image (353).png>)

There is both a request and a response intent, and if you click on either of them none transitions or completes. That means we are going to be stuck in this turn indefinitely.&#x20;

Let's fix that by first deleting the response intent (we don't need it as we handle user responses in other conversations).

Click on the response intent and then click on the trash can to delete it.&#x20;

![](<../.gitbook/assets/image (342).png>)

Now, let's fix the request intent. We want it to complete the conversation so that the conversation engine will move back to the top of the scenario and consider all the other conversations (such as the button-driven one or the NLU one).&#x20;

Tick the "Intent completes conversation" checkbox for this.

![](<../.gitbook/assets/image (334).png>)

### 6. Checking the conversational flow <a href="#6-checking-the-conversational-flow" id="6-checking-the-conversational-flow"></a>

Ok, now let's go back to the conversation player and check the conversation flow.

![](<../.gitbook/assets/image (359).png>)

That is much better, isn't it. We can trigger the application, move to the welcome conversation and the flow from button-driven to NLU and back without issues.&#x20;

With the conversational flow in place as we would like it, it is time to work on our messages. The Conversation Player uses the sample messages but for our final application we want to insert those buttons and do so much more! Time to move start using the message editor.

### 7. Message Editor <a href="#7-message-editor" id="7-message-editor"></a>

Messages are associated with what we call "outgoing intents". Outgoing intents are intents that the application has. They are sent to the user, but of course, the user does not receive an intent. The user receives a message that carries the application's intent. Just as the application receives a message and attempts to map it to an intent. The relationship is mirrored, which makes it consistent and coherent.&#x20;

Let's start with the welcome conversation. Click on the welcome conversation and then click on the bubble with a pen inside to go to the message editor for messages within the welcome conversation.

![](<../.gitbook/assets/image (358).png>)

You should see just one message, click on it so we can start editing it.

![](<../.gitbook/assets/image (332).png>)

As you can see it already has a button associated with it. We are going to change it to drive us to the various conversation we want to get to. Click the edit button to go into the message and replace the "Ok" with "Drive with a button". Then in the button functionality we want to "Simulate user intent".

![](<../.gitbook/assets/image (369).png>)

Then select the "requestButtonDriving" intent from within the Button-Driven Conversation.

![](<../.gitbook/assets/image (363).png>)

Also add a second button that will take us to the NLU conversation.

![](<../.gitbook/assets/image (330).png>)

When the user clicks either of those buttons we will find ourselves at the top of the scenario looking for _open_ conversations we could enter. Because further up we set our conversations, scenes and turns are open we will find our way through to one of those two conversations based on the button we press.&#x20;

Great. That takes care of the welcome conversation let us move to the button-driven conversation. Save you welcome scene button, go back to the designer, navigate to the Button-driven conversation and click on the message editor for that conversation.&#x20;

You should see three messages that we need to deal with here.&#x20;

![](<../.gitbook/assets/image (366).png>)

The first one is the welcome message that will then invite us to "Click away" with a button, the second will invite us to either switch or stick to buttons and the third will welcome us back to buttons after the NLU conversation. Let's dive into each one.

For the first one we removed the text block (click on the "X" next to the message) and added a button block with the same text but then a button called "Click away" and a simulated intent of "Click away".

![](<../.gitbook/assets/image (375).png>)

Save and then navigate back to message overview and click on the "Welcome to buttons" scene to get the three messages.

![](<../.gitbook/assets/image (336).png>)

The "buttonConfirmation" message will give us the choice to stick to buttons or switch to NLU.

![](<../.gitbook/assets/image (331).png>)

As you can see the "Stick to buttons" button just simulates the "Click away" intent once more while the "Switch to NLU" button will simulate the "Switch to NLU" intent that is within the Button-driven conversation.&#x20;

Ok. You should be getting the hand of this by now. Last one to go. The welcome back to buttons message. This one will also give us a button to click away.&#x20;

![](<../.gitbook/assets/image (373).png>)

We are done with the Button-driven conversation so let's head to the NLU one and fix messages there.

![](<../.gitbook/assets/image (351).png>)

Just two messages to content with here. The fist one we want to enhance so that it invites the user to sing!

![](<../.gitbook/assets/image (379).png>)

The second one gives us the choice to go back to the button-driven conversation or sing again.

![](<../.gitbook/assets/image (341).png>)

There you have it. All that is left now is to activate the conversation so that we can view it in the Preview player or deploy it on a website.&#x20;

### 8. Activating and testing your Scenario

Navigate to the designer and find your scenario in the list. Click on the slider to active your Scenario (it should now be green). You're Scenario is now active! You're ready to test it.

To test your application navigate to the preview section and select your Scenario from the drop-down menu. You should then see WebChat appear with the welcome response you created.

![](<../.gitbook/assets/image (340).png>)

{% hint style="info" %}
Remember when testing the NLU simulation it needs to exactly match what you setup as the intent name e.g "radio ga ga"
{% endhint %}

Congratulations! You've now made your first ever button-driven bot and even simulated some NLU.

Let's recap the main points:

* You start by creating a new scenario
* Setup the conversations to be had
* Design your scenes and turns, taking care around what is a starting scene and starting or open turns
* Check your conversations flows to make sure it all behaves as you would expect.
* Finalise your messages with the right tone of voice.
* Activate your scenario and test the real thing in Preview before [launching to your website](../launching-your-application.md).&#x20;

While the default callback interpreter is essential for button-driven interaction and can help with simple prototyping, but for actual NLU we need to use an [NLU interpreter which we discuss here](../interpreters-and-natural-language-understanding/dialogflow-interpreter.md).&#x20;
