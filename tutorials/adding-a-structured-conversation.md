---
description: Let's add a structured conversation flow to your AI Agent.
hidden: true
---

# Adding a structured conversation

Now that your AI Agent has become proficient at handling different topic of discussion, let's see how we can add a more structured type of conversation in the mix.

{% hint style="info" %}
For an AI Agent that is mainly focussed on process-handling, we recommend using the prebuilt [process-handling AI Agent](../getting-started-1/quick-start-ai-agents/a-process-handling-ai-agent.md).
{% endhint %}

We now want to add the possibility for users to book an appointment through our AI Agent.

To do this, we will need to :&#x20;

1 - Add the AppointmentBooking as [a new topic of discussion](./). This step is covered in the dedicated tutorial. Click the link for a [refresher](./) 👉🏻

2 - Create a dedicated conversation to further handle the AppointmentBooking process.&#x20;

3 - Link the AppointmentBooking topic of discussion to the AppointmentBooking process conversation.&#x20;

## See it in action

## Step-by-step guide

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
* Give your conversation a name, for exemple: AppointmentBooking
* Provide your conversation with a description
* Hit 'Save' to save this newly created conversation
{% endhint %}

Now you will need to add the different steps of your process. Each step is represented in a scene.

Each scene has a clear goal. At each scene (or step) the user can complete the goal and move forward or they can abandon the process and they will move back to the Topic Conversation.&#x20;

{% hint style="info" %}
We recommend setting up a template scene for step 1 that you can then duplicate for the next couple of steps.
{% endhint %}

A scene for a process conversation contains the following components:

* The **introduction** turn - led by an APP intent which is the **starting** turn of the scene
* The expected user responses - represented in respective **response turns** each - led by primary USER intents
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



### Linking the dedicated conversation to the topic of discussion

