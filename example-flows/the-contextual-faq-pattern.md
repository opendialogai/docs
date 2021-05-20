---
description: >-
  A pattern to help us deal with FAQ questions while taking the user through a
  more structured interaction.
---

# Contextual FAQ Pattern

The Contextual FAQ Pattern deals with the  behavior of supporting FAQ questions within a specific context while also supporting follow up actions and attempting to guide the user through a specific course.

There are several use cases for this. For example imagine a shopping guide that wants to support the user through the process of choosing a specific product. While there are specific steps we need to go through \(collect preferences, provide recommendations, etc\), throughout we want to be able to answer any adjacent questions the user may have without loosing overall context. 

The Contextual FAQ Pattern helps us deal with this. 

Let's walk through an example to demonstrate the process. Imagine you have a scenario with conversations as illustrated below.

![A shopping guide scenario](../.gitbook/assets/image%20%28108%29.png)

The expectation is that following a _Welcome_ conversation we will lead the user to a _Collect Preferences_ conversation where we will ask a few questions about their preferences in order to be able to provide recommendations. 

While we are in the Collect Preferences conversation we anticipate that the user will also have questions that should be dealt with an FAQ functionality. The user should be able to ask an FAQ question, get an answer and then be asked whatever remaining preference collection questions there are. 

## The Welcome Conversation

The Welcome Conversation has just one Scene. For the purposes of this example we have three turns setup. 

![The Welcome Scene Turns](../.gitbook/assets/image%20%28101%29.png)

The Welcome Turn is a _STARTING_ turn and its job is to welcome the user to the conversation. 

Following that we anticipate that the user will either have some questions to ask right then \(handled by the _OPEN_ FAQ turn or the user might either click a button or simply say that they want to get started with the guided experience. That is handled by the Continue Trigger Turn. 

The FAQ Turn is an Open turn with a simple request  and response pair.

![Welcome Scene FAQ Turn](../.gitbook/assets/image%20%28106%29.png)

The Continue Trigger turn, instead, is an Open Turn with just a Request intent that transitions the user to the Shopper Profile Conversation. 

Below is a sample dialog, using the Conversation Simulator, that we anticipate within the Welcome Scene. The user will only ever get one Welcome, can ask multiple questions, until they eventually trigger a move to the next scene.

![Example Dialog in the Welcome Conversation](../.gitbook/assets/image%20%2896%29.png)

Now, let's have a look at the Shopper Profile Conversation. 

![Shopper Profile Scene](../.gitbook/assets/image%20%28105%29.png)

Keep in mind that we direct the user to the "top" of this conversation, so what the conversation engine will be doing is to look for potential starting scenes to start the conversation with. We have two scenes. The Shopper Profile Explanation Scene and the Gather Profile Info Scene. 

The _Shopper Profile Explanation_ Scene is our _STARTING_ scene, and it has just one Turn where the bot explains what sort of information it would like from the user. This is a turn with just one Request and an immediate transition to the _Gather Profile Info_ Scene. What this approach gives us is an isolated place to deal with an intro explanation message that should only appear once \(and that we may want to condition based on user info\), and then we go into a scene where we can have multiple open turns that are user initiated providing an easy way to handle a variety of situations while keeping the overall context around shopper profile info. 

Here is what the Gather Profile Info scene looks like:

![](../.gitbook/assets/image%20%28102%29.png)

There are four turns:

In the _Provide Info_ Turn the user is providing relevant information and the bot is either asking for further information or confirming that it has all the information it needs. This choice which will be managed by conditional checks on whether all the information is there or not. 

![Provide Info Turn](../.gitbook/assets/image%20%2898%29.png)

![Conditional Checks](../.gitbook/assets/image%20%28109%29.png)

The _FAQ Turn_ handles the question and answer capabilities. 

The _Help Turn_ provides contextual help in case the user asks for help while in this context and finally the _Turn No Match_ turn will pickup and localised no matches \(i.e. when all interpreters came back with a negative answer\). 

The Turn No Match depends on defining the intent as that \([see here](../turns-and-intents.md#intent-core-turnnomatch)\).

With all these pieces in places we can start support flows as illustrated below:

![](../.gitbook/assets/image%20%28103%29.png)

The user can keep asking questions, requesting helping or not matching anything the bot can handle. The user can ask FAQ questions as a response to the bot asking for specific information such as "how often do you run". Because of the way the Conversation Engine works with us to support the conversational flow and reason about context we can keep bringing the user back to relevant questions and moving the flow forward. 

{% hint style="warning" %}
In this section we've focussed on just conversational flow so that we can highlight the pattern. To take this pattern and turn it into a complete bot you would also need to setup appropriate NLU interpreters. We will have other sections dealing specifically with that as we update our documentation. 
{% endhint %}







