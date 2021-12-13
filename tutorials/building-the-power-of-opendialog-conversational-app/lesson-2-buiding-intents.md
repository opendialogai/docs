---
description: >-
  In this lesson, we'll focus primarily on how to create intents and test
  conversational flows.
---

# Lesson 2: Buiding Intents

## Overview

{% embed url="https://www.youtube.com/embed/Krx9-JI2XaY" %}

In this lesson we'll cover:

1. &#x20;Creating Intents
2. Testing Conversational Flows

## **Step 1: Create Intents**

We are almost at the bottom of the cascading conversational components needed to design a conversation. Remember that in a conversation, there are at least two participants, and they interact with each other by exchanging utterances, and each utterance carries a specific intent. It contains the information that the user or the application needs to transmit to the other party.

Turns contain a set of response and request intents, but we will be following a design pattern in our particular case, whereby we only have request intents within our turns. This enables us to do cadence switches on transitions to have natural conversational flows.

{% hint style="info" %}
Within the conversational application, the app and the users take turns in a predefined pattern. This pattern can either be application-driven (request intents are app participant) or user-driven (request intents are user participant). When needed, the conversation designer can interrupt the turn-taking pattern between the participants (application - user), and switch the flow or rhythm of the conversation.
{% endhint %}

Now let's take a look at our Welcome Turn that we created previously.

### Request Button Feature Intent

* Click on add intent button over here.
* Select which participant should initiate a turn (in this case, it is the Application as it is welcoming the user into the Buttons conversation)
* Give it a Sample Utterance (the phrase used to remind us or our team what content the intent is supposed to support)
* Name the intent (use a more formal name to refer to it through interpreters or in the message repository, e.g., requestButtonFeature)

![](<../../.gitbook/assets/Screenshot (72).png>)

* Click Behavior (intents have a completing behavior which means that if the intent is matched, it will take us back to the top of the scenario and look for another way in through STARTING conversations, scenes, or turns)
* Click Transitions (help us transition to another conversation or scene if the intent is matched. In this case, we will be transitioning into the Next turn within the Welcome User scene as it would contain the intents from the opposite participant)
* Click on Save

Now that we've made our App Request Intent let's look at the turn that contains the opposite participant, the user, and what possible intents the user may have.

* Navigate back to the Welcome User scene

This is now where the Next turn comes in. Remember from the previous lesson that this turn focuses on the navigation of the scenes. _****_ In our case, this will be where the user request intents of what the user would like to navigate to, would be placed. This would be to see **Button Behaviours**, **Button Functionalities** or see the **Other Capabilities** covered in the other conversations.

Now let’s create these intents.

### Select Button Functionalities Intent

* Add Participant (User)
* Add Sample Utterance (Button Functionalities)
* Add Intent Name (selectButtonFunctionalities)
* This will not have a completing behaviour.&#x20;
* In this particular tutorial series, we will not be using any NLU as it is button-driven, so the default interpreter is sufficient to handle buttons.&#x20;

![](<../../.gitbook/assets/Screenshot (73).png>)

* Select the transition (**Button Functionalities** scene)
* Click Save

![](<../../.gitbook/assets/Screenshot (75).png>)

### Select Button Behaviours Intent

We will apply the same logic to the other similar user intent, selectButtonBehaviours, with the transition navigating to the Button Behaviours scene.

* Add Participant (User)
* Add Sample Utterance (Button Behaviours)
* Add Intent Name (selectButtonBehaviours)

![](<../../.gitbook/assets/Screenshot (76).png>)

* Select the transition (**Button Behaviours** scene)
* Click Save

![](<../../.gitbook/assets/Screenshot (77).png>)

### Select Other Capabilities

Finally, within this turn, we have Other Capabilities—still a user participant. In our case, in terms of the sample utterance, we shall keep it as 'Other Capabilities' and for the name selectOtherCapabilities. Now for the transition, this will transition into the Explore More turn.

* Add Participant (User)
* Add Sample Utterance (Other Capabilities)
* Add Intent Name (selectOtherCapabilities)

![](<../../.gitbook/assets/Screenshot (78).png>)

* Select the Transition (**Explore More** turn)
* Click Save

![](<../../.gitbook/assets/Screenshot (79).png>)

And that’s it for the Next intents.

![](<../../.gitbook/assets/Screenshot (80).png>)

### Explore More Intent

Now let's take a look at the Explore More turn's intent. This serves more or less the same function as the Welcome Turn but with the context of having already been in the conversation, compared to the Welcome turn, which is the viewer's first encounter with conversation.

* Add Participant (Application)
* Add Sample Utterance (Other Button Features)
* Add Intent Name (exploreMore)
* Click Save

