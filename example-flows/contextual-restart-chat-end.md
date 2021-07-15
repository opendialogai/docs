---
description: >-
  A pattern to allow users to break out of the current conversational flow or
  restart the interaction
---

# Contextual Restart / Chat End

Whilst building engaging and interesting conversations for users to follow, it's important to consider that we don't want to create 1-way streets without giving the option to break out of the flow or restart.

The webchat widget comes with 2 things to help conversation designers in this situation - the restart and chat end buttons.

Out of the box, these buttons are not visible in the widget and must be turned on in the Interface Settings page:

![Restart and Chat End buttons can be turned on in Interface Settings](../.gitbook/assets/image%20%28308%29.png)

![Webchat widget with End Chat and Restart buttons turned on](../.gitbook/assets/image%20%28297%29.png)

In the flow of a conversation, if the user clicks on the **Restart** button, a `intent.core.restart` intent is generated. Clicking on the **End Chat** button generates a `intent.core.end_chat` intent.

Both of these intents are dealt with slightly differently to a standard user intent from the webchat as they are `escalating` - this means that if no local match is found, the conversation engine will work its way up through the current Turn, Scene and Conversation until looking for a top-level match. 

The pattern is similar to the [Contextual No Match pattern](https://docs.opendialog.ai/example-flows/contextual-no-match-pattern) with the intent name being updated for each level of the conversation.

**Restart Intents:**

`intent.core.TurnRestart` -&gt; `intent.core.SceneRestart` -&gt; `intent.core.ConversationRestart` -&gt; `intent.core.restart` 

**Chat End Intents:**

`intent.core.TurnEndChat` -&gt; `intent.core.SceneEndChat` -&gt; `intent.core.ConversationEndChat` -&gt; `intent.core.endChat` 

### Conversation Structure

When you create a new scenario, a `Trigger Conversation` is created for you that handles the `WELCOME` event from webchat as well as the global restart

![Global Restart intent in the Trigger Conversation](../.gitbook/assets/image%20%28303%29.png)

With this in place, any time a user clicks the restart button, they will hit the `Trigger Conversation` and this intent will transition them to the `Welcome Turn` in the `Welcome Conversation`. You should update this to suit your needs.

{% hint style="warning" %}
Note the End Chat is not handled out of the box and you will need to set this up as required
{% endhint %}

### Contextual Restarts

Individual Turns, Scenes and Conversations can handle restarts however they need.

Consider a scene in which we are trying to gather information about a user. Our conversational flow will be a question from the app, followed by an answer from the user. 

It's easy to consider a situation where the user would want to restart this flow - if they've entered some wrong information for example.

A scene for this might look something like the one below  


![A scene to gather user information](../.gitbook/assets/image%20%28309%29.png)

Notice that there is a Turn named `Scene Restart` - the idea of this Turn is to handle the user restarting the flow and contextually at this point. 

In this case, if the user restarts the flow at any point in this scene, we would want to route them back to the `Get Name Turn`. We can set up 1 intent with a transition to do this for us

![The Scene Level Restart](../.gitbook/assets/image%20%28307%29.png)

{% hint style="success" %}
Notice the intent is named `intent.core.SceneRestart` as we want to capture all restarts within this scene
{% endhint %}

Now, if the user clicks the restart button at any point in within this scene, they will be routed straight back to the start.

