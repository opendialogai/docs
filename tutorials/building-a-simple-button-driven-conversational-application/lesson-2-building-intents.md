# Lesson 2: Building Intents

{% embed url="https://youtu.be/rm01zLILpS8" %}
Building Intents | Build A Simple Button-Driven Bot #3
{% endembed %}

## Overview

Let's recap where we are so far.

* We have a Welcome conversation that can take us to the Button-driven conversation.,

## Creating Intents

{% hint style="info" %}
Within the conversational application, the app and the users take turns in a predefined pattern. This pattern can either be application-driven (request intents are app participant) or user-driven (request intents are user participant). When needed, the conversation designer can interrupt the turn-taking pattern between the participants (application - user), and switch the flow or rhythm of the conversation.
{% endhint %}

### Button Welcome Turn

#### Request Button Driving Intent

Ok, now we can click the yellow "+" button to add intents to our turn.&#x20;

The request intent will be from the user (Participant), requesting button-driven interaction. Click the '+' sign on the "Request Intents" block to add it. Fill out the details as outlined on the screenshot below.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (18).png>)

#### Confirm Button Driven Intent

Now, let's add the application response intent. Click on the "adding new intent" button in the response intents section. Then fill out the details as outlined on the screenshot below.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (19).png>)

### More Buttons Turn

Great! That handles the introductory bit of the interaction for the button-driven conversation. However, we also want to be able to click again (so we need to capture that user intent) and we will also want to switch to natural language style interaction (rewatch the video for a reminder of the types of interactions we are after).&#x20;

We will add three possible user intents to this turn - note that we've given all the intents the same value for sample phrase and intent name.&#x20;

#### **Click Away Intent (User)**

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (21).png>)

**Stick To Buttons Intent (User)**

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (22).png>)

With these first two intents, we expect that they will keep us in this turn with the application replying that we are getting good at button clicking.&#x20;

#### Button Confirmation Intent (Application)

So let's add that intent as a response intent. Click on the "adding new intent" button of response intents and add the intent as shown in the picture below. The sample utterance is "You are getting good at this" and the intent name is "buttonConfirmation".&#x20;

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (23).png>)

#### **Switch to NLU Intent (User)**

Onwards! The third user intent is "Switch to NLU" and we want it to take us to the NLU conversation. This means that we will need to insert a transition to the NLU conversation.

Add the "Switch to NLU" intent and add a transition to the conversation.&#x20;

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (25).png>)

We can transition to Conversations, Scenes or Turns and the conversation engine will pick up things from there to figure out what intents will match. Add a transition to the NLU Conversation.&#x20;

Once you save the transition change you will see a link next to the transition and you can follow that to go to the conversation. When a user selects to Switch to NLU the conversation engine will take us to the _top_ of the NLU conversation. It will then look for a starting scene and turn that it can travel through down to an intent that could be a response from the application to the Switch to NLU intent.

### App Welcome Turn

Based on the instructions above we are transitioning to the top of the NLU conversation, so we need to provide for a way for the application to respond.&#x20;

We can add the request intent, which will be from the application. The sample utterance is "Fine no buttons for you then" and the intent name is "noButtons".

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (26).png>)

**IMPORTANT!** Save the intent.

### User Welcome Turn

Then add a "Switch to NLU"  intent in the User Welcome turn.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (27).png>)

### NLU Lyrics Turn

So, we are in our NLU Welcome scene. We are expecting the user to say "radio ga ga" and we will reply with "radio goo goo" and then offer the chance to the user to repeat "radio ga ga" or to go back to button-driven interaction.&#x20;

![](<../../.gitbook/assets/image (339).png>)

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (29).png>)

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (31).png>)

### Coming From NLU Turn

Let's add an intent in that "Coming from NLU" turn.

#### Welcome Back To Buttons Intent

The sample utterance is "Buttons can be great, can't they" and the intent name is "welcomeBackToButtons".

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0xe56f02\_scenario=0xe56f02 (33).png>)

### Back To Buttons Turn

#### Take Me Back To Buttons Intent

Now, back to our NLU conversation to add the intent that will take us to the turn we just created, "Coming from NLU" with a transition. The sample utterance and the intent name are the same, "Take me back to buttons"

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin (15).png>)

And that's it; you've just built intents of turns in scenes of conversations that give you the ability to build simple button driven applications. In the next lesson, the third lesson, we look at adjusting the default conversation. Let's head over there now.
