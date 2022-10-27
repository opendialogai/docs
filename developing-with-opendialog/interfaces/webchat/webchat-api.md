# WebChat API

The WebChat API is what our webchat widget uses to interact with OpenDialog. You can also use it in your own applications.&#x20;

There are three endpoint

`GET webchat-config`  - where you can retrieve configuration for how the interface should behave.&#x20;

`GET user/<user-id>/history` - where you can retrieve past messages for a given user

`POST incoming/webchat`  - where you post messages and receive the answer from OpenDialog

Keep in mind that in order to POST messages you need a Bearer Token that is generated from within the OpenDialog application. &#x20;

The webchat API is documented in Postman [here](https://documenter.getpostman.com/view/3532544/TVmLAdPF)
