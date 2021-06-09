# Understanding a Scenario

So far we've [created](creating-a-scenario.md) a scenario and [explored](exploring-and-understanding-a-scenario.md) one of the conversations. Now, let's dive into the Conversational Flow. How do we visualise what are the possible flows through the two conversations we already have? 

![](../../.gitbook/assets/image%20%28169%29.png)

Click on the Play button \(next to the Add Conversation button\) and it will open up the Conversational Flow view. 

![](../../.gitbook/assets/image%20%28162%29.png)

The Conversational Flow view makes it possible to play out the conversation using just the sample messages that are associated with each intent. This means that you can test for yourself or show to others how you expect the conversation to develop before having to do any NLU training or dive into detailed message composition or have to worry about conditions and context.

### Starting Position

The Starting Position is the point in the conversation that you clicked on the play button. Since we did it at the top of the Scenario our starting position is the scenario itself. 

We have two conversations that are bot _STARTING_ conversations and each has scenes and turns that are all starting so they will both be in "play" as the conversation engine evaluates what could possibly happen next. 

![](../../.gitbook/assets/image%20%28158%29.png)

Click on "Please Choose an Intent" reveals that there are two available intents from the User. The first is the Welcome intent \(_intent.core.welcome\)_ and the second is the No Match \(_intent.core.NoMatch_\) intent.

{% hint style="info" %}
You may have noticed that our intents have the naming convention of _intent.core.&lt;something&gt;_ - this is just for default internal intents of OpenDialog. You can name your intents whatever suits you best although we suggest short, clear names. 
{% endhint %}

Once you've selected an intent, the conversational engine will evaluate follow up options. Since we are dealing with a simple conversation in our example it is straightforward. If you select the Welcome intent, you are moved within the "Welcome Conversation", the "Welcome Scene" and finally the "Welcome Turn" since all of those are Starting Components. The only possible reply from within the Welcome Turn is a hello back from the bot so that is the option remaining!

![](../../.gitbook/assets/image%20%28155%29.png)

Once you've selected the Welcome Response, which actually completes the conversation, you will be taken back to the top of the scenario and the two opening options are once again available. If you select the No Match intent you are simulating what would happen if the Conversation Engine could not interpret a message and get a response from the user. 

![](../../.gitbook/assets/image%20%28171%29.png)

Congratulations! You've made it through a basic run-through of the core concepts of OpenDialog. The conversation may not be very exciting just yet but remember this is just the basic components coming out of the box. 

As we update our documentation you will find out how you can add additional turns, how to take advantage of different types of conversations, scenes, and turns and weave into all of this Conditions, connect your application to NLU services such as Dialogflow or LUIS and you will soon be able to build sophisticated multi-turn conversational experiences.







 



