---
description: >-
  Before jumping into the build process, you need to make sure you have a clear
  understanding of an AI agent’s key building blocks and the pieces of
  information you need to personalise yours.
---

# Getting ready

## Building blocks of an AI Agent

Your AI agent is built from a few fundamental building blocks: the user experience, its language capabilities and contextual knowledge. So let's explore what you need to understand to get started.

### [User Experience](../conversation-designer/)

This is all about how you want users to interact with your AI agent. You’ll need to decide when your AI agent will handle free-form conversations (where users can ask anything and the AI dynamically adapts) or process-driven conversations (which guide users step-by-step through structured workflows), or a mixture of both. For example, a free-form conversation might be used in customer support where users ask questions in an open-ended manner, while a process-driven conversation could be used for tasks like booking an appointment or completing a transaction. Knowing which interaction style best suits your use case is critical for delivering the right user experience. In OpenDialog, you can set up and tailor the user experience via our Scenario Management.

### [Language Capabilities](../opendialog-platform/interpreters-and-natural-language-understanding/)

This refers to how well your AI Agent can understand and process user input, and respond to it. Semantic classification allows your AI agent to interpret the meaning and intent behind user queries, categorising them into relevant topics. In addition, Retrieval-Augmented Generation (RAG) helps the AI agent to dynamically fetch information from knowledge sources, ensuring users receive specific responses. These advanced language capabilities ensure your AI agent can deliver meaningful, relevant answers across a variety of topics. In OpenDialog, you can set up these advanced capabilities through our Language Services.&#x20;

### [Contextual Knowledge](../core-concepts/contexts-and-attributes/attribute-management.md)

To make conversations personal and relevant, your AI agent can use contextual variables — details like the user’s name, preferences, or history. These variables allow the AI agent to tailor its responses, making the interaction more engaging and effective. The AI agent can also extract key information from the conversation itself (e.g., a user’s account number or order status) to refine its responses and keep the conversation flowing. In OpenDialog, you can create and manage these variables through Attribute Management.



<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXehD4Czg1ekUeRmU56R2wpHBgdnklb4YmB8rs_pPb_w0D-IAonzo2cb4BtwzUagMuxbSFCCxVZ8LPme4uIDBEwS-B0ANBtGFl5aVKXP6Y7Dn7tSYti_dVN0V2A1sPQ-dMd74xm9YqkCQJY1Ly8OlUwyc0k?key=Fx-ocWb11TfGpsPXdPvXlg" alt=""><figcaption></figcaption></figure>

## What You Need Before You Build

Before diving into the powerful tools that will bring your AI agent to life, it’s essential to have a clear sense of a few key elements. Think of this as gathering your ingredients before starting a recipe—you’ll save time and make the process smoother by coming prepared.&#x20;

### The Purpose of the AI Agent

What problem is your AI agent solving? Is it helping users troubleshoot technical issues, assisting employees with internal processes, or providing quick access to product information? Having a clear mission for your agent will guide its development.

### The Primary Topic Area

What is the main subject your AI agent will cover? Whether it’s customer service, employee training, or product support, identifying this focus area will help you structure the agent’s responses and capabilities.

### The Primary Knowledge Source:

Where will the AI agent retrieve the majority of its information? It could be an FAQ website page, product documentation, or an internal database. Your AI agent will pull from these sources dynamically, ensuring it delivers answers based on the most relevant data.

With these details in hand, you’re ready to create a safe, responsive AI agent that delivers immediate value to your users.

{% hint style="info" %}
**Not quite sure about what you want to build?**

You can use our example use case in the product: an AI Agent that answers questions about the moon.
{% endhint %}

Now, let's build something amazing!
