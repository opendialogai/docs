---
hidden: true
---

# Adding a new topic of discussion

### Adding a new topic of discussion

Now that your AI agent is handling your primary topic effectively, it’s time to expand its capabilities by introducing a new topic of discussion. This allows your AI agent to answer questions and engage in conversations beyond the initial scope, creating a more dynamic and comprehensive user experience. Let’s walk through the process of adding a new topic to your AI agent.

\


So that an AI Agent can correctly handle a new topic of discussion, we must make sure that it is set up to :&#x20;

* Understand user queries as being related to that topic of discussion : this happens via the Semantic Classifier.
* Contextualise the user query & advance the conversation process : this happens via the Conversation Design
* Generate a relevant response, statically or dynamically based on a knowledge source: this happens through a combination of a RAG service, LLM Actions and Message Design.

**Understand: Semantic classification**

The first step is to ensure your AI agent can recognize this new topic. To do this, you’ll need to add it to the semantic classifier—the language service that helps your AI Agent distinguish between different topic intents.&#x20;

💡 An intent represents the underlying intention of what a user or application says.

For example : The intent for “When was NASA founded?” is ‘AboutCompany’.

👣 Navigate to the Semantic Intent Classifier

\- Click on Language Services in the left-hand sidebar

\- In the list, select the classifier called “ProjectName” followed by “Classifier”

You’ll see a list of predefined topic intents, like “Talk to Human,” “About the AI Agent,” and “Small Talk.” These topics help the AI Agent interpret user intents accurately. Now let’s add a new topic of discussion for your AI Agent to understand.&#x20;

For example, if you want the AI Agent to answer questions about your company, create an “AboutCompany” intent.

\


👣 Add a new intent

\- Click in the input field on the top of the screen that says “Enter unique name”

\- Enter a unique name for your topic intent, for example “AboutCompany”

In order for the Large Language Model to understand what this new topic intent is all about, we will need to provide it with some more details as to what this topic actually covers. We do so by providing it with brief instructions in the description box.

For example, for your topic intent “AboutCompany,” a description might be “Questions about the brand, company background, or related services.”&#x20;

These details guide your AI Agent in understanding when this topic arises and distinguish it from any other topics.&#x20;

💡 When writing your description, a good checkpoint is to see whether a child would understand what your topic of discussion is about, based solely on this description.  Large Language Models are not superhuman, so anything that is not clearly described, will likely cause confusion and wrong matches later down the line.

👣 Add a description for your intent

\- Click in the description box right next to the intent name field

\- Enter a brief description of your topic of discussion

\- Confirm your entries by clicking on the checkmark

**Contextualise and advance : Conversation Design**

With the new intent in place in the semantic classifier, it’s time to set up how your AI Agent handles the conversation related to it. This is done in the Design section of OpenDialog’s scenario management.

👣 Navigate to your scenario management

\- In the left-hand navigation menu, click on Scenarios

\- In the list, select your scenario - named as in your initial setup

\- You’ll land in the Design - Conversations section of OpenDialog

Now is a good time to explore the OpenDialog conversation engine model in a bit more detail.&#x20;

The OpenDialog model breaks down the wider context of AI Agent interactions into a manageable structure: &#x20;

* Scenarios: The overall structure that defines your AI agent’s conversations. It is where you specify how your AI Agent can interact with a user and what should happen as a result. Scenarios are represented in dark navy blue in the OpenDialog design setup.&#x20;
* Conversations: The high-level parts of a scenario, often tied to specific user goals or states. Conversations are represented in highlight blue in the OpenDialog design setup.

👣 Navigate to the next level in the conversation design

\- Locate the “Topic conversations” conversation

\- Click on its node

\


* Scenes: Smaller units within conversations, handling specific parts, substages or states of the conversation. Scenes are represented in mauve grey in the OpenDialog design setup.

👣 Navigate to the next level in the conversation design

\- Locate the “About the bot” scene

\- Click on its node

* Turns: Represent the back-and-forth exchanges between the user and the AI Agent. Turns are represented in a teal colour in the OpenDialog design setup.

👣 Navigate to the next level in the conversation design

\- Locate the “Bot capabilities” turn

\- Click on its node

* Intents: Represent the intention behind the user’s input or the AI agent’s response. They are represented in yellow in OpenDialog.

👣 Navigate to the next level in the conversation design

\- Click on the yellow intent node in the turn overview

\- Click in the “About the bot” intent card in the middle of your screen

In OpenDialog, you can choose to handle topics of discussion in a few different manners:

