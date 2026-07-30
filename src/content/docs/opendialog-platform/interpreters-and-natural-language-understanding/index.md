---
title: Leveraging Generative AI
description: The OpenDialog platform is tightly integrated with LLM capabilities to support a wide range of conversational applications - from simple question answer bots to sophisticated multi-step experiences.
---

## How to use Generative AI in OpenDialog

There are three ways of using Generative AI in OpenDialog.

* **Semantic Interpretation:** Using LLMs to understand what the user said, extract any relevant information and make that available to the conversation engine as an explicit intent and related entities (or other components).

:::note
Semantic Interpreters are setup in Language Services and can be shared  across multiple scenarios by creating an interpreter in a scenario that accesses a Language Service interpreter.
:::

* **RAG with Semantic Search:** Using LLMs to vectorise knowledge sources (URLs, files, etc) and then query those sources to extract content that can be used in prompts to generate answers.

:::note
Knowledge Services are setup in Language Services and can be shared across multiple scenarios. They are accessed via LLM actions via a special query string.
:::

* **LLM Actions**: The most flexible LLM component, actions can be used for a number of tasks from generating actions, reasoning about the conversation, personalising responses and more.

:::note
LLM Actions are specific to scenarios and can be found under the Integrate section of your scenario. At their core they are actions as other OpenDialog actions.
:::

These three capabilities are tightly integrated between each other and the OpenDialog conversation model enable you to quickly design a number of different behaviours and flexibly combine them according to what your application needs.

We will look at each in brief here and then you can dive into the detail through throughout this section.

### Interpretation

When a user says something we have two choices. We can either pass it directly to a prompt and generate a response (i.e. pass it straight to an LLM action in OpenDialog) or we can go through an interpreter first to get an indication of what sort of intent it is. For example, is the user just doing small talk, are they asking a question (what is the topic of the question) or are they doing something else such as attempting to trip up or game the bot.

Understanding the intent can enable us to then pick a more appropriate subsequent step and LLM prompt or knowledge source for content generation.

The main interpretation tool in OpenDialog is the [**Semantic Intent Classifier**](/opendialog-platform/interpreters-and-natural-language-understanding/language-services/semantic-intent-classifier)**.** This classifier takes semantic instructions (i.e. instructions written in natural language) and then uses an LLM prompt to categorise an utterance against the intents and/or sub-intents.

This gives you as the conversation design an explicit representation of what the user said that you can use in design to reason about what are the apporpriate next steps.

### Semantic Search and RAG

The OpenDialog [**Knowledge Service**](/opendialog-platform/interpreters-and-natural-language-understanding/language-services/retrieval-augmented-generation) is a flexible RAG service that you can use to ingest documents and then query using either a user query or something else through an LLM action to then generate responses.

The Knoweldge Service allows you to split knowledge based on different topics, with each topic having multiple sources. This enables you to choose at runtime the most suitable knowledge source based on the type of question, the user and the specific task that the user is performing.

### LLM Actions

OpenDialog [**LLM Actions**](/opendialog-platform/interpreters-and-natural-language-understanding/llm-actions) are the most flexible component. A powerful prompt manager they enable you to define prompts and extract specific outputs that you can then use in your conversation. This could be the answer to a user question, but it can also be a reasoning task that will identify how to proceed with the conversation.

LLM Actions are tightly integrated with OpenDialog attributes and Semantic Search enabling you to not just define specific prompts but prompt templates that are, at runtime, populated with attributes from a specific conversation.
