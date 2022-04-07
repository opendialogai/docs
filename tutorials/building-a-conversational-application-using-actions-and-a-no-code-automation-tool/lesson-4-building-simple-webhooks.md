# Lesson 4: Building Simple Webhooks

{% embed url="https://youtu.be/NaPXyCauO0U" %}

## Overview

In this lesson we take a look at creating simple webhooks using a no-code tool, [Integromat ](https://www.make.com/en)in this particular case, but feel free to use any other no-code automation tool of your preference, but note that it should have the capability of having a webhook response.

{% hint style="info" %}
**Note** that you will be able to build these webhooks using the free tier of Integromat, as it allows you to make use of 1000 operations per month and 2 active scenarios which will be enough to cover this tutorial.
{% endhint %}

## Set Up Google Sheet

Start by creating a sheet in google sheet that you will be using as your database.

In our particular case we'll create a Google Sheet called EmployeeDB&#x20;

* Give your table the following column headings:
  1. EmployeeID
  2. Name
  3. Feeling
  4. Notes

![](<../../.gitbook/assets/image (449).png>)

* Populate the sheet with some employee ID's and names.

## Set Up Integromat Scenarios

Start by navigating to Integromat. Once there if you have an account log in if not sign up.&#x20;

Next start by creating a new scenario. We will be creating 2 scenarios in this particular case.

{% hint style="info" %}
**Note** that the scenarios in Integromat are our webhooks.
{% endhint %}

### Get Employee Name

![](<../../.gitbook/assets/image (462).png>)

Let's start with the Get Employee Name webhook once we create a new scenario give it the name Get Employee Name.

#### Create Webhook Trigger

![](<../../.gitbook/assets/image (463).png>)

Once you click on the '+' icon, search for Webhooks and select Custom webhook. Then give your Webhook a name such as _OpenDialog Webhook_.

We now need the webhook to determine the webhook structure. We do this by copying the webhook address and navigating back to the actions page and updating the webhook URL for the _Get Employee Name_ action to the one we have just copied.&#x20;

We then need to test the action by previewing the application and providing the employee ID so that it can send the data to the webhook and the webhook can determine the data structure. Once sent you should see that it successfully determined.

![](<../../.gitbook/assets/image (460).png>)

#### Add Google Sheets Module

Next add another module and search for Google Sheets, then select Search Rows. Then add a connection by signing in to your Google account and select the Spreadsheet we created earlier.&#x20;

Then add a filter whereby the _EmployeeID_ in our sheet should be equal to the _employee\_id_ attribute data from our webhook. Then set your maximum number of returned rows to 1.

![](<../../.gitbook/assets/image (458).png>)

#### Add JSON Module

We now need to create a JSON object with the data we just got from Google Sheets to be able to send it back to OpenDialog in the required data structure.&#x20;

Add a new module and search for JSON and select Create JSON. Then click on Add to add a data structure, we'll call it OpenDialog Structure and select Generate in order for it to automatically determine the structure. Use this code as your sample data:&#x20;

```
{
    "successful": true,
    "output_data": {
        "attributes": {
            "name": "Bob"
        }
    }
}
```

We should then get a structure similar to what is shown below. Now select Yes under the _successful_ data attribute and add the _Name_ field from the Google Sheet searched row to the name attribute.

![](<../../.gitbook/assets/image (447).png>)

#### Add Webhook Response

Our last step in creating this action is now just adding the webhook response. Let's add a webhook and select the Webhook response action. Next, within the the body add the JSON string we just created and hit OK.

![](<../../.gitbook/assets/image (427).png>)

#### Run The Scenario

Once you've added all the necessary scenarios. All that you're left with is testing it to ensure that it runs correctly. Click on Run Once at the bottom left of your screen then head back to OpenDialog and refresh your scenario and interact with your conversational application till the point that you enter an employee ID from your spreadsheet. You should then receive a confirmation message with the relevant name associated with the ID entered. Everything should then be working and we can confirm this by navigating back to Integromat and verifying that every module executed successfully.

![](<../../.gitbook/assets/image (469).png>)

Finally click on the back on icon at the top left then click on the switch button to activate your scenario.

![](../../.gitbook/assets/eu1.make.com\_24461\_scenarios\_114192\_edit.png)

Congratulations, you've just completed fully implementing your first action implementing. &#x20;

### Save Employee Feeling

![](<../../.gitbook/assets/image (434).png>)

This webhook will enable us to save employees feeling rating when they are feeling "good" and when they feel "bad". This will be done by saving just the feeling if they feel "good" or saving the feeling and their note when they feel "bad".

#### Create Webhook Trigger

Repeat what we had done [here ](lesson-4-building-simple-webhooks.md#create-webhook-trigger)but this time call it _OpenDialog Webhook 2._ Note that because we are using the same webhook to save the feeling in the "good" case whilst the feeling and the note saved in the "bad" case, when we are previewing the application we need to interact with our application to simulate the bad case. This is done so that our webhook trigger can determine a structure that includes both feeling and notes attributes not only feeling.

#### Add Google Sheet Search Rows Module

Repeat what we had done [here](lesson-4-building-simple-webhooks.md#add-google-sheets-module).

#### Add Google Sheet Update A Row Module

Next add another module and search for Google Sheets, then select Update a Row. In this module we will need to update the feeling of the employee using the row number we got when we searched for the employee ID in the previous module. Start by selecting our sheet then set the Row number to the Row number returned from the previous module. Next, set the Feeling value to the feeling attribute received from the webhook and the Notes value set to the notes attribute received from the webhook.

![](<../../.gitbook/assets/www.integromat.com\_scenario\_3038454\_edit (1).png>)

{% hint style="info" %}
Note that in the Notes column we add the notes attribute from our webhook and append it with a `null` operator so that if there are no notes we clear the cell because the employee feels "good" and didn't provide any notes.

![](<../../.gitbook/assets/image (456).png>)
{% endhint %}

#### Add Create JSON Module

Repeat what we had done [here ](lesson-4-building-simple-webhooks.md#add-json-module)but this time all we need to do is add a successful attribute and set it to true because we will not be returning anything else back to OpenDialog. We only need to notify OpenDialog that the operation was completed successfully for debugging purposes.

#### Add Webhook Response

Repeat what had been done [here](lesson-4-building-simple-webhooks.md#add-webhook-response).

#### Run The Scenario

Repeat what had been done [here ](lesson-4-building-simple-webhooks.md#run-the-scenario)but this time try and trigger the save the employee feeling action. And you are done!

## Preview The Application

We now need to test our scenario to ensure that it triggers and responds as required.

![](<../../.gitbook/assets/Tutorial Demo.gif>)

Congratulations you've built your first OpenDialog application using actions, giving your bot even more capabilities to communicate with external webhooks so seamlessly and with no-code.
