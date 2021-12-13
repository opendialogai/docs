# 3. Work with a pro-active (and opinionated) conversation engine

So far we've talked about the [OpenDialog Conversation Model](1.-start-with-a-conversation-model.md) and the [OpenDialog Context-First approach](2.-design-using-a-context-first-approach.md)  The third aspect that ties everything together is the OpenDialog Conversation Engine.&#x20;

The job of the OpenDialog Engine is two-fold; On the one hand it co-ordinates between all the different components of a conversational application (which we've talked about [earlier](1.-start-with-a-conversation-model.md)) and on the other hand it reasons about what are the possible next steps in a conversation based on the conversation design and the rules that govern its behaviour.

We call it a pro-active and opinionated conversation engine because it takes a specific approach to deciding what to do next and pro-actively provides support to make conversation design more efficient. As a conversation designer you become more efficient if you work with the approach the engine has (hence the opinionated part).&#x20;

## How the OpenDialog Conversation Engine decides what to do next

In this section we will step through the decision flow of the OpenDialog Conversation Engine. This will help you to design better and more robust conversations with OpenDialog and also more efficiently troubleshoot when things go wrong.&#x20;

### I. Determine starting status

Imagine that we've just received some sort of message at one of the OpenDialog sensors. Someone is trying to talk with us! What happens next? The first step is to determine our status. What sort of user are we dealing with and what is the current conversation status?

#### a. New or returning user?

When an incoming utterance is received the first thing the conversation engine determines is what user it is dealing with. It relies on the sensors to extract any relevant user ID information based on the type of message and provide that in a consistent way that the engine can reason about. The engine will attempt to identify if this is an existing user (i.e. a user whose ID it can relate to one already in the OpenDialog database) or a new user. If it is a new user it will create a new ID to associate to the user.&#x20;

#### b. Current conversation status?

Ok, now that we have a user the next step is to determine what is the current conversation status?

If it is a completely new user, then we may only be scoped by a single scenario but need to determine if the message from the user matches any of the possible starting states within that conversation.&#x20;

If it is an existing user, then they may already be at a specific point within a scenario so we need to determine what possible next steps are available from that point.&#x20;

### II. Defining starting state

If the conversation state, beyond the scenario itself, is not determined then we need to identify possible starting states from within the Conversations of a Scenario.&#x20;

{% hint style="info" %}
Please note that the conversation engine can actually choose between multiple scenarios first, before diving into conversations of a single scenario. Choosing between different scenarios is not currently supported through the user interface though. A scenario is defined at the point of integration with an external conversation interface.&#x20;
{% endhint %}

The conversations that can start an interaction within a scenario are the conversations that have the **starting** behaviour. In the UI this is indicated by a green pointer on the conversation.&#x20;

![Starting and non-starting conversations](<../../.gitbook/assets/image (411).png>)

Looking at the example above you can see that there are five potential starting conversations. Only starting scenes, turns and intents within those conversations will be considered as possible starting points.&#x20;

Diving into the _Trigger_ conversation, we can see that there is a single scene with the starting behaviour. That scene will be selected as our candidate. If the scene did not have the starting behaviour the conversation engine would have stopped its search within the trigger conversation there.&#x20;

![Scene with starting behavior](<../../.gitbook/assets/image (416).png>)

As the scene is a starting scene we can _dive_ in the scene where we find a single turn, again with a starting behaviour.&#x20;

![Turn with starting behaviour](<../../.gitbook/assets/image (415).png>)

Finally looking into that turn we see that it contains two intents. Each one of those intents can activate the turn and get us started with a conversation!

![Intents within trigger turn ](<../../.gitbook/assets/image (407).png>)

Now, to summarise! When we are about to start a new conversation the OpenDialog conversation engine will explore all the starting conversations, all the starting scenes within those conversations, then all the starting turns within those scenes and any request intents associated with those starting turns will be considered as possible starting intents. It will then attempt to match the incoming utterance to one of those intents. If the match is successful the conversation state is updated to that intent and we are now in a fully defined conversation state down to the level of an intent.&#x20;

If the match is unsuccessful we generate a No Match intent and then attempt to find a starting conversation, scene and turn that will lead us to that intent. In the case above that would be the conversation called No Match conversation.&#x20;

### III. Determining next state starting from a turn&#x20;

Let's pickup the conversation from above. We've placed the user at a specific location, at a specific turn. We now need to figure out what the next possible state (and hence response from the application) could be.

Let's assume the user just triggered what is marked as the `[--user trigger--]` intent message in the image above. This is associated to the `intent.core.welcome`  intent that is fired by the OpenDialog Webchat widget when the user loads Webchat.&#x20;

When we position our context at the request part of a turn we are looking for a few of things.&#x20;

1. If the matching intent defines a _transition_ to another part of the conversation, we will follow that transition.
2. In the absence of a transition we will look for a matching response intent that we can select _within_ the turn.
3. If there is no transition and no response intent we will look for a request intent (from the application) in _another_ turn within the same scene. This is what we call a _cadence_ change in OpenDialog. When a turn has no response and we are forced to look for a request from the other participant in another turn we are handing the _conversational initiative_ to the other participant and changing the cadence from user->app to app->user in this case.&#x20;

In our example there are no response intents, and if you recall from earlier there are also no other turns in the scene. So let us hope we define some sort of transition!

Here is the definition of the intent.

![Intent defining a transition](<../../.gitbook/assets/image (413).png>)

Good news. The intent defines a transition to the Welcome Conversation. Let us follow that through.&#x20;

![Welcome Conversation](<../../.gitbook/assets/image (409).png>)

We are now at the _top_ of the Welcome Conversation because that is where the transition led us. Transitions can move the context to a specific Conversation, Scene or Turn. When you move to the _top_ of a conversation you are allowing the design of that conversation to determine what happens next - you are dividing and conquering the conversational challenge!

When we are at the top of the component and looking for where we can dive in we are looking for starting behaviours. In this case we have a Welcome Scene with a starting behaviour so let's dive in.

![The Welcome Scene Turns](<../../.gitbook/assets/image (405).png>)

Well, this scene has a bunch of turns but only that is a starting turn, so that will be our winner. Let us dive into the turn.

![Welcome turn intents](<../../.gitbook/assets/image (408).png>)

Good news! The Welcome Turn has a single intent from the application. We were looking for an application intent since the last position we were in was an incoming intent from the user. So "Welcome to Perfect Fit" becomes our outgoing intent that we can send as a message to the user.&#x20;

So far, we had the user trigger this scenario, dive into the Trigger conversation that started the whole process and the Trigger conversation sent us to the Welcome Conversation that defined an outgoing intent and message from the application to welcome the user to the experience. Good stuff! But what happens next?

Well, since the Welcome Turn has just one intent from the application and no possible response intents from the user this turn is completed and the conversation state now places us at the top of the Welcome Scene.&#x20;

The user triggered the conversational app, entered the Trigger Conversation, we then transferred context to the Welcome Conversation where the Welcome Scene had a turn that got the conversational initiative and send a message out to the user in response of triggering the application.&#x20;

![Response from the application](<../../.gitbook/assets/image (406).png>)

Above is a view of the Webchat widget (within the OpenDialog Preview screen) with that welcome message from the application. The user has some button options but they can also use natural language to ask a question, request for help, etc. All these different options are handled by the various turns within the scene.&#x20;

![Back to the top of the Welcome Scene](<../../.gitbook/assets/image (414).png>)

There is a whole range of options here. The user could request for help, ask an FAQ question, decide to move to the next state of the conversation and so on. Note that we would never re-enter the Welcome Turn as it is just a starting turn and not an Open turn. A starting turn is only considered the first time we enter a conversational component.

Now the conversation engine is waiting for input from the user and once received it will attempt to match that input to one of the intents defined within a conversational turn within the Welcome scene. The application response might keeps us within the scene or it might transfer us on to the next conversation depending on what we are attempting to achieve!



Hopefully this walk through the OpenDialog way has clarified some aspects of how OpenDialog works. There is much more that is possible but the next best step would be for you to [dive in](https://opendialog.ai) and start building your own application or [follow one of our tutorials](../../tutorials/button-driven-bot.md).&#x20;
