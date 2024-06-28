# Chat API

The Chat API is what our own chat widget uses to interact with OpenDialog.&#x20;

You can use this API to interact with OpenDialog through your own applications, enabling you to build complete custom front-ends.

There are three endpoints supported right now. Brief details are provided below and the API is  documented [here](https://chatapi.opendialog.ai/).

`GET webchat-config`  - where you can retrieve configuration for how the interface should behave.&#x20;

`GET user/<user-id>/history` - where you can retrieve past messages for a given user

`POST incoming/webchat`  - where you post messages and receive the answer from OpenDialog

{% hint style="info" %}
In order to POST messages you need a Bearer Token that is generated from within the OpenDialog application in Webchat Settings (it is the appKey in the embed code). &#x20;
{% endhint %}

### Using the Chat API to have a conversation

To have a conversation with an OpenDialog scenario you will typically start by sending a [TRIGGER](https://documenter.getpostman.com/view/3532544/TVmLAdPF#372bcbba-e0af-43f5-b6cd-d59790f86522) message with a callback\_id of WELCOME - this is the default way that OpenDialog app gets started with conversations.

Following the trigger message you can send standard [TEXT](https://documenter.getpostman.com/view/3532544/TVmLAdPF#c83d72c8-11d2-45d9-9949-37e22a5cf635) messages that contain the text that the user is saying.&#x20;

Every time you change `user_id` a new conversation will be started, but if you maintain the same `user_id` you will continue the same conversation with the OpenDialog engine.

