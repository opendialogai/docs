---
description: >-
  A tutorial on how to build a product chooser and product support app within
  OpenDialog
---

# Product Chooser and Support

> The product chooser and product support application is available as a template within OpenDialog SaaS ([signup now!](https://opendialog.ai)) and you can test it out [here](https://opendialog.ai/case-study-perfectfit/).&#x20;

The Product Chooser Template is an OpenDialog Conversational Application (for the webchat interface) designed to help people choose a product after they've answered a few questions. The scenario is built around a user looking for running shoes but it can be adapted to fit any situation where the aim is to provide some recommendations after having collected some relevant information. &#x20;

The application supports flexible information gathering that can be mixed with "sidebar" conversations or FAQ question and answer. It also uses forms to collect some of the information it has. This page provides an overview of how the template works and instructions on how to configure further or adapt to your needs.&#x20;

## Key Conversations

There are the key conversations:

**Welcome Conversation** - Welcomes the user to the experience, provides support for them to move forward to the "Gather Experience" conversation and can also be integrated with FAQ Support.&#x20;

**Gather Experience **- The main objective of this conversation is to gather they key pieces of information required to be able to provide some recommendations to the user.

**Recommendations** - Provides recommendations but also allows the user to change their mind about a specific answer and can react to that change.&#x20;

**Purchase** - After a user picks a product we move them to the Purchase phase where they can complete relevant information and pay for the product.&#x20;

**Feedback **-** **The Feedback conversation is available throughout to allow the user to provide feedback on the experience.&#x20;

**Offboard** - The Offboard conversation off boards the user with an appropriate message.&#x20;

**No Match Conversation** - This is the final catch-all conversation if NLU or any other type of intent parsing goes wrong. The template caters for localised no matches as well (i.e. No Match turns within a scene).

**Trigger** - The Trigger conversation captures intents that are supposed to restart the entire conversation such as when the user loads WebChat (`intent.core.welcome` ) or when the user clicks on the WebChat restart icon (`intent.core.restart`).&#x20;

## Understanding the Design

In this section we go through all the main conversation and explain how they work together to provide the overall experience.&#x20;

![Product Choose Template](<../.gitbook/assets/image (430).png>)

### Trigger Conversation

The Trigger Conversation is a _starting conversation, _with a _starting _scene and a _starting _turn. The objective is to capture any intents that should start the entire experience. There are two intents within the _Trigger _turn._ _

&#x20;\- `intent.core.welcome` that is triggered when a user loads WebChat (i.e. enters a page with the WebChat widget)

&#x20;\- `intent.core.restart` that is triggered when a user clicks the restart button on WebChat.&#x20;

![Intents within Trigger turn](<../.gitbook/assets/image (440).png>)

As you can see from the image above the intents do not have any response intents, that is because both intents have transitions to the top of the Welcome Conversation.&#x20;

In other words, when one of these intents is triggered it will take us to the Welcome conversation and the conversation engine will be looking for an intent within an available starting turn of the Welcome Conversation.&#x20;

### Welcome Conversation

The Welcome conversation has just one scene with a number of turns as shown in the figure below.&#x20;

![Welcome Scene of Welcome Conversation](<../.gitbook/assets/image (436).png>)

Let's walk through each turn so that it is clear what their job is in the overall conversation.

#### **Welcome Turn**

&#x20;A _starting_ turn, it holds the outgoing intent from the application that will welcome the user to the scene.&#x20;

![Welcome Turn Intents](<../.gitbook/assets/image (432).png>)

To edit the associated message you can head over to the Message Editor by clicking on the Message Edit icon on the top-right corner of the screen.

![Product Chooser Welcome](<../.gitbook/assets/image (427).png>)

The message has two buttons associated with it that will activate intents that are in other turns within the same scene. We will mention this intents as we examine the other turns.&#x20;

#### **End Chat**

This is an _open_ turn that captures the intent `intent.core.TurnEndChat` - this is an intent that is generated when the user clicks on the end chat button on webchat. It is actually what in OpenDialog we term a cascading intent in that when the intent is matched the OpenDialog conversation engine will first look for `intent.core.TurnEndChat` then `intent.core.SceneEndChat` and then `intent.core.ConversationEndChat` before breaking out to the top of the scenario and look for `intent.core.endChat` . This cascade of intents allows us to react to the user differently in different contexts. This is an implementation of the [Contextual End Chat Pattern](../example-flows/contextual-restart-chat-end.md).&#x20;

#### **Prompt Question**

The prompt question turn is supposed to be activated whenever the user says that they have a question (e.g. when they click on the "I've got a question button". The response from the application will be to invite the user to ask their question.&#x20;

#### **Turn No Match**

The Turn No Match turn is activated when interpreters fail to map the user's request to an available intent. It allows us to deal with a no match within the scene. This means that we can retain context and help the user recover more easily than breaking out of the scene and ending in the global No Match Conversation. This is an implementation of the [Contextual No Match Pattern](../example-flows/contextual-no-match-pattern.md).

#### **FAQ Turn**

The FAQ Turn handles FAQ questions within the Welcome Scene. It is an implementation of the Contextual [FAQ Pattern](../example-flows/the-contextual-faq-pattern.md). The incoming user intent name is `intent.dialogflow.faq` and that should be mapped within your Dialogflow interpreter setup to the knowledge base intent as show in the figure below. This mapping will convert any `Knowledge.Knoweldgebase.*` intent from Dialogflow intent the `intent.dialogflow.faq` intent in OpenDialog.&#x20;

![Mapping FAQ intents](<../.gitbook/assets/image (434).png>)

At the same time within the outgoing intent message you will want to embed the response from the Dialogflow knowledge base using an empty custom message and adding the attribute from the user context that contains the Dialogflow message

![Embedding a Dialogflow Knowledgebase response in a OpenDialog message](<../.gitbook/assets/image (454).png>)

The end result is that you will be able to wrap question responses in a customised message based on the conversation context.&#x20;

#### **Next Turn**

The Next Turn captures all the intents from the user that could move the conversation to the next phase. There are three possibilities. The user might click on the "Let's go" button, the user might type something that maps to the `userContinueNLU` intent (e.g. "let's do it", "let's find shoes", etc) or the user might dive straight into a more specific request such as "Looking for men's shoes" that will active the `intent.shoebot.provideRunnerExperience` intent.&#x20;

#### **Help Request**

The Help Request Turn is an implementation of the [Contextual Help Pattern](../example-flows/contextual-help.md), it allows us to capture a request for help within the welcome scene and respond appropriately for this conversational context.&#x20;

### Gather Experience Conversation

![Gather Experience Conversation](<../.gitbook/assets/image (423).png>)

The Gather Experience Conversation has two scenes. The User Profile scene where we collect the necessary information from the user while also providing access to FAQ questions, etc and the Pronation Scene where we explain to the user what is Pronation. The Pronation scene is what we consider a "sidebar" scene, where we break out from the core scene (User Profile) to handle a specific piece of information before return to User Profile.&#x20;

#### User Profile

![User Profile Scene](<../.gitbook/assets/image (451).png>)

You'll notice that the User Profile scene has a few turns that are similar to the Welcome scene. The FAQ turn, Turn No Match turn and End Chat turn are all there to handle similar issues as before so we will not go over them. We will, instead, focus on the Welcome User, Provide Experience, Change Experience and Work out pronation turns.&#x20;

**Welcome User**

The Welcome User turn is a _starting_ turn with just one intent from the application - welcome the user to the this scene. This intent has five messages associated with it depending on how much information we already had from the user about their request.&#x20;

Below are a couple of possible conversation that will lead to the welcome turn. As you can see, in the first instance we don't have any new information so we need to ask the user everything, while in the second instance we have already collected some relevant info so we focus in on more specific questions.&#x20;

![](<../.gitbook/assets/image (447).png>)![](<../.gitbook/assets/image (452).png>)

From a conversation map perspective the Request Intent from the application is the same, but the way that intent is expressed through the question depends on how much information we have.&#x20;

![Request Intent with 5 associated messages](<../.gitbook/assets/image (443).png>)

![](<../.gitbook/assets/image (444).png>)![](<../.gitbook/assets/image (429).png>)

We have a total of five messages. A general one if we don't have any relevant info and another four messages, each focussing on one of the four pieces of information we want to collect. Each of those four messages has a condition that checks to verify if that piece of information exists in our context.&#x20;

![](<../.gitbook/assets/image (419).png>)

#### Provide Experience

After we've welcomed the user to this scene, we are now ready to collect any other information that is missing (or handle FAQ questions, etc). The turn that collects this additional information is the Provide Experience Turn.&#x20;

![Provide Experience Turn Intents](<../.gitbook/assets/image (445).png>)

**Request Intents**: There are two requests intents that are meant to handle information coming through from the user. The first one is the one you should configure with an NLU interpreter, while the second one is the one we use for button-based responses.  You can use an NLU interpreter to interpret a button response (we will send the text on the button to the NLU interpreter) but if you are setting values explicitly with buttons it can be more efficient to just use the internal OpenDialog interpreter.&#x20;

**Response Intents**: The response intents is where we decide whether we are going to ask a follow-up question or whether we are ready to show the user some shoes. The first intent "Ready to see some shoes" has a transition to the Welcome To Recommendations Scene in the Recommendations conversation. This intent will be selected only if all the conditions return true.&#x20;

![](<../.gitbook/assets/image (437).png>)![](<../.gitbook/assets/image (450).png>)&#x20;

If the conditions do not evaluate to true we move on to the second possible intent response which is the "Follow-up question". The "Follow-up question" intent, similarly to the intent in the welcome turn has a number of messages associated with it each one with a condition based on the attribute information that is missing.&#x20;

Through the simple interaction between these two intents we achieve what in other systems is referred to as slot filling or form filling. We will return the user to this turn and keep asking relevant questions until we have all the information we need. Once we have all the information we can transition the user on, continuing the conversation.&#x20;

#### Handling FAQs or other interactions and returning to the Provide Experience Turn

There is one other technique that this scene uses to keep the conversation focussed on collecting any pieces of missing information. When a user asks an FAQ question, what we want to do is provide the answer to the FAQ question but then continue with the information collection that is the main objective of this conversation.&#x20;

The way we achieve this is through _virtual intents_. When a user asks an FAQ question we expect the FAQ turn to match and the answer to be provide as usual. However, once that turn plays itself out rather than returning control to the user we fire a _virtual intent _by defining it on the response intent of the FAQ turn.&#x20;

![](<../.gitbook/assets/image (421).png>)

A virtual intent instructs the conversation engine to emit that intent (as if the user said an utterance that was then interpreted to that intent. Once an intent is emitted the normal flow takes on from there and the conversation engine will do whatever it was going to do if the user had said that intent. In this case the implication of the virtual intent is that the Provide Experience turn will be activated once more and the application will reply in whatever way is appropriate given the context. The message from the application will be appended to the FAQ answer and the whole series will be delivered to the user.&#x20;

Virtual intents can be extremely powerful in that they can allow us to reactivate entire parts of the conversation and they mimic how human conversational develop. The application is essentially saying "I get that you asked me something different, I will reply to that but then I am also going to continue based on the reply I would have given you if you had not veered off the main objective of the conversation!" The screenshots below show you some examples of virtual intents in action. You see the answers to FAQ questions and then the follow up coming from the Provide Experience turn.

![](<../.gitbook/assets/image (456).png>)![](<../.gitbook/assets/image (442).png>)

#### Work out Pronation Turn and the Pronation Scene&#x20;

At some point in this specific example we introduce the user to the concept of pronation. This is a term used to describe how the foot rolls each time it lands and can be used to suggest the right shoe. Since pronation may be a term the user is not familiar with we have a turn that will be activated if the user asks "What is pronation". The intents within this turn will transfer the user to the Pronation scene within the conversation where the term is explained as well as the process for how to determine pronation for yourself.&#x20;

![Pronation Scene](<../.gitbook/assets/image (453).png>)

As you can see from the pronation scene the user is introduced to the concept and then guided through how to work out pronation by determining their feet pattern or they can skip the process. Whatever the specific path through this scene they will then be taken back to the User Profile scene.&#x20;

#### Change Experience Turn

The Change Experience Turn is there to cater for the user potentially saying that they want to change one of the pieces of information they have offered. If the user says something such as "I would like to change something", this turn will be activated and we will reply letting the user know that it is ok to provide the new information.

In reality the user doesn't need to ask to change something, they can simply provide the new information and because of the way we collect new information or update existing information through the Provide Experience turn the application will react normally. For example the user might say "I want a size 8" and then say "actually make it a size 9" and the conversation would flow naturally.&#x20;

#### Recommendation Conversation

The Recommendations Conversation is made up of two scenes. There is the "Welcome To Recommendations" scene and the "Provide Recommendations" Scene.&#x20;

We transition to the "Welcome to Recommendations" scene from the "User Profile" scene once we have enough information to show the user some products. The objective of this scene is to give the user one last chance to change some information or ask FAQ questions before we show them the products.&#x20;

![Welcome to Recommendations Scene ](<../.gitbook/assets/image (428).png>)

As you can see from the figure above the scene has a number of possible _starting_ turns (which are also _open_ turns), this is because the transition from the previous scene happens on an Application intent - so this scene can open with a number of different user intents.&#x20;

Once the user confirms their choices we can then move them to the "Provide Recommendations" scene.  The objective of this scene is to show the recommendations and then collect the user's choice. Throughout, the user can still ask FAQ questions or change some of the parameters.&#x20;

![Provide Recommendations Scene](<../.gitbook/assets/image (424).png>)

#### Provide Recommendations Turn

The Provide Recommendations Turn is the key turn here. The application runs an action to retrieve some product information and then presents that to the user.&#x20;

![](<../.gitbook/assets/image (435).png>)

Currently this is somewhat artificially split on shoe type and the attributes returned in the action are hard-coded. When you are implementing your own actions you can have an appropriate setup to return the information you need.&#x20;

![](<../.gitbook/assets/image (455).png>)

The message that displays the shoes is a list message. An important element here is how we use the `<value>` field to set the attribute called `selection `to `one` . This could then be used through an action to retrieve further information about the selected product to customise the rest of the messages.&#x20;

### Purchase

Once the user has selected a product we move to the Purchase conversation and specifically the "Collect Details" scene. The objective of this scene is to a. collect details using a form message and b. allow the user to review and change those details. This is achieved by the interplay of the two turns. The "Get Details" turns presents a form message that the user can fill in and submit while the "Confirm Details" turn provides a summary of the submitted data and gives the user a way back to the form to change anything.&#x20;

![Collect Details Scene](<../.gitbook/assets/image (448).png>)

The reason form details can be changed is because each field is stored in the User context and the form message is setup to replace field values with attributes from the user context, if those attributes are present

![](<../.gitbook/assets/image (441).png>)![](<../.gitbook/assets/image (422).png>)![](<../.gitbook/assets/image (420).png>)

## Configuring NLU to work with the template

The template out of the box only uses the basic OpenDialog interpreter which does not support proper NLU.&#x20;

For a fully functioning bot that you can deploy on your website you will want to connect it to an FAQ service such as Microsoft QnA or Dialogflow Knowledgebase. In addition, you will need something like Dialogflow, LUIS or LEX to be able to pick up the following intents:

The intents to train for are:

* **helpRequest** - used by all the help turns in various scenes to capture when the user asks for help
  * Example phases: "help me", "I need help", "what should I do"
* **intent.core.TurnEndChat** - used by all the end chat turns to capture if the user is looking to end the interaction through natural language
  * Example phrases: "end", "stop"
* **intent.shoebot.Pronation** - used to capture when the uses is asking what is pronation&#x20;
  * Example phrases: "pronation?", "what is pronation?", "what is my pronation"
* **intent.shoebot.ProvideRunnerExperience** - used to capture any runner experience info&#x20;
  * Example phrases: "I run daily and looking for size 8", "I'd like to get women's shoes for causal runners"
  * Entities: frequency, gender, pronation, size (NB: gender here is not intent as gender identity but a crude way to distinguish between men and women shoes)
* **userContinueNLU** - used to identify when the user is ready to proceed with the conversation
  * Example phrases: "continue", "let's go", "let's do it"
* **userPromptQuestion** - used to identify when the users says that they want to ask something
  * Example phrases: "want to ask something", "I have a question"

