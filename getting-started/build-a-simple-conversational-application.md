---
description: A quick-start guide to development with OpenDialog
---

# Quick-start: Intro to  conversational applications

{% hint style="warning" %}
Warning - you are browsing the documentation for an older version of OpenDialog. Please check out the latest version. 
{% endhint %}

Now that we have OpenDialog up and running let's build a simple application to get a sense of how things work. We will build a small dialogue that demonstrates some of the features of the application. No NLP is involved so we can focus on the conversational flow, but as you will soon realise, because of how OpenDialog structures conversations, a guided, button-driven conversation is easily converted into one that depends on natural language interaction and the two can be mixed in lots of different ways.

All the concepts used here are described in much more detailed in the "Working with OpenDialog" section. 

## Edit a message 

OpenDialog comes with some default conversations in place. We will start by editing a message to get a sense of how that works. 

After you've [installed OpenDialog](installing-opendialog/), log in to the OpenDialog application and click on "Message Editor". Provided you've imported the default specification as described in the installation guide you should see two outgoing intents. Each _outgoing_ intent can have one or more messages \(or message templates\) associated with it. 

![Outgoing intents](../.gitbook/assets/image%20%2841%29.png)

An outgoing intent is something that the conversational application \(or bot\) _intents_ to say. It is defined in a conversation template. It's the mirror opposite on an _incoming_ intent, which is something the user said that the application needs to interpret. When an outgoing intent is selected to be sent to the user OpenDialog will look at all the messages associated with the outgoing intent and select the most appropriate one. Currently, this mostly depends on conditions that are associated with messages. 

Now, click on `intent.opendialog.WelcomeReponse` and you will see that there is one message template associated with it. Click on the edit button, replace it with the message template here

```markup
<message>
  <text-message> 
    Welcome. This is the OpenDialog sample application. 
    It is going to demonstrate some of the features of the OpenDialog 
    conversation language. 
  </text-message>
  <button-message>
    <button>
      <text>Great, let's get started!</text>
      <callback>intent.example.StartSampleConversation</callback>
    </button>
    <button>
      <text>What is the OpenDialog Conversation Language?</text>
      <callback>intent.example.ExplainOpenDialog</callback>
    </button>
  </button-message>
</message>
```

This new message has two parts. The `text-message` , with the main text message from the app, and the `button-message` , with two buttons. Since we are not using natural language in this example the buttons will stand in as user input. The buttons have `callback` values defined - and you will notice that they are intents, just like our outgoing intents. In this case, they are _incoming_ intents from the user. If we were using a natural language interpreter these values would have been the output of the interpreter following an interpretation of user input. However, since we are using buttons we can send the values straight back to our application. 

If you now load up the demo webchat you should see the updated welcome response from the bot. 

![Webchat showing the updated welcome message](../.gitbook/assets/image%20%282%29.png)

This welcome response is _triggered_ by a message sent from the webchat app to OpenDialog, letting it know that a user has loaded the chat. You can also _trigger_ this response by sending it directly to the app. Place the callback id of the event in the "Send Trigger Message" field as shown below. This is an easy way for you to trigger different parts of the conversation and simulate user input. 

![Triggering a message in webchat](../.gitbook/assets/image%20%2817%29.png)

## Creating a conversation

Now we have a new message with two buttons that are going to send back new intents to our application. How do we handle those intents though? Well, we need to create a new conversation that will be listening to at least one of those intents. 

To create a conversation, navigate to conversations, click on create an copy the Yaml-definition  below.

```yaml
conversation:
  id: explain_opendialog_conversation
  scenes:
    opening_scene:
      intents:
        - u:
            i: intent.example.ExplainOpenDialog
        - b:
            i: intent.example.OpenDialogExplainer
            completes: true
```

Save the conversation and then activate it. 

## Creating a message

At this point, we have a conversation that is expecting an intent from the user called `intent.example.ExplainOpenDialog`. The user can "send" that intent by clicking on the button from the message we create before. We are almost there!

The next step is to associate the _outgoing_ intent, i.e. the intent that the bot will send in response to the user. To do this go back into edit mode for the conversation we just created and click on the outgoing intent. 

As this is a new outgoing intent you will be invited to create it and you can now associate message templates with it. 

Click on "Create Message Template", give it a title of "Explainer" and paste the message that we have below. 

```markup
<message>
  <text-message> 
    Hello, {user.first_name}. Excited to talk OpenDialog.
  </text-message>
  <text-message>
   The OpenDialog Conversation Language is a domain-specific language used by the OpenDialog Conversational Engine to define what are the expected exchanges of intents between participants in a conversation.
  </text-message>
</message>
```

If you now go back to the test bot, trigger the welcome message and click on the second button you will see the message associated with the outgoing intent. Congratulations - this is your first OpenDialog message!

![Message associated with a specific intent](../.gitbook/assets/image%20%2816%29.png)

You'll notice a couple of things here. Firstly, we have two separate _bubbles,_ one for each `text-message` and, secondly, we are using an attribute `{user.first_name}`. What the code within the curly brackets is doing is telling OpenDialog to ask the `user` context for the value of an attribute called `first_name` and display that attribute within the message.

### Using conditions with intents

Now, to make things a bit more interesting we are going to put a condition on the message so that we can modify the message based on the type of user we are interacting with. For _novice users,_ we will keep the same message, while for _expert users_ we will provide more in-depth information. 

To achieve this we are going to create two message templates and associate each template to a [condition](../working-with-opendialog/conversations/#conditions) that checks the user's skill level. 

Go back to the first message and in the conditions field add the following condition:

```yaml
conditions:
  - condition:
      operation: eq
      attributes:
        attribute: user.skill
      parameters:
        value: novice
```

Then go back to the outgoing intent and create a new "Explainer for experts" template. Use the condition and message below.

```yaml
conditions:
  - condition:
      operation: eq
      attributes:
        attribute: user.skill
      parameters:
        value: expert
```

```markup
<message>
  <text-message> 
    Hello, {user.first_name}. Excited to talk OpenDialog.
  </text-message>
  <text-message>
   The OpenDialog Conversation Language is a domain-specific language used by the OpenDialog Conversational Engine to define what are the expected exchanges of intents between participants in a conversation.
  </text-message>
</message>
```

To test the setup you can visit the test bot. We are going to set attribute values explicitly to test conversation flow. First, set up the skill level using the "Set custom user attribute" form.

![You can set custom user attributes here](../.gitbook/assets/image%20%2828%29.png)

Secondly, we will trigger the `explain_opendialog_conversation` directly through the Trigger form

![Use the trigger form to send intents directly to the Conversation Engine](../.gitbook/assets/image%20%285%29.png)

The conversation and message will now use the updated custom attribute value to pick the appropriate message. 

![](../.gitbook/assets/image%20%2840%29.png)

 If you set the value of the skill level back to novice and send the trigger message again you will instead get the message for novices. 

### More to come!

There is much more to say about how OpenDialog works, this is just scratching the surface. We haven't talked the more complex aspects of the [conversational language](../working-with-opendialog/conversations/) or about interpreters, actions or custom contexts. We will be updating the documentation over the next few weeks so please either [get directly in touch](https://opendialog.ai) or make sure you check back here. 

