# Send to Email Action

### The basics

The "send to email" action lets you send an email containing static information and attribute values.  This is useful to notify a party that an interaction with the chatbot has occurred and to share the details.&#x20;

### What you'll need

All you need to set this up is an email address to send the email to. Note that the action only sends to a single email address. &#x20;

### Where to find

<figure><img src="../../../.gitbook/assets/Screenshot 2023-05-31 at 16.18.00.png" alt=""><figcaption><p>Select the action library to add pre-defined actions like the send to email action</p></figcaption></figure>

To set up the send to email action for a given scenario in your workspace:

Go to your Workspace overview, select Manage Scenarios (Scenarios)

On the scenario overview, select the scenario for which you would like to add a send to email action.

Use the left-hand menu and click on the Integrate menu item.

Use the 'Add action from library' button.

### Structure

Once you click on "Add from action library", give the action a name of your choice.&#x20;

Select "Send to Email".

<figure><img src="../../../.gitbook/assets/2023-11-10_14-20-10.png" alt=""><figcaption><p>Send to email action</p></figcaption></figure>

Add an email address, subject line and body.&#x20;

You can use attributes in your message. Do make sure these attributes have values, e.g. you can set attribute values in buttons, or attribute values may be passed on through integrations. For more on attributes and values, visit the [Contexts and attributes](../../../core-concepts/contexts-and-attributes/) section.&#x20;

<figure><img src="../../../.gitbook/assets/2023-11-10_14-24-27.png" alt=""><figcaption><p>Send to email details</p></figcaption></figure>

Save the action.&#x20;

Activate the action.

<figure><img src="../../../.gitbook/assets/2023-11-10_14-27-21.png" alt=""><figcaption><p>Activate the action</p></figcaption></figure>



### Using the action

In the designer, go to the intent that you want to action to be triggered from.&#x20;

Click on "Add .. actions, ..." at the bottom of the component pane.&#x20;

<figure><img src="../../../.gitbook/assets/2023-11-10_14-29-11.png" alt=""><figcaption><p>Add conditions, actions and attributes</p></figcaption></figure>

Select the action from the dropdown.&#x20;

<figure><img src="../../../.gitbook/assets/2023-11-10_14-29-36.png" alt=""><figcaption><p>Select the action from the dropdown list</p></figcaption></figure>

The action is now functional. Test it by using the preview. The email will be sent to the email address you specified.&#x20;
