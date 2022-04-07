# Lesson 3: Setting Up Actions

{% embed url="https://youtu.be/Im0wLwyr09g" %}

## Overview

In this lesson we take a look at finally setting up actions and adding them to intents.&#x20;

{% hint style="info" %}
**Actions** allow us to define input and output attributes as a way to pass data in and out of our applications. You can find out more about how they work [here](../../actions/webhook-action.md).
{% endhint %}

## Create Actions

Start by navigating to the actions setup bar and select add new action.

### Get Employee Name Action

This action is responsible for retrieving the employee's name using their ID from a webhook. This is done by sending the input attribute _employee\_id_ and expecting the output attribute _name_.

* Set the action name to "Get Employee Name".
* For now add a dummy URL till we update it later. e.g `https://example.com` (this is where your webhook's URL will be placed)
* Add the input attribute _employee\_id._
* Add the output attribute _name_.

![Get Employee Name Action](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_actions\_scenario=0x16a3246 (1).png>)

{% hint style="info" %}
Ignore the headers for now as the webhooks that we will be building for this tutorial will not need them.
{% endhint %}

### Save Employee Feeling Action

This action is responsible for saving the employee's feeling and notes to the database. This is done by sending the _employee\_id_ (in order to identify the associated employee we need to update), _feeling_ and _notes_ input attributes to the webhook.

* Set the action name to "Save Employee Feeling".
* For now add a dummy URL till we update it later. e.g `https://example.com` (this is where your webhook's URL will be placed)
* Add the input attributes _employee\_id, feeling_ and _notes._

![Save Employee Feeling Action](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_actions\_scenario=0x16a3246 (3).png>)

{% hint style="info" %}
Note that this action doesn't require any output attributes because it is sending data not necessarily receiving data. But in our webhook will still need to send back a response containing data indicating whether the execution of this action was successful.
{% endhint %}

## Create Mock Webhook (Optional)

We can now create a mock webhook to be able to test our actions. Follow this [tutorial](../../actions/webhook-action.md) using the attributes mentioned above to create your mock webhook and update the URL for the actions we've just created with the associated URLs.

### Get Employee Action Webhook Simulation

Use the code below as your mock response for your webhook.&#x20;

```
{
    "successful": true,
    "output_data": {
        "attributes": {
            "name": "John"
        }
    }
}
```

## Add Actions to Intents

It is now time to add our actions to the relevant intents and provide the associated context mappings.

### Provide Employee ID Turn

#### Provide Employee ID Intent

Let's start with our first intent that we need to add an action to, the "provideEmployeeID" intent. When this intent receives the employee's id it will trigger the action and send that employee ID to the webhook and wait for the associated name as an output.

* Select the intent and click on add action.
* Click on the drop down list and select _Get Employee Name_.
* Add an input attribute _employe\_id_ from the context _user._
* Add an output attribute _name_ from the context _user_.

![Adding the Get Employee Name action to provideEmployeeID intent](../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a3216\_scenario=0x16a3246.png)

### Provide Recommendation Turn

#### Congratulate Employee Intent

Next we have the "congratulateEmployee" intent. This intent uses the feeling attribute to determine whether the employees feels "good". Once triggered the "Save Employee Feeling" action should be triggered, resulting in the feeling associated that employee being saved in the database.

* Select the intent and click on add action.
* Click on the drop down list and select _Save Employee Feeling_.
* Add an input attribute _employe\_id_ from the context _user._
* Add another input attribute _feeling_ from the context _user._

![Add the Save Employee Feeling action to the congratulateEmployee intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a3216\_scenario=0x16a3246 (1).png>)

### Provide Feedback Turn

#### Provide Notes Intent

Finally we have the "provideNotes" intent. This intent uses the Save Employee Feeling similarly but with the difference being that it includes the additional input attribute notes. Once triggered the "Save Employee Feeling" action should be triggered, resulting in the feeling and additional notes associated with the specific employee being saved in the database.

* Select the intent and click on add action.
* Click on the drop down list and select _Save Employee Feeling_.
* Add an input attribute _employe\_id_ from the context _user._
* Add another input attribute _feeling_ from the context _user._
* Add another input attribute _notes_ from the context _user._

![Adding the Save Employee Feeling action to the provideNotes intent](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a3216\_scenario=0x16a3246 (2).png>)

## Test Actions with Mock Webhooks (Optional)

We now need to test whether our webhooks would work with our dummy webhooks, before moving onto actually building our webhooks.

![A preview of what messages should be received if the action is triggered as expected.](<../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_admin\_conversation-builder\_intents\_0x16a3216\_scenario=0x16a3246 (3).png>)
