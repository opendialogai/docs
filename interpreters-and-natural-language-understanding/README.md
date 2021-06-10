---
description: How OpenDialog helps you manage natural language utterances
---

# Interpreters and Natural Language Understanding

## Introduction

Any input we receive from a user through a conversational interface is treated as an intent within the conversational flow. This includes things such as the first time a user loads the WebChat widget by visiting a page, or when they click on a button or submit a form. It also includes natural language phrases that a user may have typed in. 

Once OpenDialog _senses_ an input it generates an _utterance_ that the OpenDialog conversation engine attempts to match to an intent within the conversation. The _candidate_ intents will depend on your current conversational state and the conditions associated with those intents. For example, if you are not in an ongoing conversation only intents that are related to starting turns are going to be considered.  

The matching function between an utterance and an intent is performed by _interpreters._ A single scenario can have multiple interpreters associated with it. Interpreters are managed through the "Interpreters - NLU" section within OpenDialog.

![Interpreter Management in OpenDialog](../.gitbook/assets/image%20%28196%29.png)

In this section, you define what interpreters are available throughout your OpenDialog instance and you can then associate those interpreters to specific sections of your scenarios. 

