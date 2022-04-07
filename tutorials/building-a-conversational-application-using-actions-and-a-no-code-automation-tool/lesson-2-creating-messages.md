# Lesson 2: Creating Messages

{% embed url="https://youtu.be/Ds_yzcsrOlA" %}

## Overview

In this lesson we will be creating and modifying messages in the intents of our conversational map that we created earlier.

{% hint style="info" %}
Note that because we aren't using any NLU we will be disabling the free-form user input field for all forms and simple messages as well as overriding the user input field thereby showing buttons as the main interaction mode for all messages with buttons. This is because we want to prevent any unexpected input from users as we are not integrating any NLU.
{% endhint %}

![All the messages in our scenario.](../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0x16a3246\_intents\_scenario=0x16a3246.png) ![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_scenario\_0x16a3246\_intents\_scenario=0x16a3246 (2).png>)

## Welcome Conversation

### Welcome Message

Let's start by modifying the welcome message. We want to inform the employee what our conversational application does and ask whether they would like to begin with the interaction.

* Navigate to the intent.app.welcomeResponseForWebchat intent in the "Welcome Turn".
* Edit the auto-generated message to what has been shown below.
* Add a "🚀Yep. Let's go" button block that simulates a user intent and select the intent "startIdentifyingEmployee" intent in the "Welcome Conversation" conversation.

![](<../../.gitbook/assets/image (445).png>)

## Identify Employee Conversation

### Identify Employee Intent Message

The next message that we will be focusing on is the the identify employee message. This message will appear once the employee has agreed to interact with our application and will prompt the user to enter their employee ID.

* Navigate to the "identifyEmployee" intent in the "Welcome Employee" turn in the "Get Employee ID" scene.
* Edit the auto-generated message to what has been shown below.
* Add a form block that has a field type of short text and attribute name of _employee\_id._
* Set the callback of the submit button to the "provideEmployeeID" intent in the "Identify Employee" conversation.

![](<../../.gitbook/assets/image (426).png>)

### Retry Employee ID Intent Message

Next we have the retry employee ID message. This message is similar to the [Identify Employee Message](lesson-2-creating-messages.md#identify-employee-intent-message) but accommodates for the context whereby an employee is trying to input their ID again.

* Navigate to the "retryEmployeeID" intent in the "Try Again" turn in the "Verify Employee ID" scene.
* Edit the auto-generated message to what has been shown below.
* Add a form block that has a field type of short text and attribute name of _employee\_id._
* Set the callback of the submit button to the "provideEmployeeID" intent in the "Identify Employee" conversation.

![](<../../.gitbook/assets/image (454).png>)

### Verify Name Intent Message

Now for  the verify name message, this message simply asks the employee to confirm their name.

* Navigate to the "verifyName" intent in the "Verify Employee ID" turn in the "Verify Employee ID" scene.
* Edit the auto-generated message to what has been shown below.
* Add a "Yes" button block that simulates a user intent and select the intent "userContinue" in the "Identify Employee" conversation.
* Add a "No" button block that simulates a user intent and select the intent "tryAgain" in the "Identify Employee" conversation.

![](<../../.gitbook/assets/image (428).png>)

### Invalid ID Intent Message

Now this message is shown if the employee inputs an ID that isn't found in the database, it notifies the employee that the ID that they entered doesn't exist then asks them to try again.

* Navigate to the "invalidID" intent in the "Verify Employee ID" turn in the "Verify Employee ID" scene.
* Edit the auto-generated message to what has been shown below.
* Add a "Try Again" button block that simulates a user intent and select the intent "tryAgain" intent in the "Identify Employee" conversation.

![](<../../.gitbook/assets/image (465).png>)

## Gather Feelings Conversation

### Select Feeling Intent Message

Next we have the select feeling message, which prompts the employee to rate how they feel.

* Navigate to the "selectFeeling" intent in the "Welcome Employee" turn in the "Gather Employee Feeling" scene.
* Edit the auto-generated message to what has been shown below.
* Add a form block with the intro text similar to what has been shown below and that has a field type of drop down, then add field options by adding the numbers 1 - 10 consecutively and set the attribute name to _feeling._
* Set the callback of the submit button to the "provideEmployeeFeeling" intent in the "Gather Feelings" conversation.

![](<../../.gitbook/assets/image (441).png>)

### Verify Feeling Intent Message

Next we have the verify feeling message which prompts the employee to confirm whether what they selected in terms of how they feel is correct.

* Navigate to the "verifyFeeling" intent in the "Verify Employee Feeling" turn in the "Verify Employee Feeling" scene.
* Edit the auto-generated message to what has been shown below.
* Add a "Yes" button block that simulates a user intent and select the intent "userContinue" intent in the "Gather Feelings" conversation.
* Add a "No" button block that simulates a user intent and select the intent "tryAgain" intent in the "Gather Feelings" conversation.

![](<../../.gitbook/assets/image (459).png>)

### Retry Employee Feeling Intent Message

This message is similar to the [Select Feeling Message](lesson-2-creating-messages.md#select-feeling-intent-message) but accommodates for the context whereby an employee is trying to input their feeling again.

* Navigate to the "retryEmployeeFeeling" intent in the "Try Again" turn in the "Verify Employee Feeling" scene.
* Edit the auto-generated message to what has been shown below.
* Add a form block with the intro text similar to what has been shown below and that has a field type of drop down, then add field options by adding the numbers 1 - 10 consecutively and set the attribute name to _feeling._
* Set the callback of the submit button to the "provideEmployeeFeeling" intent in the "Gather Feelings" conversation.

![](<../../.gitbook/assets/image (429).png>)

## Provide Recommendations Conversation

### Congratulate Employee Intent Message

This is a final message in the application and all it does is congratulate the employee for feeling good if what they selected as their feeling was greater than 5.

* Navigate to the "congratulateEmployee" intent in the "Provide Recommendations" turn.
* Edit the auto-generated message to what has been shown below.

![](<../../.gitbook/assets/image (420).png>)

### Determine Employee Problem Intent Message

Next we have the determine employee problem message. This message prompts the employee to provide more information as to why they feel bad if they selected a feeling rating below 6.

* Navigate to the "determineEmployeeProblem" intent in the "Provide Recommendations" turn.
* Edit the auto-generated message to what has been shown below.
* Add a form block with the intro text similar to what has been shown below and that has a field type of long text and attribute name of _notes._
* Set the callback of the submit button to the "provideNotes" intent in the "Provide Recommendations" conversation.

![](<../../.gitbook/assets/image (438).png>)

### Encourage Employee Intent Message

And finally we have the determine employee problem message. This is also a final or closing messaging in the application similar to the [Congratulate Employee Message](lesson-2-creating-messages.md#congratulate-employee-intent-message) but in this case this encourages the employee if they feel bad.

* Navigate to the "congratulateEmployee" intent in the "Provide Feedback" turn.
* Edit the auto-generated message to what has been shown below.

![](<../../.gitbook/assets/image (425).png>)

And we are done setting up the messages for our conversation!&#x20;

Now let's take a look at providing our attributes, conditions and expected attributes with data from webhooks using actions in our next lesson.
