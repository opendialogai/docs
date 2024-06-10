---
description: >-
  This section outlines how you can set up a handoff to live agents using a
  Chatwoot integration.
---

# Chatwoot

### **Where to find**

Conversation Handoff allows you to set up an integration with an external messaging system, for example, Chatwoot.  You can therefore find it under the Integrate section of a specific scenario. Once you select 'Create a new Handoff' you will then have the opportunity to create the Handoff of your choice.  Select Chatwoot to start setting up your Chatwoot integration.

<figure><img src="../../../.gitbook/assets/Chatwoot Handover.png" alt=""><figcaption><p>Setting up a Chatwoot integration via OpenDialog</p></figcaption></figure>

### **What you'll need**

To set up an integration between your OpenDialog account, and a Chatwoot live agent   system - you will need a paying Chatwoot account.  To create a Chatwoot account, you can follow the steps mentioned [here](https://www.chatwoot.com/docs/user-guide/setup-your-account/create-an-account/).

Once you are set up with an account on Chatwoot for your business, you will need four key elements to set up your OpenDialog - Chatwoot connection:

* The **Domain** for the Chatwoot API, which is the following: `https://app.chatwoot.com/api/v1/`
* The **Account ID** for your account can be found via the Chatwoot interface by going into Settings, then Account settings. You will find your Account ID at the bottom of that settings page.
* The **Access Token** for your account can be found under Profile settings in the Chatwoot Interface, by clicking on your initials and then selecting Profile settings.  You can find your access token on the bottom of the profile settings page and copy it from there.
* The **Inbox ID** for the inbox you would like the requests from the conversational application to be submitted to needs to be manually retrieved via the Chatwoot Interface, by going to the inbox you want the request to be sent to.  Now go to the address bar for your browser and view the URL, the Inbox ID is the number right after the inbox/ , for exemple: `app.chatwoot.com/app/accounts/12345/inbox/`**`4576`**`/conversations/...`  with **4576** being the inbox-id

### **How to use**

#### Setting up the Chatwoot handoff in OpenDialog

To set up your Chatwoot handoff, go to the Integrate section, and select Conv. handover from the menu.  Use the Create New Handoff button to set up a new Handoff.

<figure><img src="../../../.gitbook/assets/Screenshot 2023-07-28 at 16.26.42.png" alt=""><figcaption><p>Use the Create new Handoff button to set up a new Handoff integration</p></figcaption></figure>

On the settings page, give your handoff a name and select **Chatwoot** as the system you wish to integrate with.&#x20;

Provide the necessary [account details](chatwoot.md#what-youll-need) to set up your integration.  Hit 'Save' to set up this integration to use in your scenario.

#### Using the Chatwoot handoff in your scenario

To use your Chatwoot handoff in your scenario, on the Handoff overview page, activate the handoff you have just set up, so that it becomes available for your scenario.

To use the hand-off in your scenario, you can configure the messages for the hand-off via the Message Editor by selecting the Conversation Handover tile

![](https://eucattachment.freshdesk.com/inline/attachment?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAzMDQ1MzQ2NTcxLCJkb21haW4iOiJvcGVuZGlhbG9nYWkuZnJlc2hkZXNrLmNvbSIsImFjY291bnRfaWQiOjI1MjY3NjF9.MSsfOLCITqIk3WrzrrAmEYL6q0fq7ib7muaTZ0X0WHE)

\
When the user hits this message, the handover system will step into place, and as soon as the user types their request, this will show up in your Chatwoot conversations.

#### Receiving messages from Chatwoot in OpenDialog

To finalize the integration between Chatwoot and OpenDialog, you will need to connect the two together by referencing your OpenDialog workspace in your Chatwoot Inbox settings.

To do so, go to Chatwoot, the Inbox you have referenced in OpenDialog, and its settings. Update the webhook URL to the following URL, based on your tenant: {tenant}.cloud.opendialog.ai/incoming-chatwoot. &#x20;

For example: example-workspace.cloud.opendialog.ai/incoming-chatwoot.

<figure><img src="../../../.gitbook/assets/Screenshot 2023-10-25 at 12.13.26.png" alt=""><figcaption><p>Update your Chatwoot inbox Webhook URL to be able to receive messages</p></figcaption></figure>

{% hint style="info" %}
In order for your webchat application to be able to return the messages from Chatwoot to webchat, you need to allow the use of websockets.  To set this authorisation, go to Interface Settings - Chatbot Controls and set the Use of Websockets toggle to active.
{% endhint %}

#### Testing the Chatwoot handoff in your scenario

\
You can check if your hand-off is successful by testing your conversation in the Preview (Test - Preview) and checking the user context on the right side of your screen.When you hit the hand-off message the user context will update to include **handover\_success : true**.\
