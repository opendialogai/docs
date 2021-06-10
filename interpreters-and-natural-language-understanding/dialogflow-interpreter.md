# Dialogflow Interpreter

The OpenDialog Dialogflow integration allows us to use Dialogflow intent interpretation, entity extraction and the Dialogflow knowledge bases. This means that you can use one or more Dialogflow agents as your NLU interpreters and do all the conversation design in OpenDialog. 

#### Create a Dialogflow ES agent

The first step to using Dialogflow is to create an [ES Dialogflow agent](https://cloud.google.com/dialogflow/es/docs). We are using Dialogflow as just an NLU service so we will be focussing on just training intents, extracting entities and \(if and when required\) setting up knowledge bases.

#### Create an API access key in the Google cloud console

Once you've created an agent follow the instructions here to generate an API key. 

The first step is to create a service user - we will need the Dialogflow API Admin role.

![Creating an service user for the Dialogflow API through the Google Cloud Console](../.gitbook/assets/image%20%28154%29.png)

Then you can create a JSON key which will generate a file and download it to your machine. 

![Generating a JSON key for Dialogflow API access](../.gitbook/assets/image%20%28147%29.png)

#### Create a Dialogflow Interpreter in OpenDialog 

We can now create an interpreter in OpenDialog that will connect to that Dialogflow agent. 

![OpenDialog Interpreter Manager](../.gitbook/assets/image%20%28152%29.png)

![Dialogflow Interpreter Configuration](../.gitbook/assets/image%20%28146%29.png)

Once you've filled in the details you will be able to run a connectivity test to ensure that the API key is working correctly.  

![](../.gitbook/assets/2021-06-07_17-01-18.png)

With a success message in place you are ready to start using intents in your conversation design. 

### Mapping Intents

The Dialogflow management screen allows us to map Intents and/or Entities between OpenDialog and Dialogflow. What this means is that you can say things such as the intent calls "Example Intent" in OpenDialog should be compared with the intent called "Another Intent" in Dialogflow. 

![](../.gitbook/assets/image%20%28143%29.png)

This makes it simpler to reuse preexisting intents or entities without having to rename things. 

#### Activate the interpreter

The last step is to activate our interpreter so that we can use it from within Scenarios.

![](../.gitbook/assets/image%20%28148%29.png)

### Dialogflow example

Ok - let's try out our new NLU interpreter!

We will create two intents in Dialogflow. One for "I need help" and one for "I have a question". 

![Intents in Dialogflow](../.gitbook/assets/image%20%28150%29.png)

The intents just have some example phrases associated with them and nothing else. We will handle the rest from within OpenDialog. 

We will create a new scenario and add two open turns, each turn handling one of the intents. 

![Welcome scene for Dialogflow example](../.gitbook/assets/image%20%28142%29.png)

![Configuring an intent to use our DF Interpreter](../.gitbook/assets/image%20%28145%29.png)

The request intent from the user is set to use the Interpreter that we just created and we've set the confidence level to 60%. 

The message is attached to the response intent.

![Response to help request intent](../.gitbook/assets/image%20%28153%29.png)

A quick try in our WebChat widget shows that our intent is being interpreter successfully by Dialogflow and providing a response.

![](../.gitbook/assets/image%20%28149%29.png)





