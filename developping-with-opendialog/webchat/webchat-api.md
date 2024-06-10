# WebChat API

The WebChat API is what our WebChat widget uses to interact with OpenDialog.&#x20;

You can also use this API to interact with OpenDialog through your own applications.

There are three endpoints support right now. Brief details are provided below and the API is  documented in Postman [here](https://documenter.getpostman.com/view/3532544/TVmLAdPF)

`GET webchat-config`  - where you can retrieve configuration for how the interface should behave.&#x20;

`GET user/<user-id>/history` - where you can retrieve past messages for a given user

`POST incoming/webchat`  - where you post messages and receive the answer from OpenDialog

Keep in mind that in order to POST messages you need a Bearer Token that is generated from within the OpenDialog application in Webchat Settings (it is the appKey in the embed code). &#x20;

### Using the WebChat API to have a conversation

To have a conversation with an OpenDialog scenario you will typically start by sending a [TRIGGER](https://documenter.getpostman.com/view/3532544/TVmLAdPF#372bcbba-e0af-43f5-b6cd-d59790f86522) message with a callback\_id of WELCOME - this is the default way that OpenDialog app gets started with conversations.

Following the trigger message you can send standard [TEXT](https://documenter.getpostman.com/view/3532544/TVmLAdPF#c83d72c8-11d2-45d9-9949-37e22a5cf635) messages that contain the text that the user is saying.&#x20;

Every time you change `user_id` a new conversation will be started, but if you maintain the same `user_id` you will continue the same conversation with the OpenDialog engine.

