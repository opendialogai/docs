---
description: A quick-fire view of all the main concepts of OpenDialog
---

# Introduction

{% hint style="info" %}
The 1.0 version is currently in private beta and the documentation is in beta as well - please [get in touch](https://www.opendialog.ai/contact-us/) for a demo, if you want to join our private beta or simply to sign-up to be notified when the final release will be ready. 
{% endhint %}

What does it mean to build a conversational application with OpenDialog? 

We've talked quite a bit about the [underlying concepts](concepts-1/what-are-conversations/), but here we take a much more practical look to get you started.

The aim of OpenDialog is to empower you to quickly create sophisticated conversational experiences. 

This primarily happens in two ways. Firstly, by helping you define and leverage both conversational and wider application context and, secondly, by having a pro-active conversational engine that uses that context definition as much as possible.

In addition, we allow you to weave in interpreters and define actions as required, as a cohesive and coherent part of the overall application. 

In this section, we are going to provide a high-level, quick-fire overview of these concepts and in subsequent sections, we will dive into the specific details of each. 

## Application and Conversational Context

### Attributes and context

The journey of helping you manage context starts with _**attributes**_. Attributes are the way you can describe anything that is relevant to the conversational application around its environment. 

Attributes are captured within different _**contexts**_. These are like buckets that help us separate and related different types  of attributes. There are contexts such as the _user_ context or the _conversation_ context that store attributes related to that. We will be looking at each in more detail later, but for now just keep in mind that anything describable is an attribute, and each attribute will be stored in a context. 

### Conversational Context and Flow

The next bit is conversational context and flow. The OpenDialog Designer enables you to define both conversational context and flow through a single conceptual framework. The highest level abstraction is that of **scenario**, with scenarios able to contain multiple into **conversations**, conversation contain  **scenes** and finally scenes can contain **turns**, with each turn having at least some request intents and possibly response intents. 

The conversation engine then uses that definition to decide:

1. The current conversational state
2. The possible follow-up states

### Conversational State

The conversational state will let us know which \(if any\) Scenario is currently active, and then within that Scenario which \(if any\) Conversation is currently _ongoing_, and then within the Conversation which \(if any\) Scene is selected and finally within the Scene which \(if any\) Turn is selected. Each turn has at least one Request Intent and may have Response Intents. Based on the Request Intent the conversation engine will look to select an appropriate response intent _or_ it can perform a Transition to another Conversation or Scene and attempt to find an appropriate intent there. 

Yes, that is quite a journey but it provides us with a very flexible way of capturing context to a useful degree of detail! The OpenDialog Designer makes it very easy to capture the different stages.

The current conversational state will then determine what are the possible next states. 

At the highest level a user only ever in one of two states. They are either in an _ongoing conversation_ or they are _not in an ongoing conversation_. 

#### User not in an ongoing conversation

If no ongoing conversation is selected then when an utterance event takes place \(an utterance event is just a fancy way to say that someone said something\) the job of the conversation engine is to determine what \(if any\) Turn the user could be placed in \(and by consequence what the ongoing conversation is\). 

To do this the Conversation Engine is going to examine _all_ [active](designer.md#active-and-draft-scenarios) scenarios, look at all the conversations that have been given the [_STARTING_](adding-conversations.md#starting-conversations) behaviour, find all the scenes that have a _STARTING_ behaviour, then find turns with a _STARTING_ behaviour. 

From those turns is is going to use the interpreter associated with each turn to attempt to interpret the user utterance. The interpreter with the highest confidence score will _win_, and the user will be positioned in that conversational state. 

At that point, the Conversation Engine will consider what are the Response Intents or whether any transitions are defined and move the conversational state appropriate. 

#### User in Ongoing Conversation  

If the user is in an ongoing conversation and we have an incoming utterance we will attempt to match that utterance against all the possible turns within a given scene. 

{% hint style="info" %}
If the Conversation Engine does not match any of the possible intents it will create its own intent - called a No-Match intent and then attempt to match that! The Conversation Engine starts with what is called a `TurnNoMatch`, which means it was looking for a Turn but didn't manage to find out and and it will now look for a Turn that can handle a TurnNoMatch. It then escalates to a `SceneNoMatch`, then a `ConversationNoMatch` and finally the global `NoMatch`. This cascading failure allows us to capture "no matches" at the appropriate level and attempt to recover. We will be looking at more specific examples further on in the documentation.
{% endhint %}

{% hint style="info" %}
Roadmap: We will eventually support escalation of possible intents to other _open_ scenes and the _open_ conversations so if something fails within a scene we can look for other contexts that may be appropriate.
{% endhint %}

## Interpretation

A key aspect of conversational behaviour is the interpretation of user utterances. The way OpenDialog handles this is by using _interpreters._ Interpreters are assigned to individual user-related intents. When a user utterance is provided all the relevant interpreters based on conversational context will be queried and the interpreter with the highest confidence score will be matched. 

### _Expected Attributes_

Interpreters can also generate _expected attributes._ These are pieces of information that we expect to find within a user utterance. If an interpreter finds an expected attribute it will store it in the context we provided. This enables us to then user it. 

For example, for the phrase "I would like to order shoes size 7", we can have an expected attribute of `shoe_size` that we can direct the conversation engine to store in the `User` context. We can then use conditions through the conversation to determine whether we have this piece of information or not.

## Actions

The last piece of the puzzle are actions. Actions enable us to interact with external services or simply perform some specific type of computation that we can then feed back into context. 

Actions take attributes as their inputs and provide attributes as their outputs. This gives us a consistent way of doing something and then providing that information back to our conversational application so that it can use it in its interactions with the user. 

