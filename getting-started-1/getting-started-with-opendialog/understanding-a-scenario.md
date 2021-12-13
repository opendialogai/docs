# Understanding a Scenario

So far we've [created](creating-a-scenario.md) a scenario and [explored](exploring-and-understanding-a-scenario.md) one of the conversations. Now, let's dive into the Conversational Flow. _How do we visualise what are the possible flows through the two conversations we already have?_ We do this through our Conversational Flow view within the conversation designer.

![Scenario overview](<../../.gitbook/assets/image (381).png>)

To open the Conversational Flow view click on the Play button (_next to the Add Conversation button)_ and it will open it up on the right.

![Conversational flow view](<../../.gitbook/assets/image (385).png>)

The Conversational Flow view makes it possible to play out the conversation using just the sample messages that are associated with each intent. This means that you can test for yourself or show others how you expect the conversation to develop before having to do any NLU training or dive into detailed message composition or have to worry about conditions and context.

### Starting Position

The starting position is the point in the conversation that you clicked on the play button. Since we did it at the top of the Scenario our starting position is the Scenario itself.&#x20;

We have two Conversations that are both _STARTING_ conversations and each has Scenes and Turns that are all starting so they will both be available as the conversation engine evaluates what could  happen next.&#x20;

![Conversation player - starting intent selection](<../../.gitbook/assets/image (385).png>)

Click on "Select Available Intents" reveals that there are three available intents from the User. The first is the Trigger intent (_intent.core.welcome),_ the second is the Restart (_intent.core.restart_) intent and the third is the No Match (_intent.core.NoMatch_) intent.

{% hint style="warning" %}
You may have noticed that our intents have the naming convention of _intent.core.\<something>_ - this is just for default internal intents of OpenDialog. You can name your intents whatever suits you best although we suggest short, clear names.&#x20;
{% endhint %}

Once you've selected an intent, the conversational engine will evaluate follow-up options. Since we are dealing with a simple conversation in our example it is straightforward. If you select the 'Trigger intent', you are moved within the 'Trigger Conversation', the 'Trigger Scene' and finally the 'Trigger Turn' since all of those are Starting Components - this simulates the user triggering the bot on load.

![Conversation player - Start intent selected](<../../.gitbook/assets/image (386).png>)

The 'Trigger Intent' has a transition setup to transition to the 'Welcome Intent', so that is the only option available. You will then select the 'Welcome Request' and finally the 'Welcome Response'.&#x20;

![](<../../.gitbook/assets/image (380).png>)

Congratulations! You've made it through a basic run-through of the core concepts of OpenDialog and its conversation designer. The conversation may not be very exciting just yet but remember this is just the basic conversational components coming out of the box.&#x20;

Next, we would recommend learning more about [managing messages](messages.md). Messages are linked to intents, specifically intents that the application generates.

{% hint style="info" %}
As we update our documentation you will find out how you can add additional turns, how to take advantage of different types of conversations, scenes, and turns and weave into all of these; conditions, connect your application to NLU services such as Dialogflow or LUIS and you will soon be able to build sophisticated multi-turn conversational experiences.
{% endhint %}



