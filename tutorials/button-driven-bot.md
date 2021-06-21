---
description: >-
  A tutorial to guide you through the process of building a button-driven (or
  guided) conversations
---

# Button Driven Bot

For this button-driven interaction, the OpenDialog the default callback interpreter is essential and can help with simple prototyping. If you not read about this head over to the [default interpreter section](../interpreters-and-natural-language-understanding/default-interpretor.md). If you have, you can then follow the step-by-step guide below to create a button-driven conversation \(bot\). 

For this tutorial we are going to create this conversation experience:

{% embed url="https://youtu.be/GAY5vlIPiOA" caption="Tutorial: Button driven bot " %}

#### 1. Create a new scenario

The first step is to create a new scenario. We will call it "Button-driven scenario".

#### 2. Edit the welcome turn response intent

Edit the response intent of the Welcome turn to uncheck the fact that the turn completes the conversation and remember to click on the tick to save the updated settings. 

We are going to be creating another turn within the same scene so we want to stay within the context of the Welcome Scene. 

![Intent setting after unchecking the &apos;intent completes conversation&apos; box](../.gitbook/assets/image%20%28196%29.png)

#### 3. Edit the welcome response message

Navigate back to the Intents Overview for the Welcome Turn and click on the messages icon within the Action Bar to enter the message editing mode. We will be adding a button to that welcome message. 

![Message editor - Message view for an intent](../.gitbook/assets/image%20%28128%29.png)

![Button message for response intent.](../.gitbook/assets/image%20%28217%29.png)

We now have two buttons. Each button will send a different callback `requestButtonDriven` and `requestNLUDriven` . In addition to the callback we are also sending different values `preference.guided` and `preference.NLU`. The values will be embedded within the utterance and can be extracted and stored in the user context. This allows us to collect information \(in the same way we would extract entities from a natural language phrase\) and store it in our context to reuse it later on - we'll go into more details about this in a separate tutorial, in the future. 

_**N.B.** You don't need to set values like above each time but it can be useful in a range of situations._ 

Remember to save the message before moving onto the next step.

#### 4. Handling intents from buttons

Now, that we have our buttons we need to build out the conversation so that we can handle the response. As we mentioned before the model remains intent-driven throughout. When the user clicks on a button an intent will be generated that the conversation engine will attempt to match. So let's create two turns to handle each option. 

![Button preference OPEN turn](../.gitbook/assets/image%20%28137%29.png)

The first turn is called 'Button Preference', and it's an _OPEN_ turn within the same scene. This means that once the interaction of the _STARTING_ Welcome turn is done this turn will be a candidate because we will remain \(contextually\) within the scene and be considering all open turns. We also create 3 other _OPEN_ turns called NLU Preference, Switch Preference, and NLU Chat so that we end up with the following scene. 

![Welcome Scene with 5 Turns](../.gitbook/assets/image%20%28203%29.png)

* **Button Preference:** This will be our button request / response
* **NLU Preference**: This will be our NLU switching request / response
* **Switch Preference**: This will be our option for a user to switch from button to NLU request / response
* **NLU Chat**: This will be our NLU request / response

Now we can add intents to each turn to handle the various buttons. 

![Adding the requestButtonDriven intent](../.gitbook/assets/image%20%28207%29.png)

The intent name needs to match the value we will be sending through the callback. 

![](../.gitbook/assets/image%20%28125%29.png)

We are also capturing an expected attribute and storing it in the user context as `user.preference` - we will not use it in this example but it gives you a sense of what is possible. To set this up add 'preference' within the Attribute field and select 'User' from the 'from context' drop-down.

Now add a Response Intent which the bot should respond with.

![Button preference - Request/Response intents.](../.gitbook/assets/image%20%28201%29.png)

The resulting turn is as above. The user is requesting to drive with a button and we confirm that. 

We now need to repeat this process for the other 3 turns. Let's start with the 'Switch Preference' first.

![Switch Preference - Request/Response intents](../.gitbook/assets/image%20%28202%29.png)

Now for the 'NLU Preference' turn. This will be the Turn which if the user selects NLU as part of the Welcome Turn will be triggered. So we need to set up the initial Request Intent with an intent named 'requestNLUDriven' so that it can be triggered by our NLU button. 

![Adding the requestNLUDriven intent](../.gitbook/assets/image%20%28195%29.png)

![NLU Preference - Request/Response intents](../.gitbook/assets/image%20%28205%29.png)

Finally, we need to set up the 'NLU Chat' turn with its request/response intents to simulate NLU interactions with this default interpreter. After the user selects "Drive with NLU" they are taken to the NLU Preference turn and thereafter will be able to enter into the NLU Chat turn as it's an _Open_ Turn. 

The main requirement to ensure the NLU simulation works is that the Request Intent user input matches directly to the Intent Name.

![NLU Chat - Request Intent - Radio Ga Ga](../.gitbook/assets/image%20%28197%29.png)

We then need to create the response from the App so that we have our request/response pair. In this example; if the user types "radio ga ga" they will get the response "radio goo goo". 

![](../.gitbook/assets/screenshot-2021-06-07-at-10.41.34.png)

#### 5. Edit**ing** response messages

We now need to create the messages for the following 3 APP response:

* **Button Preference**
* **NLU Preference**
* **Switch Preference** 

 For each turn, open the Turn and click on the message editor button in the action bar to view and then edit the messages. See below for screenshots of each of the message templates which need to be set up for the 3 APP responses. 

**N.B.** Remember to click on 'save message' after creating the message template.

![Button Preference Turn - responseButtonDriven intent message ](../.gitbook/assets/image%20%28194%29.png)

![NLU Preference Turn - responseNLUDriven intent message ](../.gitbook/assets/image%20%28206%29.png)

![Switch Preference - ResponseGoodAtThis message ](../.gitbook/assets/image%20%28200%29.png)

#### 6. Activating and testing your Scenario

Navigate to the designer and find your scenario in the list. Click on the slider to active your Scenario \(it should now be green\). You're Scenario is now active! You're ready to test it.

To test your application navigate to the preview section and select your Scenario from the drop-down menu. You should then see WebChat appear with the welcome response you created.

**N.B.** Remember when testing the NLU simulation it needs to exactly match what you setup as the intent name e.g "radio ga ga"

Congratulation. You've now made your first ever button-driven bot and even simulated some NLU.



The default callback interpreter is essential for button-driven interaction and can help with simple prototyping, but for actual NLU we need to use an [NLU interpreter which we discuss here](../interpreters-and-natural-language-understanding/dialogflow-interpreter.md). 

