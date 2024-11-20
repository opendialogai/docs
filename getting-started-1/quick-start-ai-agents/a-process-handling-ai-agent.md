---
description: >-
  OpenDialog Pattern for managing multiple steps in a process through an AI
  Agent
---

# A Process Handling AI Agent

Conversational AI Agents typically need to support three modes of interaction

* Handling wide range of questions across a number of topics.
* Guiding the user through a specific process with multiple steps while executing appropriate actions  in backend systems to support that process.&#x20;
* A combination of question-answering coupled with stepping through a process.&#x20;

The [Quick Start AI agent](quick-start-ai-agent.md) and the [Start from Scratch AI Agent](the-start-from-scratch-ai-agent/) are both focussed on handling questions on a wide range of topics. Here we delve into the second aspect, which is handling processes and look at how it can be combined with the question-answering.

{% hint style="info" %}
**Template available**&#x20;

To get started with the Process Handling Agent in OpenDialog visit the "Create a new scenario" page and select the Process AI Agent template.
{% endhint %}

## What's special about processes?

Handling processes needs specific attention because they have a well defined series of steps (and sequence) and a well-defined end goal. For example, if we need to collect a few different pieces of information in order to finalise an appointment booking for a user we cannot achieve that final goal until all the pieces of information are collected (just as would happen in the real world).&#x20;

As such, while we can allow the user to ask question and go "off-topic" during a process, we also need to design a conversation that drives back towards the key goal (or enables the user to abandon the process).&#x20;

In addition, we need to carefully consider what _types_ of questions we want to be able to handle while in a process. While we could cover any range of topics, realistically we want to focus on issues that are relevant to a process. Just as in a real-life conversation you would not veer wildly off-topic if you are trying to book an appointment, for example, we similarly need to bring focus to our processes. Our AI Agent needs to be empowered to say no to some things so that it can focus on the process at hand.&#x20;

The Process Handling Agent illustrates the OpenDialog conversation patterns we use to support such processes in OpenDialog and can be a great starting point for your process handling AI Agents.&#x20;

## Representing Process Steps as Scenes in OpenDialog

A process could be anything from an appointment booking, an insurance claims process, a triage of a customer support issue. It typically consists of a series of steps, which each step achieving a specific sub-goal of the overall process. For example, in appointment booking, we might first want to pick who to book an appointment with, then examine their availability and finally pick a specific date.&#x20;

A user will move from one step to the other completing the process, although they can also move backwards and repeat steps as they may change their mind.&#x20;

In OpenDialog we suggest representing the overall Goal as a Conversation while each step of the Process is a Scene in that Conversation.&#x20;

So an Appointment Booking Conversation for a doctor would look something like this:

<figure><img src="../../.gitbook/assets/image (551).png" alt=""><figcaption><p>Appointment booking process</p></figcaption></figure>

Each scene has a clear goal. At each scene (or step) the user can complete the goal and move forward or they can abandon the process and they will move back to the Topic Conversation.&#x20;

{% hint style="info" %}
Name your scenes in easy to understand, human friendly ways so that you can easily track what is going on!
{% endhint %}

Worth noting that in the Topic Conversation we have a specific Topic, called Book An Appointment which will detect if the user is asking to book an appointment which will direct them to the Appointment Booking Conversation.

<figure><img src="../../.gitbook/assets/image (552).png" alt=""><figcaption><p>Moving from a Topic Conversation to the Appointment Booking Conversation</p></figcaption></figure>



{% hint style="info" %}
**How "big" or "small" should a sub-goal be?**

Sub-goals can involve asking for just one piece of information, or multiple elements. For example, you can imagine a single scene asking for 1. the person to book an appointment with and 2. what is the preferred date for the appointment.&#x20;

There is no specifically wrong or right answer. These are design choices based on what you are trying to achieve, how you are collecting the information, what backend integrations (i.e. what API actions you are calling) at the same time and how you design your LLM Actions (prompts) to collect information. If in doubt, we recommend starting with smaller discreet steps for more control and then considering whether they should be combined.&#x20;
{% endhint %}

