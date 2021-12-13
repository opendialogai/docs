---
description: Where and how to preview you application within OpenDialog.
---

# Previewing your application

Within OpenDialog we enable you to preview your application within OpenDialog, meaning you can test and validate the conversational experience before deploying your application.&#x20;

Right now the Preview page only allows you to preview the OpenDialog Webchat (AKA Chatbot). As more interfaces are released in Q2 & Q3 this page will be updated to cover those.

If you've already completed one of our tutorials (see below) then you'll have already interacted with our preview page.

* [Designing a basic flow and controlling with buttons](tutorials/button-driven-bot.md)
* [Simple FAQ Application](tutorials/simple-faq-application.md)

Even if you've interacted with the Preview page, this page of our documentation focuses on giving you some in-depth guidance around how to utilise the page, it's features and get the most of it whilst you're building out your conversational applications.

### Selecting your Scenario

When you first click through to the 'Preview' page from the navigation you will be asked to select the Scenario you would like to preview. Within the drop down list you will see only active scenario's - so if the one you want preview is missing, it's likely to be in draft mode. If so, head back to the Designer and switch it from 'Draft' to 'Active'.

Once your Scenario is active you will then see it in the drop list to select.

![Preview: Scenario select](<.gitbook/assets/image (389).png>)

You will then see that our Webchat appears displaying your Scenario welcome conversation ready for you to interact with it.&#x20;

### Conversation Context

Whilst you interact with Webchat you will notice that the Conversational Context updates to show you the intent _(and where it's positioned in your Scenario)_ that is currently being displayed. The links are clickable and will take you through to the intent so that you can make any changes as required.

![](.gitbook/assets/conversational\_context.gif)

####

### Attributes & Context

We won't go into what we mean by Attributes and Context in this section. However, if you'd like to learn more you can so [here](developing-with-opendialog/attributes-and-contexts/).

Within the preview page, you're able to simulate attributes which you might have set as conditions against [messages](messages/#6-message-conditions), [Intents & Turns](turns-and-intents.md#advanced-settings), Scene, Conversation or Scenario's. You can simulate this this by using the fields under 'Set Custom Attributes'. Underneath that is the list of 'User' and 'Global' contexts available - which will include any custom items that you add.

**Attribute Example:**

Using an example we've used [elsewhere in the documentation,](messages/#6-message-conditions) where we want to show different messages to users depending on whether they are a new user or a returning user.&#x20;

We firstly need to set conditions on the messages themselves to tell the system which message it should show depending on the value of the attribute saved against the user. For this example, we would have set the 'Attribute' to `seconds_since_last_seen` and the 'Value' to be less than '`0`' for new users or to be greater than '`0`' for returning users.

So then to test this within the preview, for a returning user, we would type in `seconds_since_last_seen` to the 'Attribute' field and then '`1`' into the value field then click on 'Add'. You will see it update in the 'Context- User' section.&#x20;

We would then refresh the whole page _(do not click on 'Refresh Scenario' as this resets ALL of the contexts incl. seconds since last visit)_, for this attribute specifically, to trigger the returning user interaction. For others, you might just continue through the conversation.&#x20;

![Preview: custom attributes](<.gitbook/assets/image (392).png>)
