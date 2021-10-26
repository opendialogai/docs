---
description: >-
  In this lesson, we'll focus on creating messages and buttons and finally get
  the opportunity to wrap up the series by finally previewing our bot.
---

# Lesson 3: Creating Messages and Buttons

## **Overview**

{% embed url="https://www.youtube.com/embed/g_TcpQinz3g" %}

In this lesson we'll cover:

1. &#x20;Creating Messages
2. Creating Buttons
3. Previewing the Application

## **Step 1: Create Messages**

At this stage, you've learned about all the core concepts of OpenDialog. We completed all the intents for the different turns in our Button's conversation scenes during our last lesson. Remember that messages are associated with intents that the application generates.&#x20;

To convey an application intent to the user, we need a repository of messages that maps an intent to a specific message that carries the appropriate utterance to the user. At each level of a scenario, you can access messages through the message icon in the action bar. When you click on it, you are directed to the message editor, which gives you a global view of all the messages associated with a scenario, and you can dive into editing them.

Now let’s continue with the development of our Buttons conversation.

### Welcome User Scene

* Navigate to the Welcome Turn of our Welcome Scene, then into the intents..
* Select the message icon to be directed to the message editor

![](<../../.gitbook/assets/Screenshot (97).png>)

{% hint style="info" %}
To help understand which intent or intents you're viewing, you can see a breadcrumb style list of links to outline which group of intents you see at the top of the screen.
{% endhint %}

![The breadcrumb is shown underneath the conversational context.](<../../.gitbook/assets/Screenshot (100).png>)

* Click on the intent (requestButtonFeature)
* Delete the auto-generated message, as we do not need it.

![](<../../.gitbook/assets/Screenshot (102).png>)

* Click Add a New Message (Enter the first message that users will interact with in the Buttons conversation)

{% hint style="info" %}
For now, we don't need to be concerned with the behaviour section. We'll get back to that later.&#x20;
{% endhint %}

![](<../../.gitbook/assets/Screenshot (104).png>)

* Add the message name (Describe and Select Button Feature)
* Add a text message (Mention that the button message enables you to add buttons that can function as user intents or links to webpages.)

![](<../../.gitbook/assets/Screenshot (105).png>)

## **Step 2: Create Buttons**

Our first button will be the Button Functionalities button.

* Add the Button Text (Button Functionalities)
* Select the Button Functionality,  this is the action we would like the button to perform on click. (Simulating Intent)
* Select the Simulating Intent (selectButtonFunctionalities)

![](<../../.gitbook/assets/Screenshot (106).png>)

You've now made your first button. When the user clicks the button, the conversation engine will match that intent and perform any intent-defined transition. In this case, it will be a transition to the **Button Functionalities** scene.

Now for the next button the Button Behaviours button. We'll be using the same methodology we used to set up the Button Functionalities button.

* Click on the "+" button to add a new button after the Button Functionalities button.
* Add the Button Text (Button Behaviours)
* Select the Button Functionality (Simulating Intent)
* Select the Simulating Intent (selectButtonBehaviours)

![](<../../.gitbook/assets/Screenshot (108).png>)

And finally, Other Capabilities, still using the same methodology, but with our simulating intent being showOtherCapabilities.

* Click on the "+" button to add a new button after the Button Functionalities button.
* Add the Button Text (Other Capabilities)
* Select the Button Functionality,  this is the action we would like the button to perform on click. (Simulating Intent)
* Select the Simulating Intent (showOtherCapabilities)

![](<../../.gitbook/assets/Screenshot (134).png>)

And we are done with the messages within the Welcome User scene.

### Button Functionalities Scene

Now let's navigate to the Button Functionalities scene; our welcome message within this scene will be in the describeFunctionalityIntent.

![](<../../.gitbook/assets/Screenshot (110).png>)

* Click on the Message Editor
* Delete the Auto-Generated Message
* Click Add A New Message

This message will be similar to the welcome message we just made. (The first text message will describe what button functionality is available. This text message will prompt the user to select which Button Functionality they would like to find out about. This will be the URL Button or the Simulating Intent Button or whether they would like to see other button features)

![](<../../.gitbook/assets/Screenshot (111).png>)

* Add the Message Name (Button Functionality Description)
* Add a Text message (Describe that the button functionality is the action that you would like the button to perform on click)
* Add a Button Block
* Add an Optional Text message (Prompt the user to select which button functionalities they would like to find out about)
* Add the Button Text (URL Buttons)
* Select the Button Functionality (Simulating Intent)
* Select the Simulating Intent (selectURLButton)

![](<../../.gitbook/assets/Screenshot (112).png>)

* Click on the "+" button to add a new button after the URL Buttons button.
* Add the Button Text (Simulating Intent Button)
* Select the Button Functionality,  this is the action we would like the button to perform on click. (Simulating Intent)
* Select the Simulating Intent (selectSimulatingIntentButton)

![](<../../.gitbook/assets/Screenshot (113).png>)

* Click on the "+" button to add a new button after the Simulating Intent Button button.
* Add the Button Text (Other Button Features)
* Select the Button Functionality,  this is the action we would like the button to perform on click. (Simulating Intent)
* Select the Simulating Intent (showOtherButtonFeatures)

