---
description: >-
  A pattern to help deal with situations where we were not able to interpret
  user input in a contextualised way
---

# Contextual No Match Pattern

One of the biggest challenges of failing to understand what the user said is that recovery can be quite hard. With OpenDialog we make it simple to recover in a contextualised way so that we can get the user back on track quickly. 

Consider the following scene:

![The Gather Profile Info scene](../.gitbook/assets/image%20%28103%29.png)

In this scene, the main goal is to gather relevant profile information. 

It is very likely that the user will say something that we will not be able to interpret. In this case, the conversation engine will proactively look for a turn that is able to handle an intent called `intent.core.TurnNoMatch`. The Conversation Engine generates this turn on its own when it fails to find a matching interpreter. 

In order for us to be able to react to this intent we need to set up a Turn that is _listening_ for that intent. Here is what the configuration can look like:

![Contextual No Match configuration](../.gitbook/assets/image%20%28109%29.png)

You can then deal with the No Match situation in whatever way will best fit the context at hand.

As well as the `intent.core.TurnNoMatch` intent, the OpenDialog conversation engine will work up a stack looking for matching no match intents from Turn up until Conversation and then globally. The logic is as follows:

* If there is no matching intent for what the user just entered, the conversation engine generates a `intent.core.TurnNoMatch` intent
* If no `intent.core.TurnNoMatch` intent is found, the conversation engine generates a `intent.core.SceneNoMatch`
* If no `intent.core.SceneNoMatch` is found, the conversation engine generates a `intent.core.ConversationNoMatch` intent
* If this is not found, a global `intent.core.NoMatch` is looked for. 

**NB Any new scenario you create in OpenDialog will have a generic NoMatch intent generated for you. If this has been deleted or removed, things might not work as expected.**

