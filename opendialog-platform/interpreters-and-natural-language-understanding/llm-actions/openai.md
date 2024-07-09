---
description: This section outlines how you can set up an LLM action using OpenAI.
---

# OpenAI

## Where to find

LLM Actions allow you to integrate with a large language model provider, for example, OpenAI. It can be found under the Integrate section of a specific scenario. Once you select 'Create an LLM action' you will then have the opportunity to create the LLM action of your choice. Select OpenAI to start setting up your OpenAI integration.

<figure><img src="../../../.gitbook/assets/Screenshot 2024-07-08 at 18.05.09.png" alt=""><figcaption><p>Setting up an OpenAI integration via OpenDialog</p></figcaption></figure>

## What you'll need

To set up an integration between your LLM action, and an OpenAI model, you can either use OpenDialog's managed credentials, or your own credentials if you prefer. Selecting 'OpenDialog managed' means you will use a service directly managed by OpenDialog, and will not need to provide any credentials. If you would like to use your own credentials, you will need an OpenAI account.&#x20;

[How to create an OpenAI account](https://platform.openai.com/docs/quickstart)

If you are using your own credentials, unselect 'OpenDialog managed' and provide the following three elements:

* The **OpenAI API Key** is an API key associated with your OpenAI account. This can be found under the ["API keys"](https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key) page in your OpenAI platform.
* The **OpenAI Organisation** is a unique identifier for your organisation within OpenAI. This can be found on the [general settings](https://platform.openai.com/settings/organization/general) page under "Organization ID".
* The **Model** is an identifier for the large language model that you would like to use. OpenAI provides a list of [pre-built model](https://platform.openai.com/docs/models/gpt-4o) identifiers, or you can use a custom fine-tuned model identifier associated with your organisation.

## How to use

### Setting up the OpenAI LLM action in OpenDialog

To set up your OpenAI LLM action, navigate to "Integrate", and select "LLM Actions" from the menu. Use the "Create an LLM action" button to set up a new LLM action.

<figure><img src="../../../.gitbook/assets/Screenshot 2024-07-08 at 18.21.46.png" alt=""><figcaption><p>Use the "Create an LLM action" button to set up a new OpenAI integration</p></figcaption></figure>

After providing a name and a description for your LLM action, select "Open AI" and provide the necessary account details to set up your integration. Hit 'Save' to set up this integration and use it within your scenario.

### Using the OpenAI LLM action in your scenario

To use your OpenAI LLM action in your scenario, you can add it to an intent in the Designer.

<figure><img src="../../../.gitbook/assets/Screenshot 2024-07-08 at 18.25.21.png" alt=""><figcaption><p>Select the desired intent in the designer and click "Add conditions, actions &#x26; attributes" to reveal the Action section</p></figcaption></figure>

When your scenario matches this intent, your LLM prompts will be sent to the language model and any output attributes will be populated.

To display the LLM's response text in your scenario, you will need to use the `llm_response` attribute (or any other desired output attributes) within a [message](../../conversation-designer/message-design/message-editor.md). Within a message, create a new text block, set the text to `{llm_response}` and click "Save Message".

<figure><img src="../../../.gitbook/assets/Screenshot 2024-07-09 at 09.52.58 (1).png" alt=""><figcaption><p>Create a text message using the LLM's response by using the <code>llm_response</code> attribute</p></figcaption></figure>

### Testing the OpenAI LLM action in your scenario

You can check if your action is successful by testing your conversation in the Preview (Test - Preview) and checking the user context on the right side of your screen. When you match the intent with the action then the user context will update to include `action_success: true` as well as any other [output attributes](./#use-custom-output-attributes), such as `llm_response`.