* Free-form conversations: The AI Agent invites the user to ask any question that comes to mind at any given time.
* Structured process conversations: The AI agent follows a predefined script, inviting the user to take specific steps towards the completion of a process.
* Hybrid: The AI agent will use a mixture of both free-form and structured conversations as part of the user experience.

In this guide, we primarily focus on creating free-form conversations in OpenDialog. For more information on how to set up a structured process conversation, you can find more information through our documentation and advanced learning materials.

Now let’s look at how to add an additional topic to your free-from conversation design. To do so, you’ll need to modify the initial conversation setup of your scenario to include interactions related to your new topic.&#x20;

👣 Navigate back up to the scene level

\- Locate the coloured filter buttons in the top left corner of your screen

\- Click on the ‘mauve grey’ button to be taken back to the “About the bot” scene&#x20;

To set up your new topic of discussion, we are going to use this pre-existing scene as a template and copy it. Now, let’s duplicate this topic’s scene to create a base for your new topic, for example “AboutCompany”.

👣 Duplicating a scene

\- Locate the action menu pill in the bottom centre of your screen

\- Click on the duplicate icon in the menu

We are now going to customise the duplicated scene to match your new topic of discussion.  This customization ensures the AI Agent responds in context, providing relevant answers to questions about the company.

👣 Editing a scene

\- Click in the node of the duplicated scene

\- Locate the Edit Settings panel on the right-hand side of your screen

\- Update the name field to your new topic of discussion’s name

\- Update the description to match your new topic of discussion

You can use the same name and description as you did previously, in the semantic classifier.

\- Click Update in the top right corner of the settings panel

Navigating downward in the architecture of your AI Agent, you will also need to update the name and description settings for your turn, so they reflect that these are related to your new topic of discussion.&#x20;

👣 Editing a turn

\- Click in the node of the duplicated turn

\- Locate the Edit Settings panel on the right-hand side of your screen

\- Update the name field to your new topic of discussion’s name

\- Update the description to match your new topic of discussion

You can use the same name and description as you did previously, in your scene.

\- Click Update in the top right corner of the settings panel

Once the turn level is edited, it is now time to update the intent for your new topic of discussion.  This is where the rubber hits the road as we need to ensure the conversation design matches up with the semantic classification. You do this by updating the language service intent that the interpreter references in the intent settings panel of your conversation design. This will allow the AI Agent to process and respond to queries in the desired way.

👣 Editing a user intent

\- Click in the yellow node which takes you to the intent overview

\- Click in the yellow user intent card

\- Update the “user says” field with an example phrase or description

\- Locate the Interpreter section with a white background&#x20;

\- Do not change the classifier

\- In the intent dropdown, select your new classifier intent, eg. “AboutCompany”

**Responding to a user query : Message Design**

To update the response of your AI agent to the new topic of discussion you just added, we will need to update the app response intent.

👣 Editing an app response intent

\- Click in the yellow app response intent card

\- Update the “Bot says” field with an example response message

\- Update the intent name to reflect your new topic, eg. “AboutCompanyResponse”

\- Click on the “Add conditions, actions, attributes” link on the bottom of the panel

\- Delete the action under the “Add actions” header by clicking on the X

\- Go back to the basic settings by clicking on the link on the bottom of the panel

\- Click on the “Edit messages” button

You will now get taken to this specific intent’s messages and are ready to start updating your app’s response. &#x20;

You will need to determine how your AI agent will source the responses for this topic: using a static, a dynamically generated or a hybrid response.&#x20;

* Static responses: The AI Agent provides a static scripted response for a given topic. &#x20;
* Dynamic responses: The AI agent generates a dynamic response based on a knowledge source, serviced by a RAG service.
* Hybrid: The AI agent generates part of the response dynamically, and uses them in combination with static elements like buttons or carrousels.

Let’s start with updating our response message to provide users with a static response. You can edit the text in the messages directly in the provided text block by updating the text to what you want the AI Agent to respond.&#x20;

For example: “NASA was founded in 1954.”&#x20;

👣 Editing a message

\- Click on the Edit icon (pencil on noteblock) of the message card&#x20;

\- Locate the text block in the middle of your screen

\- Replace the text in the text block with a static response

\- Scroll back to the top of the screen

\- Click “Save message” to save your message edits.

**Previewing your new topic of discussion**

You have now added a new topic of discussion, using a static response.  Keen to see it in action?  You can go back to the Preview you used earlier by clicking the Test section in the left-hand navigation panel, and selecting Preview.

\


Type in a question that is related to your new topic of discussion and the static response you provided.&#x20;

