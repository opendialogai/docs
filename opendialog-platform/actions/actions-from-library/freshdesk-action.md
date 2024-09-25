# Freshdesk Action

### The basics

The Freshdesk action lets you set up a connection between OpenDialog and your Freshdesk ticketing system, which you can then in turn use within your conversation design.&#x20;

### What you'll need

To set up an integration between your OpenDialog account, and a Freshdesk ticketing system - you will need a Paid Freshdesk account.  To create a Freshdesk account, you can follow the steps mentioned [here](https://www.freshworks.com/freshdesk/signup/).

Once you are set up with an account on Freshdesk for your business, you will need two elements to set up your OpenDialog - Freshdesk connection:

* The URL for your account, this looks something like `nameofcompany.freshdesk.com`
* The API key for your account, which you can find in Freshdesk, under the Settings / IT Administration / Source overview page.  You can find more information on this [here](https://support.freshsuccess.com/en/support/solutions/articles/50000004881-where-can-you-find-the-api-key-).

Note: This requires a paid (non-trial) account, as the free version of Freshdesk does not support API calls.

### OpenDialog & Freshdesk in action

#### Improve your application's service quality

When customers don't want to interact with a digital assistant or their request is not understood, you can now offer the possibility to send their request through a ticketing system for a live agent to call them back with a solution, improving your overall service quality.

#### Respond to more complex customer inquiries

Some use cases can't be treated through an automated interaction.  This is the case when a human evaluation or further investigation into an issue is needed.  Examples could be complex claim requests in insurance, a bug in a software tool that needs looking into, and more.  Adding the ability for users to submit requests to your ticketing system via your conversational application enhances your ability to respond to the more complex inquiries efficiently and through a single touchpoint.

### Where to find

Freshdesk actions allow you to integrate your Freshdesk ticketing system into your OpenDialog scenario; you can therefore find it under our product's Integrate section.

<figure><img src="../../../.gitbook/assets/Screenshot 2023-05-31 at 16.18.00.png" alt=""><figcaption><p>Select the action library to add pre-defined actions like the Freshdesk action</p></figcaption></figure>

To set up the Freshdesk action for a given scenario in your workspace:

Go to your Workspace overview, select Manage Scenarios (Scenarios)

On the scenario overview, select the scenario for which you would like to add a Freshdesk integration

Use the left-hand menu and click on the Integrate menu item.

Use the 'Add action from library' button.

### Structure

The Freshdesk Action has three main components: the action setup, the action testing, and project usage.

<figure><img src="../../../.gitbook/assets/Screenshot 2023-06-01 at 10.05.01.png" alt=""><figcaption><p>Freshdesk action setup in the central pane, guidance and action testing in the right-hand pane.</p></figcaption></figure>

The <mark style="color:purple;">**action setup**</mark> happens in the central pane of the actions screen.  It is divided into three separate spaces:  naming your action, adding your account details (see [What you'll need](freshdesk-action.md#what-youll-need) for more details), setting the ticket information, and, finally, tags to categorize your requests in Freshdesk.

The <mark style="color:purple;">**action testing**</mark> becomes available in the right-hand pane once all the settings above have been completed.&#x20;

You can start <mark style="color:purple;">**using the action in your project**</mark> by adding it to the intent of your choice. More information about this [here](../../../designing-conversations/actions/).

### How to use

{% embed url="https://youtu.be/XCaMVMtFvIc" %}
Learn how to create and test a Freshdesk action
{% endembed %}

#### Create the Freshdesk action

To add a new action to Freshdesk, go to the Integrate section of your scenario and click on the 'Add from action library' button.&#x20;

First, give your action a name that is easy to remember and functional.&#x20;

Note: keeping a separate list of names for your Attributes and Actions can be useful.

Then, enter your Freshdesk account's URL and API token (see [above](freshdesk-action.md#what-youll-need) for where to find this information).&#x20;

Next, define the ticket settings for the action, including types, priorities, and statuses. Different variations are better for different use cases.

Current Ticket Types: Question, Incident, Problem, Feature Request, and Refund

Current Priorities: Low, Medium, High, and Urgent

Current Statuses: Open, Pending, Resolved, and Closed

\
Finally, you can add tags to help categorize requests and issues in Freshdesk. Remember to save your action using the 'Save action' button at the top of your screen.

#### Test the Freshdesk action

You can test your action using the test pane on the right-hand side of the action setup screen. Click on the button 'Test action via .json'

To test your action, add dummy test data to the JSON snippet then click on the ‘Run action test’ button.&#x20;

<figure><img src="../../../.gitbook/assets/Screenshot 2023-06-02 at 10.15.10.png" alt=""><figcaption><p>Test your action using the Test Action pane</p></figcaption></figure>



This will trigger the action to run the test data through Freshdesk, create the Freshdesk ticket and retrieve the related information about the ticket including information about the action success, the ticket creation, the ticket ID and the ticket response due date. &#x20;

These output attributes will be stored against the user context, and you can now use them subsequently in your scenario to set up conditions or specify messages.

#### Use the Freshdesk action in your scenario

To start using the Freshdesk action in your scenario, you need to make sure that it is activated by sliding the toggle on the Action Card to active.

<figure><img src="../../../.gitbook/assets/Screenshot 2023-06-02 at 10.02.49.png" alt="" width="375"><figcaption><p>Activate your action to use it in your scenario</p></figcaption></figure>

To add the action in a meaningful way, we will need to take a 4-stepped approach, using the Conversation Designer and the Message Editor:

1. Create the user intent that will indicate that the user wishes to declare a problem or issue
2. Create the scene that will handle the submission of their data
3. Within this scene, create a welcome turn where the application is going to ask for the required attributes, via a form message
4. Finally, create the appropriate user-led turn which includes the SubmitTicket intent, and which you can add the action to.

You can reference the [Integrate and Action](../../../designing-conversations/actions/) introduction for more information on how to use actions in your scenarios.

### **Frequently asked questions**

**Why is the Freshdesk integration not working?**

If a free or trial account is used, Freshdesk does not allow outside API calls. This can cause errors in actions.
