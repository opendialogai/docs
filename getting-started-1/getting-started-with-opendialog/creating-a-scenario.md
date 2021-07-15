---
description: Creating your first scenario.
---

# Creating a Scenario

The first step will be to create a scenario. A scenario represents a single conversational experience, a specific use-case that is meant to be complete in and of itself. While you can use OpenDialog to move users between different scenarios for now we will treat scenarios as stand-alone experiences. 

### Create New Scenario 

Click on the Designer on the sidebar to enter the Designer space where you can create a new scenario. 

![A list of Scenarios in the Designer view](../../.gitbook/assets/image%20%2852%29.png)

Click on the "Create New Scenario" button, and you will be presented with the New Scenario dialogue. Fill in the details - something that will be clear and help you and others easily identify the purpose of a scenario.

![Create a new scenario in OpenDialog](../../.gitbook/assets/image%20%28257%29.png)

### Scenario Viewer

Once you click on "Create Scenario", you are dropped in the scenario with three default conversations - the "Trigger" conversation, the "Welcome Conversation" and the "No Match Conversation". 

![Initial conversations for most OpenDialog Scenarios](../../.gitbook/assets/image%20%28319%29.png)

The "Trigger Conversation" is the one that will be "activated" when a user first interacts \(with a webchat interface this is the conversation that gets _triggered_ when the user loads the webchat widget\). 

The Welcome Conversation is where we start interacting with the user, welcoming them to this conversational application. 

Finally, the "No Match Conversation" is the one users are led to when they say something that the conversation engine cannot interpret. You can capture _no-matches_ at different levels of a scenario but the "No Match Conversation" is meant to be the final catch-all. 

Ok! Now that we have a new scenario \(albeit a very simple one!\) in place let's dig in and see what it can do. 

