---
description: >-
  The section informs you on how to use and reference your Knowledge Services
  throughout the OpenDialog product
---

# Using your RAG Services

It's all well and good building and setting up your RAG service, however you also need to know how to use it throughout your OpenDialog scenarios, to make the most out of what you've set up.

## How to use your RAG Service

The way that you can use your RAG service in your conversations is by referencing it through a Knowledge Service String. This is much like an attribute string. From within this string you can reference the specific RAG service and even specific topics from within it that you would like the LLM to recognise and retrieve data from when forming it's responses. You can use this knowledge service string to test your RAG service where you've built it, using the testing panel.&#x20;

<div align="center" data-full-width="true">

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-08-07 at 08.34.32.png" alt="" width="188"><figcaption><p>Using the testing panel</p></figcaption></figure>

</div>

### Using your RAG service in a LLM Action

However, in real scenarios, you can also use this in places such as LLM actions. To use it you simply have put your RAG service string into the system prompt input field along with the rest of your text. Doing this means that you can reference a specific RAG service and topic that you would like the LLM to pull it's information from. To do this, you first need to set up your LLM engine. For more information on how to do this and LLM actions in general, please click [**here**](../../llm-actions/).

<figure><img src="../../../../.gitbook/assets/Group 53.png" alt=""><figcaption><p>Once you have set up your LLM engine, go to 'Prompt configuration'</p></figcaption></figure>

Once you have your LLM engine set up, you can head to the 'Prompt configuration' tab. From this page, you will find a field where you can input your system prompt. To find out more information on what you should include in your system prompt, click [**here**](../../llm-actions/#system-prompt). As part of this system prompt, you can add in your RAG service string with reference to whatever RAG service and topic you would like the LLM to pull data from. There is more information on how to write and form a RAG service string in the section [**below**](using-your-rag-services.md#how-to-write-a-rag-service-string).

<figure><img src="../../../../.gitbook/assets/Group 54.png" alt=""><figcaption><p>An example of a system prompt with a RAG service string in use</p></figcaption></figure>

## How to write a RAG service string

To use your RAG service from within a system prompt you should use the special syntax `%% [service].[topic] %%` to reference the data you want to use. For example if you have a knowledge service called 'countries\_ks' and you want to reference the 'capital\_cities' topic data you would use `%% countries_ks.capital_cities %%`.&#x20;

Optionally you can also add a query to only return the topic data that is useful to the user's question. To do this, the syntax is\
`%% [service].[topic] ? [query] %%`

**An example knowledge service string:**

`"You are a chatbot answering user questions. You may only find your answer from within the following data: %% countries_ks.capital_cities ? France %%`
