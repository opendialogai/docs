# Google Dialogflow Interpreter

## Configure The Interpreter

We can now create an interpreter in OpenDialog that will connect to that Dialogflow agent. On the "Interpreters Setup" page, select "Add new interpreter". Here you'll need to choose a unique name for the interpreter, enter the relevant language code, set your environment and paste your JSON key that we had just created in the previous step.

![OpenDialog Interpreter Manager](<../../.gitbook/assets/image (152).png>)

Once you've filled in the details you will be able to run a connectivity test to ensure that the API key is working correctly. &#x20;

![Dialogflow Interpreter Configuration & Test](../../.gitbook/assets/2021-06-07\_17-01-18.png)

With a success message in place you are ready to start using intents in your conversation design.&#x20;

## Mapping Intents

The Dialogflow management screen allows us to map Intents and/or Entities between OpenDialog and Dialogflow. What this means is that you can say things such as the intent calls "Example Intent" in OpenDialog should be compared with the intent called "Another Intent" in Dialogflow.&#x20;

![](<../../.gitbook/assets/image (143).png>)

This makes it simpler to reuse preexisting intents or entities without having to rename things.&#x20;

## Activate the interpreter

The last step is to activate our interpreter so that we can use it from within Scenarios.

![](<../../.gitbook/assets/image (148).png>)

## Use the interpreter for an intent

Ok - let's try out our new NLU interpreter!

We will create two intents in Dialogflow. One for "I need help" and one for "I have a question".&#x20;

![Intents in Dialogflow](<../../.gitbook/assets/image (150).png>)

The intents just have some example phrases associated with them and nothing else. We will handle the rest from within OpenDialog.&#x20;

We will create a new scenario and add two open turns in the Welcome Scene, with each turn handling one of the intents.&#x20;

![Welcome scene for Dialogflow example](<../../.gitbook/assets/image (142).png>)

![Configuring an intent to use our DF Interpreter](<../../.gitbook/assets/image (145).png>)

The request intent from the user is set to use the Interpreter that we just created and we've set the confidence level to 60%.&#x20;

The message is attached to the response intent.

![Response to help request intent](<../../.gitbook/assets/image (153).png>)

## Preview

A quick try in our WebChat widget shows that our intent is being interpreter successfully by Dialogflow and providing a response.

![](<../../.gitbook/assets/image (149).png>)

Now that we know how to handle intents using Dialogflow as an NLU interpreter let's take a look at how to use Dialogflow knowledge base to handle FAQ queries in our next section.
