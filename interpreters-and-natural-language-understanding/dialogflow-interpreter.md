# Dialogflow Interpreter

The OpenDialog Dialogflow integration allows us to use Dialogflow intent interpretation, entity extraction and the Dialogflow knowledge bases. This means that you can use one or more Dialogflow agents as your NLU interpreters and do all the conversation design in OpenDialog.&#x20;

### Create a Dialogflow ES agent

The first step to using Dialogflow is to create an [ES Dialogflow agent](https://cloud.google.com/dialogflow/es/docs). We are using Dialogflow as just an NLU service so we will be focussing on just training intents, extracting entities and (if and when required) setting up knowledge bases.

### Create an API access key in the Google cloud console

Once you've created an agent follow the instructions here to generate an API key.&#x20;

1. Go to the settings of you Dialogflow agent and click on the project link to go to the Google Cloud project console

![](<../.gitbook/assets/image (418).png>)

2\. From within the Google Cloud console project go to the IAM & Admin > Service Accounts.&#x20;

![](<../.gitbook/assets/image (417).png>)

3\. Create a service account and give it the Dialogflow API Admin role. You will need to give it an ID and then grant the Role as shown below.&#x20;

![Creating an service user for the Dialogflow API through the Google Cloud Console](<../.gitbook/assets/image (154).png>)

4\. Click on the account just created, head to the Keys tab and create a JSON key which will generate a file and download it to your machine.&#x20;

![Generating a JSON key for Dialogflow API access](<../.gitbook/assets/image (147).png>)

#### Create a Dialogflow Interpreter in OpenDialog&#x20;

We can now create an interpreter in OpenDialog that will connect to that Dialogflow agent.&#x20;

![OpenDialog Interpreter Manager](<../.gitbook/assets/image (152).png>)

![Dialogflow Interpreter Configuration](<../.gitbook/assets/image (146).png>)

Once you've filled in the details you will be able to run a connectivity test to ensure that the API key is working correctly. &#x20;

![](../.gitbook/assets/2021-06-07\_17-01-18.png)

With a success message in place you are ready to start using intents in your conversation design.&#x20;

### Mapping Intents

The Dialogflow management screen allows us to map Intents and/or Entities between OpenDialog and Dialogflow. What this means is that you can say things such as the intent calls "Example Intent" in OpenDialog should be compared with the intent called "Another Intent" in Dialogflow.&#x20;

![](<../.gitbook/assets/image (143).png>)

This makes it simpler to reuse preexisting intents or entities without having to rename things.&#x20;

#### Activate the interpreter

The last step is to activate our interpreter so that we can use it from within Scenarios.

![](<../.gitbook/assets/image (148).png>)

### Dialogflow example

Ok - let's try out our new NLU interpreter!

We will create two intents in Dialogflow. One for "I need help" and one for "I have a question".&#x20;

![Intents in Dialogflow](<../.gitbook/assets/image (150).png>)

The intents just have some example phrases associated with them and nothing else. We will handle the rest from within OpenDialog.&#x20;

We will create a new scenario and add two open turns, each turn handling one of the intents.&#x20;

![Welcome scene for Dialogflow example](<../.gitbook/assets/image (142).png>)

![Configuring an intent to use our DF Interpreter](<../.gitbook/assets/image (145).png>)

The request intent from the user is set to use the Interpreter that we just created and we've set the confidence level to 60%.&#x20;

The message is attached to the response intent.

![Response to help request intent](<../.gitbook/assets/image (153).png>)

A quick try in our WebChat widget shows that our intent is being interpreter successfully by Dialogflow and providing a response.

![](<../.gitbook/assets/image (149).png>)



