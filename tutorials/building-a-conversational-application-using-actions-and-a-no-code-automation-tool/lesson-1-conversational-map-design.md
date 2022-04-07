# Lesson 1: Conversational Map Design

{% embed url="https://youtu.be/Zkr70UA-64E" %}

## Overview

Let's start by building the full conversational design of our scenario, from the conversations all the way down to the intents. Note that we will not be making any changes to the messages just yet, as that will be in our next lesson.

![](<../../.gitbook/assets/image (468).png>)

## Employee Mental Fitness Bot Scenario

The first step is to create a new scenario. We will call it "Employee Mental Fitness Bot".

Now, apart from our default conversations, our scenario will consist of three additional conversations:

* Identify Employee Conversation
* Gather Feelings Conversation
* Provide Recommendations Conversation

Create the above conversations without any starting behaviours.

![](../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_demo\_scenario=0x16a3246.png)

## Welcome Conversation

This is a default conversation that focuses on greeting the employee when they first interact with the application. We will be modifying it to meet our particular needs.&#x20;

![Welcome Conversation Overview](<../../.gitbook/assets/image (470).png>)

### Welcome Scene

#### Welcome Turn

Start by navigating to the Welcome Turn in the Welcome Scene.&#x20;

* Delete the default response intent (we don't need it as we handle user responses in the FAQ conversation).

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_demo\_scenario=0x16a3246 (2) (1).png>)

#### Start Identification Turn

Navigate back to the Welcome Scene and create a new turn called "Start Identification".&#x20;

* Set Behaviour to Open.
* Add a user request called "startIdentifyingEmployee"&#x20;
* Set transitions to the "Identify Employee" conversation.&#x20;

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_demo\_scenario=0x16a3246 (1).png>)

## Identify Employee Conversation

This will be the next conversation that an employee will be transitioned into after having been welcomed by the bot. The objective of this conversation is to get the employee ID and verify the employee's name.

* Create a new scene called "Get Employee ID".
* Set the behaviour as starting.
* Create a new scene called "Verify Employee ID".

![](<../../.gitbook/assets/image (452).png>)

{% hint style="info" %}
Note that the sample utterances for all the intents will be left to your discretion, feel free to copy the ones shown in the screenshots shown.
{% endhint %}

### Get Employee ID Scene

This scene asks the employee for their ID, after it has been provided, it transitions to the next scene in the conversation, the "Verify Employee ID" scene.

#### Welcome Employee Turn

* Create a new turn called "Welcome Employee".
* Set the behaviour to both starting and open.
* Add an app intent called "identifyEmployee"

![identifyEmployee Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_demo\_scenario=0x16a3246 (3).png>)

#### Provide Employee ID Turn

This contains a user request that transitions to the "Verify Employee ID" scene.&#x20;

* Create a new turn called "Provide Employee ID".
* Set the behaviour to open and starting.
* Add a user intent called "provideEmployeeID".
* Set a transition to the "Verify Employee ID" scene.
* Set the expected attributes to _user.employee\_id_

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_demo\_scenario=0x16a3246 (4).png>) ![](../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a3216\_scenario=0x16a3246\&intent=0x16c559e.png)

### Verify Employee ID Scene

This scene verifies the employees ID and confirms their name associated with the ID. Once confirmed the employee is transitioned into the "Gather Feelings" conversation.

#### Verify Employee ID Turn

This turn contains 2 app intents, one to verify the employee's name if the ID was found and the other requests for the employee's ID again if it was not found in the database.

* Create a new turn called "Verify Employee ID"
* Set the behaviour to starting and open.
* Add an app intent called "verifyName".
* Set a condition to _user.name is set._ (So that it is only triggered if the name attribute is received from our webhook and set in our user context, more on this later).

![verifyName Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_demo\_scenario=0x16a3246 (5).png>) ![Conditions Set](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_demo\_scenario=0x16a3246 (7).png>)

* Add another app intent called "invalidID".

![invalidID Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_demo\_scenario=0x16a3246 (6).png>)

{% hint style="info" %}
Note that there is no need to set the condition for the "invalidID" intent to _user.name is not set_ because this is assumed and as a result would be chosen when in the turn.&#x20;
{% endhint %}

#### Confirm Name Turn

This contains a user request that transitions to the "Gather Feelings" conversation.&#x20;

* Create a new turn called "Confirm Name".
* Set the behaviour to open.
* Add a user intent called "userContinue".
* Set a transition to the "Gather Feelings" conversation.

![userContinue Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0x1747ae4\_scenario=0x1747ae4 (14).png>)

#### Try Again Turn

This turn contains 2 intents, one is a user request used when a user has requested to try entering their employee ID again because the name that was suggested for confirmation was incorrect. The other intent is an app intent that responds to the user request to try again by prompting them to enter the employee ID again and transitioning back to "Provide Employee ID" scene.

* Create a new turn called "Try Again".
* Set the behaviour to open.
* Add a user intent called "tryAgain".

![tryAgain Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0x1747ae4\_scenario=0x1747ae4 (15).png>)

* Add another intent called "retryEmployeeID".
* Set a transition back to the "Get Employee ID" scene.

![retryEmployeeID Intent](../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a3232\_scenario=0x16a3246\&intent=0x16a3243.png)

## Gather Feelings Conversation

After the employee has been identified and has confirmed their name. They will be transitioned into this conversation. The objective of this conversation is to get the employee's rating in terms of how they feel and confirm whether that's really how they feel.

![](<../../.gitbook/assets/image (446).png>)

