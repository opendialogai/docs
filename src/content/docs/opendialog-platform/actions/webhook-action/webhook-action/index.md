---
title: '[Deprecated] webhook actions'
---

:::caution
This action is deprecated in OpenDialog. Use [new webhook action](/opendialog-platform/actions/webhook-action) instead.
:::

The webhook action allows you to send and receive data from an external service via a HTTP POST request to a provided webhook URL.

:::note
For some more details around the data structures you can use please see the [Integrating with OpenDialog](/developing-with-opendialog/introduction) section.
:::

Once you have a service that provides the desired functionality, you'll want to create a new webhook by following the action creation steps and set the action's URL to be the URL of your service.

![A webhook action that sends/receives data from "https://api.example.com/opendialog"](</.gitbook/assets/image (403).png>)

### Headers

You can add headers in the action configuration page that will be send along with the HTTP POST request.

This could be used to send authorization tokens and other custom headers as required by the webhook.

### Mocking a webhook

If you would like to test OpenDialog's webhook action functionality ahead of developing a webhook, you can generate a mocked webhook using a service such as [webhook.site](https://webhook.site) or Postman.

This will provide you with a webhook URL, the ability to see the inputs sent by OpenDialog, and the ability to set a static response to be returned to OpenDialog. This can be useful to understand how the input and output attributes of an action will fit in with your conversation flows.

The following steps use an example we provide through Postman - available [here](https://www.postman.com/opendialogai/opendialog-s-public-workspace/request/48m0k3s/webhook-endpoint).

This example mocks a webhook action that takes input of a first & last name, and outputs a concatenated full name.

First, let's create a test action in OpenDialog and set the webhook endpoint to point to our mocked webhook endpoint on Postman.

The url we are using is `https://af7df53c-9871-40de-a454-31d5cf2d6237.mock.pstmn.io /your-webhook-endpoint`

![](</.gitbook/assets/image (535).png>)

*A webhook action*

Now, we can set up the **input attributes.** This is the information we will be collecting from our scenario and sending to our webhook endpoint. In this case it will be the user's first and last name.

:::note
In the **Headers** section you can setup and authentication token required and you can also send headers that include conversation attributes such as the user's ID.
:::

![](</.gitbook/assets/image (536).png>)

Ok, so we've setup a `first_name` and `last_name` as input attributes and indicated that we expect a `full_name` as an output attribute (i.e. the result of our action).

:::note
The webhook action is _permissive_ in that it will accept input attributes that were not explicitly defined here and it will also show output attributes that were not explicitly defined. Output attributes will be stored by default in the user context. The main reason to define attributes is to provide clarity for what the expectations are and to be able to manipulate via the UI where attributes are stored (i.e. in which context).
:::

Now, we can test our action by click on the Test Action Using JSON button.

![](</.gitbook/assets/image (537).png>)

*Testing a webhook action*

We will get the preset response from the mock Postman server.

Now, we can activate our action to make it available in a scenario.

![](</.gitbook/assets/image (538).png>)

*Activating an action.*

Finally, we can add the action to a specific intent so that it is run whenever that intent is selected.

![](</.gitbook/assets/image (539).png>)

*Adding an action to an intent.*

In this case, I've added the action to the WelcomeResponse intent, so it will be executed whenever that intent is executed. You might notice in the screenshot that there is another action defined (Customise welcome message). You can run multiple actions on an intent and they will be executed in order.

Before testing it out let's setup the WelcomeResponse message to use the results of the Webhook test action. We will edit the message associated with this intent and use the user's full name in the message.

1. Click on Edit Messages.

![](</.gitbook/assets/image (540).png>)

2. Click on the WelcomeResponse edit button

![](</.gitbook/assets/image (541).png>)

3. We are going to add a text block to our message that greets the user.

![](</.gitbook/assets/image (542).png>)

4. Now if we visit the preview section we will see that we are extracting the information from the action and using it to greet the user.

![](</.gitbook/assets/image (543).png>)

Well done! You've created your first action using the Webhook action in OpenDialog.

## Dealing with failed actions

Actions can fail so we need to be able to check for that from our conversation design and deal with it appropriately.

Every action automatically generates a boolean attribute (true/false) based on the action name. For the example above that would be `webhook_test_action_success`

We can see the value of this attribute in our user context.

![](</.gitbook/assets/image (544).png>)

We can check for the value of this attribute in our conditions before we use the output of the attribute.

For example, we could have two messages one used when `webhook_test_action_success` is true and one for false.

![](</.gitbook/assets/image (545).png>)
