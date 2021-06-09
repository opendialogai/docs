# Exploring a Scenario

We've just [created a scenario](creating-a-scenario.md), and can now dig into exploring what elements are there.

### Scenario Level View

![Starting point for scenarios](../../.gitbook/assets/image%20%28156%29.png)

The scenario level view provides an overview of all the conversations within a scenario. If you click on one of the conversations you will be taken into a conversation view, where you can see the scenes, and if you click on a scene you are taken to turns and finally intents.  

### Conversation Level View

![Conversation Level Vie](../../.gitbook/assets/image%20%28170%29.png)

At the Conversational level view we can see the Conversation and its associated scenes \(in this case just one scene called "Welcome Scene"\), as well as the action bar to add new scenes. 

If you click on the Conversation itself you can edit its settings. 

![Conversation Settings](../../.gitbook/assets/image%20%28163%29.png)

The key thing to keep in mind about the "Welcome Conversation" is that it has a _STARTING_ behaviour. This lets the conversation engine know that it can consider the "Welcome Conversation" as an _entry_ conversation into the entire scenario. You can have multiple _STARTING_ conversations and, of course, conversations without this behaviour. If a conversation does not have a starting behaviour it will only be considered after __a user has already entered the scenario and provided there is a transition to it.

You can also select the default interpreter for the conversation and add conditions but we will come back to that later. For now let's move down to the scene level.

### Scene Level View

![Scene level view](../../.gitbook/assets/image%20%28161%29.png)

At the Scene level view, we can see the turns associated with a scene and edit settings in the same way we can do for conversations.

![Scene settings](../../.gitbook/assets/image%20%28159%29.png)

Similar to conversations, scenes have a name, behavior, you can set a scene-level interpreter, and define conditions. As you can see the "Welcome Scene" also has a _STARTING_ behavior. This indicates to the conversation engine that this scene can be used as a starting scene for this conversation. 

### Turn Level View

If we click on the "Welcome Turn" we are taken to the Turn level view. A turn is a container for the possible exchange of intents. 

![Turn level view](../../.gitbook/assets/image%20%28168%29.png)

If you click on the "Welcome Turn" you will get the settings view for the turn. 

![Turn settings](../../.gitbook/assets/image%20%28166%29.png)

The turn in this case is also a _STARTING_ turn, which means that this is a turn through which the overall conversation can start. 

### Intent Level View

Now, that we are at the turn level we can click on the Intents to see what intents we are expecting to be exchanging at the turn level. 

![Intent view](../../.gitbook/assets/image%20%28164%29.png)

Intents are split into "Request Intents" and "Response Intents". A request intent is an initiating intent in a turn \(and it can come from either the user or the app\), while the response intent is the expected response. Turns do not need to have a Response Intent. The Request intent could be completing the conversation or it could be transitioning the conversation to another Scene or another Conversation. 

We can set up multiple requests and multiple responses. Conditions on intents and the actual interpretation of intents can help the conversation engine determine which one should be applicable. 

If you click on an Intent you are taken to the Intent overview page that provides a summary of the key points and the edit panel for an intent. 

![Detail &amp; Edit view of an Intent](../../.gitbook/assets/image%20%28174%29.png)

Let's walk through the highlights here. 

The Participant is the User, so this describes an expected message from the user - an example of this message, the "Sample Message" is "_Hello from user_". 

The interpreter we will be using to interpret this message is the OpenDialog default interpreter. This interpreter simply interprets button clicks or specific events \(hence the name callbackInterpreter\). 

The confidence level is set to 100%, although, in any case, when dealing with specific clicks confidence level is always certain. 

Finally, there are no transitions associated with this intent. 

The edit view and advanced settings \(click on the cog wheel\) enable you to manipulate all the settings about the intent. We won't get into the details about those just yet, since we cover it comprehensively in the [Turns and Intents](../../turns-and-intents.md) section. 