### Gather Employee Feelings Scene

This scene asks the employee for a rating of how they feel. After their feeling has been provided, it transitions to next scene in the conversation, the "Verify Employee ID" scene.

* Create a new scene called "Gather Employee Feeling".
* Set the behaviour as starting.

#### Welcome Employee Turn

This turn's objective is to prompt the user to rate how they feel.&#x20;

* Create a new turn called "Welcome Employee".
* Set the behaviour to starting and open.
* Add an app intent called "selectFeeling".

![selectFeeling Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_demo\_scenario=0x16a3246 (10).png>)

#### Provide Employee Feeling Turn

This contains a user request that transitions to the "Verify Employee Feeling" scene.&#x20;

* Create a new turn called "Provide Employee Feeling".
* Set the behaviour to starting and open.
* Add a user intent called "provideEmployeeFeeling".
* Set a transition to the "Verify Employee Feeling" scene.
* Set the expected attributes to _user.feeling._

![provideEmployeeFeeling Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0x1747ae4\_scenario=0x1747ae4 (11).png>) ![user.feeling Expected Attribute](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0x1747ae4\_scenario=0x1747ae4 (12).png>)

### Verify Employee Feeling Scene

This scene verifies the employees feeling by asking whether the rating they selected is correct otherwise they are prompted to enter it again. Once confirmed the employee is transitioned into the "Provide Recommendations" conversation.

* Create a new scene called "Verify Employee Feeling".

#### Verify Employee Feeling Turn

This turn contains an app intent to verify the employee's feeling.

* Create a new turn called "Verify Employee Feeling"
* Set the behaviour to starting and open.
* Add an app intent called "verifyFeeling".
* Set a condition to _user.feeling is set_.

![verifyFeeling Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_demo\_scenario=0x16a3246 (13).png>) ![user.feeling is set Condition](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_demo\_scenario=0x16a3246 (14).png>)

#### Confirm Feeling Turn

This contains a user request that transitions to the "Provide Recommendations" conversation.&#x20;

* Create a new turn called "Confirm Feeling".
* Set the behaviour to open.
* Add a user intent called "userContinue".
* Set a transition to the "Provide Recommendations" conversation.

![userContinue Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0x1747ae4\_scenario=0x1747ae4 (13).png>)

#### Try Again Turn

Similar to the "Try Again" turn in the "Verify Employee" scene, this turn also contains 2 intents, one is a user request used when a user has requested to try entering their employee feeling again because the feeling that was shown was incorrect. The other intent is an app intent that responds to the user request to try again by prompting them to enter the employee feeling again and transitioning back to the "Gather Employee Feelings" scene.

* Create a new turn called "Try Again".
* Set the behaviour to open.
* Add a user intent called "tryAgain".

![tryAgain Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0x1747ae4\_scenario=0x1747ae4 (17).png>)

* Add another intent called "retryEmployeeFeeling".
* Set a transition back to the "Gather Employee Feelings" scene.

![retryEmployeeFeeling Intent](../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a323e\_scenario=0x16a3246\&intent=0x16a324a.png)

## Provide Recommendations Conversation

After the employee has confirmed their rating in term of how they feel, they will be transitioned into this conversation. The objective of this conversation is to save the employee's rating in terms of how they feel and congratulate them if they feel good otherwise request feedback with regards to why they feel bad and encourage them.

![](<../../.gitbook/assets/image (461).png>)

### Provide Recommendations Scene

This is the only scene in the conversation and it contains 2 different turns, one that responds to how the employee feels, good or bad. The other captures feedback from the employee and comforts them.&#x20;

* Create a new scene called "Provide Recommendations".
* Set the behaviour as starting.

#### Provide Recommendation Turn

This turn contains 2 user intents, one to congratulate the employee if they feel good, save their feeling to the database and ends the conversation. The other intent on the other hand, asks why the employee doesn't feel good.

* Create a new turn called "Provide Recommendation"
* Set the behaviour to starting and open.
* Add an user intent called "congratulateEmployee".
* Set the intent behaviour to completing.
* Set a condition to _user.feeling is Greater than 5._&#x20;

![congratulateEmployee Intent](../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a3223\_scenario=0x16a3246\&intent=0x16c566e.png) ![Conditions Set](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a3223\_scenario=0x16a3246\&intent=0x16c566e (1).png>)

* Add a user intent called "determineEmployeeProblem"

![determineEmployeeProblem Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a3223\_scenario=0x16a3246\&intent=0x16c566e (3).png>)

#### Provide Feedback Turn

This turn contains 2 intents, one is a user request used when a employee inputs the reason why they aren't feeling good. The other intent is an app intent that responds to the user request and encourages them to not feel bad.

* Create a new turn called "Provide Feedback".
* Set the behaviour to open.
* Add a user intent called "provideNotes".
* Set the expected attributes to _user.notes._

![provideNotes Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a3223\_scenario=0x16a3246\&intent=0x16c566e (5).png>) ![Expected Attributes Set](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a3223\_scenario=0x16a3246\&intent=0x16c566e (6).png>)

* Add an app intent called called "encourageEmployee".
* Set the intent behaviour to completing.

![encourageEmployee Intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a3223\_scenario=0x16a3246\&intent=0x16c566e (7).png>)

And you are done with the conversational map, giving our Employee Mental Fitness bot an essential aspect of conversational context. I'd suggest that you test your conversational flow to make sure that you grasp the flow and make sure that your conversational design is structurally sound. Next we focus on creating the different messages to the app intents we've set up.
