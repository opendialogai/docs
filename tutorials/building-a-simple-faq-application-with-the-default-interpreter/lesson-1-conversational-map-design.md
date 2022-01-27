---
description: The first lesson of the Simple FAQ Application tutorial
---

# Lesson 1: Conversational Map Design

## Step 1: Create A Scenario

Head on over to the 'Designer' and start [creating your 'Simple FAQ' scenario](../../getting-started-1/getting-started-with-opendialog/creating-a-scenario.md). Give your scenario a name, as well as a description.

![Create scenario](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (2).png>)

Think about what Conversations there are to be had. OpenDialog comes with a few conversations out of the box; a Trigger conversation (for the user to trigger the conversational application), a Welcome conversation (in which the application welcomes the user), and a No-match conversation (in case the user request is misunderstood or unhandled by the conversational engine).

![Designer: Scenario view](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (4).png>)

👉 In our example, we will also need an 'FAQ conversation' to hold all our question-answer pairs.

## Step 2: Create A Conversation

[Add another conversation](../../adding-conversations.md), by hitting the + button in the navigation bar below.

![](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (3).png>)

You are now asked to name your conversation - in our case 'FAQ Conversation'.  You can also set an interpreter, a behaviour and add conditions. In our case, we will be using the [Default Interpreter](../../interpreters-and-natural-language-understanding/default-interpretor.md) and there is no need to worry about conditions or behaviours for this conversation. You can go ahead and save your 'FAQ Conversation'.

## Step 3: Create Scenes

Within your FAQ conversation, you will want to cover different topics such as; returns, account management, product information etc.

Each subtopic in OpenDialog can be set up as [a scene](../../scenes.md).  Open the FAQ conversation, go ahead and create a few scenes for each subtopic you would like to cover in your FAQ conversation.

Give each scene a 'Starting' behaviour, so that the conversation engine will consider them all as conversation starters.  For more in-depth information on scene behaviours, check out this [linked page](../../scenes.md)!

![Adding the Returns scene](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (5).png>)

![Adding the Shoes scene](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (6).png>)

![Adding the Across The Board scene](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (7).png>)

## Step 4: Create Turns

Finally, [**Turns**](../../turns-and-intents.md) capture single exchanges. In our FAQ application, these are our question-answer pairs. Make sure to give each turn [a starting behaviour](../../turns-and-intents.md#starting-turns), so that the conversation engine considers them when entering their parent component: the scene.

👉 **In our example:** Within the FAQ conversation - set up a 'Returns' scene, with a 'Return purchase' turn.

![Returns scene](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (8).png>)

![purchase returns turn](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (9).png>)

Followed by a 'Shoe size' turn within the 'Shoes' scene

![shoes scene](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (17).png>)

Finally, a 'view my account' turn within the 'Across the board' scene.

![Across the board scene](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_template\_1 (20).png>)

And you are done setting up the conversational map, now let's move onto building the intents within these turns.
