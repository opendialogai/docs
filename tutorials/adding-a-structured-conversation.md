---
description: Let's add a structured conversation flow to your AI Agent.
---

# Adding a structured conversation

Now that your AI Agent has become proficient at handling different topics of discussion, let's see how we can add a more structured type of conversation in the mix.

{% hint style="info" %}
For an AI Agent that is mainly focussed on process-handling, we recommend using the prebuilt [process-handling AI Agent](../getting-started-1/quick-start-ai-agents/a-process-handling-ai-agent.md).
{% endhint %}

We now want to add the possibility for users to book an appointment through our AI Agent.

To do this, we will need to :&#x20;

1 - Add the AppointmentBooking as [a new topic of discussion](./). These steps are covered in the dedicated tutorial. Click the link for a [refresher](./), and follow all the outlined steps 👉🏻

2 - Create a dedicated conversation to further handle the AppointmentBooking process.&#x20;

3 - Link the AppointmentBooking topic of discussion to the AppointmentBooking process conversation.&#x20;

## See it in action

_Video coming soon_

## Step-by-step guide

### What you need before you start building

In order to make the best of adding a structured conversation to your AI Agent, we advise to have a good understanding of the process and its steps, before getting stuck in.

**Ask yourself:**&#x20;

* What is the process I am trying to design and what are it's steps?&#x20;
* Is it a linear process or are there any forks in the road, that will require me to use conditions?

### Creating a dedicated conversation

This is a good time to remind ourselves of the OpenDialog Model:

#### The OpenDialog model breaks down the wider context of AI Agent interactions into a manageable structure: &#x20;

* **Scenarios:** The overall structure that defines your AI agent’s conversations. It is where you specify how your AI Agent can interact with a user and what should happen as a result. Scenarios are represented in dark navy blue in the OpenDialog design setup.&#x20;
* **Conversations:** The high-level parts of a scenario, often tied to specific user goals or states. Conversations are represented in highlight blue in the OpenDialog design setup.
* **Scenes:** Smaller units within conversations, handling specific parts, substages or states of the conversation. Scenes are represented in mauve grey in the OpenDialog design setup.
* **Turns:** Represent the back-and-forth exchanges between the user and the AI Agent. Turns are represented in a teal colour in the OpenDialog design setup.
* **Intents:** Represent the intention behind the user’s input or the AI agent’s response. They are represented in yellow in OpenDialog.

In OpenDialog, you can choose to handle topics of discussion in a few different manners:

* **Free-form conversations:** The AI Agent invites the user to ask any question that comes to mind at any given time, which we covered in the previous sections.
* **Structured process conversations:** The AI agent follows a predefined script, inviting the user to take specific steps towards the completion of a process.
* **Hybrid:** The AI agent will use a mixture of both free-form and structured conversations as part of the user experience.

In order to set up a structured conversation handling the multiple steps of a process conversation, you need to set up a new conversation specifically dedicated to this process.

{% hint style="success" %}
**Creating a new conversation**

* Navigate to the design section of your conversation using the navigation bar
* Click on the pulsing blue + sign in the action bar in the bottom center of your screen
* Give your conversation a name, _for example: AppointmentBooking_
* Provide your conversation with a description
* Hit 'Save' to save this newly created conversation
{% endhint %}

### Adding steps to the process

Now you will need to add the different steps of your process. Each step is represented in a scene.

Each scene has a clear goal. At each scene (or step) the user can complete the goal and move forward or they can abandon the process and they will move back to the Topic Conversation.&#x20;

{% hint style="info" %}
We recommend setting up a template scene for step 1 that you can then duplicate for the next couple of steps.
{% endhint %}

A scene for a process conversation contains the following components:

* The **introduction** turn - led by an APP intent which is the **starting** turn of the scene
* The expected user requests - represented in respective **response turns** each - led by primary USER intents
* Supporting turns - led by secondary USER intents (including Help, TalktoHuman, NoMatch, etc.)

<figure><img src="../.gitbook/assets/image (553).png" alt=""><figcaption><p>A template scene with it's different turn components</p></figcaption></figure>

{% hint style="success" %}
**Creating a scene**

* Click on the violet/grey + icon in the action bar on the bottom of your screen
* Provide your scene with a name.

_Example: AppointmentBookingIntro_

* Add a description to your scene.

&#x20;_Example: This scene introduces the user to the process of booking an appointment with    Company and the steps that will be involved._

* This scene being the first one you want to start the conversation with, make sure to click the checkbox next to 'Starting' under the [Behaviour](../core-concepts/how-the-conversation-engine-thinks.md) title.
* Click 'Update' to save your newly created Scene
* View the central Scene node
{% endhint %}

#### Setting up the introduction turn

In OpenDialog, a turn contains the interactions between the bot and the user for a specific action. The first turn will welcome the user to the booking process.

{% hint style="success" %}
**Creating an application-led turn**

* In the Appointment Booking Intro scene, add a new turn by clicking on the teal + icon in the action bar on the bottom of your screen
* Provide your turn with a descriptive name.

_Example: AppointmentBookingIntro_

* Add a description to your turn.

&#x20;_Example: This turn introduces the user to the process of booking an appointment with    Company and asks for the first piece of information._

* This turn being the first one you want to start the scene with, make sure to click the checkbox next to 'Starting' under the [Behaviour](../core-concepts/how-the-conversation-engine-thinks.md) title.
* No need to make any changes to the Interpreter
* Click 'Update' to save your newly created turn
* View the central turn node
* The  intent you will be adding to this turn (see below) will be an application intent
{% endhint %}

In the introduction turn, which is an application-led turn, we now need to create  the application intent that will contain the message, welcoming the user to this step of the process.