## A Sample Process Scene

Every scene in the Appointment Booking Conversation (or every step in our Process) follows the same pattern. Let's example that Pattern here:

<figure><img src="../../.gitbook/assets/image (553).png" alt=""><figcaption><p>The sample step scene</p></figcaption></figure>

### Starting Turn: Step Introduction

There is one **starting turn** called _Step Introduction_. The purpose of this turn is to setup the scene for our user and explain the sub-goal. It will present the user with an appropriate welcome to the step and explain what we are trying to achieve.&#x20;

<figure><img src="../../.gitbook/assets/image (554).png" alt=""><figcaption><p>The Step Introduction Turn</p></figcaption></figure>

The _Step Introduction_ turn starts with an APP intent. There is no direct response within the turn. This means that the Conversation Engine will send the message associated with the APP intent to the user and then will set the context to the overall scene waiting for input from the user and looking for turns with the Open behavior to handle user utterances .&#x20;

{% hint style="info" %}
_Hold on - how do we even get to Step Introduction turn?_

Great question! Remember the Topic conversation had a Book Appointment booking topic. A USER intent from there transitions us to the Appointment Booking Conversation. The conversation engine will then look for a start scene (our first step!) within the Appointment Booking Conversation, with a starting turn (our Step Introduction turn) and given that there is an application intent there it will use it to formulate a response to the user.&#x20;

This approach gives you several benefits. Since you are directing the user from one conversation to the "top" of another conversation without "hard-coding" a specific scene or turn you completely isolate the two. If you want to introduce a different starting scene with different behaviour you can just concentrate on the Appointment Booking conversation. You can also have multiple starting scenes with different conditions based on the type of user or the amount of information you already have about what needs to happen in the process.&#x20;
{% endhint %}

Ok, with the introduction to the step out of the way let's turn our attention to the other turns.&#x20;

Every other turn in the scene will start with a USER intent since each other turn represents a potential response to that introduction turn with the APP intent.&#x20;

We will start with the _Continue or Complete Step_ turn.&#x20;

### Continue or Complete Step

Imagine the following dialog:

<figure><img src="../../.gitbook/assets/image (556).png" alt=""><figcaption><p>First step of OpenDialog appointment booking</p></figcaption></figure>

This dialog got the user from the Topic conversation and dropped them into the appointment booking process. At this point the user can confirm that they are happy to proceed, or they might change their mind. While we have buttons to help the user they can, of course, just express that using natural language.&#x20;

The purpose of the Continue or Complete Step is to define what happens if the user confirms (or , in general, says something or performs an action that leads to the conclusion that this step has been achieved).&#x20;

For example, consider the following interaction:

<figure><img src="../../.gitbook/assets/image (559).png" alt=""><figcaption><p>Continue or Complete moves us to New Scene</p></figcaption></figure>

The "Continue or Complete" turn has the "Confirm" incoming intent that led us from "Step 0 - Welcome" to "Step 1 - Select Doctor" and the "WelcomeToDoctorChoice" outgoing intent.

There are two reasoning steps that led us to this outcome - we fist acknowledge the user choice and we then move the conversation to the next step. By separating them we can adjust them to the user and context with fine-grained control.

#### Confirm user choice

The conversation engine interpreted `"sure buddy let's go ahead"` as a Confirm intent (using a Semantic Classifier). That Confirm intent had an APP response within the turn as shown below.

<figure><img src="../../.gitbook/assets/image (560).png" alt=""><figcaption></figcaption></figure>

Since the user confirmed we then provide a response, which is `"Great, let's get started"`.&#x20;

#### Move conversation context to next step

Now, turn your attention to the Virtual Intent defined the the ConfirmResponse intent.&#x20;

We are defining a _Virtual Intent_ called `GoToNextStep` . We use this virtual intent to separate the confirmation turn and confirmation text ("great, let's get started") from the turn that decides a. where to take the user next and b. what message to display after the user has changed context. This leads to more flexible, natural conversation while keeping us in control!

