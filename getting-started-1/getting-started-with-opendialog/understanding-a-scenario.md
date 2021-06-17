# Understanding a Scenario

So far we've [created](creating-a-scenario.md) a scenario and [explored](exploring-and-understanding-a-scenario.md) one of the conversations. Now, let's dive into the Conversational Flow. _How do we visualise what are the possible flows through the two conversations we already have?_ We do this through our Conversational Flow view within the conversation designer.

![Conversation Designer - Starting conversations](../../.gitbook/assets/image%20%28169%29.png)

To open the Conversational Flow view click on the Play button \(_next to the Add Conversation button\)_ and it will open it up on the right.

![Conversation flow view.](../../.gitbook/assets/image%20%28162%29.png)

The Conversational Flow view makes it possible to play out the conversation using just the sample messages that are associated with each intent. This means that you can test for yourself or show others how you expect the conversation to develop before having to do any NLU training or dive into detailed message composition or have to worry about conditions and context.

### Starting Position

The starting position is the point in the conversation that you clicked on the play button. Since we did it at the top of the Scenario our starting position is the Scenario itself. 

We have two Conversations that are bot _STARTING_ conversations and each has Scenes and Turns that are all starting so they will both be available as the conversation engine evaluates what could possibly happen next. 

![Conversation flow view - intent selection.](../../.gitbook/assets/image%20%28158%29.png)

Click on "Please Choose an Intent" reveals that there are two available intents from the User. The first is the Welcome intent \(_intent.core.welcome\)_ and the second is the No Match \(_intent.core.NoMatch_\) intent.

{% hint style="warning" %}
You may have noticed that our intents have the naming convention of _intent.core.&lt;something&gt;_ - this is just for default internal intents of OpenDialog. You can name your intents whatever suits you best although we suggest short, clear names. 
{% endhint %}

Once you've selected an intent, the conversational engine will evaluate follow-up options. Since we are dealing with a simple conversation in our example it is straightforward. If you select the Welcome intent, you are moved within the "Welcome Conversation", the "Welcome Scene" and finally the "Welcome Turn" since all of those are Starting Components. The only possible reply from within the Welcome Turn is a hello back from the bot so that is the option remaining!

![](../../.gitbook/assets/image%20%28155%29.png)

Once you've selected the Welcome Response, which actually completes the conversation, you will be taken back to the top of the scenario and the two opening options are once again available. If you select the No Match intent you are simulating what would happen if the Conversation Engine could not interpret a message and get a response from the user. 

![](../../.gitbook/assets/image%20%28171%29.png)

Congratulations! You've made it through a basic run-through of the core concepts of OpenDialog and its conversation designer. The conversation may not be very exciting just yet but remember this is just the basic conversational components coming out of the box. 

Next, we would recommend learning more about [managing messages](messages.md). Messages are linked to intents, specifically intents that the application generates.

{% hint style="info" %}
As we update our documentation you will find out how you can add additional turns, how to take advantage of different types of conversations, scenes, and turns and weave into all of these; conditions, connect your application to NLU services such as Dialogflow or LUIS and you will soon be able to build sophisticated multi-turn conversational experiences.
{% endhint %}





