---
title: Chat API
---

The Chat API is what our own chat widget uses to interact with OpenDialog.

You can use this API to interact with OpenDialog through your own applications, enabling you to build complete custom front-ends.

There are three endpoints supported right now. Brief details are provided below and the API is  documented [here](https://chatapi.opendialog.ai/).

`GET chat-api/configuration`  - where you can retrieve configuration for how the interface should behave.

`GET chat-api/history` - where you can retrieve past messages for a given user

`POST chat-api/message`  - where you post messages and receive the answer from OpenDialog

You must also include the following user ID and scenario ID HTTP headers with each request:\
`OPENDIALOG-USER-ID: <user_id>`

`OPENDIALOG-SCENARIO-ID: <scenario_id>`

These headers ensure users are authenticated and are properly directed to your AI agent.

:::note
In order to POST messages you need a Bearer Token that is generated from within the OpenDialog application in Webchat Settings (it is the appKey in the embed code). 
:::

### Using the Chat API to have a conversation

To have a conversation with an OpenDialog scenario you will typically start by sending a [TRIGGER](https://chatapi.opendialog.ai/#58e86ade-e5ff-4475-8285-0129faa09fc3) message with a callback\_id of WELCOME - this is the default way that OpenDialog app gets started with conversations.

Following the trigger message you can send standard [TEXT](https://documenter.getpostman.com/view/3532544/TVmLAdPF#c83d72c8-11d2-45d9-9949-37e22a5cf635) messages that contain the text that the user is saying.

Every time you change `user_id` a new conversation will be started, but if you maintain the same `user_id` you will continue the same conversation with the OpenDialog engine.