The `GoToNextStep` intent is in an Open turn in our Step 0 conversation (the "User Routing" turn) and provides a transition to the next step - in this case the Step 1 Scene. In Step 1 a starting turn with starting APP intent presents us with the doctor choice.&#x20;

This same pattern allows us to move forward, backwards or in any direction we need in the process. We can, for example, also re-enter Step 1 from say Step 2 if the user chooses to go back a step but with different connecting text - e.g. something like "Let's get you back to doctor choice" - without having to change Step 1. Virtual intents enable us to simulate user requests, keeping the USER-APP or APP-USER cadence and flexibly connect different contexts while re-using the same conversation elements.&#x20;

{% hint style="info" %}
**What is a Virtual Intent?**

A **Virtual Intent** is a USER intent that we explicitly inject in the conversation following an APP intent. It enables us to emulate the user and move the conversation forward _as if_ the user had actually (and not virtually) said something that would be interpreted as that intent.&#x20;

Virtual intents are useful for a number of reasons:

1. They enable us to keep a conversation cadence of USER-APP and connect multiple APP intents in a series (up to five) without forcibly chaining the APP intents. We are simulating a conversation by injecting USER intents that means we have much more flexibility around the outcome. Rather than hard-coding an outcome we are asking the conversation engine to figure out what it would do if the user said something. This is especially useful when we are changing conversation context (i.e. moving from one scene to the other).&#x20;
2. Since we are connecting APP intents together we can have connecting text (such as "Great, let's get started") that is relevant to the outgoing context - in this case the Step 0 Scene - but not relevant to the in coming next context - the Step 1 Scene. This supports reuse while leaving the conversation fluid and natural.
3. They enable us to reuse sections of a conversation or pick specific behavior by essentially telling the conversation engine "even if the user said intent X treat it as if they said intent Y"

Virtual intents are supported in the Analyse view of a conversation and in the conversation player in Conversation Design so you can always see what the impact of this intent injection will be.&#x20;
{% endhint %}

<figure><img src="../../.gitbook/assets/Intent and virtual intents.png" alt=""><figcaption><p>Virtual intents</p></figcaption></figure>

### Support Intents

We now turn our attention to the supporting intents in the scene.&#x20;

* NoMatch
* Question
* TalkToHuman

#### No Match

This is a local No Match (`intent.core.TurnNoMatch`) that will be selected if the conversation engine does not find an intent that matches what the interpreter output is. We can use this turn to recover the conversation, asking the user to rephrase, etc. Of course the output can be driven by an LLM action and be contextuall and conversationally relevant, but it recognises that we were not confident enough to treat it as something else providing significant control.&#x20;

#### Question

The Question intent will match to general questions and statements based on the definition of our semantic classifier. We can then connect it to an appropriate LLM action to answer the question. We can also decide to refocus the user on the goal through another virtual intent.

<figure><img src="../../.gitbook/assets/image (561).png" alt=""><figcaption><p>Answering a question and then return to the doctor choice</p></figcaption></figure>

<figure><img src="../../.gitbook/assets/image (562).png" alt=""><figcaption><p>Virtual intent on QuestionResponse that forces the conversation engine to behave as if the user asked about doctor choice</p></figcaption></figure>

The configuration above shoes that after we've provided a response to the question we then inject an "AskAboutDoctor" intent.&#x20;



This intent is in our Routing turn and transitions us back to the top of the same scene we are in which will, in turn, re-present the doctor choice widget. This enables us to reuse the exact same design and makes it more scalable moving forward as we can easily make different choices or introduce other steps by intervening at just the right point.&#x20;

<figure><img src="../../.gitbook/assets/image (563).png" alt=""><figcaption><p>AskAboutDoctor routing intent</p></figcaption></figure>

#### TalkToHuman

Finally, the TalkToHuman intent would specifically respond to a request to a human agent and handover the conversation or provide instructions on how to do so as apporpriate.&#x20;
