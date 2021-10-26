---
description: >-
  What are conversations in the OpenDialog world? Also, what on earth are
  Electronic Institutions!?
---

# What are Conversations?

## Introduction

{% hint style="success" %}
This section provides some of the why behind the how of OpenDialog. If you want to dive straight into the active part then go straight to the [Modelling Conversations](../../concepts-1/concepts/) section.&#x20;

If you are really, really in a hurry jump over to [Getting Started with OpenDialog](../../getting-started-1/getting-started-with-opendialog/) to set up your first scenario within OpenDialog.
{% endhint %}

We all intuitively know what a conversation is. One of the first things we are taught is how to exchange ideas and information with others using words and whatever other sensory clues we are capable of producing (visual, auditory, touch, etc). The question to tackle here is **what are conversations in the context of a conversational application**, and, more specifically, in OpenDialog.&#x20;

As we say in our [manifesto](https://www.opendialog.ai/manifesto), a conversational application has a specific purpose. It is communicating with the user to coordinate, collaborate in order to solve a specific goal. As such, it is worth asking ourselves how do we (as humans) know how to communicate, coordinate and collaborate in the real world? How do we, as humans, figure out what is the appropriate next thing to do?

## We are all agents in a multi-agent world

There is a sub-field of Artificial Intelligence, called Multi-Agent Systems, that has been grappling with this problem for some time. In multi-agent systems, agents are considered autonomous entities that need to come together to solve common problems. Which sounds an awful lot like what conversational applications are. In conversational applications, you have one (or more) software bots that need to communicate and collaborate with one or more humans to solve a common problem.&#x20;

It will come as no surprise then that OpenDialog views a conversational application as a multi-agent system. Theoretically, there can be multiple **participants** in this system, but at the very least there is one user (the human) and one application (our bot).

> In an OpenDialog conversational application, bots and humans are all considered as agents in a single multi-agent system.

This approach allows us to tap into the rich research that already exists on how to model and manage conversations between agents and apply it to conversational applications.&#x20;

## Institutions for the win!

There are several ways of modeling such multi-agent systems. We adopted a framework called [Electronic Institutions (EI)](electronic-institutions.md). This framework is particularly well-suited as it aligns with our view of what a conversational application is and it provides a rich enough set of concepts and structure, enabling us to describe a wide range of scenarios.&#x20;

> An Electronic Institution is an organisational structure for coordinating the activities of multiple interacting agents. This organisational structure provides the framework for conversational applications.&#x20;

![](<../../.gitbook/assets/image (48).png>)

You can read some more about [Electronic Institutions ](electronic-institutions.md)and the specific way we model conversations within EIs (using something called [Enhanced Dooley Graphs](enchanced-dooley-graphs.md))

Ok. Enough of the underlying theory and thanks for giving this section some time. Let us move on to how we [practically model conversations](broken-reference)!&#x20;