\


For example: “When was NASA founded?”

### Adding additional knowledge sources

Now, we obviously want our AI Agent to provide more relevant and precise information to our users than just the static response you provided as an example.

If you want to use dynamic responses, you will need to take a few additional steps:

* Making sure the AI Agent has the necessary knowledge at hand to respond regarding your new topic of discussion by adding additional knowledge sources to your RAG service.
* Give the AI Agent the instructions to generate a dynamic response based on that knowledge by creating an LLM Action .
* Indicate to the AI Agent when to generate the response by referencing the LLM action on the correct response intent
* Adapt the AI Agent’s message to use the generated content by referencing the LLM action through an attribute in the message editor.

\


**Adding knowledge: Knowledge Services (RAG)**

As a first step, you’ll need to add relevant content to your RAG service.  Let’s walk through the process of adding and setting up an additional knowledge source.

\


👣 Navigate to your prebuilt RAG Service

\- In the left-hand navigation panel, click on Language Services

\- Locate your prebuilt RAG service, labelled “ProjectName Knowledge”

\- Click on the link to navigate to the service

\
Within the RAG/ Knowledge service, you’ll see predefined topics and existing knowledge sources that were uploaded during the initial setup. Now, let’s add a new topic for your AI Agent to reference, related to your new topic of discussion.

👣 Adding a new knowledge topic

\- Click the Add Topic button in the top-right corner

\- Enter a name for your topic, such as “AboutCompany”

\- Provide a brief description of your topic aligned with the one you used earlier

Example: “Information about the brand, organisation, and related services.”&#x20;

\- Click ‘Create Topic’ to save

\
Now, with your new topic created, it’s time to begin adding sources to it. OpenDialog provides you with the ability to choose from a variety of different source types.

* URL: Link to a URL page that has information relevant to your topic.
* Document: Upload relevant documents.
* Text: Manually enter text as a knowledge source.

👣 Adding knowledge sources to your topic

\- Click the Add sources button in the centre right of the screen

\- Select the source type you want to add (URL, document or text)

\- In the pop-up, follow the instructions

\- Click ‘Upload source’ to continue

\
To ensure the AI Agent can efficiently use the information you  just added, you will need to transform its information into a machine readable, numerical format, this is called vectorisation.&#x20;

\


👣 Vectorizing your knowledge sources

\- Select one or more knowledge sources using the select box next to it

\- Click the Vectorize button in the action menu above the knowledge source table

\- Confirm the vectorization in the pop-up

\- View the updated vectorisation status in the knowledge source table&#x20;

Via this action menu, you can also delete a knowledge source or set a schedule to re-vectorize sources that update frequently, ensuring your AI Agent always has the latest information.

In order to use the vectorised knowledge in your conversation design setup and LLM Actions later, you will need the ability to  reference it.  In OpenDialog, you do this using a knowledge string.

A knowledge string follows this syntax: %%RAGServiceName.TopicName%%

For example: %%SpaceKnowledge.AboutCompany%%&#x20;

For ease of use, locate the knowledge string for your new topic of discussion in the right-hand test panel and copy/paste this string into a note or blank document for further use in LLM Actions system prompts.

👣 Saving your new knowledge topic and its sources

\- Scroll up to the top of the screen

\- Click ‘Update Topic’ to save your changes

**Providing instructions : LLM Actions**

In order to use your new knowledge source in a response, you will need to accomplish three more steps:

1. Create an LLM action to provide the Large Language Model with instructions on how to use your knowledge sources to generate responses.&#x20;
2. Indicate to your AI Agent when to trigger a response generation by adding this LLM action to the app response intent&#x20;
3. Reference the output attribute for this LLM action in the response message

\


👣 Navigate to LLM Actions in your scenario

\- In the left-hand navigation panel, hover ‘Scenarios’

\- Select your “ProjectName” scenario in the list of scenarios

\- Hover over ‘Integrate’ in the updated navigation panel

\- Select LLM Actions

\


Once in the LLM Actions overview, you’ll see prebuilt actions like “Topic Response Generator”, for example, which were automatically created to generate responses for your primary topic. We will be using this LLM action as a basis for our new LLM Action.&#x20;

Let’s have a look at what this “Topic Response Generator” LLM action looks like.

// add screenshot that highlights the different sections of the LLM Action setup

\
\


👣 View a pre-existing LLM Action

\- In the LLM Action overview, locate the “Topic Response Generation” LLM Action

\- Click on the card

\


An LLM action is made up of 3 main components:&#x20;

