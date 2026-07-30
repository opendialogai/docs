---
title: Google Dialogflow interpreter
---

## Configure the interpreter

We can now create an interpreter in OpenDialog that will connect to that Dialogflow agent. On the "Interpreters Setup" page, select "Add new interpreter". Here you'll need to choose a unique name for the interpreter, enter the relevant language code, set your environment and paste your JSON key that we had just created in the previous step.

![OpenDialog Interpreter Manager](~/assets/image-394.png)

Once you've filled in the details you will be able to run a connectivity test to ensure that the API key is working correctly. 

![Dialogflow Interpreter Configuration & Test](~/assets/2021-06-07-17-01-18-1.png)

With a success message in place you are ready to start using intents in your conversation design.

## Mapping intents

The Dialogflow management screen allows us to map Intents and/or Entities between OpenDialog and Dialogflow. What this means is that you can say things such as the intent calls "Example Intent" in OpenDialog should be compared with the intent called "Another Intent" in Dialogflow.

![](~/assets/image-434.png)

This makes it simpler to reuse preexisting intents or entities without having to rename things.

## Activating the interpreter

The last step is to activate our interpreter so that we can use it from within scenarios.

![](~/assets/image-8.png)

## Using the interpreter for an intent

Ok - let's try out our new NLU interpreter!

We will create two intents in Dialogflow. One for "I need help" and one for "I have a question".

![Intents in Dialogflow](~/assets/image-89.png)

The intents just have some example phrases associated with them and nothing else. We will handle the rest from within OpenDialog.

We will create a new scenario and add two open turns in the Welcome Scene, with each turn handling one of the intents.

![Welcome scene for Dialogflow example](~/assets/image-256.png)

![Configuring an intent to use our DF Interpreter](~/assets/image-33.png)

The request intent from the user is set to use the Interpreter that we just created and we've set the confidence level to 60%.

The message is attached to the response intent.

![Response to help request intent](~/assets/image-436.png)

## Preview

A quick try in our WebChat widget shows that our intent is being interpreter successfully by Dialogflow and providing a response.

![](~/assets/image-101.png)

Now that we know how to handle intents using Dialogflow as an NLU interpreter let's take a look at how to use Dialogflow knowledge base to handle FAQ queries in our next section.
