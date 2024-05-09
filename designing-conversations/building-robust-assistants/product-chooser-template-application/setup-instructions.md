# Setup instructions

If you want to work along in your own copy, create a new scenario using the Product Chooser template and follow the instructions below to set up your copy. The next page explains the conversation structure of the assistant and illustrates how to use the OpenDialog patterns.&#x20;

## Step 1: Configure NLU

The template out of the box only uses the basic [OpenDialog interpreter](https://docs.opendialog.ai/interpreters-and-natural-language-understanding/default-interpretor) which does not support proper NLU.&#x20;

For a fully functioning bot that you can deploy on your website, you will want to connect it to an FAQ service such as [Microsoft QnA](https://docs.opendialog.ai/interpreters-and-natural-language-understanding/qna-interpreter) or Dialogflow knowledge base. In addition, you will need something like [Dialogflow](https://docs.opendialog.ai/interpreters-and-natural-language-understanding/dialogflow-interpreter), [LUIS ](https://docs.opendialog.ai/interpreters-and-natural-language-understanding/luis-interpreter)or [LEX ](https://docs.opendialog.ai/interpreters-and-natural-language-understanding/amazon-lex-interpreter)to be able to pick up the following intents:

{% hint style="info" %}
If you would like any additional assistance with regards to setting up or working with these NLU services, you can find out more information [here](https://docs.opendialog.ai/interpreters-and-natural-language-understanding).
{% endhint %}

### Intents

{% hint style="info" %}
Note that in this particular explainer, we'll be using Dialogflow as our interpreter.
{% endhint %}

Mentioned below are all the required intents, you can either manually create the intents or upload the intent in the Dialogflow intents menu using the attached file under the associated intent.

* **helpRequest** - used by all the help turns in various scenes to capture when the user asks for help
  * Example phases: "help me", "I need help", "what should I do"

{% file src="../../../.gitbook/assets/helpRequest.json" %}

* **intent.core.TurnEndChat** - used by all the end chat turns to capture if the user is looking to end the interaction through natural language
  * Example phrases: "end", "stop"

{% file src="../../../.gitbook/assets/intent.core.TurnEndChat.json" %}

* **intent.shoebot.Pronation** - used to capture when the user is asking what pronation is&#x20;
  * Example phrases: "pronation?", "what is pronation?", "what is my pronation"

{% file src="../../../.gitbook/assets/intent.shoebot.pronation.json" %}

* **intent.shoebot.ProvideRunnerExperience** - used to capture any runner experience info&#x20;
  * Example phrases: "I run daily and looking for size 8", "I'd like to get women's shoes for casual runners"
  * Entities: frequency, gender, pronation, size (NB: gender here is not intended as gender identity but a crude way to distinguish between men and women shoes)

{% file src="../../../.gitbook/assets/intent.shoebot.provideRunnerExperience.json" %}

* **unsureNLU -** used to identify when the user is unsure about something like what pronation they are.
  * Example phrases: "what is that", "what do you mean", "I don't know"

{% file src="../../../.gitbook/assets/unsureNLU.json" %}

* **userContinueNLU** - used to identify when the user is ready to proceed with the conversation
  * Example phrases: "continue", "let's go", "let's do it"

{% file src="../../../.gitbook/assets/userContinueNLU.json" %}

* **userPromptQuestion** - used to identify when the user says that they want to ask something
  * Example phrases: "want to ask something", "I have a question"

{% file src="../../../.gitbook/assets/userPromptQuestion.json" %}

![Screenshot of intents for the Product Chooser Template in Dialogflow.](<../../../.gitbook/assets/dialogflow.cloud.google.com\_ (1).png>)

### Knowledge Base

The incoming user intent name is `intent.dialogflow.faq` and that should be mapped within your Dialogflow interpreter setup to the knowledge base intent as shown in the figure below. This mapping will convert any `Knowledge.Knoweldgebase.*` intent from Dialogflow intent the `intent.dialogflow.faq` intent in OpenDialog.&#x20;

![Mapping FAQ intents](<../../../.gitbook/assets/image (459).png>)

For this particular example, we'll create a delivery knowledge base. Navigate to the Knowledge Bases in Dialogflow and Create a Knowledge Base that is a FAQ knowledge type. You may use this document attached below as your knowledge base for your delivery related questions and answers. Once you have uploaded the CSV and added a response, your Delivery knowledge base should be similar to the one shown below.

{% file src="../../../.gitbook/assets/DeliveryKnowledgeBase.csv" %}

![DialogFlow Knowledge Base Demo](<../../../.gitbook/assets/Knowledge Base Demo.gif>)

## Step 2: Intent Interpreter Update

We now need to set up the interpreters for all of the relevant turns. Under each conversation navigate to the appropriate turn and make the following updates to enable NLU interpretation.

### Welcome Conversation

#### Welcome Scene

_**Next Turn**_

Once you have navigated to view the intents in the Next turn in the Welcome Scene of the Welcome Conversation, make the following changes:

Update `intent.shoebot.provideRunnerExperience` interpreter to _Dialogflow Interpreter._

![](../../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_device-warning.png)

Update `userContinueNLU` interpreter to _Dialogflow Interpreter._

![](<../../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_device-warning (1).png>)

_**FAQ Turn**_

Next, navigate to the FAQ turn within the same scene and make the following changes.

Update `intent.dialogflow.faq` interpreter to _Dialogflow Interpreter._

![](<../../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_device-warning (2).png>)

_**Help Request**_

And finally, within this scene, navigate to the Help Request turn and make the following changes.

Update `helpRequest` interpreter to _Dialogflow Interpreter._

![](<../../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_device-warning (3).png>)

### Gather Experience Conversation

#### User Profile _**Scene**_

_**Provide Experience Turn**_

Once you have navigated to view the intents in the Provide Experience turn in the User Profile scene of the Gather Experience conversation and make the following changes:

Update `intent.shoebot.provideRunnerExperience` interpreter to _Dialogflow Interpreter._

_**FAQ Turn**_

Next, navigate to the FAQ turn within the same scene and make the following changes.

Update `intent.dialogflow.faq` interpreter to _Dialogflow Interpreter._

_**Work Out Pronation Turn**_

And finally, within this scene, navigate to the Work Out Pronation turn and make the following changes.

Update `intent.shoebot.pronation` interpreter to _Dialogflow Interpreter._

Update `unsureNLU` interpreter to _Dialogflow Interpreter._

#### **Pronation Scene**

_**Feet Patterns Turn**_

Once you have navigated to view the intents in the Feet Patterns turn in the Pronation scene of the Gather Experience conversation, make the following changes:

Update `unsureNLU` interpreter to _Dialogflow Interpreter._

Update `intent.shoebot.provideRunnerExperience` interpreter to _Dialogflow Interpreter._

### Recommendations Conversation

#### Welcome To Recommendations Scene

_**Change Preferences Turn**_

Once you have navigated to view the intents in the Change Preferences turn in the Welcome to Recommendations scene of the Recommendations conversation, make the following changes:

Update both `intent.shoebot.provideRunnerExperience` interpreters to _Dialogflow Interpreter._

_**FAQ Turn**_

Next_**,**_ navigate to the FAQ turn within the same scene and make the following changes.

Update `intent.dialogflow.faq` interpreter to _Dialogflow Interpreter._

_**Request Recommendations Turn**_

And finally, within this scene, navigate to the Request Recommendations turn and make the following changes.

Update `userContinueNLU` interpreter to _Dialogflow Interpreter._

#### Provide Recommendations Scene

_**Change Preferences Turn**_

Once you have navigated to view the intents in the Change Preferences turn in the Welcome to Recommendations scene of the Recommendations conversation, make the following changes:

Update both `intent.shoebot.provideRunnerExperience` interpreters to _Dialogflow Interpreter._

_**FAQ Turn**_

And finally, within this scene, navigate to the FAQ turn and make the following changes.

Update `intent.dialogflow.faq` interpreter to _Dialogflow Interpreter._

### Purchase Conversation

#### Finalize Payment Scene

_**Confirm Payment Turn**_

Once you have navigated to view the intents in the Change Preferences turn in the Welcome to Recommendations scene of the Recommendations conversation, make the following changes:

Update `userContinueNLU` interpreter to _Dialogflow Interpreter**.**_

_**FAQ Turn**_

Next, navigate to the FAQ turn within the same scene and make the following changes.

Update `intent.dialogflow.faq` interpreter to _Dialogflow Interpreter._



And that's it for setting up the interpreter for our product chooser template.

## Step 3: Messages Update

Now that you've set up all the relevant turns with the NLU interpreter, we can  add some custom messages as well as delete our default messages reminding us to configure the NLU.

### Welcome Conversation

#### Welcome Scene

_**FAQ Turn**_

Navigate to the faqAnswer intent in the FAQ turn in the Welcome Scene of the Welcome Conversation and add a custom message, then add`{user.dialogflow_message}` in your XML snippet. Thereafter, delete the default message that appears at the top.

![](<../../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_device-warning (4).png>)

_**Prompt Question Turn**_

Next_**,**_ navigate to the Prompt Question turn within the same scene and delete the default message at the bottom.&#x20;

![](<../../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_device-warning (9).png>)

### Gather Experience Conversation

#### User Profile Scene

_**Welcome User Turn**_

Start by navigating to the Request Experience Welcome message in the requestExperienceWelcome intent , which is found in the Welcome User turn in the User Profile scene of the Gather Experience conversation. Once there, delete the default message that appears at the bottom.

![](<../../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_device-warning (6).png>)

## Step 4: Virtual Intent Update

### Welcome Conversation

#### Welcome Scene

_**FAQ Turn**_

Once you have navigated to view the intents in the FAQ turn in the Welcome Scene of the Welcome Conversation, update virtual intent of the response intent to `intent.shoebot.provideRunnerExperience`

![](<../../../.gitbook/assets/od-kamau.cloud.opendialog.ai\_device-warning (10).png>)

### Gather Experience Conversation

#### User Profile Scene

_**FAQ Turn**_

Finally, navigate to the intents in the Change Preferences turn in the Welcome to Recommendations scene of the Recommendations conversation, update virtual intent of the response intent to `intent.shoebot.provideRunnerExperience`

![](<../../../.gitbook/assets/image (122).png>)

Your product chooser bot should now be done and ready for you to interact with. After you've reviewed and tested the bot and experienced most of its capabilities check out the [next section](how-it-works.md) which explains how it works. It'll give you a deeper understanding as to what you set up and why it was set up the way it was set up.