![](<../../.gitbook/assets/Screenshot (135).png>)

Now for the URL Buttons turn, the objective of the message within this turn is to demo the URL Button.

![](<../../.gitbook/assets/Screenshot (136).png>)

* Delete the Auto-Generated Message.
* Click Add A New Message.
* Add the Message Name (Display URL Button)
* Add a Text message (Mention that URL buttons enable users to navigate to external links.)

![](<../../.gitbook/assets/Screenshot (137).png>)

* Add a Button Block
* Add an Optional Text message (Explain to the user that the button will showcase what would happen when you'd click on the URL button)
* Add the Button Text (Docs)
* Select the Button Functionality (Link to URL)
* Enter a URL (message-markup OpenDialog docs)

![](<../../.gitbook/assets/Screenshot (115).png>)

* Add Simulating Intent Button. It is a Simulating Intent that navigates to the user intent selectSimulatingIntentButton.&#x20;
* And finally, within this message, our simulating intent will be showOtherFeatures.

{% hint style="info" %}
The conversation engine will match that intent and perform any transition that that intent defines. In this case, it will be a transition to the Explore More in our Welcome User scene.
{% endhint %}

![](<../../.gitbook/assets/Screenshot (117).png>)

Now let's navigate back to the designer and our last intent for making a message in this tutorial, Simulating Intents.

![](<../../.gitbook/assets/Screenshot (118).png>)

Note that we will be applying the same methodology we used to create URL Buttons in this case.

* Delete the auto-generated message.
* Create a new message.

![](<../../.gitbook/assets/Screenshot (119).png>)

* Add display buttons that navigate only to the selectURLButton and showOtherFeatures.

![](<../../.gitbook/assets/Screenshot (123).png>) ![](<../../.gitbook/assets/Screenshot (120).png>)

And we are done.

Now that we've done it for the Button Functionalities scene, I would like you to try it out using the same pattern but apply it to the Button Behaviours scene.

![](<../../.gitbook/assets/Screenshot (124).png>)

## Recap

Now that we are approaching the end of the development of our bot let's recap and test our understanding of all the different conversational components that we’ve covered in this tutorial by editing and completing the default Welcome Conversation. For the sake of time, I'll make this quick.

* Navigate to the Welcome conversation and into the Welcome Scene; we already see a Welcome turn.
* Add a Next Turn.

![](<../../.gitbook/assets/Screenshot (125).png>)

* Select the Welcome Turn
* Select the Intents
* Select and delete the default User Response Intent

![](<../../.gitbook/assets/Screenshot (126).png>)

* Select the App Intent
* Change App Intent to our preferences.
* Set our Sample Utterance to Welcome to The Power of OpenDialog,
* Do not change Intent Name (this is a reserved intent name mapped to an event when the web chat loads for a new user to provide a way to kick start the conversation)
* It will not have the behaviour of completing the conversation as it is creating it.&#x20;
* It will not have any transition as the conversation engine will match it to the associated user request intent in our Welcome Scene.

![](<../../.gitbook/assets/Screenshot (127).png>)

Now for the next turn, note that we'll only have one user intent for now since we only built the buttons conversation within our scenario.

* Create user intent (requestButtons)
* Add the Sample Utterance (Buttons)
* We'll leave the interpreter as it is because it can interpret button-driven interactions.&#x20;
* It will not have a completing behaviour
* Its transition will be set to the Buttons conversation

![](<../../.gitbook/assets/Screenshot (129).png>)

And you are done with the Next Turn.\
Now we are left with completing the Welcome User turn by:

![](<../../.gitbook/assets/Screenshot (130).png>)

* Navigate back to the intent.
* Select the message editor.
* Delete the auto-generated message.
* Click on add a new message.&#x20;
* Give your message the name Welcome Message
* Our first text message will have what our users will first see when they interact with our bot.

![](<../../.gitbook/assets/Screenshot (131).png>)

* Add a button block.
* Add a text (To prompt the user to click on the button below).
* Add a button called Buttons.
* With button functionality, set the button to a requestButtons simulating intent in our Welcome Conversation.

![](<../../.gitbook/assets/Screenshot (132).png>)

And that’s it, congratulations on creating your first fully functional bot.

## **Step 3: Preview Application**

We now need to know whether our bot works, so we must test and validate the conversational experience before deploying our application.

* Click on Preview Menu Button
* A chat icon should appear; select it.

![](<../../.gitbook/assets/Screenshot (133).png>)

The webchat should appear displaying your scenario welcome conversation ready for you to interact with it.

{% hint style="info" %}
The conversational context updates to show you the intent that is currently being displayed.
{% endhint %}

And there you have it, a well-designed demo of The Power of OpenDialog. Using design principles oriented around the separation of concerns, this bot could grow into something as comprehensive and robust as the current Power of OpenDialog bot used on our site.

We have now reached the end of our tutorial series. Stay tuned for our next series, where we cover an even more advanced bot using more of the advanced features of OpenDialog. See you next time.