![](<../../.gitbook/assets/Screenshot (81).png>)

And that’s it for the Welcome User scene’s turns and intents.

### Describe Button Functionalities Intent

Now let's move on to the Button Functionalities scene. Let's start with the turn with the starting behaviour, Describe Functionalities. Note that this turn is similar in function to the Welcome Turn we mentioned earlier. With regards to its intent, it is an app request intent, our Sample Utterance will be Describe Button Functionality, and the intent name is describeButtonFunctionality.

* Add Participant (Application)
* Add Sample Utterance (Describe Functionalities)
* Add Intent Name (describeButtonFunctionality)
* Set it to the Next turn within Button Functionalities scene for the transition.
* Click Save

![](<../../.gitbook/assets/Screenshot (84).png>)

### Show URL Button Intent

Now for the URL Buttons, turn's intent. This shall be an app request intent as it will be the application responding to the user's request to see the URL Button. Our sample utterance will be Show URL Button, and the name will be showURLButton. It shall not have a completing behaviour because the user may want to interact with other turns within the scene, such as the Simulating Intents turn.

* Add Participant (Application)
* Add Sample Utterance (Show URL Button)
* Add Intent Name (showURLButton)
* Click Save

![](<../../.gitbook/assets/Screenshot (85).png>)

With that in mind, we will need the transition to be the Next turn within our scene because we will allow them to re-navigate to other turns.

### Show Simulating Intent Button

Now for the Simulating Intents turn's intent. Note that this turn function is very similar to URL Buttons, with the difference coming into play with the messaging. They both show the specific button functionality through the use of the appropriate message. Our sample utterance, in this case, will be Show Simulating Intent Button, and the name will be showSimulatingIntentButton.

* Add Participant (Application)
* Add Sample Utterance (Show Simulating Intent Button)
* Add Intent Name (showSimulatingIntentButton)
* Click Save

![](<../../.gitbook/assets/Screenshot (86).png>)

We will also transition into the same Next turn within our scene for reasons mentioned earlier.

Now for our last turn that we will be focusing on again, the Next turn. Note that this will have the same function as the Next turn within our Buttons Welcome User Scene. User intents navigate to the right turns within the scene and other scenes entirely using the default interpreter. Let's start with the selectURLButton intent with a sample URL Button utterance, use the default interpreter, and transition to the URL Buttons turn.

### Select URL Button

* Add Participant (User)
* Add Sample Utterance (URL Button)
* Add Intent Name (selectURLButton)

![](<../../.gitbook/assets/Screenshot (87).png>)

* Select the Transition (**URL Buttons** turn)
* Click Save

![](<../../.gitbook/assets/Screenshot (88).png>)

### Select Simulating Intent Button Intent

Next, we have the selectSimulatingIntentButton intent with a sample utterance of Simulating Intent Button, which transitions into the Simulating Intents turn.

* Add Participant (User)
* Add Sample Utterance (Select Simulating Intent Button)
* Add Intent Name (selectSimulatingIntentButton)

![](<../../.gitbook/assets/Screenshot (90).png>)

* Select the Transition (**Simulating Intents** turn)
* Click Save

![](<../../.gitbook/assets/Screenshot (91).png>)

### Show Other Features Intent

Finally, we have the showOtherFeatures with a sample utterance of Other Button Features and a transition set to the Explore More turn within the Welcome User scene.

* Add Participant (User)
* Add Sample Utterance (Other Button Features)
* Add Intent Name (showOtherFeatures)

![](<../../.gitbook/assets/Screenshot (92).png>)

* Select the Transition (**Explore More** turn)
* Click Save

![](<../../.gitbook/assets/Screenshot (93).png>)

And that's it; we've completed the intents within the Welcome User and Button Functionalities scenes.

The same design pattern we used to make the Button Functionalities scene should be used to make the Button Behaviours scene.

And that's it; you've created several intents; now it's time to test them to see whether it all makes sense.

## **Step 2: Test Conversational Flow**

The Conversation Simulator is the quickest way to test out different conversational flows based on your designs. It shows you what flows are possible given a specific utterance from either the user or the application. It is focused on flow and does not take into account interpretation or any conditions.

* Click the Play Button
* Choose an intent that the user could express to get the conversation started.

![](<../../.gitbook/assets/Screenshot (95).png>)

Select different intents and see whether you get the desired conversational flow. This will give you a good understanding of how the Power of OpenDialog flow would be like, before diving into actually setting up NLU or doing detailed messaging.

![](<../../.gitbook/assets/Screenshot (96).png>)

And that's it; you've just built intents of turns in scenes of conversations that give you the ability to design even more powerful conversations and have understood how to test your conversational flows. In the next lesson, the final lesson, we look at creating messages and buttons.
