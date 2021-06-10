# Default Interpretor

## Default Interpreter

The default interpreter that comes out of the box with OpenDialog is useful primarily for **button-driven conversations** and **prototyping**. 

### Button-driven \(or guided\) conversations

When we build a message with a button we can instruct the button to send the name of a specific intent to the OpenDialog conversation engine. Within the[ message markup](../developing-with-opendialog/messages/message-markup.md) this intent is defined within `callback` tag. 

When the user clicks a button the WebChat widget will send to the conversation engine an event that contains the value within the callback tag. The conversation engine will then attempt to match that callback to the value of a specific intent within your scenario \(based on the overall conversational state\). 

This enables us to build very flexible button-driven conversations where we don't have to change our mental model of how a conversation works. A button click is just an utterance that needs to be mapped to an intent like a natural language utterance. The only difference is that there is no ambiguity as to what the user just said. 

Let's build a small conversation to illustrate this behaviour. 

### Button-driven example

#### Create a new scenario

The first step is to create a new scenario. We will call it "Button-driven scenario".

#### Edit the welcome turn response intent

Edit the response intent of the Welcome turn to uncheck the fact that the turn completes the conversation and remember to click on the tick to save the updated settings. 

We are going to be creating another turn within the same scene so we want to stay within the context of the Welcome Scene. 

![Intent setting after unchecking the &apos;intent completes conversation&apos; box](../.gitbook/assets/image%20%28194%29.png)

#### Edit the welcome response message

Navigate back to the Intents Overview for the Welcome Turn and click on the messages icon within the Action Bar to enter the message editing mode. We will be adding a button to that welcome message. 

![](../.gitbook/assets/image%20%28128%29.png)

{% hint style="info" %}
Roadmap: Currently buttons are only available through the custom blocks that drop in the XML template of a message. However, we will soon have a button UI widget to support button creation. 
{% endhint %}

![Response with buttons](../.gitbook/assets/image%20%28126%29.png)

Here is the XML for our button message. 

```markup
<button-message>
  <button>
    <text>Drive with a button</text>
    <value>preference.guided</value>
    <callback>requestButtonDriven</callback>
    <display>true</display>
  </button>
  <button>
    <text>Drive with NLU</text>
    <value>preference.NLU</value>
    <callback>requestNLUDriven</callback>
    <display>true</display>
  </button>
</button-message>
```

We now have two buttons. Each button will send a different callback `requestButtonDriven` and `requestNLUDriven` . In addition to the callback we are also sending different values `preference.guided` and `preference.NLU`. The values will be embedded within the utterance and can be extracted and stored in the user context. This allows us to collect information \(in the same way we would extract entities from a natural language phrase\) and store it in our context to reuse it later on. 

_**N.B.** You don't need to set values like above each time but it can be useful in a range of situations._ 

Remember to save the message before moving onto the next step.

#### Handling intents from buttons

Now, that we have our buttons we need to build out the conversation so that we can handle the response. As we mentioned before the model remains intent-driven throughout. When the user clicks on a button an intent will be generated that the conversation engine will attempt to match. So let's create two turns to handle each option. 

![Button preference OPEN turn](../.gitbook/assets/image%20%28137%29.png)

The first turn is called 'Button Preference', and it's an _OPEN_ turn within the same scene. This means that once the interaction of the _STARTING_ Welcome turn is done this turn will be a candidate because we will remain \(contextually\) within the scene and be considering all open turns. We also create 3 other _OPEN_ turns called NLU Preference, Switch Preference, and NLU Chat so that we end up with the following scene. 

![Welcome Scene with 5 Turns](../.gitbook/assets/image%20%28197%29.png)

* **Button Preference:** This will be our button request / response
* **NLU Preference**: This will be our NLU switching request / response
* **Switch Preference**: This will be our option for a user to switch from button to NLU request / response
* **NLU Chat**: This will be out NLU request / response

Now we can add intents to each turn to handle the various buttons. 

![Adding the requestButtonDriven intent](../.gitbook/assets/image%20%28135%29.png)

The intent name needs to match the value we will be sending through the callback. 

![](../.gitbook/assets/image%20%28125%29.png)

We are also capturing an expected attribute and storing it in the user context as `user.preference` - we will not use it in this example but it gives you a sense of what is possible. To set this up add 'preference' within the Attribute field and select 'User' from the 'from context' drop-down.

Now add a Response Intent which the bot should respond with.

![Button preference turn](../.gitbook/assets/image%20%28120%29.png)

The resulting turn is as above. The user is requesting to drive with a button and we confirm that. 

If the user selects "Drive with NLU" they are taken to the NLU Preference turn. If we want to simulate NLU interactions with this default interpreter we can. The only requirement is that the user input matches direct the intent name.  

I've create a simple turn to illustrate this.

![](../.gitbook/assets/screenshot-2021-06-07-at-10.41.34.png)

If the user types "radio ga ga" they will get the response "radio goo goo". 

The complete interactions described here are illustrated in the video below:

{% embed url="https://youtu.be/KV22RisKoMo" %}



The default callback interpreter is essential for button-driven interaction and can help with simple prototyping, but for actual NLU we need to use an NLU interpreter which we will discuss next. 