{% hint style="success" %}
**Create an application intent**

* Within the turn, add an App Intent by clicking the yellow + icon.
* In the small pop-up that appears on the top of the + icon, select app intent
* Enter a sample message.\
  &#xNAN;_&#x45;xample: "Welcome to the appointment booking process! I’ll ask a few quick questions to set up your appointment. Ready to get started?"_&#x20;
* Give your application intent a descriptive name. _Example: BookingAppointmentWelcome_
* The intent will auto-save
{% endhint %}

#### Setting up the primary user request turns

Next, we’ll handle potential user requests as a result of what the AI Agent is asking in the introduction turn. Typically, these responses include primary intents (e.g., "Yes" or "No") or secondary intents (e.g., "Help" or unrelated queries).

To do so, we will create a turn by a potential user request. &#x20;

In our example, we will need a 'Confirm' turn and a 'Cancel' turn to harbour the primary interactions.

{% hint style="success" %}
**Creating an intent-led turn**

* In the Appointment Booking Intro scene, add a new turn by clicking on the teal + icon in the action bar on the bottom of your screen
* Provide your turn with a descriptive name.

_Example: ConfirmReadiness_

* Add a description to your turn.

&#x20;_Example: This turn contains the primary user intent, for the user confirming that they are ready to proceed._

* This turn being the user's reaction to the application-led turn already present in this scene,  you should not change it's behaviour and the Starting behaviour checkbox should be left unchecked.&#x20;
* Use the 'Default' interpreter for now
* Click 'Update' to save your newly created turn
* View the central turn node
* The  intent you will be adding to this turn (see below) will be a user intent
{% endhint %}

{% hint style="success" %}
**Create a user intent**

* Within the turn, add a user Intent by clicking the yellow + icon.
* In the small pop-up that appears on the top of the + icon, select user intent
* Enter a user's sample utterance.\
  &#xNAN;_&#x45;xample: "Confirm"_&#x20;
* Give your user intent a descriptive name. _Example: ConfirmReadiness_
* The intent will auto-save.
{% endhint %}

#### Setting up secondary user request turns

With secondary requests you can go as detailed and broad as you want - however there is a set of supporting intents we recommend setting up as a best practice:

* TalktoHuman - `TalktoHuman`
* Help - `Help`
* No-match - `intent.core.TurnNoMatch`
* Further questions - Question

To set these up - follow the steps described above in the 'Create a user intent' section, and we will use the intent names as described above.

#### Progressing the conversation after a user request

Once the intents have been set up, we will now need to tell the conversation engine what to do next.

There are a few options here for you to consider:

* Progress to the next step in the process by transitioning to the next scene.  For instance, after confirming readiness, the user might proceed to a "Provide Availability" scene.
* Set up a contextual response, for example to handle no-matches.  In this case, the provided responses will nudge the user into using one of the primary responses instead and help them progress the conversation.
* End the conversation, and take the user back to the top of the scenario

{% hint style="success" %}
**Define logical progression**

* Navigate to the user intent you want to define the progression for using the filter buttons in the top-left corner of the central panel, or, using the nodes in the middle of your screen.
* Click on the intent card
* View the Edit intent panel
* In the intent panel, locate the Transition section
* To progress to another scene, select this scene in the Transition dropdown
* To end the conversation, check the 'This intent ends the conversation' checkbox
{% endhint %}

{% hint style="success" %}
**Set up a contextual response**

* Navigate to the user intent you want to define a contextual response for using the filter buttons in the top-left corner of the central panel, or, using the nodes in the middle of your screen.
* Click on the 'Add Response Intent' card, next to the intent you are creating the contextual response for.
* View the Edit intent panel.
* Give the response intent a descriptive name, _for example: NoMatchResponse_
* Add an example message, _for example: 'I didn't quite understand.  Please let me know if you are ready to proceed by typing 'Yes' or 'No', or using the button above'_
* The intent will autosave.
* You can further fine-tune the message by clicking on 'Edit messages' or you can revisit this later via the Message Editor.
{% endhint %}

{% hint style="info" %}
If you have not yet created the next set of scenes, we recommend doing this after having created a full scene with all the supporting user turns and intents, so you can duplicate it as the basis for the next scenes. You can then come back later to this specific user intent to set up the Transition.
{% endhint %}

#### Summary

By following these steps, you’ve built the foundation for a structured conversation in OpenDialog. You now have:

* A clear starting scene with an app-intent introduction.
* Logical user response handling through turns and intents.
* Transitions to additional scenes for progressing through the process.

This template can now be expanded or duplicated to build out more complex processes. Remember, [testing](test-and-tweak-your-ai-agent.md) is your friend—use the tools provided to ensure a seamless experience for your users. 🎉

### Linking the dedicated conversation to the topic of discussion

Wait a minute! Now that the process is in place, we still need to link it up to our topic of discussion. Let's have a look at how to do that

{% hint style="success" %}
**Navigate to your topic discussion**

* Using the filter buttons or the nodes in the central panel, navigate to the 'Topic Management' conversation, all the way through to the intent for the topic you wish to send the user to a process from.
* This user intent currently has a corresponding response intent, which provided the one-off static or dynamic response. &#x20;
* Delete this **application response intent** (not the user intent) by clicking in its card - and using the bin icon in the action bar in the bottom center of your screen
* Click in the user intent request intent
* View the Edit intent panel on the right-hand side
* Locate the Transition section
* Select the process conversation you have set up in the drop-down.
{% endhint %}

That's it - your are all set.  Now, when the BookAppointment topic will be matched through semantic classification, the AI Agent will transition to the BookAppointment process rather than providing a one-off response.

\