1 - the LLM engine that powers it, visible under the Engine settings tab

2 - the prompt configuration that provides the LLM with instructions, under the prompt configuration tab, and further settings that allow you to determine how the LLM response will be referenced thanks to output attributes.

3 - guardrails to constrain the LLM responses and configure their safety settings, under the safeguarding tab.

\


In this initial guide, we are not going to dig any deeper into the preconfigured prompt configuration just yet. All you need to remember for now is that:

* A knowledge source gets referenced in prompt instructions using a knowledge string
* The knowledge string is used in the prompt instructions in a specific knowledge sections, indicated as follows: \<knowledge>
* The LLM response that comes back when the action is run is saved in OpenDialog under an output attribute which by default is the {llm\_response} attribute

\


For more information on how to structure prompt instructions for LLM Actions, you can take a look at our documentation or advanced learning materials.&#x20;

\


For this initial setup, we will use the same configuration as the ‘Topic Response Generation’ LLM Action.

\


👣 Use a prebuilt prompt configuration

\- Click on the prompt configuration tab in the Settings section&#x20;

\- Locate the prompt instructions in the System prompt section

\- Select allthe text in the System prompt input section

\- Copy all the text using Cmd+C on Mac (or Ctrl+C on PC)

\- Navigate back to the LLM actions overview page using the link in the top left corner of the central panel

\


Now let’s set up our new LLM action and provide it with instructions to reference our newly setup knowledge source.

👉🏻 You will also need the knowledge string you put aside earlier.

\
\


👣 Creating an LLM Action

\- Click the ‘Create LLM Action’ button

\- Add a name to your LLM Action, eg. “About Company Response Generator”

\- Add a description to specify that this action generates responses for your topic.

\- Select the LLM  Engine you wish to use (\*)&#x20;

(\*) When selecting the OpenAI engine, the correct configuration will already be selected. You can use an OpenDialog-managed account, or use your own account credentials.

Now, we are going to update the prompt instructions in order to adapt to the additional knowledge source you have just added.&#x20;

\


👣 Updating prebuilt prompt instructions&#x20;

\- Navigate to the ‘Prompt Configuration’ tab

\- Go to the system prompt input field

\- Paste the prompt instructions you copied earlier, using Cmd+V (or Ctrl+V)

\- Locate the knowledge section in the prompt instructions, \<knowledge>

\- Replace the mentioned knowledge string to your newly added topic.

For reference, it is formatted as follows: %%ServiceName.TopicName%%

\- Scroll back up to the top of the page

\- Click the ‘Save action’  button

**When to trigger a response: adding an LLM Action to a response intent**

You are now ready to return to your conversation design and update the response intent with your LLM Action.&#x20;

To do so, navigate back to the Design section of your scenario, by clicking Design in the navigation bar and then Conversation. Now, using the filter buttons  in the top left corner of the central panel, or the conversation nodes in the centre, navigate back to the topic intent you set up earlier. &#x20;

Topic conversations > About Company > About Company > Intents>AboutCompanyResponse

👣 Adding an action to an intent

\- View the intent settings  panel

\- Locate “Add conditions, actions & attributes” on the bottom of the panel

\- Click the link

\- In the Actions section of the panel, select Add new action.&#x20;

\- Select your newly created LLM Action by its name in the dropdown

\- The updated intent settings will Autosave

You are all set! When your scenario matches this intent, your LLM prompts will be sent to the language model and the related llm\_response attribute will be populated.&#x20;

**Adapting the message: the LLM response attribute**

To display the LLM's response text in your scenario, we will need to update its message in the message editor, to reference the {llm\_response} attribute. Remember, this is the attribute where the LLM’s response generated by your LLM action gets stored in OpenDialog.

\
\


👣 Updating your message to use the dynamically generated response

\- Go back to the Basic settings using the link on the bottom of the panel

\- Click the Edit Messages button in the panel

\- Click the Edit icon on the message card&#x20;

\- Locate the text block&#x20;

\- Delete the static message in the text block

\- Type an opening curly brace { to access the attribute autocomplete field

\- Start typing llm…

\- Select the desired attribute from the dropdown, in our case: llm\_response

\- Scroll back up to the top of the page

\- Click “Save Message”

\


Your new knowledge source is now ready, and the AI Agent is set to generate informed responses based on the enriched content.

Your additional topic is now live! With these steps, you can empower your AI Agent to handle a wider range of user questions while maintaining a smooth, relevant conversation flow. To add more additional topics, go back to the top of this guide, rinse and repeat!

\
